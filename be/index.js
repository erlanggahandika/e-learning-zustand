import express from "express";
import swaggerDocs from "./swagger.js"; 
import './tracing.js';
import { Server as SocketIo } from "socket.io";
import cors from "cors";
import routerauth from "./router/mobile/auth/authRouter.js";
import notifrouter from "./router/mobile/notification/notifRouter.js";
import kategoriRouter from "./router/mobile/kategori/kategoriRouter.js";
import routerbanner from "./router/mobile/banner/routerBanner.js";
import userRouter from "./router/mobile/user/user.js";
import adminRouter from "./router/web/auth/adminRouter.js";
import routeradmin from "./router/web/routeradmin/routeradmin.js";
import routercourse from "./router/mobile/course/routercourse.js";
import { sendRollbackEmail, sendEmailAlert } from "./mailer.js";
import { fileURLToPath } from "url";
import { ApolloServer } from "apollo-server-express";
import { typeDefs } from "./src/schema.js";
import { resolvers } from "./src/resolvers.js";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
// @ts-ignore
import xss from "xss-clean";
import slowDown from "express-slow-down";
import path from "path";


import dotenv from "dotenv";
import cookieParser from "cookie-parser";



dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
swaggerDocs(app);

// const corsOptions = {
//   origin: "*", // atau frontend domain
//   methods: ["GET","POST","PUT", "PATCH","DELETE","OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization", "ngrok-skip-browser-warning"],
// };
// app.set("trust proxy", 1);

// app.use(cors(corsOptions)); 
app.use(cors({
  origin: "*", // frontend URL
  credentials: true // agar cookie bisa dikirim
}));

// middleware 
app.use(helmet({ 
  crossOriginResourcePolicy: false, 
  crossOriginEmbedderPolicy: false 
}));
app.use(morgan("dev"));
app.use(compression());
app.use(xss());
app.use(cookieParser());
app.use(express.json());


const speedLimiter = slowDown({
  windowMs: 1 * 60 * 1000, // 1 menit
  delayAfter: 10,          // setelah 10 request mulai dilambatkan
  delayMs: () => 500,      // delay 500ms per request tambahan
});
app.use(speedLimiter);

async function ensureAdmin() {
  try {
    await prisma.admin.upsert({
      where: { id: 1 },
      update: {}, // jika sudah ada, tidak berubah
      create: { name: "Admin", balance: 0 }, // jika belum ada, buat
    });
    console.log("✅ Admin siap / sudah ada");
  } catch (err) {
    console.error("❌ Gagal memastikan admin:", err);
  }
}

// Panggil saat aplikasi start
ensureAdmin();

async function ensureDefaultCategory() {
  try {
    const existing = await prisma.bannerCategory.findFirst({
      where: { name: "Home" }, // cari kategori "Home"
    });

    if (!existing) {
      await prisma.bannerCategory.create({
        data: { name: "Home" }, // buat kategori kalau belum ada
      });
      console.log("✅ Kategori default 'Home' dibuat");
    } else {
      console.log("✅ Kategori default 'Home' sudah ada");
    }
  } catch (err) {
    console.error("❌ Gagal memastikan kategori default:", err);
  }
}

// Panggil saat aplikasi start
ensureDefaultCategory();


// Router in here
app.use("/v1", routerauth);
app.use("/v1", notifrouter);
app.use("/v1", kategoriRouter);
app.use("/v1", userRouter);
app.use("/v1", routercourse);
app.use("/v1", routerbanner);
app.use("/v1/admin", adminRouter);
app.use("/v1/admin", routeradmin);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get("/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`; // cek koneksi DB
    res.status(200).json({ status: "ok", service: "backend", db: "connected" });
  } catch (err) {
    res.status(500).json({ status: "error", service: "backend", db: "disconnected" });
  }
});//ini
app.get('/', (req, res) => {
  res.send('Backend is running! ');
});




app.listen(3001, () => {
  console.log(" Backend running on http://localhost:3001");
});
