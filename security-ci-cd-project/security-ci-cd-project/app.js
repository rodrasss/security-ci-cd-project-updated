/*
  Vulnerable Demo App
  - /login: intentionally naive authentication (no rate-limit, plaintext)
  - /search: reflected XSS via query param `q`
  - /users: shows "insecure" data and demonstrates unsafe use of user input in a pseudo-query
  - /unsafe-eval: demonstrates use of eval on user input (dangerous)
*/
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const fs = require('fs');
const _ = require('lodash');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// Intentionally using helmet but with default config to make some headers present
app.use(helmet());

const USERS_FILE = __dirname + '/users.json';
let USERS = [];
try {
  USERS = JSON.parse(fs.readFileSync(USERS_FILE));
} catch (e) {
  USERS = [
    { id: 1, username: "admin", password: "admin123", role: "admin", secret: "TOPSECRET" },
    { id: 2, username: "user", password: "user123", role: "user", secret: "USERSECRET" }
  ];
}

// Home
app.get('/', (req, res) => {
  res.send(`<h2>Vulnerable Demo App</h2>
    <ul>
      <li><a href="/login">/login (POST)</a></li>
      <li><a href="/search?q=hello">/search?q= (reflected XSS)</a></li>
      <li><a href="/users">/users (insecure data)</a></li>
      <li><a href="/unsafe-eval?code=2+%2B+2">/unsafe-eval?code=</a></li>
    </ul>`);
});

// Naive login - stores "session" in cookie (insecure)
app.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  // Very naive auth: lookup by username and check password directly
  const u = USERS.find(x => x.username === username && x.password === password);
  if (u) {
    // insecure cookie: no secure flags, no signing
    res.cookie('session_user', username);
    return res.json({ ok: true, message: 'Logged in', user: _.omit(u, ['password']) });
  } else {
    return res.status(401).json({ ok: false, message: 'Invalid credentials' });
  }
});

// Reflected XSS example: displays user input back without sanitization
app.get('/search', (req, res) => {
  const q = req.query.q || '';
  // Intentionally reflecting without escaping -> XSS risk
  res.send(`<h3>Search results for: ${q}</h3><p>Simulated results...</p>`);
});

// Insecure endpoint that simulates a query built using string concatenation (SQLi-like pattern)
app.get('/users', (req, res) => {
  // Example: ?username=admin' OR '1'='1
  const username = req.query.username;
  if (username) {
    // Simulate unsafe "query"
    const simulatedQuery = "SELECT * FROM users WHERE username = '" + username + "'";
    // Return the assembled query and any matches using naive check
    const matches = USERS.filter(u => u.username === username);
    return res.json({ query: simulatedQuery, matches });
  } else {
    // Return full list including "secret" to show sensitive data exposure
    return res.json(USERS);
  }
});

// Unsafe eval endpoint (do NOT use in real apps) - demonstrates code injection risk
app.get('/unsafe-eval', (req, res) => {
  const code = req.query.code || '';
  try {
    // Dangerous: evaluating user-supplied code
    // Deliberate vulnerability for learning/testing
    const result = eval(code);
    res.json({ ok: true, code: code, result: String(result) });
  } catch (e) {
    res.status(400).json({ ok: false, error: e.toString() });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Vulnerable Demo App running on http://localhost:${PORT}`);
});