import { jwtVerify } from 'jose';

const optionalUserAuthMiddleware = async (req, res, next) => {
  try {
    const token =
      req.cookies?.['user-auth-token'] ||
      (req.headers.authorization?.startsWith('Bearer ')
        ? req.headers.authorization.split(' ')[1]
        : null);

    if (!token) return next();

    // 🔥 SAME SECRET AS LOGIN
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    const { payload } = await jwtVerify(token, secret, {
      issuer: 'iifb',
      audience: 'iifb-audience',
    });

    req.user = {
      userId: payload.userId,
      email: payload.email,
    };
  } catch (err) {
    console.warn('Optional auth: token invalid or expired');
  }

  next();
};

export default optionalUserAuthMiddleware;
