"use client";
import React, { useState, useEffect } from "react";
import api from "../../interceptor";
import { ENDPOINTS } from "../../endpoint";
import { useAsset } from "utils/util";

export default function CardProfile() {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", title: "", avatar: "" });
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accesToken");
    const getProfile = async () => {
      try {
        const response = await api.get(ENDPOINTS.PROFILE, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response?.data?.data || response?.data || null;
        if (data) {
          setProfile(data);
          setForm({
            name: data.name || "",
            phone: data.phone || "",
            title: data.title || "",
            avatar: data.avatar || "",
          });
        }
      } catch (error) {
        console.log("error", error);
      }
    };
    getProfile();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
    setForm((f) => ({ ...f, avatar: file }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("accesToken");
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("phone", form.phone);
      formData.append("title", form.title);
      if (form.avatar instanceof File) formData.append("image", form.avatar);

      const res = await api.patch(ENDPOINTS.EDIT_PROFILE, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const data = res?.data?.data || res?.data;
      if (data) {
        setProfile(data);
        setEditing(false);
        setPreview("");
      }
    } catch (err) {
      console.error("save profile error", err);
    } finally {
      setSaving(false);
    }
  };

  const currentAvatar = preview
    ? preview
    : profile?.avatar
    ? (profile.avatar.startsWith("http")
        ? profile.avatar
        : `${ENDPOINTS.IMAGE.replace(/\/$/, "")}/${profile.avatar.replace(/^\//, "")}`)
    : useAsset("/img/team-2-800x800.jpg");

  return (
    <div className="max-w-md mt-16 mx-auto bg-white shadow-md border border-gray-100 rounded-2xl p-6 pb-8 transition-all duration-300 hover:shadow-lg">
      <div className="flex flex-col items-center">
        <div className="relative mt-8">
          <img
            src={currentAvatar}
            alt={profile?.name || "avatar"}
            className="rounded-full w-24 h-24 object-cover border-4 border-white shadow-md"
          />
        </div>

        <div className="text-center mt-4">
          <h2 className="text-lg font-semibold text-gray-800">{profile?.name || "—"}</h2>
          <p className="text-gray-500 text-sm mt-1">{profile?.title || "Belum ada jabatan"}</p>
          <p className="text-gray-400 text-sm">{profile?.email || "—"}</p>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => setEditing(!editing)}
            className="px-4 py-2 border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-50 transition"
          >
            {editing ? "Batal" : "Edit Profil"}
          </button>
          {editing && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition"
            >
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
          )}
        </div>
      </div>

      {editing && (
        <div className="mt-10 px-6 space-y-5 pb-6">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Nama</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-black focus:outline-none"
            />
          </div>

          <div>
            <label className="block mt-4 text-xs text-gray-500 mb-1">Telepon</label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-black focus:outline-none"
            />
          </div>

          <div>
            <label className="block mt-4 text-xs text-gray-500 mb-1">Jabatan / Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-black focus:outline-none"
            />
          </div>

          {/* Tambahan input upload foto */}
          <div className="mt-4">
            <label className="block text-xs text-gray-500 mb-1">Foto Profil</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-black focus:outline-none"
            />
            {preview && (
              <div className="flex justify-center mt-3">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-20 h-20 rounded-full object-cover border"
                />
              </div>
            )}
          </div>

                  </div>
      )}

      {!editing && (
        <p className="text-gray-500 text-sm text-center mt-6">
          {profile?.description || "Belum ada deskripsi diri."}
        </p>
      )}
    </div>
  );
}
