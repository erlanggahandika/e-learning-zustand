"use client";
import { useEffect, useState } from "react";
import api from "../../../interceptor";
import { ENDPOINTS } from "../../../endpoint";
import CardStats from "components/Cards/CardStats.js";

const Transactiontoday = () => {
  const [data, setData] = useState({
    jumlah: 0,
    arrow: "up",
    percent: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accesToken");
    // console.log("Token:", token);

    const fetchdata = async () => {
      try {
        const response = await api.get(ENDPOINTS.GETALLTRANSACTION, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // simpan semua ke state
        setData({
          transaksi: response.data.transactionsToday || 0,
          
        });
      } catch (error) {
        console.log("Error fetching user count:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchdata();
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
                      statSubtitle="TRANSAKSI HARI INI"
                      statTitle={data.transaksi}
                      statArrow=""
                      statPercent=""
                      statPercentColor="text-emerald-500"
                      statDescripiron="Hari ini"
                      statIconName="fas fa-calendar-day"
                      statIconColor="bg-yellow-500"
                    />
  );
};

export default Transactiontoday;
