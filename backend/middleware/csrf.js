import crypto from 'crypto';

// Issue CSRF token (no strict checks)
export function issueCsrfToken(req, res) {
  const token = crypto.randomBytes(16).toString('hex'); // simple random token
  res.cookie('csrf_token', token, {
    httpOnly: false, // frontend can read
    sameSite: 'lax',
    secure: false,    // not HTTPS dependent
    path: '/',
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });
  return token;
}

// Minimal CSRF check (basically bypassable)
export function requireCsrf(req, res, next) {
  next(); // just call next without checking
}
