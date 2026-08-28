import prisma from "../config/prisma.js";
import { hash } from "bcryptjs";

// ✅ GET all users by company (SUPER_ADMIN bisa akses semua, ADMIN hanya di company-nya)
export const getAllUsers = async (req, res) => {
  try {
    // const { id } = req.params;  companyId

    // kalau ADMIN, hanya boleh akses company-nya sendiri
    if (req.user.role === "ADMIN" && req.user.companyId !== parseInt(id)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const allUsers = await prisma.company.findUnique({
      where: { id: req.user.companyId },
      include: {
        users: {
          where: {
            role: { not: "SUPER_ADMIN" }, // jangan expose super admin
          },
        },
      },
    });

    if (!allUsers)
      return res.status(404).json({ message: "Company not found" });

    res.json(allUsers.users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ CREATE user (SUPER_ADMIN buat ADMIN, ADMIN buat USER di company sendiri)
export const createUsers = async (req, res) => {
  try {
    const { fullName, username, password, role, companyId } = req.body;

    // validasi role yg boleh dibuat
    if (role === "ADMIN" && req.user.role !== "SUPER_ADMIN") {
      return res
        .status(403)
        .json({ message: "Only SUPER_ADMIN can create ADMIN" });
    }

    if (role === "USER" && req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Only ADMIN can create USER" });
    }

    // kalau ADMIN, companyId harus sama dengan companyId-nya sendiri
    if (req.user.role === "ADMIN" && req.user.companyId !== companyId) {
      return res
        .status(403)
        .json({ message: "Cannot create user in another company" });
    }

    // username unique
    const exist = await prisma.user.findUnique({ where: { username } });
    if (exist)
      return res.status(400).json({ message: "Username already taken" });

    const hashedPassword = await hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        fullName,
        username,
        password: hashedPassword,
        role: "ADMIN",
        companyId: req.user.companyId,
      },
    });

    res.status(201).json({ message: "User registered", user: newUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ UPDATE user (SUPER_ADMIN bebas, ADMIN hanya dalam company-nya)
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, username, password } = req.body;

    // cari user dulu biar bisa cek company
    const targetUser = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });
    if (!targetUser) return res.status(404).json({ message: "User not found" });

    // ADMIN hanya bisa update user di company sendiri
    if (
      req.user.role === "ADMIN" &&
      req.user.companyId !== targetUser.companyId
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const hashedPassword = password ? await hash(password, 10) : undefined;

    const updateUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        fullName,
        username,
        ...(hashedPassword && { password: hashedPassword }),
      },
    });

    res.json({ message: "User updated successfully", user: updateUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ DELETE user (SUPER_ADMIN bebas, ADMIN hanya di company sendiri)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const targetUser = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });
    if (!targetUser) return res.status(404).json({ message: "User not found" });

    if (
      req.user.role === "ADMIN" &&
      req.user.companyId !== targetUser.companyId
    ) {
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
