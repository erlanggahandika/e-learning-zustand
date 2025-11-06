import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
const prisma = new PrismaClient();

dotenv.config();

export const getAllTransactions = async (req, res) => {
  try {
    // Semua transaksi
    const transactions = await prisma.transaction.findMany({
      orderBy: { createdAt: "desc" },
    });

    const data = await Promise.all(
      transactions.map(async (t) => {
        const user = await prisma.user.findUnique({
          where: { uuid: t.useruuid },
          select: { id: true, name: true, email: true },
        });
        return {
          ...t,
          user,
        };
      })
    );
    

    // Total transaksi
    const totalTransactions = transactions.length;

    // Hitung transaksi hari ini
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const transactionsToday = transactions.filter(
      (t) => new Date(t.createdAt) >= today && new Date(t.createdAt) < tomorrow
    ).length;

    // Hitung transaksi minggu ini
    const now = new Date();
    const startOfWeek = new Date();
    startOfWeek.setDate(now.getDate() - now.getDay()); // minggu mulai hari Minggu
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfLastWeek = new Date(startOfWeek);
    endOfLastWeek.setDate(startOfWeek.getDate() - 1);
    endOfLastWeek.setHours(23, 59, 59, 999);

    const startOfLastWeek = new Date(endOfLastWeek);
    startOfLastWeek.setDate(endOfLastWeek.getDate() - 6);
    startOfLastWeek.setHours(0, 0, 0, 0);

    const transactionsThisWeek = transactions.filter(
      (t) => new Date(t.createdAt) >= startOfWeek
    ).length;

    const transactionsLastWeek = transactions.filter(
      (t) => new Date(t.createdAt) >= startOfLastWeek && new Date(t.createdAt) <= endOfLastWeek
    ).length;

    // Hitung arrow & percent
    const arrow = transactionsThisWeek >= transactionsLastWeek ? "up" : "down";
    const percent =
      transactionsLastWeek === 0
        ? 100
        : ((transactionsThisWeek - transactionsLastWeek) / transactionsLastWeek) * 100;

    res.json({
      success: true,
      message: "Daftar transaksi berhasil diambil",
      data,
      totalTransactions,
      transactionsToday,
      arrow,
      percent: parseFloat(percent.toFixed(1)), // bulatkan 1 desimal
    });
  } catch (err) {
    console.error("Error getAllTransactions:", err);
    res.status(500).json({ error: "Gagal mengambil data transaksi" });
  }
};
export const searchTransactions = async (req, res) => {
  const search = (req.params.search || "").toLowerCase().trim();

  if (!search) {
    return res.status(400).json({
      success: false,
      message: "Silahkan masukkan kata kunci pencarian!",
    });
  }

  try {
    // Ambil semua transaksi + user
    const transactions = await prisma.transaction.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Filter manual (case-insensitive)
    const filtered = transactions.filter(
      (t) =>
        t.description?.toLowerCase().includes(search) ||
        t.courseuuid?.toLowerCase().includes(search) ||
        t.user?.name?.toLowerCase().includes(search)
    );

    res.json({
      success: true,
      message: "Daftar transaksi berhasil diambil",
      data: filtered,
    });
  } catch (error) {
    console.log("Error searchTransactions:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
    });
  }
};

