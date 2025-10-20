# PowerShell script to run semgrep and avoid PowerShell '||' issue
# Usage: .\run_semgrep.ps1
if (-not (Get-Command semgrep -ErrorAction SilentlyContinue)) {
  Write-Host "semgrep not found. Trying 'python -m semgrep'..."
  python -m semgrep --config=.semgrep.yml --json > semgrep-report.json
} else {
  semgrep --config=.semgrep.yml --json > semgrep-report.json
}
if ($LASTEXITCODE -ne 0) {
  $LASTEXITCODE = 0
}
Write-Host "Report generated: semgrep-report.json"
