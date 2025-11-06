"use client";
import { useRouter } from "next/router";
import { useState, useRef } from "react";
import axios from "axios";
import { ENDPOINTS } from "../../endpoint";
import Auth from "layouts/Auth.js";

function OTPPage() {
  const router = useRouter();
  const { email } = router.query;
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [success, setSuccess] = useState(false);
  const inputsRef = useRef([]);

const handleVerify = async (e) => {
  if (e) e.preventDefault();
  const code = otp;
  if (code.length !== 6) {
    setMessage("Masukkan 6 digit kode verifikasi.");
    setSuccess(false);
    return;
  }
  setLoading(true);
  setMessage(null);

  try {
    const res = await axios.post(ENDPOINTS.VERIFY_OTP, {
      email,
      otp_code: code,
    });

    if (res.data?.success === true) {
      setSuccess(true);
      setMessage("Verifikasi berhasil! Mengalihkan ke halaman login...");
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } else {
      setSuccess(false);
      setMessage(res.data?.msg || "Kode OTP salah atau sudah kadaluarsa.");
    }
  } catch (err) {
    console.error(err);
    setSuccess(false);
    setMessage(err?.response?.data?.msg || "Kode OTP salah atau sudah kadaluarsa.");
  } finally {
    setLoading(false);
  }
};

// helper to set otp by index
const setOtpAt = (index, value) => {
  const v = value.replace(/[^0-9]/g, "");
  const chars = otp.split("");
  chars[index] = v ? v.slice(-1) : "";
  const next = chars.join("");
  setOtp(next);
};

const handleInputChange = (e, idx) => {
  const val = e.target.value.replace(/[^0-9]/g, "");
  if (!val && e.nativeEvent.inputType === "deleteContentBackward") {
    // deletion handled below
  }
  setOtpAt(idx, val);
  if (val) {
    // move focus to next
    const next = inputsRef.current[idx + 1];
    if (next) next.focus();
  }
  // if all filled, trigger verify
  const newOtp = (() => {
    const arr = inputsRef.current.map((el) => (el ? el.value : ""));
    return arr.join("");
  })();
  if (newOtp.length === 6) {
    setOtp(newOtp);
    handleVerify();
  }
};

const handleKeyDown = (e, idx) => {
  if (e.key === "Backspace" && !e.target.value) {
    const prev = inputsRef.current[idx - 1];
    if (prev) {
      prev.focus();
    }
  }
};

const handlePaste = (e) => {
  e.preventDefault();
  const paste = (e.clipboardData || window.clipboardData).getData("text");
  const digits = paste.replace(/\D/g, "").slice(0, 6).split("");
  digits.forEach((d, i) => {
    const input = inputsRef.current[i];
    if (input) input.value = d;
  });
  const joined = digits.join("");
  setOtp(joined);
  if (joined.length === 6) handleVerify();
};


  return (
  <div className="relative flex justify-center items-start min-h-screen pt-16 px-4 z-10">
  <div className="bg-white border border-gray-200 pt-4 pb-6 px-6 rounded-2xl shadow-xl w-full max-w-md h-auto">
    <div className="flex flex-col items-center mb-3">
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
        Masukkan kode verifikasi 6 digit yang dikirim ke
        <br />
        <span className="font-semibold text-green-700">{email}</span>
      </p>
    </div>

    {message && (
      <div className="rounded-lg p-3 mb-3 text-sm font-medium shadow-md bg-blue-100 text-blue-800 border border-blue-300">
        {message}
      </div>
    )}

    <form onSubmit={handleVerify} onPaste={handlePaste}>
      <div className="flex items-center justify-center gap-2.5 mb-3">
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
        className={`w-full py-3 rounded-md text-white font-medium transition duration-150 ${
          loading ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
        }`}
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

OTPPage.layout = Auth;
export default OTPPage;