import prisma from "../config/prisma.js";
import { compare } from "bcryptjs";
import pkg, { decode } from "jsonwebtoken";
const { sign, verify } = pkg;
import { generateTokens } from "../utils/token.js";

// ================== LOGIN ==================
export const login = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    let user = null;
    if (email) {
      const company = await prisma.company.findUnique({
        where: { email },
        include: { users: true },
      });
      if (!company)
        return res.status(404).json({ message: "Company not found" });

      const isMatch = await compare(password, company.password);
      if (!isMatch)
        return res.status(401).json({ message: "Invalid password" });

      user = company.users[0]; // ambil SUPER_ADMIN
    }

    if (username) {
      user = await prisma.user.findUnique({ where: { username } });
      if (!user) return res.status(404).json({ message: "User not found" });
      const isMatch = await compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ message: "Invalid password" });
    }

    if (!user)
      return res.status(400).json({ message: "Provide email or username" });

    // generate access & refresh tokens
    const { accessToken, refreshToken } = await generateTokens(user);

    // simpan refreshToken di cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/", // penting biar bisa diakses semua endpoint
    });

    // kirim accessToken ke frontend
    return res.json({
      accessToken,
      name: user.fullName,
      username: user.username,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const me = async (req, res) => {
  try {
    // req.user sudah diisi dari middleware JWT
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        fullName: true,
        username: true,
        role: true,
        company: {
          select: {
            id: true,
            name: true,
            ownerName: true,
            email: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const refresh = async (req, res) => {
  const refreshToken = req.cookies.refreshToken; // perbaikan

  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token" });
  }

  try {
    // Verifikasi JWT refresh token
    const decoded = verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Cari token di DB
    const storedToken = await prisma.refreshToken.findFirst({
      where: {
        token: refreshToken,
        userId: decoded.id,
        revoked: false,
        expiresAt: { gt: new Date() },
      },
      include: {
        user: true,
      },
    });

    if (!storedToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    // Buat access token baru
    const accessToken = sign(
      {
        id: storedToken.user.id,
        role: storedToken.user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    return res.json({ accessToken });
  } catch (err) {
    return res.status(401).json({ message: "Invalid or exired refresh token" });
  }
};

export const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    await prisma.refreshToken
      .updateMany({
        where: { token: refreshToken },
        data: { revoked: true },
      })
      .catch(() => {});
  }

  res.clearCookie("refreshToken");
  res.json({ message: "Logged out successfully" });
};
