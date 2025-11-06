import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import { uuid } from "systeminformation";
dotenv.config();

const prisma = new PrismaClient();

// GET /courses
export const getCourse = async (req, res) => {
  const useruuid = req.user?.uuid;
  if (!useruuid) {
    return res.status(401).json({
      success: false,
      message: "Silahkan login terlebih dahulu!",
    });
  }

  try {
    const courses = await prisma.course.findMany({
      include: {
        mentor: true,
        meetings: {
          include: {
            _count: { select: { tests: true } } // hitung jumlah soal tiap pertemuan
          }
        },
        enrollments: true,
      },
    });

    // format response
    const formatted = courses.map(course => ({
      id: course.id,
      uuid: course.uuid,
      title: course.title,
      description: course.description,
      price: course.price,
      isPublished: course.isPublished,
      createdAt: course.createdAt,
      mentor: course.mentor,
      vidio: course.vidio,
      image: course.image,
      meetingsCount: course.meetings.length, // jumlah pertemuan
      meetingsData: course.meetings.slice(0, 2).map(m => ({
        id: m.id,
        title: m.title,
        content: m.content,
        order: m.order,
        vidio: m.vidio,
        image: m.image,
        meetinguuid: m.meetinguuid,
        testsCount: m._count.tests, // jumlah soal di pertemuan
      })),
      enrollmentsCount: course.enrollments.length, // optional, jumlah siswa
    }));

    res.status(200).json({ success: true, data: formatted });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil courses" });
  }
};

export const getCourses = async (req, res) => {
 

  try {
    const courses = await prisma.course.findMany({
      include: {
        mentor: true,
        meetings: {
          include: {
            _count: { select: { tests: true } } // hitung jumlah soal tiap pertemuan
          }
        },
        enrollments: true,
      },
    });

    // format response
    const formatted = courses.map(course => ({
      id: course.id,
      uuid: course.uuid,
      title: course.title,
      description: course.description,
      price: course.price,
      isPublished: course.isPublished,
      createdAt: course.createdAt,
      mentor: course.mentor,
      vidio: course.vidio,
      image: course.image,
      meetingsCount: course.meetings.length, // jumlah pertemuan
      meetingsData: course.meetings.slice(0, 2).map(m => ({
        id: m.id,
        title: m.title,
        content: m.content,
        order: m.order,
        vidio: m.vidio,
        image: m.image,
        meetinguuid: m.meetinguuid,
        testsCount: m._count.tests, // jumlah soal di pertemuan
      })),
      enrollmentsCount: course.enrollments.length, // optional, jumlah siswa
    }));

    res.status(200).json({ success: true, data: formatted });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil courses" });
  }
};


// POST /courses
export const createCourse = async (req, res) => {
  try {
    const userId = req.user?.uuid;
    const userName = req.user?.name;
    const userEmail = req.user?.email;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Silahkan login terlebih dahulu!",
      });
    }

    const { title, description, price, isPublished, vidio } = req.body;
    const image = req.files && req.files["image"] ? `/uploads/${req.files["image"][0].filename}` : "/webinar.jpeg";

    // Cek apakah user sudah menjadi mentor
    let mentor = await prisma.mentor.findUnique({
      where: { email: userEmail },
    });

    // Kalau belum, buat mentor baru
    if (!mentor) {
      mentor = await prisma.mentor.create({
        data: {
          name: userName,
          email: userEmail,
          balance: 0,
        },
      });
    }

    // Buat course dengan mentorId
    const course = await prisma.course.create({
      data: {
        title,
        description,
        mentorId: mentor.id,
        mentorname: userName,
        mentoruuid: userId,
        price: parseInt(price),
        image: image,
        isPublished: true,
        vidio: vidio || null,
        uuid: uuidv4(),
      },
    });

    res.status(201).json({
      success: true,
      message: "Course berhasil dibuat",
      data: course,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Gagal membuat course" });
  }
};

// GET /courses/:id
export const getCourseById = async (req, res) => {
    const user = req.user.uuid
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Silahkan login terlebih dahulu!",
      });
    }
  try {
    const { uuid } = req.params;
    if (!uuid) return res.status(404).json({ message: "Course tidak ditemukan" });

    const course = await prisma.course.findUnique({
      where: { uuid: uuid },
      include: {
        mentor: true,
        meetings: {
          include: {
            tests: true,
          },
        },
        enrollments: true,
      },
    });

    if (!course) return res.status(404).json({ message: "Course tidak ditemukan" });

    res.status(200).json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil course" });
  }
};

// PUT /courses/:id
export const updateCourse = async (req, res) => {
  try {
    const { uuid } = req.params;
    const { title, description, price, isPublished, video } = req.body;
    if (!uuid) return res.status(404).json({ message: "Course tidak ditemukan" });
    const updated = await prisma.course.update({
      where: { uuid: uuid },
      data: {
        title,
        description,
        price,
        isPublished,
        vidio: video
      },
    });

    res.status(200).json({
      success: true,
      message: "Course berhasil diupdate",
      data: updated,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal update course" });
  }
};

// DELETE /courses/:id
export const deleteCourse = async (req, res) => {
    const user = req.user.uuid
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Silahkan login terlebih dahulu!",
      });
    }
  try {
    const { uuid } = req.params;
    if (!uuid) return res.status(404).json({ message: "Course tidak ditemukan" });

    const course = await prisma.course.findUnique({ where: { uuid: uuid } });
    if (!course) return res.status(404).json({ message: "Course tidak ditemukan" });

    await prisma.course.delete({
      where: { uuid: uuid },
    });

    res.status(200).json({ message: "Course berhasil dihapus" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal hapus course" });
  }
};

export const getDatasaldoadmin = async (req, res) => {
  const user = req.user.uuid
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Silahkan login terlebih dahulu!",
    });
  }
  try {
    const saldo = await prisma.admin.findMany({
      select: {
        balance: true
      }
    });
    res.status(200).json({
      success: true,
      data: saldo,});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil course" });
  }
}

