import prisma from "../config/prisma.js";
import { hash } from "bcryptjs";

// ✅ ADMIN: get all USER in his company
export const getAllUsers = async (req, res) => {
  try {
    const companyId = req.user.companyId; // ambil dari JWT

    const company = await prisma.company.findUnique({
      where: { id: companyId },
      include: {
        users: {
          where: { role: "USER" },
        },
      },
    });

    if (!company) return res.status(404).json({ message: "Company not found" });

    res.json(company.users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ ADMIN: create USER (hanya di company sendiri)
export const createUsers = async (req, res) => {
  try {
    const { fullName, username, password } = req.body;

    // hanya bisa buat USER
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const exist = await prisma.user.findUnique({ where: { username } });
    if (exist)
      return res.status(400).json({ message: "Username already taken" });

    const hashedPassword = await hash(password, 10);

    const user = await prisma.user.create({
      data: {
        fullName,
        username,
        password: hashedPassword,
        role: "USER",
        companyId: req.user.companyId, // pastikan di company admin
      },
    });

    res.status(201).json({ message: "User registered", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ ADMIN: update USER (hanya di company sendiri)
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, username, password } = req.body;

    const targetUser = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });
    if (!targetUser) return res.status(404).json({ message: "User not found" });

    // pastikan user yg diupdate masih dalam company admin
    if (targetUser.companyId !== req.user.companyId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const hashedPassword = password ? await hash(password, 10) : undefined;

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        fullName,
        username,
        ...(hashedPassword && { password: hashedPassword }),
      },
    });

    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ ADMIN: delete USER (hanya di company sendiri)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const targetUser = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });
    if (!targetUser) return res.status(404).json({ message: "User not found" });

    if (targetUser.companyId !== req.user.companyId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await prisma.user.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
