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

export default function CardTable({ color, users }) {
  const [userData, setUserData] = useState([]);
  const [copied, setCopied] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");

  const baseList =
    Array.isArray(userData) && userData.length
      ? userData
      : Array.isArray(users) && users.length
      ? users
      : sampleUsers;

  // apply search filter (case-insensitive) on name, email, uuid, phone
  const filteredList = appliedSearch
    ? baseList.filter((u) => {
        const q = appliedSearch.toLowerCase();
        return (
          (u.name && u.name.toLowerCase().includes(q)) ||
          (u.email && u.email.toLowerCase().includes(q)) ||
          (u.uuid && u.uuid.toLowerCase().includes(q)) ||
          (u.phone && u.phone.toLowerCase().includes(q))
        );
      })
    : baseList;

  const totalPages = Math.max(1, Math.ceil(filteredList.length / pageSize));
  const startIndex = currentPage * pageSize;
  const paginated = filteredList.slice(startIndex, startIndex + pageSize);

  const copyUuid = (uuid) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(uuid).then(() => {
        setCopied(uuid);
        setTimeout(() => setCopied(null), 2000);
      });
    }
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const token = localStorage.getItem("accesToken");
        const response = await api.get(ENDPOINTS.COUNT_ALLUSER, {
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

    return (
    <>
      <div
        className={
          "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded " +
          (color === "light" ? "bg-white" : "bg-blueGray-700 text-white")
        }>
        <div className='rounded-t mb-0 px-4 py-3 border-0'>
          <div className='flex flex-wrap items-center'>
            <div className='relative w-full px-4 max-w-full flex-grow flex-1'>
              <h3
                className={
                  "font-semibold text-lg " +
                  (color === "light" ? "text-blueGray-700" : "text-white")
                }>
                Daftar Pengguna
              </h3>
            </div>
            {/* search input & buttons */}
            <div className='flex items-center gap-2 px-4 py-2'>
              <input
                type='text'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder='Cari nama, email, uuid, atau phone'
                className='border rounded px-3 py-1 text-sm w-64 bg-white text-gray-700'
              />
              <button
                onClick={() => {
                  setAppliedSearch(searchTerm.trim());
                  setCurrentPage(0);
                }}
                className='bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600'
              >
                Cari
              </button>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setAppliedSearch("");
                  setCurrentPage(0);
                }}
                className='bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-300'
              >
                Clear
              </button>
            </div>
          </div>
        </div>
        <div className='block w-full overflow-x-auto'>
          {/* Users table */}
          <table className='items-center w-full bg-transparent border-collapse'>
            <thead>
              <tr>
                <th className={'px-3 text-center align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold ' + (color === 'light' ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100' : 'bg-blueGray-600 text-blueGray-200 border-blueGray-500')}>No.</th>
                <th className={'px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left ' + (color === 'light' ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100' : 'bg-blueGray-600 text-blueGray-200 border-blueGray-500')}>Name</th>
                <th className={'px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left ' + (color === 'light' ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100' : 'bg-blueGray-600 text-blueGray-200 border-blueGray-500')}>Email</th>
                <th className={'px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left ' + (color === 'light' ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100' : 'bg-blueGray-600 text-blueGray-200 border-blueGray-500')}>Phone</th>
                <th className={'px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left ' + (color === 'light' ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100' : 'bg-blueGray-600 text-blueGray-200 border-blueGray-500')}>Last Login</th>
                <th className={'px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left ' + (color === 'light' ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100' : 'bg-blueGray-600 text-blueGray-200 border-blueGray-500')}></th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((u, idx) => (
                <tr key={u.uuid || startIndex + idx}>
                  <td className='border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-center'>{startIndex + idx + 1}</td>
                  <th className='border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left'>
                    <div className='flex items-center'>
                      <img
                        src={ENDPOINTS.IMAGE + u.avatar || useAsset('/img/team-1-800x800.jpg')}
                        className='h-10 w-10 bg-white rounded-full border'
                        alt={u.name}></img>
                      <div className='ml-3'>
                        <div className={'font-bold flex items-center gap-2 ' + (color === 'light' ? 'text-blueGray-600' : 'text-white')}>
                          <span>{u.name}</span>
                          <span className='text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded'>{u.uuid}</span>
                          <button
                            type='button'
                            onClick={() => copyUuid(u.uuid)}
                            className='text-sm text-gray-600 hover:text-gray-800 ml-1'
                            title='Copy UUID'
                          >
                            <i className='far fa-clone' />
                          </button>
                          {copied === u.uuid && <span className='text-xs text-emerald-500 ml-2'>Copied</span>}
                        </div>
                      </div>
                    </div>
                  </th>
                  <td className='border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4'>{u.email}</td>
                  <td className='border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4'>{u.phone}</td>
                  <td className='border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4'>{u.lastLogin}</td>
                  <td className='border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right'>
                    <TableDropdown />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* pagination controls */}
          <div className='flex items-center justify-between px-4 py-3 bg-white border-t'>
            <div className='text-sm text-gray-600'>Menampilkan {filteredList.length ? startIndex + 1 : 0} - {Math.min(filteredList.length, startIndex + paginated.length)} dari {filteredList.length} pengguna</div>
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

CardTable.defaultProps = {
  color: "light",
  users: sampleUsers,
};

CardTable.propTypes = {
  color: PropTypes.oneOf(["light", "dark"]),
  users: PropTypes.array,
};
