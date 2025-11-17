import User from "../models/User.js";
import {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";

const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.COOKIE_SECURE === "true",
  sameSite: process.env.COOKIE_SAMESITE || "lax",
  path: "/api/auth/refresh",
  maxAge: 1000 * 60 * 60 * 24 * 7,
});

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "Missing fields" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const user = new User({ name, email, password });
    await user.save();

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);
    res.cookie("jid", refreshToken, cookieOptions());

    res.json({
      accessToken,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const valid = await user.comparePassword(password);
    if (!valid) return res.status(400).json({ message: "Invalid credentials" });

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);
    res.cookie("jid", refreshToken, cookieOptions());

    res.json({
      accessToken,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const refresh = async (req, res) => {
  try {
    const token = req.cookies.jid;
    if (!token) return res.status(401).json({ ok: false });

    const payload = verifyRefreshToken(token);
    const user = await User.findById(payload.userId);
    if (!user) return res.status(401).json({ ok: false });

    if (payload.tokenVersion !== user.tokenVersion)
      return res.status(401).json({ ok: false });

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);
    res.cookie("jid", refreshToken, cookieOptions());

    res.json({
      ok: true,
      accessToken,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    return res.status(401).json({ ok: false });
  }
};

export const logout = async (req, res) => {
  try {
    const token = req.cookies.jid;
    res.clearCookie("jid", { path: "/api/auth/refresh" });

    if (token) {
      const payload = verifyRefreshToken(token);
      await User.findByIdAndUpdate(payload.userId, {
        $inc: { tokenVersion: 1 },
      });
    }

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false });
  }
};
