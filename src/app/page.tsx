"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const router = useRouter();
  const [slide, setSlide] = useState(false);

  const handlePlay = () => {
    setSlide(true);
    setTimeout(() => router.push("/usernames"), 400); // 400ms for slide animation
  };

  return (
    <div
      className={`relative flex flex-col min-h-screen w-full bg-black text-white transition-transform duration-500 ${
        slide ? "-translate-x-full" : "translate-x-0"
      }`}
    >
      <div
        className="flex flex-1 flex-col justify-center items-center w-full"
        style={{ minHeight: "60vh" }}
      >
        <h1
          className="text-6xl sm:text-9xl font-bold mb-4 tracking-tight text-center"
          style={{ fontFamily: "var(--font-geist-sans)", color: "#fff" }}
        >
          Yeni Nesil Spy&apos;a Hoşgeldiniz
        </h1>
        <button
          onClick={handlePlay}
          className="mt-2 px-8 py-3 rounded-full bg-white text-black font-bold text-lg shadow-lg hover:bg-gray-200 transition-colors duration-200"
        >
          Hemen Oyna
        </button>
      </div>
      <div className="fixed bottom-6 left-0 w-full flex justify-center items-center z-10">
        <span
          className="text-white text-base sm:text-lg font-bold italic tracking-wide mr-2"
          style={{ fontFamily: "var(--font-geist-mono)" }}
        >
          presented by
        </span>
        <Image
          src="/MUNJA.jpg"
          alt="Munja"
          width={80}
          height={54}
          className="rounded-lg object-contain"
        />
      </div>
    </div>
  );
}