export const getdatamentor = async (req, res) => {
  const user = req.user.uuid
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Silahkan login terlebih dahulu!",
    });
  }
  try {
    const mentor = await prisma.mentor.findMany({
      select: {
        name: true,
        email: true,
        balance: true
      }
    });
    res.status(200).json({
      success: true,
      data: mentor,});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil course" });
  }
}

export const getmysaldo = async (req, res) => {
  const userUuid = req.user?.uuid;

  if (!userUuid) {
    return res.status(401).json({
      success: false,
      message: "Silahkan login terlebih dahulu!",
    });
  }

  try {
    const userData = await prisma.user.findUnique({
      where: { uuid: userUuid },
    });

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    const saldo = await prisma.mentor.findFirst({
      where: { email: userData.email },
      select: { balance: true },
    });

    if (!saldo) {
      return res.status(404).json({
        success: false,
        message: "Saldo tidak ditemukan",
      });
    }

    return res.status(200).json({
      success: true,
      data: saldo,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil saldo",
    });
  }
};

export const getmyKelas = async (req, res) => {
  const userUuid = req.user?.uuid;

  if (!userUuid) {
    return res.status(401).json({
      success: false,
      message: "Silahkan login terlebih dahulu!",
    });
  }

  try {
    const userData = await prisma.user.findUnique({
      where: { uuid: userUuid },
    });

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    const courses = await prisma.course.findMany({
      where: {
        mentor: {
          email: userData.email,
        },
      },
      include: {
        mentor: true,
      },
    });

    if (courses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Kelas tidak ditemukan",
      });
    }

    return res.status(200).json({
      success: true,
      totalKelas: courses.length,
      data: courses,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil kelas",
    });
  }
};


export const listUseryangbeli = async (req, res) => {
  const userUuid = req.user?.uuid;

  if (!userUuid) {
    return res.status(401).json({
      success: false,
      message: "Silahkan login terlebih dahulu!",
    });
  }

  try {
    const userData = await prisma.user.findUnique({
      where: { uuid: userUuid },
    });

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    const mentor = await prisma.mentor.findFirst({
      where: { email: userData.email },
      select: {
        courses: {
          select: {
            id: true,
            uuid: true,
            title: true,
            enrollments: {
              select: {
                user: {
                  select: {
                    id: true,
                    uuid: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!mentor || mentor.courses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Kelas tidak ditemukan",
      });
    }

    // gabungkan data agar tiap user punya info course yang dia beli
    const data = mentor.courses.flatMap(course =>
      course.enrollments.map(e => ({
        courseId: course.id,
        courseUuid: course.uuid,
        courseTitle: course.title,
        userId: e.user.id,
        userUuid: e.user.uuid,
        userName: e.user.name,
        userEmail: e.user.email,
      }))
    );

    return res.status(200).json({
      success: true,
      totalKelas: mentor.courses.length,
      totalPembeli: data.length,
      data,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil data user yang membeli course",
    });
  }
};

export const totalseluruhsaldo = async (req, res) => {
  const userUuid = req.user?.uuid;

  if (!userUuid) {
    return res.status(401).json({
      success: false,
      message: "Silahkan login terlebih dahulu!",
    });
  }

  try {
    // Hitung total saldo semua admin
    const totalAdmin = await prisma.admin.aggregate({
      _sum: { balance: true },
    });

    // Hitung total saldo semua mentor
    const totalMentor = await prisma.mentor.aggregate({
      _sum: { balance: true },
    });

    const totalSeluruh =
      (totalAdmin._sum.balance || 0) + (totalMentor._sum.balance || 0);

    return res.status(200).json({
      success: true,
      totalUangAdmin: totalAdmin._sum.balance || 0,
      totalUangMentor: totalMentor._sum.balance || 0,
      totalSeluruh
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Gagal menghitung total saldo.",
      error: error.message,
    });
  }
};


export const getkelasuser = async (req, res) => {
  const userUuid = req.user?.uuid;

  if (!userUuid) {
    return res.status(401).json({
      success: false,
      message: "Silahkan login terlebih dahulu!",
    });
  }
  try {
    const userData = await prisma.user.findUnique({
      where: { uuid: userUuid },
    });
    const transaksi = await prisma.transaction.findMany({
      where: {
        useruuid: userData.uuid,
      },
      include: {
        course: true,
      },
    });
    res.status(200).json({
      success: true,
      data: transaksi,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil course" });
  }
}

export const searchkelasuser = async (req, res) => {
  const userUuid = req.user?.uuid;
  const search = (req.params.search || "").toLowerCase().trim();

  if (!userUuid) {
    return res.status(401).json({
      success: false,
      message: "Silahkan login terlebih dahulu!",
    });
  }
  if (!search) {
    return res.status(400).json({
      success: false,
      message: "Silahkan masukkan kata kunci pencarian!",
    });
  }

  try {
    const userData = await prisma.user.findUnique({
      where: { uuid: userUuid },
    });

    // ambil semua transaksi beserta course-nya
    const transaksi = await prisma.transaction.findMany({
      where: {
        useruuid: userData.uuid,
      },
      include: {
        course: true,
      },
    });

    // filter manual case-insensitive
    const filtered = transaksi.filter(
      (t) =>
        t.course?.title?.toLowerCase().includes(search)
    );

    res.status(200).json({
      success: true,
      data: filtered,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil course" });
  }
};

