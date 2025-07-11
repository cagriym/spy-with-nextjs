"use client";
import { useState } from "react";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
} from "@/components/ui/drawer";
import AnimatedOverlay from "@/components/ui/AnimatedOverlay";
import { useRouter } from "next/navigation";
import MobileAppBar from "@/components/ui/MobileAppBar";

export default function TimePage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [seconds, setSeconds] = useState(60);
  const [overlayOpen, setOverlayOpen] = useState(true);
  const [animDirection, setAnimDirection] = useState<"left" | "right">("left");
  const [warning, setWarning] = useState("");
  const router = useRouter();

  const goBack = () => {
    setAnimDirection("right"); // geri: sağa kay
    setOverlayOpen(false);
  };

  const handleStart = () => {
    if (seconds < 10 || seconds > 600) {
      setWarning("Lütfen 10-600 saniye arasında bir süre seçiniz.");
      return;
    }
    setAnimDirection("left"); // ileri: sola kay
    setOverlayOpen(false);
  };

  const handleExit = () => {
    if (animDirection === "left") {
      // Oyun başlatılacak, burada başka bir sayfaya yönlendirme yapılabilir
      router.push("/game/setup");
    } else {
      router.push("/sections");
    }
  };

  return (
    <AnimatedOverlay
      open={overlayOpen}
      direction={animDirection}
      onExit={handleExit}
    >
      <MobileAppBar title="Süre Seç" onBack={goBack} />
      <div
        className="flex flex-1 flex-col justify-center items-center w-full pt-16 px-4 pb-8 min-h-screen overflow-y-auto"
        style={{
          fontFamily: "var(--font-geist-sans)",
          background: "#000",
          color: "#fff",
        }}
      >
        {warning && (
          <div className="mb-4 text-red-400 font-bold text-lg">{warning}</div>
        )}
        <div className="flex flex-col gap-6 w-full max-w-sm mt-4 items-center justify-center">
          <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
            <DrawerTrigger asChild>
              <button className="w-full px-8 py-3 rounded-full bg-white text-black font-bold text-lg shadow-lg hover:bg-gray-200 transition-colors duration-200">
                Süreyi Ayarla
              </button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle className="text-white">Saniye Seç</DrawerTitle>
              </DrawerHeader>
              <div className="flex flex-col items-center gap-4 p-4">
                <input
                  type="number"
                  min={10}
                  max={600}
                  value={seconds}
                  onChange={(e) => setSeconds(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-white bg-black text-white rounded text-lg text-center focus:outline-none focus:ring-2 focus:ring-white/30"
                />
                <span className="text-gray-400 text-sm">10 - 600 saniye</span>
              </div>
              <DrawerFooter>
                <button
                  className="w-full px-8 py-3 rounded-full bg-white text-black font-bold text-lg shadow-lg hover:bg-gray-200 transition-colors duration-200"
                  onClick={() => setDrawerOpen(false)}
                >
                  Onayla
                </button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
          <button
            className="w-full px-8 py-3 rounded-full bg-white text-black font-bold text-lg shadow-lg hover:bg-gray-200 transition-colors duration-200"
            onClick={handleStart}
          >
            Oyunu Başlat
          </button>
        </div>
      </div>
    </AnimatedOverlay>
  );
}
