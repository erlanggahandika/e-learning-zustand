"use client";
import React, { useState , useEffect} from "react";
import PropTypes from "prop-types";
import api from "../../interceptor";
import { ENDPOINTS } from "../../endpoint";
import CardCreateBanner from "./CardCreateBanner";
// components

import TableDropdown from "components/Dropdowns/TableDropdown.js";
import { useAsset } from "utils/util";

const sampleUsers = [
  { uuid: "a1b2c3d4", name: "Budi Santoso", email: "budi@example.com", phone: "081234567890", lastLogin: "2025-10-27 14:23" },
  { uuid: "e5f6g7h8", name: "Siti Rahma", email: "siti@example.com", phone: "081298765432", lastLogin: "2025-10-28 08:12" },
  { uuid: "i9j0k1l2", name: "Andi Wijaya", email: "andi@example.com", phone: "081212345678", lastLogin: "2025-10-26 19:05" },
];

export default function CardBanner({ color, users }) {
  const [userData, setUserData] = useState([]);
  const [copied, setCopied] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [creating, setCreating] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editSortOrder, setEditSortOrder] = useState(0);
  const [editIsActive, setEditIsActive] = useState(false);
  const [editImageFile, setEditImageFile] = useState(null);
  const [editPreviewUrl, setEditPreviewUrl] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newSortOrder, setNewSortOrder] = useState(0);
  const [newImageFile, setNewImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  const list =
    Array.isArray(userData) && userData.length
      ? userData
      : Array.isArray(users) && users.length
      ? users
      : sampleUsers;

  const totalPages = Math.max(1, Math.ceil(list.length / pageSize));
  const startIndex = currentPage * pageSize;
  const paginated = list.slice(startIndex, startIndex + pageSize);

  useEffect(() => {
    const getBanners = async () => {
      try {
        const token = localStorage.getItem("accesToken");
        const response = await api.get(ENDPOINTS.GET_BANNER_ADMIN, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data && Array.isArray(response.data.data)) {
          setUserData(response.data.data);
        } else if (response.data && Array.isArray(response.data)) {
          setUserData(response.data);
        }
      } catch (error) {
        console.error("Gagal mengambil banner:", error);
      }
    };
    getBanners();
  }, []);

  const openEditModal = async (uuid) => {
    try {
      const token = localStorage.getItem('accesToken');
      const res = await api.get(`${ENDPOINTS.GET_BANNER_ADMIN_BY_ID}/${uuid}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = res.data && (res.data.data || res.data);
      setSelectedBanner(data);
      // initialize edit form fields
  setEditTitle(data?.title || '');
  setEditSortOrder(data?.sortOrder ?? 0);
  setEditIsActive(Boolean(data?.isActive));
  setEditCategoryName(data?.category?.name || data?.categoryName || '');
      setEditImageFile(null);
      setEditPreviewUrl(data?.image ? `${ENDPOINTS.BACKEND}${data.image}` : null);
      setModalOpen(true);
    } catch (err) {
      console.error('Gagal ambil banner by id:', err);
    }
  };

  const openDeleteModal = (b) => {
    setSelectedBanner(b);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedBanner) return;
    try {
      const token = localStorage.getItem('accesToken');
      await api.delete(`${ENDPOINTS.DELETE_BANNER_ADMIN}/${selectedBanner.uuid}`, { headers: { Authorization: `Bearer ${token}` } });
      // remove from list locally
      setUserData((prev) => prev.filter((p) => p.uuid !== selectedBanner.uuid));
      setConfirmOpen(false);
      setSelectedBanner(null);
    } catch (err) {
      console.error('Gagal menghapus banner:', err);
    }
  };


  return (
    <>
      <div
        className={
          "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded " +
          (color === "light" ? "bg-white" : "bg-blueGray-700 text-white")
        }>
        <div className='rounded-t mb-0 px-4 py-3 border-0'>
          <div className='flex mt-4 items-center justify-between w-full px-4 max-w-full flex-grow'>
  <h3
    className={
      "font-semibold text-lg " +
      (color === "light" ? "text-blueGray-700" : "text-white")
    }>
    Daftar Banner
  </h3>
  <button
    onClick={() => setCreating(true)}
    className='px-3 py-1 bg-red-600 text-white rounded inline-flex items-center'
  >
    <i className='fas fa-plus mr-2' /> Create
  </button>
</div>

        </div>
        <div className='block w-full overflow-x-auto'>
          {/* Banners table */}
          <table className='items-center w-full bg-transparent border-collapse'>
            <thead>
              <tr>
                <th className={'px-3 text-center align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold ' + (color === 'light' ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100' : 'bg-blueGray-600 text-blueGray-200 border-blueGray-500')}>No.</th>
                                <th className={'px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left ' + (color === 'light' ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100' : 'bg-blueGray-600 text-blueGray-200 border-blueGray-500')}>Uuid</th>
                <th className={'px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left ' + (color === 'light' ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100' : 'bg-blueGray-600 text-blueGray-200 border-blueGray-500')}>Title</th>
                <th className={'px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left ' + (color === 'light' ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100' : 'bg-blueGray-600 text-blueGray-200 border-blueGray-500')}>Image</th>
                <th className={'px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left ' + (color === 'light' ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100' : 'bg-blueGray-600 text-blueGray-200 border-blueGray-500')}>Category</th>
                <th className={'px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left ' + (color === 'light' ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100' : 'bg-blueGray-600 text-blueGray-200 border-blueGray-500')}>Sort</th>
                <th className={'px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left ' + (color === 'light' ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100' : 'bg-blueGray-600 text-blueGray-200 border-blueGray-500')}>Created</th>
                <th className={'px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-center ' + (color === 'light' ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100' : 'bg-blueGray-600 text-blueGray-200 border-blueGray-500')}>Status</th>
                <th className={'px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left ' + (color === 'light' ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100' : 'bg-blueGray-600 text-blueGray-200 border-blueGray-500')}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((b, idx) => (
                <tr key={b.id || startIndex + idx}>
                  <td className='border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-center'>{startIndex + idx + 1}</td>
                                    <td className='border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left font-semibold'>{b.uuid || '-'}</td>
                  <td className='border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left font-semibold'>{b.title || '-'}</td>
                  <td className='border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4'>
                    {b.image ? <img src={`${ENDPOINTS.BACKEND}${b.image}`} alt={b.title} className='h-12 object-cover rounded'/> : '-'}
                  </td>
                  <td className='border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4'>{b.category?.name || b.categoryName || '-'}</td>
                  <td className='border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4'>{b.sortOrder ?? '-'}</td>
                  <td className='border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4'>{b.createdAt ? new Date(b.createdAt).toLocaleString() : '-'}</td>
                  <td className='border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-center'>
                    {b.isActive ? <span className='text-xs bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded'>Aktif</span> : <span className='text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded'>Tidak Aktif</span>}
                  </td>
                  <td className='border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right'>
                    <button onClick={() => openEditModal(b.uuid)} className='px-3 py-1 mr-2 bg-emerald-500 text-white rounded inline-flex items-center'>
                      <i className='fas fa-edit mr-2' /> Edit
                    </button>
                    <button onClick={() => openDeleteModal(b)} className='px-3 py-1 bg-red-500 text-white rounded inline-flex items-center'>
                      <i className='fas fa-trash mr-2' /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* pagination controls */}
          <div className='flex items-center justify-between px-4 py-3 bg-white border-t'>
            <div className='text-sm text-gray-600'>Menampilkan {Math.min(list.length, startIndex + 1)} - {Math.min(list.length, startIndex + paginated.length)} dari {list.length} banner</div>
            <div className='flex items-center gap-2'>
              <button
                onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                disabled={currentPage === 0}
                className={`px-3 py-1 rounded-md border ${currentPage === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-100'}`}>
                Prev
              </button>
              <div className='text-sm'>Halaman {currentPage + 1} / {totalPages}</div>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={currentPage >= totalPages - 1}
                className={`px-3 py-1 rounded-md border ${currentPage >= totalPages - 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-100'}`}>
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit modal */}
      {/* Create modal */}
      {creating && (
        <CardCreateBanner  
        onClose={() => setCreating(false)} 
        onSuccess={(newBanner) => {
      // tambahkan banner baru ke list lokal
      if (newBanner) {
        setUserData(prev => [newBanner, ...prev]);
      }
      setCreating(false); // tutup modal
    }} />
      )}
      {modalOpen && selectedBanner && (
     <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
 <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl my-16 p-8 overflow-y-auto max-h-[90vh] pb-24 overflow-y-auto">

    <h3 className="text-2xl font-semibold text-gray-800 mb-8 border-b pb-4">Edit Banner</h3>

    <form
      onSubmit={async (e) => {
        e.preventDefault();
        try {
          const token = localStorage.getItem("accesToken");
          const form = new FormData();
          form.append("title", editTitle);
          form.append("sortOrder", editSortOrder);
          form.append("isActive", editIsActive);
          if (editCategoryName) form.append("categoryName", editCategoryName);
          if (editImageFile) form.append("image", editImageFile);

          const res = await api.patch(`${ENDPOINTS.UPDATE_BANNER}/${selectedBanner.uuid}`, form, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const updated = res.data && (res.data.data || res.data);
          if (updated) {
            setUserData((prev) => prev.map((p) => (p.uuid === updated.uuid ? updated : p)));
            setModalOpen(false);
            setSelectedBanner(null);
          }
        } catch (err) {
          console.error("Gagal update banner:", err);
        }
      }}
      className="space-y-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 px-2">
        {/* Left Side - Form Fields */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="mt-2 block w-full border border-gray-300 rounded-lg p-3 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Masukkan judul banner"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Sort Order</label>
            <input
              type="number"
              value={editSortOrder}
              onChange={(e) => setEditSortOrder(e.target.value)}
              className="mt-2 block w-full border border-gray-300 rounded-lg p-3 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Category Name</label>
            <input
              value={editCategoryName}
              onChange={(e) => setEditCategoryName(e.target.value)}
              placeholder="Contoh: Home / Promo"
              className="mt-2 block w-full border border-gray-300 rounded-lg p-3 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              checked={editIsActive}
              onChange={(e) => setEditIsActive(e.target.checked)}
              className="h-4 w-4 text-emerald-600 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">Active</span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Replace Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(ev) => {
                const file = ev.target.files && ev.target.files[0];
                if (file) {
                  setEditImageFile(file);
                  const url = URL.createObjectURL(file);
                  setEditPreviewUrl(url);
                }
              }}
              className="mt-2 block w-full text-sm text-gray-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
            />
          </div>
        </div>

        {/* Right Side - Preview */}
        <div className="flex flex-col items-center">
          <label className="block text-sm font-medium text-gray-700 mb-3 self-start">Preview</label>
           <div className="w-full border rounded-xl overflow-hidden shadow-sm bg-gray-50 flex items-center justify-center p-2 mb-8">
  {editPreviewUrl ? (
    <img src={editPreviewUrl} alt="preview" className="w-full h-24 object-cover rounded-lg" />
  ) : selectedBanner.image ? (
    <img
      src={`${ENDPOINTS.BACKEND}${selectedBanner.image}`}
      alt="current"
      className="w-full h-24 object-cover rounded-lg"
    />
  ) : (
    <div className="w-full h-24 flex items-center justify-center text-gray-500 bg-gray-100 rounded-lg">
      No image
    </div>
  )}
</div>

        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex justify-end gap-3 pt-6 border-t sticky bottom-0 bg-white py-4">
        <button
          type="button"
          onClick={() => {
            setModalOpen(false);
            setSelectedBanner(null);
          }}
          className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition"
        >
          Save
        </button>
      </div>
    </form>
  </div>
</div>

      )}

      {/* Delete confirm modal */}
      {confirmOpen && selectedBanner && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div className="bg-white rounded-2xl shadow-2xl p-10 w-11/12 max-w-2xl transform transition-all scale-100">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 flex items-center justify-center bg-red-100 text-red-600 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-2xl font-semibold text-gray-800">Hapus Banner</h3>
      </div>

      <p className="text-gray-600 text-lg leading-relaxed">
        Apakah kamu yakin ingin menghapus banner{" "}
        <strong className="text-gray-800">{selectedBanner.title}</strong>?<br />
        <span className="text-red-500 font-medium">
          Tindakan ini tidak dapat dibatalkan.
        </span>
      </p>

      <div className="flex justify-end gap-5 mt-10">
        <button
          onClick={() => {
            setConfirmOpen(false);
            setSelectedBanner(null);
          }}
          className="px-6 py-3 text-base rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
        >
          Batal
        </button>
        <button
          onClick={handleDelete}
          className="px-6 ml-4 py-3 text-base rounded-lg bg-red-600 text-white hover:bg-red-700 shadow-md transition"
        >
          Hapus
        </button>
      </div>
    </div>
  </div>
)}


    </>
  );
}

CardBanner.defaultProps = {
  color: "light",
  users: sampleUsers,
};

CardBanner.propTypes = {
  color: PropTypes.oneOf(["light", "dark"]),
  users: PropTypes.array,
};
