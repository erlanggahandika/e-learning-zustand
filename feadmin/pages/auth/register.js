// layout for page
"use client";
import Auth from "layouts/Auth.js";
import { useAsset } from "utils/util";
import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { ENDPOINTS } from "../../endpoint";


export default function Register() {
   const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await axios.post(ENDPOINTS.REGISTER, {
        name,
        email,
        password,
      });

      if (res.status === 200 || res.status === 201) {
        setSuccess(true);
        setMessage("Akun berhasil dibuat! Mengalihkan ke verifikasi OTP...");
        setTimeout(() => {
          router.push({
            pathname: "/auth/otp",
            query: { email },
          });
        }, 2500);
      } else {
        setSuccess(false);
        setMessage("Gagal membuat akun, coba lagi.");
      }
    } catch (err) {
      console.error(err);
      setSuccess(false);
      setMessage("Email sudah terdaftar atau terjadi kesalahan server.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className='container mx-auto px-4 h-full'>
        <div className='flex content-center items-center justify-center h-full'>
          <div className='w-full lg:w-6/12 px-4'>
            <div className='relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0'>
              <div className='rounded-t mb-0 px-6 py-6'>
                <div className='text-center mb-3'>
                  <h6 className='text-blueGray-500 text-sm font-bold'>
                    Sign up with
                  </h6>
                </div>
                <div className='btn-wrapper text-center'>
            
                </div>
                <hr className='mt-6 border-b-1 border-blueGray-300' />
              </div>
              <div className='flex-auto px-4 lg:px-10 py-10 pt-0'>
                <div className="min-h-[56px] mb-5">
        {message && (
          <div className="rounded-lg p-4 text-sm font-semibold shadow-md text-center transition-all duration-300 bg-yellow-500 text-black">
            {message}
          </div>
        )}
      </div>
                <form onSubmit={handleSubmit}>
                  <div className='relative w-full mb-3'>
                    <label
                      className='block uppercase text-blueGray-600 text-xs font-bold mb-2'
                      htmlFor='grid-password'>
                      Name
                    </label>
                    <input
                      type='text'
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className='border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150'
                      placeholder='Name'
                    />
                  </div>

                  <div className='relative w-full mb-3'>
                    <label
                      className='block uppercase text-blueGray-600 text-xs font-bold mb-2'
                      htmlFor='grid-password'>
                      Email
                    </label>
                    <input
                      type='email'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className='border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150'
                      placeholder='Email'
                    />
                  </div>

                  <div className='relative w-full mb-3'>
                    <label
                      className='block uppercase text-blueGray-600 text-xs font-bold mb-2'
                      htmlFor='grid-password'>
                      Password
                    </label>
                    <input
                      type='password'
                      value={password}
                       onChange={(e) => setPassword(e.target.value)}
                      className='border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150'
                      placeholder='Password'
                    />
                  </div>

                  <div>
                    <label className='inline-flex items-center cursor-pointer'>
                      <input
                        id='customCheckLogin'
                        type='checkbox'
                        className='form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150'
                      />
                      <span className='ml-2 text-sm font-semibold text-blueGray-600'>
                        I agree with the{" "}
                        <a
                          href='#pablo'
                          className='text-lightBlue-500'
                          onClick={(e) => e.preventDefault()}>
                          Privacy Policy
                        </a>
                      </span>
                    </label>
                  </div>

                  <div className='text-center mt-6'>
                    <button
                    disabled={loading}
                      className='bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150'
                      type='submit'>
                      {loading ? "Membuat Akun..." : "Create Account"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

Register.layout = Auth;
