"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGameContext } from "../GameContext";

export default function RoleRevealPage() {
  const router = useRouter();
  const { players, selectedPlace, currentRevealIndex, setCurrentRevealIndex } =
    useGameContext();
  const [showRole, setShowRole] = useState(false);
  const [warning, setWarning] = useState("");

  useEffect(() => {
    if (!players.length || !selectedPlace) {
      setWarning("Lütfen önce kullanıcı adı ve bölüm seçiniz.");
      setTimeout(() => router.replace("/"), 1500);
    }
  }, [players, selectedPlace, router]);

  if (!players.length || !selectedPlace)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-4">
        {warning && (
          <div className="mb-4 text-red-400 font-bold text-lg">{warning}</div>
        )}
      </div>
    );
  const player = players[currentRevealIndex];
  const isLast = currentRevealIndex === players.length - 1;

  const handleNext = () => {
    if (!showRole) {
      setShowRole(true);
    } else if (!isLast) {
      setShowRole(false);
      setCurrentRevealIndex(currentRevealIndex + 1);
    } else {
      router.push("/game/play");
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-4"
      style={{ fontFamily: "var(--font-geist-sans)" }}
    >
      <div className="flex flex-col items-center w-full max-w-sm">
        {!showRole ? (
          <>
            <div className="text-2xl font-bold mb-6">Telefonu eline al:</div>
            <div className="text-3xl font-bold mb-8 text-yellow-300">
              {player.name}
            </div>
            <button
              className="w-full px-8 py-3 rounded-full bg-white text-black font-bold text-lg shadow-lg hover:bg-gray-200 transition-colors duration-200"
              onClick={handleNext}
            >
              İleri
            </button>
          </>
        ) : (
          <>
            <div className="text-2xl font-bold mb-6">Rolün:</div>
            {player.role === "spy" ? (
              <div className="text-3xl font-bold mb-4 text-red-400">SPY</div>
            ) : (
              <>
                <div className="text-3xl font-bold mb-4 text-green-400">
                  Sivil
                </div>
                <div className="text-lg font-semibold mb-2">Mekan:</div>
                <div className="text-xl font-bold mb-6 text-blue-300">
                  {selectedPlace}
                </div>
              </>
            )}
            <button
              className="w-full px-8 py-3 rounded-full bg-white text-black font-bold text-lg shadow-lg hover:bg-gray-200 transition-colors duration-200"
              onClick={handleNext}
            >
              {isLast ? "Oyuna Başla" : "İleri"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
