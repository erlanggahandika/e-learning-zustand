import React from "react";

// components

import CardBanner from "../../components/Cards/CardBanner";
// layout for page

import Admin from "layouts/Admin.js";

export default function Banner() {
  return (
    <>
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4">
          <CardBanner />
        </div>
      </div>
    </>
  );
}

Banner.layout = Admin;
