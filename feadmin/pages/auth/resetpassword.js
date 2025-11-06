"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ENDPOINTS } from "../../endpoint";
import axios from "axios";
import Auth from "layouts/Auth.js";

export default function ResetpasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token"); // ambil recovery token dari URL
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [success, setSuccess] = useState(false);
  

  const handleSubmit = () => {
  if (password !== confirmPassword) {
    setMessage("Password dan konfirmasi password harus sama!");
    setSuccess(false);
    return;
  }

  setLoading(true);
  setMessage(null);

  try {
    const recovtoken = localStorage.getItem("recovery_token"); // NO await

    axios.post(ENDPOINTS.RESET_PASSWORD, {
      recovery_token: recovtoken,
      password,
    })
    .then((response) => {
      if (response.data?.success) {
        setSuccess(true);
        setMessage("Password berhasil diubah! Mengalihkan...");
        localStorage.removeItem("recovery_token"); // NO await
        setTimeout(() => router.push("/auth/login"), 2000);
      } else {
        setSuccess(false);
        setMessage(response.data?.message || "Gagal mengubah password");
      }
    })
    .catch((error) => {
      setSuccess(false);
      const errMsg =
        error.response?.data?.message ||
        "Terjadi kesalahan saat mengubah password";
      setMessage(errMsg);
    })
    .finally(() => {
      setLoading(false);
    });

  } catch (error) {
    setLoading(false);
    setSuccess(false);
    setMessage("Terjadi kesalahan saat memproses data");
  }
};


  return (
    <div className="container mx-auto px-4 h-full">
      <div className="flex content-center items-center justify-center h-full">
        <div className="w-full lg:w-4/12 px-4">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
            <div className="rounded-t mb-0 px-6 py-6">
              <div className="text-center mb-3">
                <h6 className="text-blueGray-500 text-sm font-bold">
                  Reset Password
                </h6>
              </div>
              <hr className="mt-6 border-b-1 border-blueGray-300" />
            </div>

            <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
              {message && (
                <div
                  className={`rounded-lg p-4 mb-5 text-sm font-semibold shadow-md ${
                    success ? "bg-yellow-500 text-white" : "bg-red-500 text-white"
                  }`}
                >
                  {message}
                </div>
              )}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
              >
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="password"
                  >
                    Password Baru
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    placeholder="Password Baru"
                    required
                  />
                </div>

                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="confirmPassword"
                  >
                    Konfirmasi Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    placeholder="Konfirmasi Password"
                    required
                  />
                </div>

                <div className="text-center mt-6">
                  <button
                    type="submit"
                    className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none w-full ease-linear transition-all duration-150"
                    disabled={loading}
                  >
                    {loading ? "Mengubah..." : "Ubah Password"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

ResetpasswordPage.layout = Auth;
