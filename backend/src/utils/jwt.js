import jwt from "jsonwebtoken";

export const createAccessToken = (user) => {
  return jwt.sign(
    { userId: user._id, name: user.name },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m" }
  );
};

export const createRefreshToken = (user) => {
  return jwt.sign(
    { userId: user._id, tokenVersion: user.tokenVersion },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d" }
  );
};

export const verifyAccessToken = (token) =>
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

export const verifyRefreshToken = (token) =>
  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
