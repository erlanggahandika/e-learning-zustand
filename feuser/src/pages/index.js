import Head from "next/head";
import { useState, useEffect } from "react";
import { FeatureSection } from "@/components/sections/FeatureSection";
import {
  Header,
  HeroSection,
  TestimonialSection,
  FaqSection,
  Footer,
  PricingSection,
  LargeFeatureSection,
  CtaSection,
} from "../components/sections";

import {
  header,
  faqs,
  testimonials,
  features,
  pricing,
  clients,
  footer,
} from "@/data";

export default function Home() {
const courses = [
  {
    id: 1,
    title: 'Tes Akademik POLRI: Matematika & Bahasa Indonesia',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80', // belajar, buku, ujian
    mentor: 'Kompol Budi Santoso',
    sessionsCount: 10,
    price: 99000,
    original: 199000,
    sessions: [
      { title: 'Strategi Menjawab Soal Akademik', desc: 'Tips dan teknik menjawab cepat dan tepat' },
      { title: 'Materi Matematika Dasar', desc: 'Logika, aritmetika, dan aljabar dasar' },
      { title: 'Bahasa Indonesia', desc: 'Tata bahasa dan pemahaman bacaan' },
      { title: 'Simulasi Soal Akademik', desc: 'Latihan soal berdasarkan ujian asli' },
    ],
  },
  {
    id: 2,
    title: 'Tes Psikologi POLRI',
    image: 'https://images.unsplash.com/photo-1605902711622-cfb43c4437d3?auto=format&fit=crop&w=800&q=80', // psikologi, analisis
    mentor: 'AKP Siti Rahma',
    sessionsCount: 8,
    price: 119000,
    original: 229000,
    sessions: [
      { title: 'Pengenalan Tes Psikologi', desc: 'Jenis-jenis tes dan tujuan penilaian' },
      { title: 'Tes Kepribadian', desc: 'Cara memahami dan menjawab dengan benar' },
      { title: 'Tes Logika dan Penalaran', desc: 'Cara menghadapi soal figural dan logika' },
      { title: 'Simulasi Psikotes', desc: 'Latihan dengan waktu terbatas' },
    ],
  },
  {
    id: 3,
    title: 'Tes Kesamaptaan Jasmani (TKJ)',
    image: 'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=800&q=80', // olahraga, latihan fisik
    mentor: 'Bripka Andi Wijaya',
    sessionsCount: 6,
    price: 89000,
    original: 159000,
    sessions: [
      { title: 'Latihan Fisik Dasar', desc: 'Push-up, sit-up, dan lari 12 menit' },
      { title: 'Teknik Pernafasan & Daya Tahan', desc: 'Cara meningkatkan stamina' },
      { title: 'Nutrisi dan Pola Tidur', desc: 'Panduan menjaga kebugaran optimal' },
    ],
  },
  {
    id: 4,
    title: 'Wawasan Kebangsaan dan Tes Pengetahuan Umum',
    image: 'https://images.unsplash.com/photo-1581091870627-3b5b9e7a6f59?auto=format&fit=crop&w=800&q=80', // bendera, kebangsaan
    mentor: 'AKBP Dewi Lestari',
    sessionsCount: 12,
    price: 109000,
    original: 209000,
    sessions: [
      { title: 'Materi Pancasila & UUD 1945', desc: 'Pemahaman dasar nilai kebangsaan' },
      { title: 'Sejarah Nasional', desc: 'Peristiwa penting dalam sejarah Indonesia' },
      { title: 'Simulasi Tes Wawasan Kebangsaan', desc: 'Latihan soal dan pembahasan' },
    ],
  },
  {
    id: 5,
    title: 'Tes Kesehatan & Administrasi',
    image: 'https://images.unsplash.com/photo-1588776814546-981b8f28229c?auto=format&fit=crop&w=800&q=80', // medis, pemeriksaan
    mentor: 'Dokter Rina Putri',
    sessionsCount: 5,
    price: 79000,
    original: 149000,
    sessions: [
      { title: 'Pemeriksaan Kesehatan Umum', desc: 'Langkah-langkah pemeriksaan dan persiapan' },
      { title: 'Cek Postur & Mata', desc: 'Persyaratan fisik umum POLRI' },
      { title: 'Administrasi Berkas', desc: 'Dokumen yang wajib dipersiapkan' },
    ],
  },
  {
    id: 6,
    title: 'Simulasi Lengkap Seleksi POLRI',
    image: 'https://images.unsplash.com/photo-1551836022-4c4c79ecde51?auto=format&fit=crop&w=800&q=80', // ujian, simulasi
    mentor: 'Komisaris Agus Prasetyo',
    sessionsCount: 10,
    price: 149000,
    original: 299000,
    sessions: [
      { title: 'Simulasi Akademik', desc: 'Uji kemampuan akademik dalam waktu terbatas' },
      { title: 'Simulasi Psikologi', desc: 'Latihan tes kepribadian dan logika' },
      { title: 'Simulasi Fisik & Mental', desc: 'Kesiapan mental dan daya tahan tubuh' },
    ],
  },
];


  const [openCourse, setOpenCourse] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [visible, setVisible] = useState(4);
  // auto slide banner
useEffect(() => {
  const total = 4; // jumlah gambar di banner
  const interval = setInterval(() => {
    setCarouselIndex((prev) => (prev + 1) % total);
  }, 4000); // ganti tiap 4 detik
  return () => clearInterval(interval);
}, []);


  // adjust visible cards based on window width
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w >= 1200) setVisible(4);
      else if (w >= 768) setVisible(2);
      else setVisible(1);
      setCarouselIndex(0);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // maximum starting index where a full page of `visible` cards can be shown
  const maxIndex = Math.max(0, courses.length - visible);

  const prev = () => setCarouselIndex((i) => Math.max(0, i - 1));
  const next = () => setCarouselIndex((i) => Math.min(maxIndex, i + 1));

  return (
    <>
      <Head>
        <title>SekolahCASN</title>
      </Head>
      <Header
        logo={header.logo}
        links={header.links}
        buttons={header.buttons}
      />
      <HeroSection
        id="home"
        badge={{ href: "#", icon: "tabler:star", label: "Bimbel CASN Unggulan" }}
        title="SekolahCASN"
        description={
          "Platform belajar online dan bimbel kedinasan terlengkap — dari AKPOL hingga STAN. Belajar dari instruktur ahli dan raih impianmu!"
        }
        buttons={[
          { href: "/auth/register", label: "Bimbel Offline", color: "dark" },
          { href: "#courses", label: "Lihat Fitur", color: "transparent", variant: "link", icon: "tabler:arrow-right" },
        ]}
        image={{ src: "", alt: "Screenshot Aplikasi", className: "w-full h-auto" }}
        clientsLabel="Dipercaya oleh 100+ Sekolah & Instructor"
        clients={clients}
      />

      {/* moving banner */}
      {/* moving banner */}
<section className="relative bg-gray-50 py-6 overflow-hidden">
  <div className="max-w-6xl mx-auto px-6">
    <div className="relative overflow-hidden rounded-2xl shadow-md">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${carouselIndex * 100}%)` }}
      >
        {[
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80", // coding, computer
  "https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=1200&q=80", // students, learning
  "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=1200&q=80", // teacher, online
]
.map((src, i) => (
          <div key={i} className="flex-shrink-0 w-full h-[250px] md:h-[400px]">
            <img
              src={src}
              alt={`Banner ${i + 1}`}
              className="w-full h-full object-cover rounded-2xl"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {/* overlay gradient for better text visibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent rounded-2xl pointer-events-none" />

      {/* optional text overlay */}
      <div className="absolute bottom-6 left-6 text-white z-10">
        <h3 className="text-xl md:text-2xl font-semibold">Promo Kursus Spesial!</h3>
        <p className="text-sm md:text-base opacity-90">Diskon hingga 50% untuk pendaftar baru.</p>
      </div>

      {/* navigation dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <button
            key={i}
            onClick={() => setCarouselIndex(i)}
            className={`w-2.5 h-2.5 rounded-full transition ${
              carouselIndex === i ? "bg-green-500" : "bg-white/70"
            }`}
          />
        ))}
      </div>
    </div>
  </div>
</section>

{/* //course */}
<section id="courses" className="py-16">
  <div className="max-w-7xl mx-auto px-6">
    <div className="flex flex-col items-center text-center mb-10">
      <h2 className="text-3xl font-extrabold text-gray-900">Bimbel CASN</h2>
      <p className="text-base text-gray-600 mt-2 max-w-2xl">
        Pelatihan unggulan untuk masa depan — kembangkan kemampuan dan profesionalitas.
      </p>
    </div>

    <div className="relative">
      {/* Tombol navigasi */}
      <button
        onClick={prev}
        disabled={carouselIndex <= 0}
        aria-label="Sebelumnya"
        className={`absolute left-3 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-white/90 border shadow-md transition transform ${
          carouselIndex <= 0 ? "opacity-40 cursor-not-allowed" : "hover:scale-110"
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M12.293 16.293a1 1 0 010-1.414L15.586 11H4a1 1 0 110-2h11.586l-3.293-3.879a1 1 0 011.486-1.318l5 6a1 1 0 010 1.318l-5 6a1 1 0 01-1.486 0z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      <button
        onClick={next}
        disabled={carouselIndex >= maxIndex}
        aria-label="Selanjutnya"
        className={`absolute right-3 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-white/90 border shadow-md transition transform ${
          carouselIndex >= maxIndex ? "opacity-40 cursor-not-allowed" : "hover:scale-110"
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700 rotate-180" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M12.293 16.293a1 1 0 010-1.414L15.586 11H4a1 1 0 110-2h11.586l-3.293-3.879a1 1 0 011.486-1.318l5 6a1 1 0 010 1.318l-5 6a1 1 0 01-1.486 0z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Carousel */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out gap-6"
          style={{ transform: `translateX(-${carouselIndex * (100 / visible)}%)` }}
        >
          {courses.map((c) => {
            const discount =
              c.original && c.original > c.price
                ? Math.round(((c.original - c.price) / c.original) * 100)
                : 0;

            return (
              <div key={c.id} style={{ flex: `0 0 ${100 / visible}%` }}>
                <article className="bg-white border border-gray-100 rounded-2xl shadow-md hover:shadow-xl overflow-hidden transform transition hover:-translate-y-2">
                  <div className="aspect-[16/9] relative">
                    <img
                      src={c.image}
                      alt={c.title}
                      className="object-cover w-full h-full"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 line-clamp-1">{c.title}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                      {c.mentor} • {c.sessionsCount} pertemuan
                    </p>

                    <div className="mt-5 flex items-center justify-between">
                      <div>
                        {c.original && c.original > c.price ? (
                          <>
                            <div className="text-sm text-gray-400 line-through">
                              Rp{c.original.toLocaleString("id-ID")}
                            </div>
                            <div className="text-lg font-bold text-gray-900">
                              Rp{c.price.toLocaleString("id-ID")}
                            </div>
                          </>
                        ) : (
                          <div className="text-lg font-bold text-gray-900">
                            Rp{c.price.toLocaleString("id-ID")}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {discount > 0 && (
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                            -{discount}%
                          </span>
                        )}
                        <a
                          href={`/courses/${c.id}`}
                          className="text-sm font-medium text-green-600 hover:text-green-700"
                        >
                          Lihat
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pagination dots */}
      <div className="mt-6 flex items-center justify-center gap-3">
        {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCarouselIndex(idx)}
            aria-label={`Halaman ${idx + 1}`}
            className={`w-3 h-3 rounded-full transition-all ${
              carouselIndex === idx ? "bg-green-600 scale-110" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  </div>
</section>



      <FeatureSection
        id="features"
        title="Kenapa SekolahCASN Academy?"
        description="Platform belajar yang fokus pada hasil: modul terstruktur, tugas proyek, komunitas aktif, dan dukungan karier."
        features={features}
      />

      <LargeFeatureSection
        title="Kurikulum yang terstruktur"
        description="Materi disusun oleh praktisi, dengan latihan dan proyek yang bisa langsung diterapkan."
        list={features.slice(0, 3)}
        image={{ src: "/user/phone-mockup.png", alt: "Kurikulum", className: "w-full aspect-square object-contain rotate-6 hover:rotate-0 duration-300 ease-in-out" }}
      />

      <LargeFeatureSection
        reverse={true}
        title="Belajar dengan fleksibel"
        description="Kursus dapat diikuti secara self-paced atau terstruktur oleh instruktur. Akses materi selamanya setelah mendaftar."
        list={features.slice(0, 3)}
        image={{ src: "/user/phone-mockup.png", alt: "Fleksibel", className: "w-full aspect-square object-contain -rotate-6 hover:rotate-0 duration-300 ease-in-out" }}
      />

     

      <TestimonialSection
        id="testimonials"
        title="Suara dari peserta"
        description="Pengalaman nyata peserta yang berhasil meningkatkan karier dan keterampilan mereka."
        badge={{ leading: true, icon: "tabler:heart", label: "TESTIMONIALS" }}
        testimonials={testimonials}
        button={{ icon: "tabler:brand-x", label: "Bagikan Pengalaman", href: "#", color: "white" }}
      />

      <FaqSection
        id="faqs"
        title="Pertanyaan Umum"
        description="Pertanyaan yang sering muncul tentang pendaftaran, pembayaran, dan sertifikat."
        buttons={[ { label: "Hubungi Dukungan", href: "#", color: "primary", variant: "link", icon: "tabler:arrow-right" } ]}
        faqs={faqs}
      />

      <CtaSection
        title="Siap memulai perjalanan belajar Anda?"
        description="Daftar sekarang dan dapatkan rekomendasi kursus yang sesuai dengan tujuan karier Anda."
        buttons={[{ label: "Daftar Gratis", href: "/auth/register", color: "dark" }]}
      />

      <Footer id="footer" copyright={footer.copyright} logo={footer.logo} social={footer.social} links={footer.links} />
    </>
  );
}
