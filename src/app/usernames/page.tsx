"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AnimatedOverlay from "@/components/ui/AnimatedOverlay";
import MobileAppBar from "@/components/ui/MobileAppBar";
import { saveUsernamesToBlob, getUsernamesFromBlob } from "@/lib/blob";

export default function UsernamesPage() {
  const [usernames, setUsernames] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [overlayOpen, setOverlayOpen] = useState(true);
  const [animDirection, setAnimDirection] = useState<"left" | "right">("left");
  const [warning, setWarning] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Sayfa açıldığında blob'dan kullanıcı adlarını çek
  useEffect(() => {
    (async () => {
      let names: string[] = [];
      try {
        names = await getUsernamesFromBlob();
      } catch (e) {
        // fetch hatası veya 404: blob'a boş dizi yaz ve tekrar dene
        await saveUsernamesToBlob([]);
        names = await getUsernamesFromBlob();
      }
      setUsernames(Array.isArray(names) ? names : []);
      setLoading(false);
    })();
  }, []);

  const addUsername = async () => {
    if (!input.trim()) {
      setWarning("Lütfen bir isim giriniz.");
      return;
    }
    if (usernames.includes(input.trim())) {
      setWarning("Aynı isim tekrar eklenemez.");
      return;
    }
    if (usernames.length >= 10) {
      setWarning("En fazla 10 kullanıcı eklenebilir.");
      return;
    }
    const newList = [...usernames, input.trim()];
    setUsernames(newList);
    setInput("");
    setWarning("");
    await saveUsernamesToBlob(newList);
  };

  const removeUsername = async (name: string) => {
    const newList = usernames.filter((u) => u !== name);
    setUsernames(newList);
    await saveUsernamesToBlob(newList);
  };

  const goNext = async () => {
    if (usernames.length < 2) {
      setWarning("En az 2 kullanıcı ekleyiniz.");
      return;
    }
    localStorage.setItem(
      "spy-usernames",
      JSON.stringify(usernames.map((name) => ({ name, feature: "" })))
    );
    await saveUsernamesToBlob(usernames);
    setAnimDirection("left");
    setOverlayOpen(false);
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
      <MobileAppBar
        title="Kullanıcıları Gir"
        onBack={goBack}
        onNext={goNext}
        nextLabel="İleri"
      />
      <div
        className="flex flex-1 flex-col justify-center items-center w-full pt-16 px-4 pb-8 min-h-screen overflow-y-auto"
        style={{
          fontFamily: "var(--font-geist-sans)",
          background: "#000",
          color: "#fff",
        }}
      >
        {loading ? (
          <div className="text-white">Yükleniyor...</div>
        ) : (
          <>
            {warning && (
              <div className="mb-4 text-red-400 font-bold text-lg">
                {warning}
              </div>
            )}
            <div className="flex flex-row gap-2 w-full max-w-sm mb-4">
              <input
                type="text"
                value={input}
                maxLength={20}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 px-4 py-3 rounded border border-white bg-black text-white text-lg focus:outline-none"
                placeholder="Kullanıcı adı girin"
                disabled={usernames.length >= 10}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addUsername();
                }}
              />
              <button
                className="px-4 py-3 rounded bg-white text-black font-bold text-lg shadow-lg hover:bg-gray-200"
                onClick={addUsername}
                disabled={usernames.length >= 10}
              >
                Ekle
              </button>
            </div>
            <ul className="w-full max-w-sm mb-4">
              {usernames.map((name, idx) => (
                <li
                  key={name}
                  className="flex items-center justify-between px-4 py-2 border-b border-gray-700"
                >
                  <span>
                    {idx + 1}. {name}
                  </span>
                  <button
                    className="ml-2 px-2 py-1 rounded bg-red-600 text-white text-xs font-bold hover:bg-red-700"
                    onClick={() => removeUsername(name)}
                  >
                    Sil
                  </button>
                </li>
              ))}
            </ul>
            <div className="text-gray-400 text-sm mb-2">
              {usernames.length}/10 kullanıcı
            </div>
          </>
        )}
      </div>
    </AnimatedOverlay>
  );
}
