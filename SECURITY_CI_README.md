# Security CI/CD Project - Updated Package

Este pacote contém o projeto original + configurações e scripts para executar as análises de segurança (SAST, DAST, SCA) e um workflow de exemplo para GitHub Actions.

## O que eu adicionei
- `.semgrep.yml` — regras básicas de exemplo para Semgrep (SAST).
- `scripts/run_semgrep.sh` — script Bash para executar Semgrep localmente.
- `scripts/run_semgrep.ps1` — script PowerShell para executar Semgrep no Windows/Powershell.
- `.github/workflows/security-ci.yml` — workflow de exemplo para GitHub Actions com jobs para Semgrep, ZAP e Dependency-Check.
- `placeholder_reports/semgrep-report.json` — relatório de exemplo (placeholder).
- `SECURITY_CI_README.md` — instruções rápidas para rodar localmente e integrar no CI.

## Como rodar localmente
### Pré-requisitos
- Python 3.x (para semgrep)
- Docker (opcional, para ZAP se preferir usar imagem)
- Java (para dependency-check se for usar localmente)

### SAST (Semgrep)
No Linux/macOS:
```bash
./scripts/run_semgrep.sh
```
No Windows PowerShell:
```powershell
.\scriptsun_semgrep.ps1
```

### DAST (OWASP ZAP)
No GitHub Actions uso `zaproxy/action-baseline`. Localmente você pode usar:
```bash
docker run -v $(pwd):/zap/wrk/:rw --network host owasp/zap2docker-stable zap-baseline.py -t http://seu-staging -r zap-report.html
```

### SCA (Dependency check)
No workflow usei OWASP Dependency-Check. Localmente é possível baixar a ferramenta e executar:
```bash
./dependency-check/bin/dependency-check.sh --scan . --format JSON --out dependency-check-report.json
```

## Observações importantes
- Os relatórios incluídos neste pacote são *placeholder/sample* — eles não representam uma análise real do seu código.
- Para executar scans reais no CI, atualize `security-ci.yml` com a URL de staging correta e configure secrets (ex: SNYK_TOKEN) se preferir usar Snyk.
- Se quiser, eu posso:
  - adaptar o workflow para GitLab CI ou Azure Pipelines;
  - integrar Snyk (se você fornecer token via secrets);
  - gerar um relatório Semgrep real usando o conteúdo do seu projeto (mas preciso que você rode o `semgrep` localmente e me envie o `semgrep-report.json`, ou posso tentar executar aqui se semgrep estiver disponível no ambiente).

