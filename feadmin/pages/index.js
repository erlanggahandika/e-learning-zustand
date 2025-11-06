/* eslint-disable react/jsx-no-target-blank */
import Link from "next/link";

import Footer from "components/Footers/Footer.js";
import IndexNavbar from "components/Navbars/IndexNavbar.js";
import { useAsset } from "utils/util";

export default function Index() {
  return (
    <>
      <IndexNavbar fixed />
      <section className='header relative pt-16 items-center flex h-screen max-h-860-px'>
        <div className='container mx-auto items-center flex flex-wrap'>
           <div className='w-full md:w-8/12 lg:w-6/12 xl:w-6/12 px-4'>
  <div className='pt-32 sm:pt-0'>
    <h2 className='font-semibold text-4xl text-blueGray-600'>
      Dashboard Admin SekolahCASN — Kelola Pembelajaran & Administrasi dengan Mudah
    </h2>
    <div className='mt-12'>
      <a
        href='/admin/dashboard'
        className='get-started text-white font-bold px-6 py-4 rounded outline-none focus:outline-none mr-1 mb-1 bg-blueGray-400 active:bg-blueGray-500 uppercase text-sm shadow hover:shadow-lg ease-linear transition-all duration-150'>
        Buka Dashboard Admin
      </a>
      
    </div>
  </div>
</div>

        </div>
        <img
          className='absolute top-0 b-auto right-0 pt-16 sm:w-6/12 -mt-48 sm:mt-0 w-10/12 max-h-860-px'
          src={useAsset("/img/pattern_nextjs.png")}
          alt='...'
        />
      </section>
      
      <Footer />
    </>
  );
}
