import React from "react";

// components

import CardTransactionpending from "../../components/Cards/CardTransactionpending";

// layout for page

import Admin from "layouts/Admin.js";

export default function Pembelianpending() {
  return (
    <>
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4">
          <CardTransactionpending />
        </div>
      </div>
    </>
  );
}

Pembelianpending.layout = Admin;
