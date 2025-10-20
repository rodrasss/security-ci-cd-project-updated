#!/usr/bin/env bash
set -e
# Install semgrep if missing
if ! command -v semgrep >/dev/null 2>&1; then
  echo "semgrep not found, installing via pip..."
  python3 -m pip install --user semgrep
  export PATH="$HOME/.local/bin:$PATH"
fi
echo "Running semgrep..."
semgrep --config=.semgrep.yml --json > semgrep-report.json || true
echo "Report generated: semgrep-report.json"
