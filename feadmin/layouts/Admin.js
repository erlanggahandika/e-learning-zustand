"use client";
import React, { useEffect, useState } from "react";

// components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import HeaderStats from "components/Headers/HeaderStats.js";
import FooterAdmin from "components/Footers/FooterAdmin.js";
import api from "../interceptor";
import { ENDPOINTS } from "../endpoint";
import { useRouter } from "next/navigation";

export default function Admin({ children }) {
  const [collapseShow, setCollapseShow] = useState(false);
  const router = useRouter();
 
  useEffect(() => {
    const token = localStorage.getItem("accesToken");
    if (!token) {
      window.location.href = "/auth/login";
    }
    const profile = async () => {
      try {
        const res = await api.get(ENDPOINTS.PROFILE , { headers: { Authorization: `Bearer ${token}` } });
        if (!res.data.success) {
          router.replace("/auth/login");
        }
      } catch (err) {
        router.replace("/auth/login");
      }
    };
    profile();

  }, []);

  const contentStyle = {
    marginLeft: collapseShow ? "13.5rem" : "4rem", // open vs collapse
    transition: "margin-left 0.3s",
    backgroundColor: "#f1f5f9", // bg-blueGray-100
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  };

  const innerStyle = {
    padding: "1rem 2.5rem",
    width: "100%",
    flex: 1,
  };

  return (
    <>
      <Sidebar collapseShow={collapseShow} setCollapseShow={setCollapseShow} />
      <div style={contentStyle}>
        
        <HeaderStats />
        <div style={innerStyle}>
          {children}
          
        </div>
      </div>
    </>
  );
}
