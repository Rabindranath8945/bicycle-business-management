import { verifyAccessToken } from "../utils/jwt.js";

export default function authMiddleware(req, res, next) {
  const auth = req.headers["authorization"];
  if (!auth) return res.status(401).json({ message: "Not authenticated" });

  const parts = auth.split(" ");
  if (parts.length !== 2)
    return res.status(401).json({ message: "Invalid token" });

  try {
    const payload = verifyAccessToken(parts[1]);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalid or expired" });
  }
}
