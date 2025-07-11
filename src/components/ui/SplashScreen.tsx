"use client";
import { useEffect, useState } from "react";

const MESSAGES = [
  "Rastgele maymunlar pistten alınıyor...",
  "Uzaylılar çay molasında...",
  "Casuslar kamuflaj değiştiriyor...",
  "Timsahlar güvenlik kontrolünden geçiyor...",
  "Lazer gözlü kediler eğitiliyor...",
  "Röntgen gözlükleri kalibre ediliyor...",
  "Şüpheli bakışlar sisteme yükleniyor...",
  "Mikrofonlar meyve suyuna batırılıyor...",
  "Alüminyum şapka sinyalleri kesiliyor...",
  "Balıklar interneti keşfediyor...",
  "Gizli ajanslar lastik top ile oyalanıyor...",
  "Ayakkabılar sır veriyor...",
  "Gölge ajanlar ışık ayarına alınıyor...",
  "Kaşlar dikkatlice kıvrılıyor...",
  "Taktiksel ananaslar yerleştiriliyor...",
  "Tavuklar sorgulanıyor...",
  "Zaman makinesi geri sarılıyor...",
  "Ajan kargalar görev başına gidiyor...",
  "Haritalar ters çevriliyor...",
  "El fenerleri gizli modda yanıyor...",
];

export default function SplashScreen({
  children,
}: {
  children: React.ReactNode;
}) {
  const [show, setShow] = useState(true);
  const [message, setMessage] = useState(MESSAGES[0]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setMessage(MESSAGES[Math.floor(Math.random() * MESSAGES.length)]);
    let frame: number;
    let start: number | null = null;
    const duration = 2000;
    function animate(ts: number) {
      if (!start) start = ts;
      const elapsed = ts - start;
      const percent = Math.min(100, (elapsed / duration) * 100);
      setProgress(percent);
      if (elapsed < duration) {
        frame = requestAnimationFrame(animate);
      } else {
        setTimeout(() => setShow(false), 200);
      }
    }
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <>
      {show && (
        <div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black transition-opacity duration-500"
          style={{ fontFamily: "var(--font-geist-sans)" }}
        >
          <div className="text-lg sm:text-xl font-semibold mb-8 text-center text-white px-6 max-w-xs sm:max-w-md">
            {message}
          </div>
          <div className="w-48 h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
      <div
        className={
          show
            ? "opacity-0 pointer-events-none"
            : "opacity-100 transition-opacity duration-500"
        }
      >
        {children}
      </div>
    </>
  );
}
