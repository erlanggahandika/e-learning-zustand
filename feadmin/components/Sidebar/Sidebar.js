import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import NotificationDropdown from "components/Dropdowns/NotificationDropdown.js";
import UserDropdown from "components/Dropdowns/UserDropdown.js";

export default function Sidebar({ collapseShow, setCollapseShow }) {
  const router = useRouter();
  const [mobileShow, setMobileShow] = useState(false);

  const toggleSidebar = () => setCollapseShow(!collapseShow);
  const toggleMobileSidebar = () => setMobileShow(!mobileShow);

  const sidebarStyle = {
    width: collapseShow ? "13.5rem" : "4rem", // desktop
    transition: "width 0.3s",
  };

  const mobileSidebarStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    height: mobileShow ? "auto" : 0,
    overflow: "hidden",
    backgroundColor: "#fff",
    zIndex: 50,
    transition: "height 0.3s",
  };

 const menuItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: "fa-tv" },
  { name: "List User", href: "/admin/tables", icon: "fa-users" },
  { name: "Banner", href: "/admin/banner", icon: "fa-image" },
  { name: "Course", href: "/admin/course", icon: "fa-book" },
  { name: "Event Tryout", href: "/admin/event-tryout", icon: "fa-calendar-check" },
  { name: "Transaksi", href: "/admin/transaction", icon: "fa-money-bill" },
  { name: "Pembelian Pending", href: "/admin/pembelian-pending", icon: "fa-clock" },
  { name: "Settings", href: "/admin/settings", icon: "fa-cog" },
];



  const renderMenu = (isCollapsed) =>
    menuItems.map((item) => (
      <li key={item.name} className="items-center">
        <Link
          href={item.href}
          className={`text-xs uppercase py-3 font-bold block px-4 ${
            router.pathname.includes(item.href)
              ? "text-blue-500 hover:text-blue-600"
              : "text-gray-700 hover:text-gray-500"
          }`}
        >
          <i
            className={`fas ${item.icon} mr-2 text-sm ${
              router.pathname.includes(item.href) ? "opacity-75" : "text-gray-300"
            }`}
          ></i>
          {isCollapsed && item.name}
        </Link>
      </li>
    ));

  return (
    <>
      {/* Desktop Sidebar */}
      <nav
        style={sidebarStyle}
        className="hidden md:flex fixed top-0 left-0 h-full shadow-xl bg-white flex flex-col justify-between z-50"
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <Link href="/" className="text-sm font-bold">
            {collapseShow ? "SekolahCASN" : ""}
          </Link>
          <button
            onClick={toggleSidebar}
            className="text-black px-2 py-1 rounded-md hover:bg-gray-100 transition-colors"
          >
            <i className="fas fa-bars"></i>
          </button>
        </div>

        <ul className="flex flex-col flex-1 mt-4">{renderMenu(collapseShow)}</ul>

        <div className="md:hidden flex flex-col p-4 border-t border-gray-200">
          <NotificationDropdown />
          <UserDropdown />
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <div className="md:hidden" style={mobileSidebarStyle}>
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <span className="text-sm font-bold">SekolahCASN</span>
          <button
            onClick={toggleMobileSidebar}
            className="text-black px-2 py-1 rounded-md hover:bg-gray-100 transition-colors"
          >
            <i className={`fas ${mobileShow ? "fa-times" : "fa-bars"}`}></i>
          </button>
        </div>
        <ul className="flex flex-col">{renderMenu(true)}</ul>
      </div>
    </>
  );
}
