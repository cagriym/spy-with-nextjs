"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGameContext, Player } from "../GameContext";

// PLACES kaldırıldı

export default function GameSetupPage() {
  const router = useRouter();
  const {
    setPlayers,
    setSelectedPlace,
    setSpyId,
    setMode,
    setCurrentRevealIndex,
    resetGame,
    usedWords,
    setUsedWords,
  } = useGameContext();
  const [warning, setWarning] = useState("");

  useEffect(() => {
    // Get player names from localStorage (from usernames page)
    const names = JSON.parse(localStorage.getItem("spy-usernames") || "[]");
    if (!names || names.length < 2) {
      setWarning("Lütfen önce kullanıcı adı ve bölüm seçiniz.");
      resetGame();
      setTimeout(() => router.push("/"), 1500);
      return;
    }
    // Kelime havuzunu localStorage'dan al
    const allWords = JSON.parse(
      localStorage.getItem("spy-section-words") || "[]"
    );
    // Kullanılmamış kelimeleri bul
    const available = allWords.filter((w: string) => !usedWords.includes(w));
    // Eğer hiç kelime kalmadıysa havuzu sıfırla
    let newWord = "";
    let newUsedWords = usedWords;
    if (available.length === 0 && allWords.length > 0) {
      newWord = allWords[Math.floor(Math.random() * allWords.length)];
      newUsedWords = [newWord];
    } else if (available.length > 0) {
      newWord = available[Math.floor(Math.random() * available.length)];
      newUsedWords = [...usedWords, newWord];
    }
    setUsedWords(newUsedWords);
    // Oyuncuları oluştur
    const players: Player[] = names.map((name: string, i: number) => ({
      id: i + 1,
      name,
      role: "civilian",
    }));
    const playerCount = players.length;
    const spyIdx = Math.floor(Math.random() * playerCount);
    players[spyIdx].role = "spy";
    setPlayers(players);
    setSelectedPlace(newWord);
    setSpyId(players[spyIdx].id);
    setMode(playerCount === 2 ? "two" : "multi");
    setCurrentRevealIndex(0);
    setTimeout(() => {
      router.push("/game/role-reveal");
    }, 800);
  }, [
    router,
    setPlayers,
    setSelectedPlace,
    setSpyId,
    setMode,
    setCurrentRevealIndex,
    resetGame,
    usedWords,
    setUsedWords,
  ]);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-black text-white"
      style={{ fontFamily: "var(--font-geist-sans)" }}
    >
      {warning && (
        <div className="mb-4 text-red-400 font-bold text-lg">{warning}</div>
      )}
      <div className="text-2xl font-bold mb-4">Oyun başlatılıyor...</div>
    </div>
  );
}
