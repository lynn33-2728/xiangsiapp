$ErrorActionPreference = 'Stop'

Write-Host ''
Write-Host '=== Xiangsi v1.1.5 phone-test APK builder ===' -ForegroundColor Cyan
Write-Host 'This tool patches the current offline web bundle into the original v1.1.5 APK, then signs it.'
Write-Host 'The original APK will not be overwritten.'
Write-Host ''

$ProjectDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RootDir = Split-Path -Parent $ProjectDir

function Find-OneFile($BaseDir, $Filter, $Hint) {
  $Items = Get-ChildItem -LiteralPath $BaseDir -Recurse -File -Filter $Filter -ErrorAction SilentlyContinue
  if (-not $Items -or $Items.Count -lt 1) {
    throw "Missing required file: $Hint"
  }
  return $Items | Select-Object -First 1
}

$OriginalApkItems = Get-ChildItem -LiteralPath $RootDir -Recurse -File -Filter 'xiangsi-v1.1.5.apk' -ErrorAction SilentlyContinue |
  Where-Object { $_.FullName -notmatch '\\apk-analysis\\' } |
  Sort-Object FullName
if (-not $OriginalApkItems -or $OriginalApkItems.Count -lt 1) {
  throw 'Missing required file: xiangsi-v1.1.5.apk outside apk-analysis'
}
$OriginalApk = ($OriginalApkItems | Select-Object -First 1).FullName
$OutputDir = Split-Path -Parent $OriginalApk

$PatchTool = Join-Path $RootDir 'tools\patch_apk_raw.py'
$FactoryDefaultConfigJs = Join-Path $ProjectDir 'factory-default-config.js'
$AppMemoryJs = Join-Path $ProjectDir 'app-memory.js'
$AppJs = Join-Path $ProjectDir 'app.js'
$StylesCss = Join-Path $ProjectDir 'styles.css'
$IndexHtml = Join-Path $ProjectDir 'index.html'
$FontAwesomeBaseCss = Join-Path $ProjectDir 'assets\vendor\fontawesome\css\fontawesome.min.css'
$FontAwesomeSolidCss = Join-Path $ProjectDir 'assets\vendor\fontawesome\css\solid.min.css'
$FontAwesomeSolidFont = Join-Path $ProjectDir 'assets\vendor\fontawesome\webfonts\fa-solid-900.woff2'
$FontAwesomeLicense = Join-Path $ProjectDir 'assets\vendor\fontawesome\LICENSE.txt'
$PublisherSettingsPath = Join-Path $RootDir '相思发布工具\publisher.settings.json'
if (-not (Test-Path -LiteralPath $PublisherSettingsPath -PathType Leaf)) { throw 'Publisher settings were not found. Select the default persona and preset files in the publisher first.' }
$PublisherSettings = Get-Content -Raw -Encoding UTF8 -LiteralPath $PublisherSettingsPath | ConvertFrom-Json
$DefaultPersonas = [string]$PublisherSettings.defaultPersonasPath
$DefaultPreset = [string]$PublisherSettings.defaultPresetPath
$ApkSignerItem = Find-OneFile $RootDir 'apksigner.bat' 'apksigner.bat'
$ApkSigner = $ApkSignerItem.FullName
$ZipAlignItem = Find-OneFile $RootDir 'zipalign.exe' 'zipalign.exe'
$ZipAlign = $ZipAlignItem.FullName
$KeyStoreItem = Find-OneFile $RootDir 'xiangsi-release.jks' 'xiangsi-release.jks'
$KeyStore = $KeyStoreItem.FullName
$JavaExeItem = Find-OneFile $RootDir 'java.exe' 'java.exe'
$JavaHome = Split-Path -Parent (Split-Path -Parent $JavaExeItem.FullName)

$Stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$UnsignedApk = Join-Path $OutputDir "xiangsi-v1.1.5-phone-test-$Stamp-unsigned.apk"
$AlignedApk = Join-Path $OutputDir "xiangsi-v1.1.5-phone-test-$Stamp-aligned.apk"
$SignedApk = Join-Path $OutputDir "xiangsi-v1.1.5-phone-test-$Stamp-aligned-signed.apk"

