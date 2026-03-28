import { SignJWT } from "jose";

const createAdminAuthTokenAndSetCookie = async (userId, email, res) => {
  const secret = new TextEncoder().encode(process.env.ADMIN_SECRET);

  const token = await new SignJWT({ userId, email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer("iifb")
    .setAudience("iifb-audience")
    .setExpirationTime("3d")
    .sign(secret);

  res.cookie("admin-auth-token", token, {
    httpOnly: true,

    // 🔥 REQUIRED for Render backend
    secure: true,
    sameSite: "none",

    path: "/",
    maxAge: 3 * 24 * 60 * 60 * 1000,
  });

  return token;
};

export default createAdminAuthTokenAndSetCookie;
