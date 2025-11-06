"use client";
import { useEffect, useState } from "react";
import api from "../../../interceptor";
import { ENDPOINTS } from "../../../endpoint";
import CardStats from "components/Cards/CardStats.js";

const CountUser = () => {
  const [data, setData] = useState({
    jumlah: 0,
    arrow: "up",
    percent: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accesToken");
    // console.log("Token:", token);

    const fetchUserCount = async () => {
      try {
        const response = await api.get(ENDPOINTS.COUNT_ALLUSER, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // simpan semua ke state
        setData({
          jumlah: response.data.jumlah,
          arrow: response.data.arrow || "up",
          percent: response.data.percent || 0,
        });
      } catch (error) {
        console.log("Error fetching user count:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserCount();
  }, []);

  if (loading) {
    // Shimmer / Skeleton
    return (
      <div className="w-full md:w-6/12 lg:w-4/12 xl:w-1/6 px-2 mb-4 animate-pulse">
        <div className="bg-gray-300 h-24 rounded-lg"></div>
      </div>
    );
  }

  return (
    <CardStats
      statSubtitle="TOTAL USER"
      statTitle={data.jumlah.toLocaleString()} // format angka
      statArrow={data.arrow}
      statPercent={data.percent}
      statPercentColor={data.arrow === "up" ? "text-emerald-500" : "text-red-500"}
      statDescription="Sejak bulan lalu"
      statIconName="fas fa-users"
      statIconColor="bg-orange-500"
    />
  );
};

export default CountUser;
