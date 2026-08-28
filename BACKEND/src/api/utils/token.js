import pkg from "jsonwebtoken";
const { sign } = pkg;
import prisma from "../config/prisma.js";

export const generateTokens = async (user) => {
  // Access token (15 detik)
  const accessToken = sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  // Refresh token (7 hari)
  const refreshToken = sign(
    { id: user.id, role: user.role },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  // delete token lama, 1 user/device
  await prisma.refreshToken.deleteMany({
    where: { userId: user.id },
  });

  // Simpan refreshToken baru ke DB
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 hari
    },
  });

  return { accessToken, refreshToken };
};
