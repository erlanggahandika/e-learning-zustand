"use client"
import React, { useState, useEffect } from "react";
import api from "../../interceptor";
import { ENDPOINTS } from "../../endpoint";
import CardProfile from "./CardProfile";

export default function CardUbahPassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage({ type: "error", text: "Semua field harus diisi." });
      return;
    }
    if (newPassword.length < 6) {
      setMessage({ type: "error", text: "Password baru minimal 6 karakter." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Konfirmasi password tidak cocok." });
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("accesToken");
      const payload = {
        old_password: currentPassword,
        password: newPassword,
        };

      const res = await api.patch(ENDPOINTS.CHANGE_PASSWORD, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data && (res.data.data || res.data);
      setMessage({ type: "success", text: data?.message || "Password berhasil diubah." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      const errMsg = err?.response?.data?.message || "Gagal mengubah password.";
      setMessage({ type: "error", text: errMsg });
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (pw) => {
    let score = 0;
    if (!pw) return { score: 0, label: 'Too short', color: 'bg-red-300' };
    if (pw.length >= 6) score += 1;
    if (/[A-Z]/.test(pw)) score += 1;
    if (/[0-9]/.test(pw)) score += 1;
    if (/[^A-Za-z0-9]/.test(pw)) score += 1;
    if (score <= 1) return { score, label: 'Weak', color: 'bg-red-300' };
    if (score === 2) return { score, label: 'Fair', color: 'bg-yellow-300' };
    if (score === 3) return { score, label: 'Good', color: 'bg-emerald-300' };
    return { score, label: 'Strong', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(newPassword);

  useEffect(() => {
    if (message && message.type === 'success') {
      const t = setTimeout(() => setMessage(null), 4000);
      return () => clearTimeout(t);
    }
  }, [message]);

  return (
    <div className="w-full max-w-5xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="p-8 bg-white rounded-xl shadow-xl border border-gray-200 flex flex-col justify-center items-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-3">Ubah Password</h3>
        <p className="text-sm text-gray-500 mb-6">Pastikan password baru kuat dan jangan bagikan ke siapapun.</p>

        <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md mx-auto">
          {/* Current Password */}
          <div className="relative mt-12">
            <input
              type={showCurrent ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Password Saat Ini"
              className="w-full px-4 py-3 border border-gray-300 rounded-full text-sm placeholder-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition"
            />
            <button
              type="button"
              onClick={() => setShowCurrent((s) => !s)}
              className="absolute right-4 top-3 text-gray-500"
            >
              {showCurrent ? '🙈' : '👁️'}
            </button>
          </div>

          {/* New Password */}
          <div className="relative mt-8">
            <input
              type={showNew ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Password Baru"
              className="w-full px-4 py-3 border border-gray-300 rounded-full text-sm placeholder-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition"
            />
            <button
              type="button"
              onClick={() => setShowNew((s) => !s)}
              className="absolute right-4 top-3 text-gray-500"
            >
              {showNew ? '🙈' : '👁️'}
            </button>
          </div>

          {/* Password Strength */}
          <div className="mt-8 h-2 w-full rounded-full overflow-hidden bg-gray-200">
            <div className={`${strength.color} h-full`} style={{ width: `${(strength.score/4)*100}%` }}></div>
          </div>
          <p className="text-xs text-gray-500">{strength.label}</p>

          {/* Confirm Password */}
          <div className="relative mt-8">
            <input
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Konfirmasi Password"
              className="w-full px-4 py-3 border border-gray-300 rounded-full text-sm placeholder-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition"
            />
            <button
              type="button"
              onClick={() => setShowConfirm((s) => !s)}
              className="absolute right-4 top-3 text-gray-500"
            >
              {showConfirm ? '🙈' : '👁️'}
            </button>
          </div>

          {/* Message */}
          {message && (
            <p className={`text-sm ${message.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
              {message.text}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-8 bg-black text-white py-3 rounded-full text-sm font-medium hover:bg-gray-900 transition"
            disabled={loading}
          >
            {loading ? 'Menyimpan...' : 'Ubah Password'}
          </button>
        </form>
      </div>

      <aside>
        <CardProfile />
      </aside>
    </div>
  );
}
