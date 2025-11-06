import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { io } from "../../../index.js";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

dotenv.config();

export const getProfile = async (req, res) => {
  try {
    const token = req.cookies.jwt;
    if (!token) return res.status(401).json({ error: "Not authenticated" });

    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN);

    const user = await prisma.user.findUnique({
    where: { uuid: decoded.uuid },
    select: { uuid: true, email: true, createdAt: true }
    });

    
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ success: true, user });
  } catch (error) {
    console.error("Error getProfile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const logout = (req, res) => {
  res.clearCookie("jwt");
  res.json({ success: true, message: "Logged out" });
};

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID_GGL,
    clientSecret: process.env.CLIENT_SECRET_GGL,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      
      let user = await prisma.user.findUnique({
        where: { email: profile.emails[0].value }
      });

    
      if (!user) {
        user = await prisma.user.create({
          data: {
            email: profile.emails[0].value,
            password: "",  
          }
        }); 
      }

      // Buat JWT token
      const token = jwt.sign(
        { uuid: user.uuid, email: user.email },
        process.env.REFRESH_TOKEN,
        { expiresIn: "7d" }
      );

      return done(null, { user, token });
    } catch (err) {
      return done(err, null);
    }
  }
));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));
