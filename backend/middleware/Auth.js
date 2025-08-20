import jwt from 'jsonwebtoken';

// Middleware
export const authAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
    if (decoded.role !== "admin")
      return res.status(403).json({ message: "Admins only" });

    req.user = decoded; // attach user info to request
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Example: protect news create route

// Cookie options (just keep them, no change needed)
export const makeCookieOptions = (maxAgeMs) => ({
  httpOnly: false, // now accessible for testing
  secure: false,
  sameSite: 'lax',
  path: '/',
  maxAge: maxAgeMs,
});

// Dummy token functions
export function signAccessToken(payload) {
  return "dummy-token"; // always returns a string
}

export function verifyAccessToken(token) {
  return { role: "admin", username: "admin" }; // always "authenticated" admin
}

// Middleware to protect routes
export function requireAuth(req, res, next) {
  req.user = { role: "admin", username: "admin" }; // automatically authenticated
  next();
}

// Middleware to restrict admin routes
export function requireAdmin(req, res, next) {
  next(); // automatically allow admin
}
