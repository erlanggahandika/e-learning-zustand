import React from "react";

// components

import CardTransaction from "../../components/Cards/CardTransaction";

// layout for page

import Admin from "layouts/Admin.js";

export default function Transaction() {
  return (
    <>
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4">
          <CardTransaction />
        </div>
      </div>
    </>
  );
}

Transaction.layout = Admin;