$PatchResources = @(
  @{ Source = $FactoryDefaultConfigJs; Target = 'assets/public/factory-default-config.js' },
  @{ Source = $AppMemoryJs; Target = 'assets/public/app-memory.js' },
  @{ Source = $AppJs; Target = 'assets/public/app.js' },
  @{ Source = $StylesCss; Target = 'assets/public/styles.css' },
  @{ Source = $IndexHtml; Target = 'assets/public/index.html' },
  @{ Source = $FontAwesomeBaseCss; Target = 'assets/public/assets/vendor/fontawesome/css/fontawesome.min.css' },
  @{ Source = $FontAwesomeSolidCss; Target = 'assets/public/assets/vendor/fontawesome/css/solid.min.css' },
  @{ Source = $FontAwesomeSolidFont; Target = 'assets/public/assets/vendor/fontawesome/webfonts/fa-solid-900.woff2' },
  @{ Source = $FontAwesomeLicense; Target = 'assets/public/assets/vendor/fontawesome/LICENSE.txt' },
  @{ Source = $DefaultPersonas; Target = 'assets/public/default-personas.json' },
  @{ Source = $DefaultPreset; Target = 'assets/public/default-preset.json' }
)

foreach ($RequiredPath in @($OriginalApk, $PatchTool, $ApkSigner, $ZipAlign, $KeyStore) + @($PatchResources | ForEach-Object { $_.Source })) {
  if (-not (Test-Path -LiteralPath $RequiredPath)) {
    throw "Missing required path: $RequiredPath"
  }
}

$PythonCommand = Get-Command python -ErrorAction SilentlyContinue
if (-not $PythonCommand) {
  $PythonCommand = Get-Command py -ErrorAction SilentlyContinue
}
if (-not $PythonCommand) {
  throw 'Python was not found. Please install Python or ask Codex to build another way.'
}

Write-Host 'Using original APK:' -ForegroundColor DarkCyan
Write-Host $OriginalApk
Write-Host 'Using project folder:' -ForegroundColor DarkCyan
Write-Host $ProjectDir
Write-Host ''

Write-Host 'Checking JavaScript syntax...' -ForegroundColor Yellow
$NodeExe = Join-Path $ProjectDir 'node.exe'
if (Test-Path -LiteralPath $NodeExe) {
  foreach ($ScriptPath in @($FactoryDefaultConfigJs, $AppMemoryJs, $AppJs)) {
    & $NodeExe --check $ScriptPath
  }
} else {
  Write-Host 'node.exe not found; skipped JS syntax check.' -ForegroundColor DarkYellow
}

Write-Host 'Embedding offline web bundle...' -ForegroundColor Yellow
$CurrentApk = $OriginalApk
for ($Index = 0; $Index -lt $PatchResources.Count; $Index += 1) {
  $Resource = $PatchResources[$Index]
  $IsLast = $Index -eq ($PatchResources.Count - 1)
  $NextApk = if ($IsLast) { $UnsignedApk } else { Join-Path $OutputDir "xiangsi-v1.1.5-phone-test-$Stamp-patch-$Index.tmp.apk" }
  Write-Host ("  [{0}/{1}] {2}" -f ($Index + 1), $PatchResources.Count, $Resource.Target) -ForegroundColor DarkYellow
  & $PythonCommand.Source $PatchTool $CurrentApk $Resource.Source $NextApk $Resource.Target
  if ($CurrentApk -ne $OriginalApk -and (Test-Path -LiteralPath $CurrentApk)) {
    Remove-Item -LiteralPath $CurrentApk -Force
  }
  $CurrentApk = $NextApk
}

Write-Host 'Aligning APK...' -ForegroundColor Yellow
& $ZipAlign -f -p 4 $UnsignedApk $AlignedApk

Write-Host ''
Write-Host 'Enter signing password. The password will be hidden while typing.' -ForegroundColor Cyan
$SecurePassword = Read-Host 'Signing password' -AsSecureString
$Bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($SecurePassword)
try {
  $PlainPassword = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($Bstr)
} finally {
  [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($Bstr)
}

if ([string]::IsNullOrWhiteSpace($PlainPassword)) {
  throw 'Empty password. Build stopped.'
}

Write-Host 'Signing APK...' -ForegroundColor Yellow
$env:JAVA_HOME = $JavaHome
$env:PATH = (Join-Path $JavaHome 'bin') + ';' + $env:PATH
($PlainPassword + "`n" + $PlainPassword + "`n") | & $ApkSigner sign --ks $KeyStore --ks-key-alias xiangsi --ks-pass stdin --key-pass stdin --out $SignedApk $AlignedApk

Write-Host 'Verifying signature...' -ForegroundColor Yellow
& $ApkSigner verify --verbose --print-certs $SignedApk

Write-Host 'Verifying alignment...' -ForegroundColor Yellow
& $ZipAlign -c -p 4 $SignedApk

Write-Host ''
Write-Host 'DONE. Phone-test APK:' -ForegroundColor Green
Write-Host $SignedApk -ForegroundColor Green
Write-Host ''
Write-Host 'Install this APK on your phone to check the real Android result.'
