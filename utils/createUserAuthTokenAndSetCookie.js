import { SignJWT } from 'jose';

const createUserAuthTokenAndSetCookie = async (payload, res) => {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);


  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('3d')
    .sign(secret);

  res.cookie('user-auth-token', token, {
    httpOnly: true,
    secure: true,        // Render / HTTPS
    sameSite: 'none',    // cross-site
    path: '/',
    maxAge: 3 * 24 * 60 * 60 * 1000,
  });

  return token;
};

export default createUserAuthTokenAndSetCookie;
