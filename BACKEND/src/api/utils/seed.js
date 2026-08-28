import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";

async function seedDeveloper() {
  const existingDev = await prisma.user.findFirst({
    where: { role: "developer" },
  });

  if (!existingDev) {
    const hashedPassword = await bcrypt.hash("password123", 10);
    await prisma.user.create({
      data: {
        fullName: "Meong Coding",
        username: "dev",
        password: hashedPassword,
        role: "developer",
      },
    });
    console.log("✅ Developer account created");
  } else {
    console.log("ℹ️ Developer already exists");
  }
}

export default seedDeveloper;
