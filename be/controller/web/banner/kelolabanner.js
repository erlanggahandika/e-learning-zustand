import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
const prisma = new PrismaClient();

dotenv.config();

// GET ALL BANNERS (ADMIN)
export const getBanneradmin = async (req, res) => {
    const userUuid = req.user?.uuid;
    if (!userUuid) {
        return res.status(401).json({ success: false, message: "Silahkan login terlebih dahulu!" });
    }

    try {
        const banners = await prisma.banner.findMany({
            include: { category: true },
            orderBy: { sortOrder: 'desc' },
        });

        res.status(200).json({ success: true, data: banners });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Gagal mengambil banner" });
    }
};

// CREATE BANNER
export const createBanneradmin = async (req, res) => {
    const userUuid = req.user?.uuid;
    if (!userUuid)
        return res.status(401).json({ success: false, message: "Silahkan login terlebih dahulu!" });

    const { title,  sortOrder , categoryName } = req.body;
    const image = req.files && req.files["image"] ? `/uploads/${req.files["image"][0].filename}` : "/webinar.jpeg";


    try {
        // Determine category: use provided categoryName or default to Home
        let finalCategory;
        if (categoryName) {
            finalCategory = await prisma.bannerCategory.findFirst({ where: { name: categoryName } });
            if (!finalCategory) {
                finalCategory = await prisma.bannerCategory.create({ data: { name: categoryName } });
            }
        } else {
            finalCategory = await prisma.bannerCategory.findFirst({ where: { name: "Home" } });
            if (!finalCategory) {
                finalCategory = await prisma.bannerCategory.create({ data: { name: "Home" } });
            }
        }

        // Create banner with resolved category
        const banner = await prisma.banner.create({
            data: {
                title,
                image,
                sortOrder: parseInt(sortOrder) || 0,
                categoryId: finalCategory.id,
            },
            include: { category: true },
        });

        res.status(201).json({ success: true, data: banner });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Gagal membuat banner" });
    }
};


// GET BANNER BY UUID
export const getBannerByUuid = async (req, res) => {
     const userUuid = req.user?.uuid;
    if (!userUuid) {
        return res.status(401).json({ success: false, message: "Silahkan login terlebih dahulu!" });
    }

    const { uuid } = req.params;
    

    try {
        const banner = await prisma.banner.findUnique({
            where: { uuid },
            include: { category: true },
        });

        if (!banner) return res.status(404).json({ success: false, message: "Banner tidak ditemukan" });

        res.status(200).json({ success: true, data: banner });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Gagal mengambil banner" });
    }
};

// UPDATE BANNER BY UUID
export const updateBanneradmin = async (req, res) => {
    const userUuid = req.user?.uuid;
    if (!userUuid) {
        return res.status(401).json({ success: false, message: "Silahkan login terlebih dahulu!" });
    }

    const { uuid } = req.params;
    // accept image either as uploaded file or as image path in body
    const { title, image: imageBody, sortOrder, categoryId, categoryName, isActive } = req.body;
    const uploadedImage = req.files && req.files["image"] ? `/uploads/${req.files["image"][0].filename}` : undefined;

    try {
        // Pastikan banner ada
        const existingBanner = await prisma.banner.findFirst({ where: { uuid } });
        if (!existingBanner) {
            return res.status(404).json({ success: false, message: "Banner tidak ditemukan" });
        }


        // Update banner
        const finalImage = uploadedImage !== undefined ? uploadedImage : (imageBody !== undefined ? imageBody : existingBanner.image);
        const finalSort = sortOrder !== undefined ? parseInt(sortOrder) : existingBanner.sortOrder;
        const finalIsActive = isActive !== undefined ? (isActive === 'true' || isActive === true) : existingBanner.isActive;

        const banner = await prisma.banner.update({
            where: { uuid },
            data: {
                isActive: finalIsActive,
                title: title !== undefined ? title : existingBanner.title,
                image: finalImage,
                sortOrder: finalSort,
                
                category: categoryName ? { update: { name: categoryName } } : undefined,
            },
        });

        res.status(200).json({ success: true, data: banner });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Gagal memperbarui banner" });
    }
};


// DELETE BANNER BY UUID
export const deleteBanneradmin = async (req, res) => {
     const userUuid = req.user?.uuid;
    if (!userUuid) {
        return res.status(401).json({ success: false, message: "Silahkan login terlebih dahulu!" });
    }

    const { uuid } = req.params;
    if (!uuid) {
        return res.status(400).json({ success: false, message: "UUID banner tidak ditemukan" });
    }

    try {
        await prisma.banner.delete({ where: { uuid } });
        res.status(200).json({ success: true, message: "Banner berhasil dihapus" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Gagal menghapus banner" });
    }
};
