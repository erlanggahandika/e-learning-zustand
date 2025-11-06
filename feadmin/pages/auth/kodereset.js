"use client";
import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ENDPOINTS } from "../../endpoint";
import Auth from "layouts/Auth.js";
import { useSearchParams } from "next/navigation";

export default function KoderesetPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get("email") || "";
  const [email, setEmail] = useState(emailFromQuery);
   // Masukkan email dulu atau dari query
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [success, setSuccess] = useState(false);
  const inputsRef = useRef([]);

  const handleVerify = async (e) => {
    if (e) e.preventDefault();
    if (otp.length !== 6) {
      setMessage("Masukkan 6 digit kode verifikasi.");
      setSuccess(false);
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      const res = await axios.post(ENDPOINTS.VALIDATE_RECOVERY_PASSWORD, { email, otp_code: otp });

       if (res.data?.success) {
  setSuccess(true);
  setMessage("Verifikasi berhasil! Mengalihkan ke halaman reset password...");

  const { recovery_token } = res.data.data; 
  await localStorage.setItem("recovery_token", recovery_token); // ambil token dari response

  setTimeout(() => {
    router.push({
      pathname: "/auth/resetpassword",
      query: { token: "Change-Password" }, // bawa token lewat query
    });
  }, 2000);

      } else {
        setSuccess(false);
        setMessage(res.data?.msg || "Kode OTP salah atau sudah kadaluarsa.");
      }
    } catch (err) {
      setSuccess(false);
      setMessage(err?.response?.data?.msg || "Kode OTP salah atau sudah kadaluarsa.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e, idx) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    const chars = otp.split("");
    chars[idx] = val ? val.slice(-1) : "";
    setOtp(chars.join(""));
    if (val && inputsRef.current[idx + 1]) inputsRef.current[idx + 1].focus();
    if (chars.join("").length === 6) handleVerify();
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !e.target.value && inputsRef.current[idx - 1]) {
      inputsRef.current[idx - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = (e.clipboardData || window.clipboardData).getData("text");
    const digits = paste.replace(/\D/g, "").slice(0, 6).split("");
    digits.forEach((d, i) => {
      if (inputsRef.current[i]) inputsRef.current[i].value = d;
    });
    setOtp(digits.join(""));
    if (digits.join("").length === 6) handleVerify();
  };

  return (
    <div className="relative flex justify-center items-start min-h-screen pt-24 px-4 z-10">
      <div className="bg-white border border-gray-200 pt-6 pb-4 px-6 rounded-2xl shadow-xl w-full max-w-md h-auto">
        <div className="flex flex-col items-center mb-4">
          {/* logo */}
          <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-teal-400 rounded-full flex items-center justify-center mb-2">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7v7c0 5 4 9 10 9s10-4 10-9V7l-10-5z" fill="white" opacity="0.15"/>
              <path d="M7 10c1.657 0 3-1.343 3-3S8.657 4 7 4 4 5.343 4 7s1.343 3 3 3z" fill="white"/>
              <path d="M17 10c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z" fill="white"/>
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">Verifikasi Akun</h2>
          <p className="text-sm text-gray-600 mt-1 text-center">
            Masukkan kode verifikasi 6 digit yang dikirim ke <br />
            <span className="font-semibold text-green-700">{email}</span>
          </p>
        </div>

        {message && (
          <div className={`rounded-lg p-3 mb-4 text-sm font-medium shadow-md ${success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"} border`}>
            {message}
          </div>
        )}

        <form onSubmit={handleVerify} onPaste={handlePaste}>
          <div className="flex items-center justify-center gap-2.5 mb-4">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <input
                key={i}
                type="text"
                inputMode="numeric"
                maxLength={1}
                ref={(el) => (inputsRef.current[i] = el)}
                onChange={(e) => handleInputChange(e, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                className="w-12 h-12 text-center text-lg font-semibold border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                aria-label={`digit-${i + 1}`}
              />
            ))}
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-md text-white font-medium transition duration-150 ${loading ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
          >
            {loading ? "Memverifikasi..." : "Verifikasi"}
          </button>
        </form>

        <p className="text-xs text-center text-gray-500 mt-3">
          Tidak menerima kode?{" "}
          <button
            onClick={() => alert("Fitur kirim ulang belum diaktifkan.")}
            className="text-green-700 font-medium hover:underline"
          >
            Kirim ulang
          </button>
        </p>
      </div>
    </div>
  );
}

KoderesetPage.layout = Auth;
