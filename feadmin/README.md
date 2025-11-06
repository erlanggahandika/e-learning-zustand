# Notus-React Free React.js Tailwindcss Template

#### Preview

- [Demo](https://themewagon.github.io/Notus-Next.js/)

#### Download

- [Download from ThemeWagon](https://themewagon.github.io/Notus-Next.js/)

## Getting Started

1. Clone Repository

```
git clone https://github.com/themewagon/Notus-Next.js.git
```

2. Install Dependencies

```
npm i
```

3. Run the development server:

```bash
npm run start
# or
yarn start
# or
pnpm start
# or
bun start
```

## Author

```
Design and code is completely written by Creative Tim design and development team.
```

## License

- Design and Code is Copyright &copy; [Creative Tim](https://www.creative-tim.com/)
- Licensed cover under [MIT]
- Distributed by [ThemeWagon](https://themewagon.com)

"use client";
import Auth from "layouts/Auth.js";
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
    <div className="container mx-auto px-4 h-full">
      <div className="flex content-center items-center justify-center h-full">
        <div className="w-full lg:w-6/12 px-4">
  {/* Ganti warna background luar jadi putih */}
  <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-xl rounded-xl bg-white border border-green-100">
    
    {/* Header hijau lembut */}
    <div className="rounded-t-lg mb-0 px-6 py-6 bg-green-50 border-b border-green-200">
      <div className="text-center mb-3">
        <h6 className="text-green-700 text-lg font-semibold">
          Daftar
        </h6>
      </div>
      <hr className="mt-4 border-green-300 opacity-50" />
    </div>

    {/* Form putih bersih */}
    <div className="flex-auto px-6 lg:px-10 py-10">
      {/* ✅ Message Box */}
      <div className="min-h-[56px] mb-5">
        {message && (
          <div className="rounded-lg p-4 text-sm font-semibold shadow-md text-center transition-all duration-300 bg-green-500 text-white">
            {message}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="relative w-full mb-4">
          <label className="block uppercase text-green-700 text-xs font-bold mb-2">
            Nama
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-green-200 px-3 py-3 placeholder-green-300 text-green-700 bg-white rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 w-full transition-all duration-150"
            placeholder="Nama lengkap"
            required
          />
        </div>

        <div className="relative w-full mb-4">
          <label className="block uppercase text-green-700 text-xs font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-green-200 px-3 py-3 placeholder-green-300 text-green-700 bg-white rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 w-full transition-all duration-150"
            placeholder="Email"
            required
          />
        </div>

        <div className="relative w-full mb-4">
          <label className="block uppercase text-green-700 text-xs font-bold mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-green-200 px-3 py-3 placeholder-green-300 text-green-700 bg-white rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 w-full transition-all duration-150"
            placeholder="Password"
            required
          />
        </div>

        <div className="text-center mt-6">
          <button
            disabled={loading}
            className={`${
              loading
                ? "bg-green-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            } text-green-100 active:bg-green-600 text-sm font-bold uppercase px-6 py-3 rounded-lg shadow-md outline-none focus:outline-none w-full transition-all duration-150`}
            type="submit"
          >
            {loading ? "Membuat Akun..." : "Create Account"}
          </button>
        </div>
      </form>
    </div>
  </div>
</div>

      </div>
    </div>
  );
}

Register.layout = Auth;
