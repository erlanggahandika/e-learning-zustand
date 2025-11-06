"use client";
import React, { useState , useEffect} from "react";
import PropTypes from "prop-types";
import api from "../../interceptor";
import { ENDPOINTS } from "../../endpoint";
// components

import TableDropdown from "components/Dropdowns/TableDropdown.js";
import { useAsset } from "utils/util";

const sampleUsers = [
  { uuid: "a1b2c3d4", name: "Budi Santoso", email: "budi@example.com", phone: "081234567890", lastLogin: "2025-10-27 14:23" },
  { uuid: "e5f6g7h8", name: "Siti Rahma", email: "siti@example.com", phone: "081298765432", lastLogin: "2025-10-28 08:12" },
  { uuid: "i9j0k1l2", name: "Andi Wijaya", email: "andi@example.com", phone: "081212345678", lastLogin: "2025-10-26 19:05" },
];

export default function CardTransaction({ color, users }) {
  const [userData, setUserData] = useState([]);
  const [copied, setCopied] = useState(null);
  const [queryInput, setQueryInput] = useState("");
  const [dateFromInput, setDateFromInput] = useState("");
  const [dateToInput, setDateToInput] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  const list =
    Array.isArray(userData) && userData.length
      ? userData
      : Array.isArray(users) && users.length
      ? users
      : sampleUsers;

  // Server-side search: when user performs a search we'll call the search endpoint
  // For pagination we just paginate over the current `list` (which will be server-filtered when search used)
  const totalPages = Math.max(1, Math.ceil(list.length / pageSize));
  const startIndex = currentPage * pageSize;
  const paginated = list.slice(startIndex, startIndex + pageSize);

  const copyUuid = (uuid) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(uuid).then(() => {
        setCopied(uuid);
        setTimeout(() => setCopied(null), 2000);
      });
    }
  };

  const copyText = (text) => {
    if (!text) return;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(text);
        setTimeout(() => setCopied(null), 2000);
      });
    }
  };

  const truncate = (s, n = 40) => {
    if (!s) return "-";
    return s.length > n ? s.slice(0, n) + "..." : s;
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const token = localStorage.getItem("accesToken");
        const response = await api.get(ENDPOINTS.GETALLTRANSACTION, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data && Array.isArray(response.data.data)) {
          setUserData(response.data.data);
        }
      } catch (error) {
        console.error("Gagal mengambil data user:", error);
      }
    };
    getUser();
  }, []);

  // perform server-side search using the SEARCH_TRANSAKSI_BERHASIL endpoint
  const searchTransactions = async () => {
    try {
      const token = localStorage.getItem("accesToken");
      const params = { search: queryInput };
      const search = params.search;
      if (dateFromInput) params.dateFrom = dateFromInput;
      if (dateToInput) params.dateTo = dateToInput;
      const response = await api.post(ENDPOINTS.SEARCH_TRANSAKSI_BERHASIL +"/" + search, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data && Array.isArray(response.data.data)) {
        setUserData(response.data.data);
        setCurrentPage(0);
      } else if (response.data && Array.isArray(response.data)) {
        // fallback if API returns data directly
        setUserData(response.data);
        setCurrentPage(0);
      } else {
        setUserData([]);
        setCurrentPage(0);
      }
    } catch (error) {
      console.error("Gagal mencari transaksi:", error);
    }
  };

  const handleFilterDate = async () => {
  try {
    const token = localStorage.getItem("accesToken");
    const response = await api.get(
      `${ENDPOINTS.SEARCH_DATE_TRANSAKSI_BERHASIL}?from=${dateFromInput}&to=${dateToInput}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setUserData(response.data.data);
  } catch (err) {
    console.error("Gagal memfilter transaksi berdasarkan tanggal:", err);
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
          <div className='flex flex-wrap items-center justify-between'>
            <div className='relative px-4 max-w-full flex-1'>
              <h3
                className={
                  "font-semibold text-lg " +
                  (color === "light" ? "text-blueGray-700" : "text-white")
                }>
                Daftar Transaksi Berhasil
              </h3>
            </div>
            {/* search controls */}
      <div className='flex flex-wrap items-center justify-end gap-6 mt-3'>

  {/* Grup input pencarian & tanggal */}
  <div className='flex flex-wrap items-center gap-4'>
    <input
      type='text'
      placeholder='Cari nama atau deskripsi...'
      value={queryInput}
      onChange={(e) => setQueryInput(e.target.value)}
      className='px-3 py-2 border rounded text-sm w-56'
      onKeyDown={(e) => { if (e.key === 'Enter') searchTransactions(); }}
    />

    <button
      type='button'
      onClick={searchTransactions}
      className='px-3 ml-2 py-2 bg-red-600 text-white rounded text-sm hover:bg-blue-700'>
      Search
    </button>

   
  </div>

  {/* Grup tombol */}
  <div className='flex flex-wrap items-center gap-3'>
      <input
      type='date'
      value={dateFromInput}
      onChange={(e) => setDateFromInput(e.target.value)}
      className='px-3 py-2 border rounded text-sm text'
      title='Dari tanggal'
    />

    <input
      type='date'
      value={dateToInput}
      onChange={(e) => setDateToInput(e.target.value)}
      className='px-3 ml-2 py-2 border rounded text-sm'
      title='Sampai tanggal'
    />

    <button
      type='button'
      onClick={handleFilterDate}
      className='px-3 ml-2 py-2 bg-red-600 text-white rounded text-sm hover:bg-green-700'>
      Filter by Date
    </button>

    <button
      type='button'
      onClick={async () => {
        setQueryInput('');
        setDateFromInput('');
        setDateToInput('');
        setCurrentPage(0);
        try {
          const token = localStorage.getItem('accesToken');
          const response = await api.get(ENDPOINTS.GETALLTRANSACTION, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.data && Array.isArray(response.data.data)) {
            setUserData(response.data.data);
          } else if (response.data && Array.isArray(response.data)) {
            setUserData(response.data);
          } else {
            setUserData([]);
          }
        } catch (err) {
          console.error('Gagal mengambil semua transaksi:', err);
        }
      }}
      className='px-3 ml-2 py-2 border rounded text-sm hover:bg-gray-100'>
      Clear
    </button>
  </div>
</div>


          </div>
        </div>
        <div className='block w-full overflow-x-auto'>
          {/* Transactions table */}
          <table className='items-center w-full bg-transparent border-collapse'>
            <thead>
              <tr>
                <th className={'px-3 text-center align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold ' + (color === 'light' ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100' : 'bg-blueGray-600 text-blueGray-200 border-blueGray-500')}>No.</th>
                <th className={'px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left ' + (color === 'light' ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100' : 'bg-blueGray-600 text-blueGray-200 border-blueGray-500')}>Nama</th>
                <th className={'px-4 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left ' + (color === 'light' ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100' : 'bg-blueGray-600 text-blueGray-200 border-blueGray-500')}>UUID</th>
                <th className={'px-4 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left ' + (color === 'light' ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100' : 'bg-blueGray-600 text-blueGray-200 border-blueGray-500')}>Type</th>
                <th className={'px-4 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-right ' + (color === 'light' ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100' : 'bg-blueGray-600 text-blueGray-200 border-blueGray-500')}>Amount</th>
                <th className={'px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left ' + (color === 'light' ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100' : 'bg-blueGray-600 text-blueGray-200 border-blueGray-500')}>Description</th>
                <th className={'px-4 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-center ' + (color === 'light' ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100' : 'bg-blueGray-600 text-blueGray-200 border-blueGray-500')}>Status</th>
                 <th className={'px-4 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-center ' + (color === 'light' ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100' : 'bg-blueGray-600 text-blueGray-200 border-blueGray-500')}>Bukti Pembayaran</th>
                <th className={'px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left ' + (color === 'light' ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100' : 'bg-blueGray-600 text-blueGray-200 border-blueGray-500')}>Created At</th>
                <th className={'px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left ' + (color === 'light' ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100' : 'bg-blueGray-600 text-blueGray-200 border-blueGray-500')}></th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((t, idx) => (
                <tr key={t.id || startIndex + idx}>
                  <td className='border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-center'>{startIndex + idx + 1}</td>
                  <td className='border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4'>
                    <div className='flex flex-col'>
                      <span className={'font-semibold ' + (color === 'light' ? 'text-blueGray-700' : 'text-white')}>{t.user?.name || '-'}</span>
                      <span className='text-xs text-gray-500'>{t.user?.email}</span>
                    </div>
                  </td>
                  <td className='border-t-0 px-4 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4'>
                    <div className='flex items-center gap-2'>
                      <span className='text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded'>{t.useruuid}</span>
                      <button type='button' onClick={() => copyUuid(t.useruuid)} className='text-sm text-gray-600 hover:text-gray-800' title='Copy UUID'><i className='far fa-clone' /></button>
                    </div>
                  </td>
                  <td className='border-t-0 px-4 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4'>{t.type}</td>
                  <td className='border-t-0 px-4 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right font-semibold'>
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(t.amount)}
                  </td>
                
                  <td className='border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4'>{t.description}</td>
                  <td className='border-t-0 px-4 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-center'>
                    {t.status === 'success' ? <span className='text-xs bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded'>Success</span> : <span className='text-xs bg-yellow-50 text-yellow-600 px-2 py-0.5 rounded'>{t.status}</span>}
                  </td>
                  <td className='border-t-0 px-4 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4'>
                    {t.snapUrl ? (
                      <div className='flex items-center gap-2'>
                        <a href={t.snapUrl} target='_blank' rel='noopener noreferrer' className='text-sm text-green-600 underline max-w-xs truncate'>{truncate(t.snapUrl, 50)}</a>
                        <button type='button' onClick={() => copyText(t.snapUrl)} className='text-sm text-gray-600 hover:text-gray-800' title='Copy link'>
                          <i className='far fa-clone' />
                        </button>
                        <button type='button' onClick={() => window.open(t.snapUrl, '_blank')} className='text-sm text-gray-600 hover:text-gray-800' title='Buka link'>
                          <i className='fas fa-external-link-alt' />
                        </button>
                        {copied === t.snapUrl && <span className='text-xs text-emerald-500 ml-2'>Copied</span>}
                      </div>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className='border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4'>{new Date(t.createdAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</td>
                  <td className='border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right'>
                    <TableDropdown />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* pagination controls */}
          <div className='flex items-center justify-between px-4 py-3 bg-white border-t'>
            <div className='text-sm text-gray-600'>Menampilkan {Math.min(list.length, startIndex + 1)} - {Math.min(list.length, startIndex + paginated.length)} dari {list.length} pengguna</div>
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
    </>
  );
}

CardTransaction.defaultProps = {
  color: "light",
  users: sampleUsers,
};

CardTransaction.propTypes = {
  color: PropTypes.oneOf(["light", "dark"]),
  users: PropTypes.array,
};
