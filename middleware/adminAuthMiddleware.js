import { jwtVerify } from 'jose';

const adminAuthMiddleware = async (req, res, next) => {
  try {
    // 1) पहले cookie से token लें, नहीं मिले तो Authorization header से fallback करें.
    const token =
      req.cookies?.['admin-auth-token'] ||
      (req.headers.authorization && req.headers.authorization.split(' ')[1]);

    if (!token) {
      return res.status(401).json({ message: 'Authentication token missing' });
    }

    const secret = new TextEncoder().encode(process.env.ADMIN_SECRET);

    const { payload } = await jwtVerify(token, secret, {
      issuer: 'iifb',
      audience: 'iifb-audience',
    });

    // Attach admin info to request
    req.admin = {
      userId: payload.userId,
      email: payload.email,
    };

    return next();
  } catch (err) {
    // Optional: clear cookie if token invalid/expired so browser doesn't keep sending it
    try {
      res.clearCookie('admin-auth-token', { path: '/' });
    } catch (e) { /* ignore */ }

    console.error('Admin auth failed:', err?.message || err);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

export default adminAuthMiddleware;
