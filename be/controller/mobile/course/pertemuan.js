import { PrismaClient } from "@prisma/client";
import { uuid } from "systeminformation";
import { v4 as uuidv4 } from "uuid";
const prisma = new PrismaClient();

// ================= CREATE MEETING =================
export const tambahPertemuan = async (req, res) => {
  const userId = req.user?.uuid; // pastikan ada user login
  if (!userId) return res.status(401).json({ success: false, message: "Silahkan login!" });

  const courseId = req.params.uuid;
  const { title, content, order, vidio, image } = req.body;

  try {
    // pastikan user ini adalah mentor course
    const course = await prisma.course.findUnique({ where: { uuid: courseId } });
    if (!course) return res.status(404).json({ success: false, message: "Course tidak ditemukan" });
    if (course.mentoruuid !== userId) return res.status(403).json({ success: false, message: "Tidak punya akses" });

    const meeting = await prisma.meeting.create({
      data: { title, content, order, courseId: course.id, courseuuid: courseId , uuid: uuidv4() , vidio, image },
    });

    res.status(201).json({ success: true, message: "Pertemuan berhasil dibuat", data: meeting });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Gagal membuat pertemuan" });
  }
};

// ================= LIST MEETINGS =================
export const listPertemuan = async (req, res) => {
  const user = req.user?.uuid;
  if (!user)
    return res.status(401).json({ success: false, message: "Silahkan login terlebih dahulu!" });

  const courseUuid = req.params.uuid;
  if (!courseUuid)
    return res.status(404).json({ success: false, message: "Course tidak ditemukan" });

  try {
    // ambil course berdasarkan UUID
    const course = await prisma.course.findUnique({ where: { uuid: courseUuid } });
    if (!course)
      return res.status(404).json({ success: false, message: "Course tidak ditemukan" });

    // ambil semua meeting dari courseId termasuk hitung jumlah tests
    const meetings = await prisma.meeting.findMany({
      where: { courseId: course.id },
      orderBy: { order: "asc" },
      include: { 
        course: true,
        _count: { select: { tests: true } } // hitung jumlah soal
      },
    });

    // ubah response biar ada courseUuid dan jumlah test
    const response = meetings.map(m => ({
      id: m.id,
      title: m.title,
      content: m.content,
      order: m.order,
      uuidpertemuan: m.uuid,
      vidio : m.vidio,
      image: m.image,
      courseId: m.courseId,
      uuid: m.meetinguuid,
      courseUuid: m.course.uuid,
      testsCount: m._count.tests, // jumlah soal
    }));

    res.status(200).json({ success: true, data: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Gagal mengambil data pertemuan" });
  }
};


// ================= UPDATE MEETING =================
// ================= UPDATE MEETING =================
export const updatePertemuan = async (req, res) => {
  const userId = req.user?.uuid; // pakai uuid mentor
  const meetingUuid = req.params.uuid; // gunakan uuid pertemuan
  const { title, content, order, vidio, image } = req.body;

  try {
    const meeting = await prisma.meeting.findUnique({ where: { uuid: meetingUuid } });
    if (!meeting) return res.status(404).json({ success: false, message: "Pertemuan tidak ditemukan" });

    // cek apakah mentor punya akses
    const course = await prisma.course.findUnique({ where: { id: meeting.courseId } });
    if (course?.mentoruuid !== userId) return res.status(403).json({ success: false, message: "Tidak punya akses" });

    const updated = await prisma.meeting.update({
      where: { uuid: meetingUuid },
      data: { title, content, order, vidio, image },
    });

    res.status(200).json({ success: true, message: "Pertemuan berhasil diperbarui", data: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Gagal update pertemuan" });
  }
};

// ================= DELETE MEETING =================
export const hapusPertemuan = async (req, res) => {
  const userId = req.user?.uuid;
  const meetingUuid = req.params.uuid;

  try {
    const meeting = await prisma.meeting.findUnique({ where: { uuid: meetingUuid } });
    if (!meeting) return res.status(404).json({ success: false, message: "Pertemuan tidak ditemukan" });

    // cek akses mentor
    const course = await prisma.course.findUnique({ where: { id: meeting.courseId } });
    if (course?.mentoruuid !== userId) return res.status(403).json({ success: false, message: "Tidak punya akses" });

    await prisma.meeting.delete({ where: { uuid: meetingUuid } });

    res.status(200).json({ success: true, message: "Pertemuan berhasil dihapus" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Gagal hapus pertemuan" });
  }
};

