import prisma from "../config/prisma.js";
import { hash } from "bcryptjs";

// GET /companies
export const getAllCompanies = async (req, res) => {
  try {
    if (req.user.role !== "developer") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const companies = await prisma.company.findMany({
      include: {
        users: {
          select: {
            id: true,
            fullName: true,
            username: true,
            role: true,
            companyId: true,
          },
        },
      },
    });

    res.json(companies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /companies
export const createCompany = async (req, res) => {
  try {
    if (req.user.role !== "developer") {
      return res
        .status(403)
        .json({ message: "Only developer can create companies" });
    }

    const {
      companyName,
      ownerName,
      address,
      phone,
      email,
      password,
    } = req.body;

    const exist = await prisma.company.findFirst({ where: { email } });
    if (exist)
      return res.status(400).json({ message: "Company already registered" });

    const hashedPassword = await hash(password, 10);

    const company = await prisma.company.create({
      data: {
        name: companyName,
        ownerName,
        address,
        phone,
        email,
        users: {
          create: [
            {
              fullName: ownerName,
              username: email,
              password: hashedPassword,
              role: "SUPER_ADMIN",
            },
          ],
        },
      },
      include: { users: true },
    });

    res.status(201).json({ message: "Company registered", company });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /companies/:id
export const updateCompany = async (req, res) => {
  try {
    if (req.user.role !== "developer") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { id } = req.params;
    const { name, ownerName, address, phone, email } = req.body;

    const updatedCompany = await prisma.company.update({
      where: { id: parseInt(id) },
      data: { name, ownerName, address, phone, email },
    });

    res.json({
      message: "Company updated Successfully",
      company: updatedCompany,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /companies/:id
export const deleteCompany = async (req, res) => {
  try {
    if (req.user.role !== "developer") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { id } = req.params;
    const companyId = parseInt(id);

    // 🔥 hapus semua data terkait biar gak orphan
    await prisma.refreshToken.deleteMany({ where: { user: { companyId } } });
    await prisma.user.deleteMany({ where: { companyId } });
    // await prisma.productOrderItem.deleteMany({
    //   where: { order: { companyId } },
    // });
    // await prisma.productOrder.deleteMany({ where: { companyId } });

    // terakhir hapus company
    await prisma.company.delete({
      where: { id: companyId },
    });

    res.json({ message: "Company and related data deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
