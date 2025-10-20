
# Vulnerable Demo App (for Security CI/CD tests)

Este projeto é uma aplicação Node.js + Express propositalmente vulnerável para ser utilizada em atividades de integração de segurança (SAST, DAST, SCA) em CI/CD.

## O que está incluso
- `app.js` — servidor Express com endpoints vulneráveis:
  - `POST /login` — autenticação muito simples (senha em texto)
  - `GET /search?q=` — refletindo entrada do usuário (XSS)
  - `GET /users` — expõe dados sensíveis e simula "query" concatenada (SQLi-like)
  - `GET /unsafe-eval?code=` — executa `eval()` sobre input do usuário (code injection)
- `.github/workflows/security-pipeline.yml` — workflow de GitHub Actions (Semgrep, Snyk, OWASP ZAP)
- `.semgrep.yml` — regras básicas para Semgrep (exemplo)
- `package.json` com dependências (algumas propositalmente antigas para SCA detectar)
- `users.json` — dados de exemplo

## Como testar localmente
1. Abra no VS Code.
2. Rode no terminal:
   ```
   npm install
   npm start
   ```
3. Acesse `http://localhost:3000` no navegador.
4. Teste endpoints:
   - `GET /search?q=<script>alert(1)</script>` → refletirá XSS
   - `GET /users` → lista de usuários (com segredos)
   - `GET /users?username=admin' OR '1'='1` → simula consulta insegura
   - `GET /unsafe-eval?code=2+2` → demonstra `eval`

## Como usar com o pipeline de CI/CD
- Commit e suba o repositório para o GitHub.
- No GitHub Actions, o workflow `.github/workflows/security-pipeline.yml` irá:
  - Rodar Semgrep
  - Rodar Snyk (é necessário setar `SNYK_TOKEN` em Secrets)
  - Subir a aplicação e rodar um scan básico com OWASP ZAP via Docker

### Observação sobre Snyk
Para rodar o Snyk no Actions você precisa criar conta em https://snyk.io e adicionar o token como **Repository Secret** chamado `SNYK_TOKEN`.

## Licença
Exemplo para fins educacionais. Não use esse código em produção.
