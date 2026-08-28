import prisma from "../config/prisma.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const protect = async (req, res, next) => {
  try {
    const auth = req.headers.authorization || "";
    const [scheme, token] = auth.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ message: "No token, unauthorized" });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res
        .status(500)
        .json({ message: "Server misconfig: JWT_SECRET not set" });
    }

    const decoded = jwt.verify(token, secret, { algorithms: ["HS256"] });

    const userId = decoded.id ?? decoded.sub;
    if (!userId) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    // ✅ ambil user + company (lebih lengkap, biar bisa langsung dipakai /me)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullName: true,
        username: true,
        role: true,
        companyId: true,
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

    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: `Invalid token: ${err.message}` });
    }
    return res.status(500).json({ message: "Auth error" });
  }
};

export const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Forbidden: Role not allowed" });
  }
  next();
};
