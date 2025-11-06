import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import { addDays } from "date-fns";

dotenv.config();
const prisma = new PrismaClient();

export const getMyProfile = async (req, res) => {
  const currentUserUuid = req.user?.uuid;

  if (!currentUserUuid) 
    return res.status(401).json({ success: false, message: "Login dulu!" });

  try {
    // Ambil data user
    const user = await prisma.user.findUnique({
      where: { uuid: currentUserUuid },
      select: {
        id: true,
        uuid: true,
        name: true,
        email: true,
        avatar: true,
        title: true,
        phone: true,

        // List orang yang follow user ini
        followers: {
          select: {
            followerId: true,
            follower: { select: { uuid: true, name: true, avatar: true } }
          }
        },

        // List orang yang diikuti user ini
        following: {
          select: {
            followingId: true,
            following: { select: { uuid: true, name: true, avatar: true } }
          }
        },

        // Total followers dan total following
        _count: {
          select: {
            followers: true,
            following: true,
          },
        },
      },
    });

    if (!user) return res.status(404).json({ success: false, message: "User tidak ditemukan" });

    const totalPost = await prisma.post.count({ where: { userId: user.id } });
    res.json({ 
      success: true, 
      user: {
        ...user,
        totalPost: totalPost,
        totalFollowers: user._count.followers,
        totalFollowing: user._count.following,
        followers: user.followers.map(f => f.follower), // tampilkan langsung detail follower
        following: user.following.map(f => f.following) // tampilkan langsung detail following
      } 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
}; //profile sendiri


export const getUserProfile = async (req, res) => {
  const { uuid } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { uuid },
      select: {
        id: true,
        uuid: true,
        name: true,
        email: true,
        avatar: true,
        title: true,
        phone: true,
        followers: {
          select: {
            followerId: true,
            follower: { select: { uuid: true, name: true, avatar: true } },
          },
        },
        following: {
          select: {
            followingId: true,
            following: { select: { uuid: true, name: true, avatar: true } },
          },
        },
        _count: {
          select: {
            followers: true,
            following: true,
          },
        },
      },
    });

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User tidak ditemukan" });

    const posts = await prisma.post.findMany({
      where: { userId: user.id },
      include: {
        user: { select: { name: true, avatar: true, title: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      success: true,
      user: {
        ...user,
        totalFollowers: user._count.followers,
        totalFollowing: user._count.following,
        followers: user.followers.map((f) => f.follower),
        following: user.following.map((f) => f.following),
        posts, // tambahkan daftar postingan milik user ini
      },
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Terjadi kesalahan server" });
  }
};


export const searchuser = async (req, res) => {
  const { keyword } = req.params;
  const userlog = req.user.uuid;

  if (!keyword)
    return res.status(400).json({ success: false, message: "Keyword tidak boleh kosong" });

  try {
    const users = await prisma.user.findMany({
      select: {
        uuid: true,
        name: true,
        email: true,
        avatar: true,
        title: true,
      },
      take: 100,
    });

    const lowerKeyword = keyword.toLowerCase();

    const filtered = users.filter(
      (u) =>
        u.uuid !== userlog && ( 
          u.name?.toLowerCase().includes(lowerKeyword) ||
          u.email?.toLowerCase().includes(lowerKeyword) ||
          u.title?.toLowerCase().includes(lowerKeyword)
        )
    );

    res.json({ success: true, users: filtered });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getMypost = async (req, res) => {
  const currentUserUuid = req.user?.uuid;

  if (!currentUserUuid) return res.status(401).json({ success: false, message: "Login dulu!" });
  const user = await prisma.user.findUnique({ where: { uuid: currentUserUuid } });

  if (!user) return res.status(404).json({ success: false, message: "User tidak ditemukan" });

  try {
    const posts = await prisma.post.findMany({
      where: { userId: user.id },
      include: {
        user: {
          select: { name: true, avatar: true, title: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({ success: true, data: posts });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
}

export const getAllMyCommunities = async (req, res) => {
  const currentUserUuid = req.user?.uuid;

  if (!currentUserUuid)
    return res.status(401).json({ success: false, message: "Login dulu!" });

  try {
    // 1️⃣ Komunitas yang user buat
    const ownCommunities = await prisma.webinar.findMany({
      where: {
        userUuid: currentUserUuid,
        isCommunity: 1,
      },
      include: {
        _count: { select: { joinedBy: true } },
      },
    });

    // 2️⃣ Komunitas yang user gabung
     const joinedCommunities = await prisma.joinwebinar.findMany({
  where: {
    userUuid: currentUserUuid,
    webinar: {
      isCommunity: 1,
    },
  },
  include: {
    webinar: {
      include: {
        _count: { select: { joinedBy: true } },
      },
    },
  },
});


    // 3️⃣ Format hasil agar konsisten
    const formattedOwn = ownCommunities.map((c) => ({
      uuid: c.uuid,
      title: c.title,
      desc: c.desc,
      speaker: c.speaker,
      thumb: c.thumb,
      createdAt: c.createdAt,
      totalJoined: c._count.joinedBy,
      owner: true, // penanda dia pemilik
    }));

    const formattedJoined = joinedCommunities
      .filter((j) => j.webinar) // hindari data null
      .map((j) => ({
        uuid: j.webinar.uuid,
        title: j.webinar.title,
        desc: j.webinar.desc,
        speaker: j.webinar.speaker,
        thumb: j.webinar.thumb,
        createdAt: j.webinar.createdAt,
        totalJoined: j.webinar._count.joinedBy,
        owner: false, // dia cuma anggota
      }));

    // 4️⃣ Gabungkan & urutkan
    const allCommunities = [...formattedOwn, ...formattedJoined].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    // 5️⃣ Ambil info user login
    const userdata = await prisma.user.findUnique({
      where: { uuid: currentUserUuid },
      select: { name: true, avatar: true, title: true },
    });

    return res.status(200).json({
      success: true,
      data: allCommunities,
      userdata,
    });
  } catch (error) {
    console.error("Error getAllMyCommunities:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
    });
  }
};


export const getCommunitybyparams = async (req, res) => {
  const { uuid } = req.params;
  if (!uuid)
    return res.status(400).json({ success: false, message: "uuid tidak boleh kosong" });
  const userdata = await prisma.user.findUnique({
    where: { uuid },
    select: { name: true, avatar: true, title: true },
  });

  const communities = await prisma.webinar.findMany({
    where: {
      userUuid: uuid,
      isCommunity: 1,
    },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { joinedBy: true },
      },
    },
  });

  const formatted = communities.map((c) => ({
    ...c,
    totalJoined: c._count.joinedBy,
  }));

  return res.status(200).json({
    success: true,
    data: formatted,
    userdata,
  })
}


export const followUser = async (req, res) => {
  const { uuid } = req.params;
  const currentUserUuid = req.user?.uuid;

  if (!currentUserUuid) return res.status(401).json({ success: false, message: "Login dulu!" });

  try {
    const currentUser = await prisma.user.findUnique({ where: { uuid: currentUserUuid } });
    const targetUser = await prisma.user.findUnique({ where: { uuid } });

    if (!targetUser) return res.status(404).json({ success: false, message: "User target tidak ditemukan" });
    if (currentUser.id === targetUser.id) return res.status(400).json({ success: false, message: "Tidak bisa follow diri sendiri" });

    const existingFollow = await prisma.follower.findUnique({
      where: {
        followerId_followingId: { followerId: currentUser.id, followingId: targetUser.id }
      }
    });

    // 🔁 Toggle logic
    if (existingFollow) {
      await prisma.follower.delete({
        where: { followerId_followingId: { followerId: currentUser.id, followingId: targetUser.id } }
      });
      return res.json({ success: true, message: `Berhenti mengikuti ${targetUser.name}`, unfollowed: true });
    } else {
      await prisma.follower.create({
        data: { followerId: currentUser.id, followingId: targetUser.id }
      });
      return res.json({ success: true, message: `Berhasil mengikuti ${targetUser.name}`, followed: true });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};



export const unfollowUser = async (req, res) => {
  const { uuid } = req.params;
  const currentUserUuid = req.user?.uuid;

  if (!currentUserUuid) return res.status(401).json({ success: false, message: "Login dulu!" });

  try {
    const currentUser = await prisma.user.findUnique({ where: { uuid: currentUserUuid } });
    const targetUser = await prisma.user.findUnique({ where: { uuid } });

    if (!targetUser) return res.status(404).json({ success: false, message: "User target tidak ditemukan" });

    // Hapus follow
    await prisma.follower.delete({
      where: {
        followerId_followingId: { followerId: currentUser.id, followingId: targetUser.id }
      }
    });

    res.json({ success: true, message: `Berhasil unfollow ${targetUser.name}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const blockUser = async (req, res) => {
  const { uuid } = req.params;
  const currentUserUuid = req.user?.uuid;

  if (!currentUserUuid) return res.status(401).json({ success: false, message: "Login dulu!" });

  try {
    const currentUser = await prisma.user.findUnique({ where: { uuid: currentUserUuid } });
    const targetUser = await prisma.user.findUnique({ where: { uuid } });

    if (!targetUser) return res.status(404).json({ success: false, message: "User target tidak ditemukan" });
    if (currentUser.id === targetUser.id) return res.status(400).json({ success: false, message: "Tidak bisa blokir diri sendiri" });

    // Cek sudah diblokir belum
    const existingBlock = await prisma.block.findUnique({
      where: {
        blockerId_blockedId: { blockerId: currentUser.id, blockedId: targetUser.id }
      }
    });

    if (existingBlock) return res.status(400).json({ success: false, message: "User sudah diblokir" });

    await prisma.block.create({
      data: { blockerId: currentUser.id, blockedId: targetUser.id }
    });

    res.json({ success: true, message: `Berhasil blokir ${targetUser.name}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const unblockUser = async (req, res) => {
  const { uuid } = req.params;
  const currentUserUuid = req.user?.uuid;

  if (!currentUserUuid) return res.status(401).json({ success: false, message: "Login dulu!" });

  try {
    const currentUser = await prisma.user.findUnique({ where: { uuid: currentUserUuid } });
    const targetUser = await prisma.user.findUnique({ where: { uuid } });

    if (!targetUser) return res.status(404).json({ success: false, message: "User target tidak ditemukan" });

    await prisma.block.delete({
      where: {
        blockerId_blockedId: { blockerId: currentUser.id, blockedId: targetUser.id }
      }
    });

    res.json({ success: true, message: `Berhasil unblock ${targetUser.name}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ========================
// Buat atau ambil chat room 1-on-1
// ========================


export const getOrCreatePrivateChat = async (req, res) => {
  const { targetUuid } = req.body;
  const currentUserUuid = req.user?.uuid;

  console.log("🔥 Request targetUuid:", targetUuid);
  console.log("🔥 Current user UUID:", currentUserUuid);

  if (!currentUserUuid)
    return res.status(401).json({ success: false, message: "Login dulu!" });

  try {
    const currentUser = await prisma.user.findUnique({ where: { uuid: currentUserUuid } });
    const targetUser = await prisma.user.findUnique({ where: { uuid: targetUuid } });

    console.log("🔹 Current user:", currentUser);
    console.log("🔹 Target user:", targetUser);

    if (!targetUser)
      return res.status(404).json({ success: false, message: "User target tidak ditemukan" });

    if (currentUser.id === targetUser.id)
      return res.status(400).json({ success: false, message: "Tidak bisa chat dengan diri sendiri" });

    // Cari chat 1-on-1 yang sudah ada antara currentUser dan targetUser
    console.log("🔍 Mencari chat room 1-on-1 yang sudah ada...");
    let chatRoom = await prisma.chatRoom.findFirst({
      where: {
        isGroup: false,
        participants: {
          some: { userId: currentUser.id },
        },
        AND: {
          participants: {
            some: { userId: targetUser.id },
          },
        },
      },
      include: { participants: true, messages: true },
    });

    console.log("🔹 Chat room ditemukan:", chatRoom);

    // Kalau belum ada, buat baru
    if (!chatRoom) {
      console.log("➕ Chat room belum ada, membuat baru...");
      chatRoom = await prisma.chatRoom.create({
        data: {
          isGroup: false,
          participants: {
            create: [
              { userId: currentUser.id },
              { userId: targetUser.id },
            ],
          },
        },
        include: { participants: true, messages: true },
      });
      console.log("✅ Chat room baru dibuat:", chatRoom);
    } else {
      console.log("✅ Menggunakan chat room yang sudah ada");
    }

    res.json({ success: true, chatRoom });
  } catch (error) {
    console.error("❌ Error di getOrCreatePrivateChat:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ========================
// Kirim pesan
// ========================
export const sendMessage = async (req, res) => {
  const { chatRoomId, content } = req.body;
  const currentUserUuid = req.user?.uuid;

  if (!currentUserUuid) return res.status(401).json({ success: false, message: "Login dulu!" });

  try {
    const currentUser = await prisma.user.findUnique({ where: { uuid: currentUserUuid } });

    const message = await prisma.PrivateMessage.create({
      data: {
        chatRoomId,
        senderId: currentUser.id,
        content,
      },
      include: { sender: true }
    });

    res.json({ success: true, message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ========================
// Ambil semua pesan chat room
// ========================
export const getMessages = async (req, res) => {
  const { chatRoomId } = req.params;
  const currentUserUuid = req.user?.uuid;

  if (!currentUserUuid)
    return res.status(401).json({ success: false, message: "Login dulu!" });

  try {
    const roomId = parseInt(chatRoomId, 10);
    if (isNaN(roomId)) {
      return res.status(400).json({ success: false, message: "chatRoomId tidak valid" });
    }

    const messages = await prisma.PrivateMessage.findMany({
      where: { chatRoomId: roomId },
      orderBy: { createdAt: "asc" },
      include: {
        sender: { select: { uuid: true, name: true, avatar: true } },
      },
    });

    res.json({ success: true, messages });
  } catch (error) {
    console.log("❌ Gagal ambil pesan:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// ========================
// Ambil semua chat rooms user
// ========================
export const getUserChatRooms = async (req, res) => {
  const currentUserUuid = req.user?.uuid;

  if (!currentUserUuid) return res.status(401).json({ success: false, message: "Login dulu!" });

  try {
    const currentUser = await prisma.user.findUnique({ where: { uuid: currentUserUuid } });

    const chatRooms = await prisma.chatParticipant.findMany({
      where: { userId: currentUser.id },
      include: {
        chatRoom: {
          include: {
            participants: { include: { user: { select: { uuid: true, name: true, avatar: true } } } },
            messages: { take: 1, orderBy: { createdAt: 'desc' } } // ambil pesan terakhir
          }
        }
      }
    });

    res.json({ success: true, chatRooms });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
