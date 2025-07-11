"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AnimatedOverlay from "@/components/ui/AnimatedOverlay";
import MobileAppBar from "@/components/ui/MobileAppBar";
import { getSectionFromBlob, saveSectionToBlob } from "@/lib/blob";

const SECTION_NAMES = ["bolum1", "bolum2", "bolum3", "bolumras"];
const SECTION_DEFAULTS: Record<string, Record<string, unknown>> = {
  bolum1: { bolum: "Bölüm 1", aciklama: "Otomatik oluşturuldu.", veriler: [] },
  bolum2: { bolum: "Bölüm 2", aciklama: "Otomatik oluşturuldu.", veriler: [] },
  bolum3: { bolum: "Bölüm 3", aciklama: "Otomatik oluşturuldu.", veriler: [] },
  bolumras: {
    bolum: "Rastgele",
    aciklama: "Otomatik oluşturuldu.",
    veriler: [],
  },
};

export default function SectionsPage() {
  const [sections, setSections] = useState<Record<string, unknown>[]>([]);
  const [modalIdx, setModalIdx] = useState<number | null>(null);
  const [overlayOpen, setOverlayOpen] = useState(true);
  const [animDirection, setAnimDirection] = useState<"left" | "right">("left");
  const [warning, setWarning] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Bölüm başlıklarını blob'dan çek
  useEffect(() => {
    (async () => {
      const data: Record<string, unknown>[] = [];
      for (const name of SECTION_NAMES) {
        let section = null;
        try {
          section = await getSectionFromBlob(name);
        } catch (e) {
          // fetch hatası veya 404: blob'a örnek bölüm yaz ve tekrar dene
          await saveSectionToBlob(name, SECTION_DEFAULTS[name]);
          section = await getSectionFromBlob(name);
        }
        if (section && typeof section === "object") data.push(section);
      }
      setSections(data);
      setLoading(false);
    })();
  }, []);

  const goNext = () => {
    if (modalIdx === null) {
      setWarning("Lütfen bir bölüm seçiniz.");
      return;
    }
    setAnimDirection("left"); // ileri: sola kay
    setOverlayOpen(false);
    // Seçilen bölümün kelime havuzunu localStorage'a kaydet
    const selected = sections[modalIdx];
    if (selected && selected.veriler) {
      localStorage.setItem(
        "spy-section-words",
        JSON.stringify(selected.veriler)
      );
      localStorage.setItem("spy-section-title", String(selected.bolum) || "");
    }
  };
  const goBack = () => {
    setAnimDirection("right"); // geri: sağa kay
    setOverlayOpen(false);
  };
  const handleExit = () => {
    if (animDirection === "left") router.push("/time");
    else router.push("/usernames");
  };

  return (
    <AnimatedOverlay
      open={overlayOpen}
      direction={animDirection}
      onExit={handleExit}
    >
      <MobileAppBar title="Bölüm Seç" onBack={goBack} />
      <div
        className="flex flex-1 flex-col justify-center items-center w-full pt-16 px-4 pb-8 min-h-screen overflow-y-auto"
        style={{
          fontFamily: "var(--font-geist-sans)",
          background: "#000",
          color: "#fff",
        }}
      >
        {loading ? (
          <div className="text-white">Bölümler yükleniyor...</div>
        ) : (
          <>
            {warning && (
              <div className="mb-4 text-red-400 font-bold text-lg">
                {warning}
              </div>
            )}
            <div className="flex flex-col gap-4 w-full max-w-sm mt-4 items-center justify-center">
              {sections.map((section, idx) => (
                <button
                  key={idx}
                  className="bg-black border border-white rounded-xl p-6 shadow-md cursor-pointer hover:scale-[1.03] transition-transform duration-200 flex flex-col items-center text-white w-full"
                  onClick={() => setModalIdx(idx)}
                >
                  <span
                    className="text-lg font-semibold mb-2"
                    style={{ color: "#fff" }}
                  >
                    {String(section.bolum) || `Bölüm ${idx + 1}`}
                  </span>
                  <div className="text-gray-400 text-sm mb-2">
                    {String(section.aciklama)}
                  </div>
                </button>
              ))}
            </div>
            {modalIdx !== null && sections[modalIdx] && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
                <div className="bg-black border border-white rounded-2xl p-6 shadow-2xl w-[95vw] max-w-sm flex flex-col items-center animate-grow text-white relative">
                  <button
                    className="absolute top-3 right-3 text-2xl text-gray-400 hover:text-white focus:outline-none"
                    onClick={() => setModalIdx(null)}
                    aria-label="Kapat"
                  >
                    ×
                  </button>
                  <h3
                    className="text-xl font-bold mb-4 mt-2"
                    style={{ color: "#fff" }}
                  >
                    {String(sections[modalIdx].bolum)}
                  </h3>
                  <div className="mb-6 text-gray-300 text-base">
                    {String(sections[modalIdx].aciklama)}
                  </div>
                  <button
                    className="w-full px-8 py-3 rounded-full bg-white text-black font-bold text-lg shadow-lg hover:bg-gray-200 transition-colors duration-200 mt-2"
                    onClick={goNext}
                  >
                    Seç
                  </button>
                </div>
              </div>
            )}
          </>
        )}
        <style jsx global>{`
          .animate-grow {
            animation: growModal 0.3s cubic-bezier(0.4, 2, 0.6, 1) forwards;
          }
          @keyframes growModal {
            0% {
              transform: scale(0.8);
              opacity: 0;
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}</style>
      </div>
    </AnimatedOverlay>
  );
}
