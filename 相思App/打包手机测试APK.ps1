$ErrorActionPreference = 'Stop'

# 旧入口保留给已有快捷方式；实际统一调用主构建脚本，避免两份资源清单分叉。
$MainBuilder = Join-Path (Split-Path -Parent $MyInvocation.MyCommand.Path) 'build-phone-test-apk.ps1'
& $MainBuilder
exit $LASTEXITCODE
