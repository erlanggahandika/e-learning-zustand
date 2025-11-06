"use client"
import React, { useState, useEffect } from "react";
import api from "../../interceptor";
import { ENDPOINTS } from "../../endpoint";
import { useRouter } from "next/router";

export default function CardSettings() {
  const [activities, setActivities] = useState([]);
  const router = useRouter();
  const [selectedNotif, setSelectedNotif] = useState(null);
  const [notifModalOpen, setNotifModalOpen] = useState(false);

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const token = localStorage.getItem('accesToken');
        const res = await api.get(ENDPOINTS.GET_NOTIFIKASI_ADMIN, { headers: { Authorization: `Bearer ${token}` } });
        const data = res.data && (res.data.data || res.data);
        if (Array.isArray(data)) setActivities(data);
      } catch (err) {
        console.error('Gagal ambil notifikasi:', err);
        // leave activities empty, UI will show fallback
      }
    };
    fetchNotifs();
  }, []);

  const itemsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(activities.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentActivities = activities.slice(startIndex, startIndex + itemsPerPage);

  const openNotif = async (id) => {
    try {
      const token = localStorage.getItem('accesToken');
      let res;
      // if numeric id, use GET_NOTIFICATION_BY_ID, otherwise GETBYUUID_NOTIFIKASI
      if (/^\d+$/.test(String(id))) {
        res = await api.get(ENDPOINTS.GETBYUUID_NOTIFIKASI + "/" + id, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        res = await api.get(`${ENDPOINTS.GETBYUUID_NOTIFIKASI}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      }
      // console.log('notif detail', res.data);
      const data = res.data && (res.data.data || res.data);
      // Some endpoints return object directly or wrapped in array/object
      setSelectedNotif(data);
      setNotifModalOpen(true);
    } catch (err) {
      console.error('Gagal ambil notifikasi by uuid:', err);
    }
  };

  return (
    <>
      <div className="w-full mt-16 max-w-3xl mx-auto shadow-lg rounded-2xl bg-white border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 bg-white border-b">
          <h6 className="text-gray-800 text-xl font-bold">Aktivitas</h6>
        </div>

        <ul className="divide-y border-t border-gray-100">
  {currentActivities.length > 0 ? (
    currentActivities.map((a) => {
      const isRead = a.isRead === true || a.isRead === 'true' || a.isRead === 1 || a.isRead === '1';
      return (
        <li
          key={a.id}
          className={`transition rounded-xl ${isRead ? 'bg-white' : 'bg-amber-50'}`}
        >
          <div
            className="flex items-start justify-between py-4 px-6 hover:bg-gray-50 cursor-pointer"
            onClick={async () => {
  // update lokal dulu
  setActivities((prev) =>
    prev.map((n) =>
      n.id === a.id ? { ...n, isRead: true } : n
    )
  );

  // kirim ke backend supaya benar-benar dibaca
  try {
    const token = localStorage.getItem('accesToken');
    await api.get(ENDPOINTS.GETBYUUID_NOTIFIKASI + "/" + a.id, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
  } catch (err) {
    console.log('Gagal mark as read di backend', err);
  }

  setSelectedNotif(a);
}}

          >
            <div className="flex items-start gap-3">
              {!isRead && (
                <div className="flex-shrink-0 mt-1">
                  <svg className="w-3 h-3 text-amber-500" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="4" cy="4" r="4" fill="#f59e0b" />
                  </svg>
                </div>
              )}
              <div>
                <div className="text-sm font-semibold text-gray-800">
                  {a.title || a.action} —{' '}
                  <span className="text-gray-500 font-normal">{a.email || a.user}</span>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {a.message || a.device} {a.ip ? `• ${a.ip}` : ''}
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-400">
              {a.createdAt ? new Date(a.createdAt).toLocaleString() : a.time}
            </div>
          </div>
        </li>
      );
    })
  ) : (
    <li className="text-sm text-gray-500 text-center py-4">
      Tidak ada notifikasi
    </li>
  )}
</ul>




        {/* Pagination */}
        <div className="flex justify-between items-center px-6 py-3 bg-gray-50 border-t">
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Prev
          </button>
          <span className="text-sm text-gray-600">{currentPage} / {totalPages}</span>
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </div>

      {/* Pengaturan */}
      <div className="w-full mt-16 max-w-3xl mx-auto shadow-lg rounded-2xl bg-white border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 bg-white border-b">
          <h6 className="text-gray-800 text-xl font-bold">Pengaturan</h6>
        </div>

        <ul>
          <li onClick={() => router.push("/admin/changepassword")} className="flex items-center justify-between py-4 px-6 hover:bg-gray-50 transition rounded-t-xl cursor-pointer border-b border-gray-200">
            <div>
              <div className="text-sm font-semibold text-gray-800">Ubah Password</div>
              <div className="text-xs text-gray-400 mt-1">Ganti password akun Anda secara berkala</div>
            </div>
            <button className="px-4 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition">Ubah</button>
          </li>

          <li onClick={() =>
             [ localStorage.removeItem('accesToken'),
             router.push("/auth/login")]} className="flex items-center justify-between py-4 px-6 hover:bg-gray-50 transition rounded-b-xl cursor-pointer border-b border-gray-200">
            <div>
              <div className="text-sm font-semibold text-gray-800">Lupa Password</div>
              <div className="text-xs text-gray-400 mt-1">Pemulihan password akun Anda</div>
            </div>
            <button className="px-4 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition">Ubah</button>
          </li>
        </ul>
      </div>
      {/* Notification detail modal */}
      {notifModalOpen && seleactedNotif && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-lg p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{selectedNotif.title || selectedNotif.action || 'Notification'}</h3>
                <p className="text-sm text-gray-500 mt-1">{selectedNotif.type || ''} • {selectedNotif.email || ''}</p>
              </div>
              <button className="text-gray-400 hover:text-gray-600" onClick={() => { setNotifModalOpen(false); setSelectedNotif(null); }}>
                ✕
              </button>
            </div>

            <div className="mt-4 text-gray-700">
              {selectedNotif.message || selectedNotif.body || JSON.stringify(selectedNotif)}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button className="px-4 py-2 border rounded" onClick={() => { setNotifModalOpen(false); setSelectedNotif(null); }}>Close</button>
              <button
                className="px-4 py-2 bg-emerald-500 text-white rounded"
                onClick={() => {
                  // mark as read locally
                  setActivities((prev) => prev.map((n) => (n.id === selectedNotif.id ? { ...n, isRead: true } : n)));
                  setNotifModalOpen(false);
                  setSelectedNotif(null);
                }}
              >
                Mark as read
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}
