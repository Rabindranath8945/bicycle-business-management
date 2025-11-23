import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Generate JWT and set cookie
const sendToken = (res, user) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: true, // ⭐ MUST be true for HTTPS (Vercel/Render)
    sameSite: "none", // ⭐ MUST be none for cross-domain cookies
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

// ---------------------------
// REGISTER
// ---------------------------
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({
      name,
      email,
      password,
      role: role || "staff", // auto-set role
    });

    // login immediately after register
    sendToken(res, user);

    return res.json({
      message: "Registered successfully",
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ---------------------------
// LOGIN
// ---------------------------
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Cookie for web
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Return token for MOBILE APPS
    return res.json({
      message: "Login successful",
      token, // <-- IMPORTANT
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ---------------------------
// LOGOUT
// ---------------------------
export const logoutUser = (req, res) => {
  res.cookie("token", "", { maxAge: 1 });
  res.json({ message: "Logged out" });
};

// ---------------------------
// GET LOGGED-IN USER
// ---------------------------
export const getMe = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  return res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
  });
};
