import prisma from "../config/prisma.js";

// ✅ CREATE order + items
export const createData = async (req, res) => {
  try {
    const { id, oleh, waktu, pemesan, data } = req.body;

    const newOrder = await prisma.productOrder.create({
      data: {
        id: id || undefined,
        oleh,
        waktu: new Date(waktu),
        pemesan,
        companyId: req.user.companyId,
        userId: req.user.id,
        items: {
          create: data.map((item) => ({
            kategori: item.kategori,
            ukuran: item.ukuran,
            diameter: item.diameter,
            volume: item.volume,
            jumlah: item.jumlah,
          })),
        },
      },
      include: { items: true },
    });

    res.status(201).json(newOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ READ all orders for company
export const getDatas = async (req, res) => {
  try {
    const orders = await prisma.productOrder.findMany({
      where: { companyId: req.user.companyId },
      include: { items: true },
      orderBy: { waktu: "desc" },
    });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ READ one order by id
export const getDataById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await prisma.productOrder.findFirst({
      where: { id, companyId: req.user.companyId },
      include: { items: true },
    });
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ UPDATE order + items (replace items)
export const updateData = async (req, res) => {
  try {
    const { id } = req.params;
    const { oleh, waktu, pemesan, data } = req.body;

    // Hapus semua items lama, lalu create ulang
    const updatedOrder = await prisma.productOrder.update({
      where: {
        id,
        companyId: req.user.companyId, // multi-tenant safe
      },
      data: {
        oleh,
        waktu: waktu ? new Date(waktu) : undefined,
        pemesan,
        items: {
          deleteMany: {}, // hapus semua items lama
          create: data.map((item) => ({
            kategori: item.kategori,
            ukuran: item.ukuran,
            diameter: item.diameter,
            volume: item.volume,
            jumlah: item.jumlah,
          })),
        },
      },
      include: { items: true },
    });

    res.json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ UPDATE marked order By id
export const markedData = async (req, res) => {
  try {
    const { id } = req.params;
    const markedUpdate = await prisma.productOrder.update({
      where: {
        id,
        companyId: req.user.companyId,
      },
      data: { marked: true },
    });
    res.json(markedUpdate);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "gagal update" });
  }
};

// ✅ DELETE order (items ikut terhapus otomatis by relation cascade)
export const deleteData = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.productOrder.delete({
      where: { id, companyId: req.user.companyId },
    });
    res.json({ message: "Order deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
