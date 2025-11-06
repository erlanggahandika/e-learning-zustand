export default function Footer() {
  return (
    <>
      <footer className='relative bg-blueGray-200 pt-8 pb-6'>
        <div
          className='bottom-auto top-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden -mt-20 h-20'
          style={{ transform: "translateZ(0)" }}>
          <svg
            className='absolute bottom-0 overflow-hidden'
            xmlns='http://www.w3.org/2000/svg'
            preserveAspectRatio='none'
            version='1.1'
            viewBox='0 0 2560 100'
            x='0'
            y='0'>
            <polygon
              className='text-blueGray-200 fill-current'
              points='2560 0 2560 100 0 100'></polygon>
          </svg>
        </div>
        <div className='container mx-auto px-4'>
          <div className='flex flex-wrap text-center lg:text-left'>
            <div className='w-full lg:w-6/12 px-4'>
              <h4 className='text-3xl font-semibold'>Hubungi SekolahCASN</h4>
              <h5 className='text-lg mt-0 mb-2 text-blueGray-600'>
                Untuk pertanyaan atau bantuan, silakan kirim email ke kontak
                kami.
              </h5>
              <div className='mt-6 lg:mb-0 mb-6'>
                <button
                  className='bg-white text-lightBlue-400 shadow-lg font-normal h-10 w-10 items-center justify-center align-center rounded-full outline-none focus:outline-none mr-2'
                  type='button'>
                  <i className='fab fa-twitter'></i>
                </button>
                <button
                  className='bg-white text-lightBlue-600 shadow-lg font-normal h-10 w-10 items-center justify-center align-center rounded-full outline-none focus:outline-none mr-2'
                  type='button'>
                  <i className='fab fa-facebook-square'></i>
                </button>
                <button
                  className='bg-white text-pink-400 shadow-lg font-normal h-10 w-10 items-center justify-center align-center rounded-full outline-none focus:outline-none mr-2'
                  type='button'>
                  <i className='fab fa-dribbble'></i>
                </button>
               
              </div>
            </div>
            <div className='w-full lg:w-6/12 px-4'>
              <div className='flex flex-wrap items-top mb-6'>
                <div className='w-full lg:w-4/12 px-4 ml-auto'>
                  <span className='block uppercase text-blueGray-500 text-sm font-semibold mb-2'>
                    Useful Links
                  </span>
                  <ul className='list-unstyled'>
                    <li>
                      <a
                        rel='noreferrer'
                        target='_blank'
                        className='text-blueGray-600 hover:text-blueGray-800 font-semibold block pb-2 text-sm'
                        href='https://sekolahcasn.id'>
                        sekolahcasn.id
                      </a>
                    </li>
                    <li>
                      <a
                        target='_blank'
                        rel='noreferrer'
                        className='text-blueGray-600 hover:text-blueGray-800 font-semibold block pb-2 text-sm'
                        href='https://sekolahcasn.id/blog'>
                        Blog
                      </a>
                    </li>
                    <li>
                      <a
                        rel='noreferrer'
                        className='text-blueGray-600 hover:text-blueGray-800 font-semibold block pb-2 text-sm'
                        href='https://github.com/sekolahcasn'
                        target='_blank'>
                        Github
                      </a>
                    </li>
                    <li>
                      <a
                        rel='noreferrer'
                        className='text-blueGray-600 hover:text-blueGray-800 font-semibold block pb-2 text-sm'
                        href='https://sekolahcasn.id/services'
                        target='_blank'>
                        Layanan
                      </a>
                    </li>
                  </ul>
                </div>
                <div className='w-full lg:w-4/12 px-4'>
                  <span className='block uppercase text-blueGray-500 text-sm font-semibold mb-2'>
                    Other Resources
                  </span>
                  <ul className='list-unstyled'>
                    <li>
                      <a
                        rel='noreferrer'
                        className='text-blueGray-600 hover:text-blueGray-800 font-semibold block pb-2 text-sm'
                        href='https://sekolahcasn.id/terms'
                        target='_blank'>
                        Syarat & Ketentuan
                      </a>
                    </li>
                    <li>
                      <a
                        rel='noreferrer'
                        className='text-blueGray-600 hover:text-blueGray-800 font-semibold block pb-2 text-sm'
                        href='https://sekolahcasn.id/privacy'
                        target='_blank'>
                        Kebijakan Privasi
                      </a>
                    </li>
                    <li>
                      <a
                        rel='noreferrer'
                        className='text-blueGray-600 hover:text-blueGray-800 font-semibold block pb-2 text-sm'
                        href='mailto:erlanggahandika73@gmail.com'>
                        Hubungi lewat Email
                      </a>
                    </li>
                    <li>
                      <a
                        rel='noreferrer'
                        className='text-blueGray-600 hover:text-blueGray-800 font-semibold block pb-2 text-sm'
                        href='mailto:erlanggahandika73@gmail.com'>
                        Bantuan & Dukungan
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <hr className='my-6 border-blueGray-300' />
          <div className='flex flex-wrap items-center md:justify-between justify-center'>
            <div className='w-full md:w-4/12 px-4 mx-auto text-center'>
              <div className='text-sm text-blueGray-500 font-semibold py-1'>
                Copyright © {new Date().getFullYear()} SekolahCASN.id —
                <a
                  target='_blank'
                  rel='noreferrer'
                  href='https://sekolahcasn.id'
                  className='text-blueGray-500 hover:text-blueGray-800 ml-1'>
                  sekolahcasn.id
                </a>
              </div>
              <div className='text-sm text-blueGray-500 font-semibold py-1'>
                Dibuat oleh <span className='font-semibold'>Zustand Team</span>.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
