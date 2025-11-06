"use client";
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import api from "../../interceptor";
import { ENDPOINTS } from "../../endpoint";
import { useAsset } from "utils/util";

export default function CardCreateBanner({ color, onClose, onSuccess }) {
  const [title, setTitle] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [categoryName, setCategoryName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    return () => {
      // cleanup preview URL on unmount
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleImageChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    // revoke previous
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const resetForm = () => {
    setTitle("");
    setSortOrder(0);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setImageFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    if (!title) return setMessage({ type: "error", text: "Title wajib diisi" });
    setLoading(true);
    try {
  const form = new FormData();
  form.append("title", title);
  form.append("sortOrder", sortOrder);
  if (categoryName) form.append("categoryName", categoryName);
  if (imageFile) form.append("image", imageFile);

      const token = typeof window !== "undefined" ? localStorage.getItem("accesToken") : null;

      const url = `${ENDPOINTS.CREATE_BANNER}`;

      const headers = {
        Authorization: token ? `Bearer ${token}` : undefined,
        // Let axios set multipart boundary
        "Content-Type": "multipart/form-data",
      };

      const response = await api.post(url, form, { headers });
      if (response && response.data && response.data.success) {
        setMessage({ type: "success", text: "Banner berhasil dibuat" });
        resetForm();
         if (onSuccess) onSuccess(response.data.data || null);
      } else {
        const t = (response && response.data && response.data.message) || "Gagal membuat banner";
        setMessage({ type: "error", text: t });
      }
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || err.message || "Gagal membuat banner";
      setMessage({ type: "error", text: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded ${
      color === "light" ? "bg-white" : "bg-blueGray-700 text-white"
    }`}>
     <div className="rounded-t mb-0 px-4 py-3 border-0 flex justify-between items-center">
  <div>
    <h3 className={`font-semibold text-lg ${color === "light" ? "text-blueGray-700" : "text-white"}`}>
      Upload Banner Baru
    </h3>
    <p className="text-sm text-gray-500">Buat banner baru untuk ditampilkan pada halaman utama.</p>
  </div>

  <button
  type="button"
  onClick={onClose}
  className="p-2 rounded hover:bg-gray-200 transition flex items-center justify-center"
  aria-label="Close"
>
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
</button>

</div>

    

      <div className="block w-full overflow-x-auto p-4">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Judul banner"
              className="mt-1 block w-full border rounded px-3 py-2"
            />

            <label className="text-sm font-medium text-gray-700 mt-3">Sort Order</label>
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value || 0))}
              className="mt-1 block w-40 border rounded px-3 py-2"
            />

            <label className="text-sm font-medium text-gray-700 mt-3">Category Name</label>
            <input
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Nama kategori (mis. Home)"
              className="mt-1 block w-56 border rounded px-3 py-2"
            />

           <div className="mt-6 flex flex-wrap items-center gap-5">
  {/* Pilih Gambar */}
  <label className="cursor-pointer flex items-center px-6 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
    <input onChange={handleImageChange} accept="image/*" type="file" className="hidden" />
    <span className="text-base text-gray-700 font-medium">Pilih Gambar</span>
  </label>

  {/* Reset */}
  <button
    type="button"
    onClick={resetForm}
    className="px-6 py-3 border rounded-lg text-base text-gray-700 font-medium hover:bg-gray-50 transition"
  >
    Reset
  </button>

  {/* Submit */}
  <button
    type="submit"
    disabled={loading}
    className={`px-6 py-3 rounded-lg text-base font-medium text-white ${
      loading ? 'bg-gray-400' : 'bg-emerald-500 hover:bg-emerald-600'
    } transition`}
  >
    {loading ? 'Menyimpan...' : 'Buat Banner'}
  </button>
</div>




            {message && (
              <div className={`mt-3 p-2 rounded ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                {message.text}
              </div>
            )}
          </div>

          <div className="flex mt-6 flex-col items-start justify-start">
            <div className="w-32 md:w-40 lg:w-44 h-20 md:h-24 bg-gray-50 rounded-md border flex items-center justify-center overflow-hidden shadow-sm">
              {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={previewUrl} alt="preview" className="object-cover w-full h-full" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={ENDPOINTS.IMAGE + '/webinar.jpeg' || useAsset('/webinar.jpeg')} alt="placeholder" className="object-cover w-full h-full opacity-60" />
              )}
            </div>
            <div className="text-xs text-gray-500 mt-2">Preview kecil (klik untuk lihat lebih besar)</div>
          </div>
        </form>
      </div>
    </div>
  );
}

CardCreateBanner.defaultProps = {
  color: "light",
};

CardCreateBanner.propTypes = {
  color: PropTypes.oneOf(["light", "dark"]),
};
