import { jwtVerify } from "jose";

const authenticateAdmin = async (req, res, next) => {
    try {
        const token =
            (req.headers.authorization && req.headers.authorization.split(" ")[1]) ||
            req.cookies?.["admin-auth-token"];

        if (!token) {
            return res.status(401).json({ message: "Authentication token missing" });
        }

        const secret = new TextEncoder().encode(process.env.ADMIN_SECRET);

        const { payload } = await jwtVerify(token, secret, {
            issuer: "iifb",
            audience: "iifb-audience",
        });

        req.user = {
            userId: payload.userId,
            email: payload.email,
        };

        next();
    } catch (err) {
        try {
            res.clearCookie("admin-auth-token", { path: "/" });
        } catch (e) { }
        console.error("Admin auth failed:", err?.message || err);
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};

export default authenticateAdmin;
