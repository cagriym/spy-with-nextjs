"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AnimatedOverlay from "@/components/ui/AnimatedOverlay";
import MobileAppBar from "@/components/ui/MobileAppBar";

export default function UsernamesPage() {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]); // oyuna katılacaklar
  const [input, setInput] = useState("");
  const [overlayOpen, setOverlayOpen] = useState(true);
  const [animDirection, setAnimDirection] = useState<"left" | "right">("left");
  const [warning, setWarning] = useState("");
  const [recentPlayers, setRecentPlayers] = useState<string[]>([]);
  const router = useRouter();

  // Son oynayanları localStorage'dan çek
  useEffect(() => {
    const recent = JSON.parse(
      localStorage.getItem("spy-recent-players") || "[]"
    );
    setRecentPlayers(Array.isArray(recent) ? recent.slice(-3).reverse() : []);
  }, []);

  // Yeni kullanıcı ekle (sadece seçiliye ve son oynayanlara ekle)
  const addUsername = async () => {
    const name = input.trim();
    if (!name) {
      setWarning("Lütfen bir isim giriniz.");
      return;
    }
    if (selectedUsers.includes(name)) {
      setWarning("Bu isim zaten seçili.");
      setInput("");
      return;
    }
    if (selectedUsers.length >= 10) {
      setWarning("En fazla 10 oyuncu seçebilirsiniz.");
      return;
    }
    setSelectedUsers([...selectedUsers, name]);
    setInput("");
    setWarning("");
  };

  // Seçili kullanıcıyı çıkar
  const removeSelectedUser = (name: string) => {
    setSelectedUsers(selectedUsers.filter((u) => u !== name));
  };

  const goNext = async () => {
    if (selectedUsers.length < 2) {
      setWarning("En az 2 oyuncu seçmelisiniz.");
      return;
    }
    localStorage.setItem(
      "spy-usernames",
      JSON.stringify(selectedUsers.map((name) => ({ name, feature: "" })))
    );
    // Son oynayanları güncelle
    const updatedRecent = [...selectedUsers].slice(-3);
    localStorage.setItem("spy-recent-players", JSON.stringify(updatedRecent));
    setAnimDirection("left");
    setOverlayOpen(false);
    setTimeout(() => {
      router.push("/sections");
    }, 200);
  };
  const goBack = () => {
    setAnimDirection("right");
    setOverlayOpen(false);
  };
  const handleExit = () => {
    if (animDirection === "left") router.push("/sections");
    else router.push("/");
  };

  return (
    <AnimatedOverlay
      open={overlayOpen}
      direction={animDirection}
      onExit={handleExit}
    >
      <MobileAppBar title="Kullanıcılar" onBack={goBack} />
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-4 pb-32 sm:pb-4">
        <div className="w-full max-w-md mx-auto mt-8">
          {/* Son Oynayanlar */}
          <div className="mb-4">
            <div className="font-bold text-lg mb-1 text-yellow-300">
              Son Oynayanlar
            </div>
            <div className="flex gap-2 flex-wrap">
              {recentPlayers.length === 0 ? (
                <span className="text-gray-400 text-sm">Henüz yok</span>
              ) : (
                recentPlayers.map((name, i) => (
                  <span
                    key={i}
                    className="bg-gray-800 px-3 py-1 rounded-full text-sm font-semibold"
                  >
                    {name}
                  </span>
                ))
              )}
            </div>
          </div>
          {/* Oyun Oyuncuları */}
          <div className="mb-4">
            <div className="font-bold text-lg mb-1 text-green-300">
              Oyun Oyuncuları
            </div>
            <div className="flex gap-2 flex-wrap">
              {selectedUsers.length === 0
                ? null
                : selectedUsers.map((name, i) => (
                    <span
                      key={i}
                      className="bg-green-700 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1"
                    >
                      {name}
                      <button
                        className="ml-1 text-xs text-red-300 hover:text-red-500"
                        onClick={() => removeSelectedUser(name)}
                        title="Çıkar"
                        type="button"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
            </div>
          </div>
          {/* Kullanıcı adı ekleme inputu */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-900 text-white border border-gray-700 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Kullanıcı adı giriniz"
            maxLength={20}
          />
          <button
            onClick={addUsername}
            className="w-full px-4 py-2 rounded bg-blue-500 text-white font-bold mb-2 hover:bg-blue-600 transition-colors duration-200"
          >
            Ekle
          </button>
          {warning && (
            <div className="text-red-400 font-bold mb-2">{warning}</div>
          )}
        </div>
        {/* Sabitlenmiş Oyuna Başla butonu */}
        <button
          onClick={goNext}
          className={`fixed left-0 right-0 bottom-0 z-50 w-full max-w-md mx-auto px-4 py-4 rounded-t-2xl font-bold transition-colors duration-200 shadow-lg
            ${
              selectedUsers.length >= 2
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
            }
          `}
          style={{
            margin: "0 auto",
            // iOS safe area desteği
            paddingBottom: "env(safe-area-inset-bottom, 16px)",
          }}
          disabled={selectedUsers.length < 2}
        >
          Oyuna Başla
        </button>
      </div>
    </AnimatedOverlay>
  );
}
