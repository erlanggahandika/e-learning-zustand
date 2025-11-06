import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
const prisma = new PrismaClient();

// ================== CREATE TEST SOAL ==================
export const buatSoalpertemuan = async (req, res) => {
  const userId = req.user?.uuid;
  const meetingUuid = req.params.uuid;
  const { question, options, answer } = req.body;

  if (!userId)
    return res.status(401).json({ success: false, message: "Login dulu!" });

  try {
    const meeting = await prisma.meeting.findUnique({
      where: { uuid: meetingUuid },
      include: {
        _count: { select: { tests: true } }, // hitung jumlah soal
      },
    });

    if (!meeting)
      return res.status(404).json({ success: false, message: "Meeting tidak ditemukan" });

    // cek mentor akses
    const course = await prisma.course.findUnique({ where: { id: meeting.courseId } });
    if (course?.mentoruuid !== userId)
      return res.status(403).json({ success: false, message: "Tidak punya akses" });

    const test = await prisma.test.create({
      data: {
        question,
        options,
        answer,
        meetingId: meeting.id,
        uuidtest: uuidv4(),
      },
    });

    // ambil ulang count terbaru
    const updatedMeeting = await prisma.meeting.findUnique({
      where: { uuid: meetingUuid },
      include: { _count: { select: { tests: true } } },
    });

    res.status(201).json({
      success: true,
      pertemuan: {
        ...meeting,
        testsCount: updatedMeeting?._count.tests ?? 0, // jumlah soal terbaru
      },
      message: "Soal berhasil dibuat",
      data: test,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Gagal membuat soal" });
  }
};




// ================== DELETE TEST ==================
export const hapusSoalPertemuan = async (req, res) => {
  const userId = req.user?.uuid;
  const soalUuid = req.params.uuid;
  console.log(soalUuid);

  if (!userId)
    return res.status(401).json({ success: false, message: "Login dulu!" });

  try {
    // cari soal
    const soal = await prisma.test.findUnique({
      where: { uuidtest: soalUuid },
      include: {
        meeting: {
          include: {
            course: true,
          },
        },
      },
    });

    if (!soal)
      return res.status(404).json({ success: false, message: "Soal tidak ditemukan" });

    // cek apakah mentor pemilik course ini
    if (soal.meeting.course.mentoruuid !== userId)
      return res.status(403).json({ success: false, message: "Tidak punya akses untuk menghapus soal ini" });

    await prisma.test.delete({
      where: { uuidtest: soalUuid },
    });

    res.status(200).json({
      success: true,
      message: "Soal berhasil dihapus",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Gagal menghapus soal" });
  }
};

// ================== LIST TESTS ==================
export const listTestMeeting = async (req, res) => {
  const userId = req.user?.uuid;
  if (!userId) return res.status(401).json({ success: false, message: "Login dulu!" });

  const meetingUuid = req.params.uuid;

  try {
    const meeting = await prisma.meeting.findUnique({
      where: { uuid: meetingUuid }, // pastikan pakai field UUID yang sesuai schema
      include: {
        _count: {
          select: { tests: true }, // hitung jumlah soal
        },
      },
    });

    if (!meeting)
      return res.status(404).json({ success: false, message: "Meeting tidak ditemukan" });

    const tests = await prisma.test.findMany({ where: { meetingId: meeting.id } });

    res.status(200).json({
      success: true,
      pertemuan: {
        ...meeting,
        testsCount: meeting._count.tests, // jumlah soal
      },
      data: tests,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Gagal mengambil soal" });
  }
};

// ================== SUBMIT TEST RESULT ==================
export const submitTestResult = async (req, res) => {
  const userUuid = req.user?.uuid;
  const testUuid = req.params.uuid;
  const { answer } = req.body;

  if (!userUuid) 
    return res.status(401).json({ success: false, message: "Login dulu!" });

  const user = await prisma.user.findUnique({ where: { uuid: userUuid } });
  if (!user) 
    return res.status(404).json({ success: false, message: "User tidak ditemukan" });

  try {
    const test = await prisma.test.findUnique({ where: { uuidtest: testUuid } });
    if (!test) 
      return res.status(404).json({ success: false, message: "Test tidak ditemukan" });

    // ===== Cek apakah user sudah menjawab soal ini =====
    const existing = await prisma.testResult.findFirst({
      where: {
        userId: user.id,
        testId: test.id,
      },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Soal ini sudah dijawab",
        data: existing,
      });
    }

    // ===== Auto-check jawaban dengan trim + case-insensitive =====
    const correct = test.answer.trim().toLowerCase() === answer.trim().toLowerCase();

    // ===== Simpan jawaban =====
    const result = await prisma.testResult.create({
      data: {
        userId: user.id,
        testId: test.id,
        useruuid: userUuid,
        answer,
        correct,
      },
    });

    res.status(201).json({ 
      success: true, 
      message: "Jawaban berhasil disubmit", 
      data: result 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Gagal submit jawaban" });
  }
};


// ================== LIST TEST RESULT ==================
export const listTestResult = async (req, res) => {
  const userUuid = req.user?.uuid;
  const testUuid = req.params.uuid; // pake UUID sekarang

  if (!userUuid) 
    return res.status(401).json({ success: false, message: "Login dulu!" });

  const user = await prisma.user.findUnique({ where: { uuid: userUuid } });
  if (!user) 
    return res.status(404).json({ success: false, message: "User tidak ditemukan" });

  try {
    const test = await prisma.test.findUnique({ where: { uuidtest: testUuid } });
    if (!test) 
      return res.status(404).json({ success: false, message: "Test tidak ditemukan" });

    const results = await prisma.testResult.findMany({
      where: { testId: test.id, userId: user.id },
    });

    res.status(200).json({ success: true, data: results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Gagal mengambil hasil test" });
  }
};

// getall list 
