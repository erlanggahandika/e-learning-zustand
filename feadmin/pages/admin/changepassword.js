import React from "react";

// components

import CardUbahPassword from "components/Cards/CardUbahPassword";
// layout for page

import Admin from "layouts/Admin.js";

export default function Changepassword() {
  return (
    <>
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4">
          <CardUbahPassword />
        </div>
      </div>
    </>
  );
}

Changepassword.layout = Admin;
