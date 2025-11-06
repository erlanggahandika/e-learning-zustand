import React, { useState } from "react";
import CountUser from "../api/card/countuser";
import Transactioncard from "../api/card/transaction";
import Transactiontoday from "../api/card/transactiontoday";
import CardStats from "components/Cards/CardStats.js";

export default function HeaderStats() {
  const [open, setOpen] = useState(false);
  
  return (
    <>
      {/* Tombol Floating */}
  

      {/* Section Statistik */}
      <div
        className={`relative bg-blueGray-800 md:pt-20 pb-20 pt-10 px-4 md:px-10 mx-auto w-full overflow-hidden transition-all duration-700 ${
          open
            ? "opacity-100 max-h-[2000px] translate-y-0"
            : "opacity-0 max-h-0 -translate-y-10"
        }`}
      >
        {open && (
          <div className="mt-12 flex flex-wrap gap-4">
            <div className="w-full md:w-6/12 lg:w-4/12 xl:w-1/6 px-2 mb-4">
              <CountUser />
            </div>
            <div className="w-full md:w-6/12 lg:w-4/12 xl:w-1/6 px-2 mb-4">
              <Transactioncard />
            </div>
            <div className="w-full md:w-6/12 lg:w-4/12 xl:w-1/6 px-2 mb-4">
              <Transactiontoday />
            </div>
            <div className="w-full md:w-6/12 lg:w-4/12 xl:w-1/6 px-2 mb-4">
              <CardStats
                statSubtitle="SALDO ADMIN"
                statTitle="Rp12.345.000"
                statArrow="down"
                statPercent="1.5"
                statPercentColor="text-red-500"
                statDescripiron="Per hari"
                statIconName="fas fa-wallet"
                statIconColor="bg-pink-500"
              />
            </div>
            <div className="w-full md:w-6/12 lg:w-4/12 xl:w-1/6 px-2 mb-4">
              <CardStats
                statSubtitle="SALDO MENTOR"
                statTitle="Rp4.567.000"
                statArrow="up"
                statPercent="6.8"
                statPercentColor="text-emerald-500"
                statDescripiron="Per minggu"
                statIconName="fas fa-user-tie"
                statIconColor="bg-lightBlue-500"
              />
            </div>
            <div className="w-full md:w-6/12 lg:w-4/12 xl:w-1/6 px-2 mb-4">
              <CardStats
                statSubtitle="TOTAL SELURUH SALDO"
                statTitle="Rp16.912.000"
                statArrow="up"
                statPercent="3.2"
                statPercentColor="text-emerald-500"
                statDescripiron="Terkumpul"
                statIconName="fas fa-coins"
                statIconColor="bg-emerald-500"
              />
            </div>
            <div className="w-full md:w-6/12 lg:w-4/12 xl:w-1/6 px-2 mb-4">
              <CardStats
                statSubtitle="USER AKTIF HARI INI"
                statTitle="5"
                statArrow="up"
                statPercent="25"
                statPercentColor="text-emerald-500"
                statDescripiron="Dibanding kemarin"
                statIconName="fas fa-user-check"
                statIconColor="bg-indigo-500"
              />
            </div>
            <div className="w-full md:w-6/12 lg:w-4/12 xl:w-1/6 px-2 mb-4">
              <CardStats
                statSubtitle="PENARIKAN MENTOR"
                statTitle="Rp2.000.000"
                statArrow="up"
                statPercent="8.4"
                statPercentColor="text-emerald-500"
                statDescripiron="Bulan ini"
                statIconName="fas fa-hand-holding-usd"
                statIconColor="bg-yellow-500"
              />
            </div>
            <div className="w-full md:w-6/12 lg:w-4/12 xl:w-1/6 px-2 mb-4">
              <CardStats
                statSubtitle="KELAS AKTIF"
                statTitle="12"
                statArrow="up"
                statPercent="10"
                statPercentColor="text-emerald-500"
                statDescripiron="Sedang berjalan"
                statIconName="fas fa-chalkboard-teacher"
                statIconColor="bg-cyan-500"
              />
            </div>
            <div className="w-full md:w-6/12 lg:w-4/12 xl:w-1/6 px-2 mb-4">
              <CardStats
                statSubtitle="LAPORAN SISTEM"
                statTitle="0"
                statArrow="up"
                statPercent="100"
                statPercentColor="text-emerald-500"
                statDescripiron="Tidak ada error"
                statIconName="fas fa-server"
                statIconColor="bg-red-500"
              />
            </div>
            
          </div>
        )}
      </div>
<button
  onClick={() => setOpen(!open)}
  className="fixed bottom-6 !right-6 left-auto bg-red-600 text-white p-4 rounded-full hover:bg-yellow-700 transition-all shadow-lg z-[99999] flex items-center justify-center"
>
  <i className={`fas ${open ? "fa-times" : "fa-chart-pie"} text-xl`}></i>
</button>


    </>
  );
}