export const getAllTransactionsbydate = async (req, res) => {
  const search = (req.query.search || "").trim().toLowerCase();
  const dateFrom = req.query.from ? new Date(req.query.from) : null;
  const dateTo = req.query.to ? new Date(req.query.to) : null;

  try {
    const whereClause = {};

    // === Filter pencarian ===
    if (search) {
      whereClause.OR = [
        { description: { contains: search } },
        { courseuuid: { contains: search } },
        { user: { name: { contains: search } } },
      ];
    }

    // === Filter tanggal ===
    if (dateFrom || dateTo) {
      whereClause.createdAt = {};
      if (dateFrom) whereClause.createdAt.gte = dateFrom;
      if (dateTo) {
        // tambahkan 1 hari biar tanggal akhir termasuk
        dateTo.setHours(23, 59, 59, 999);
        whereClause.createdAt.lte = dateTo;
      }
    }

    // === Ambil semua data kalau filter kosong ===
    const transactions = await prisma.transaction.findMany({
      where: Object.keys(whereClause).length ? whereClause : undefined,
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json({
      success: true,
      message: "Data transaksi berhasil diambil",
      data: transactions,
    });
  } catch (error) {
    console.error("Error getAllTransactionsbydate:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
};

export const getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await prisma.enrollment.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        course: { select: { id: true, title: true, price: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      success: true,
      message: "Daftar langganan berhasil diambil",
      data: subscriptions.map(s => ({
        id: s.id,
        midtransOrderId: s.midtransOrderId,
        user: s.user,
        course: s.course,
        paid: s.paid,
        paymentId: s.paymentId,
        snapUrl: s.snapUrl,
        createdAt: s.createdAt,
        status: s.paid ? "Paid" : "Pending",
      })),
    });
  } catch (err) {
    console.error("Error getAllSubscriptions:", err);
    res.status(500).json({ error: "Gagal mengambil data langganan" });
  }
};

export const searchSubscriptions = async (req, res) => {
  try {
    const search = (req.params.search || "").trim();

    const subscriptions = await prisma.enrollment.findMany({
      where: {
        user: {
          name: {
            contains: search, // tanpa mode
          },
        },
      },
      include: {
        user: { select: { uuid: true, name: true, email: true } },
        course: { select: { id: true, title: true, price: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      success: true,
      message: "Hasil pencarian langganan berdasarkan UUID user",
      data: subscriptions.map(s => ({
        id: s.id,
        midtransOrderId: s.midtransOrderId,
        user: s.user,
        course: s.course,
        paid: s.paid,
        paymentId: s.paymentId,
        snapUrl: s.snapUrl,
        createdAt: s.createdAt,
        status: s.paid ? "Paid" : "Pending",
      })),
    });
  } catch (err) {
    console.error("Error searchSubscriptions:", err);
    res.status(500).json({ error: "Gagal mencari langganan" });
  }
};

export const getSubscriptionsbydate = async (req, res) => {
  try {
    const search = (req.query.search || "").trim().toLowerCase();
    const dateFrom = req.query.from ? new Date(req.query.from) : null;
    const dateTo = req.query.to ? new Date(req.query.to) : null;

    const whereClause = {};

    // 🔹 Filter nama user (jika ada)
    if (search) {
      whereClause.user = {
        name: {
          contains: search,
        },
      };
    }

    // 🔹 Filter tanggal createdAt (jika ada)
    if (dateFrom && dateTo) {
      whereClause.createdAt = {
        gte: dateFrom,
        lte: new Date(dateTo.setHours(23, 59, 59, 999)), // agar mencakup seluruh hari
      };
    } else if (dateFrom) {
      whereClause.createdAt = {
        gte: dateFrom,
      };
    } else if (dateTo) {
      whereClause.createdAt = {
        lte: new Date(dateTo.setHours(23, 59, 59, 999)),
      };
    }

    const subscriptions = await prisma.enrollment.findMany({
      where: whereClause,
      include: {
        user: { select: { uuid: true, name: true, email: true } },
        course: { select: { id: true, title: true, price: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      success: true,
      message: "Daftar langganan berhasil difilter berdasarkan tanggal",
      data: subscriptions.map(s => ({
        id: s.id,
        midtransOrderId: s.midtransOrderId,
        user: s.user,
        course: s.course,
        paid: s.paid,
        paymentId: s.paymentId,
        snapUrl: s.snapUrl,
        createdAt: s.createdAt,
        status: s.paid ? "Paid" : "Pending",
      })),
    });
  } catch (err) {
    console.error("Error getSubscriptionsbydate:", err);
    res.status(500).json({ error: "Gagal memfilter data langganan berdasarkan tanggal" });
  }
};
