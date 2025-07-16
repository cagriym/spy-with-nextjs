"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useGameContext } from "../GameContext";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { saveUsernamesToBlob } from "@/lib/blob";

export default function GamePlayPage() {
  const router = useRouter();
  const {
    timer,
    gamePhase,
    setGamePhase,
    players,
    votes,
    setVotes,
    votingIndex,
    setVotingIndex,
    setWinner,
    resetGame,
    usedWords,
    setUsedWords,
    continueGame,
  } = useGameContext();
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timer);
  const [flashing, setFlashing] = useState(false);
  const [showScore, setShowScore] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [continueStep, setContinueStep] = useState(false); // bölüm ve süre seçimi için
  const [newTimer, setNewTimer] = useState(60);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Gerekli veriler yoksa uyarı ve yönlendirme
  useEffect(() => {
    if (!players.length || !timer) {
      setTimeout(() => router.replace("/"), 1500);
    }
  }, [players, timer, router]);

  // Redirect if not in playing phase
  useEffect(() => {
    if (gamePhase === "voting") router.replace("/game/vote");
    if (gamePhase === "scoreboard") router.replace("/game/scoreboard");
  }, [gamePhase, router]);

  // Timer logic
  useEffect(() => {
    if (!started) return;
    if (timeLeft <= 0) {
      setFlashing(true);
      return;
    }
    intervalRef.current = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [started, timeLeft]);

  // When timer ends, start flashing
  useEffect(() => {
    if (timeLeft <= 0 && started) {
      setFlashing(true);
    }
  }, [timeLeft, started]);

  const handleStart = () => {
    setStarted(true);
  };

  // Oylama başlat
  const handleVote = () => {
    setGamePhase("voting");
    setVotingIndex(0);
  };

  // Oy verme işlemi
  const handlePlayerVote = (toId: number) => {
    setVotes([...votes, { from: players[votingIndex].id, to: toId }]);
    if (votingIndex < players.length - 1) {
      setVotingIndex(votingIndex + 1);
    } else {
      setGamePhase("scoreboard");
      setShowScore(true);
    }
  };

  // Skor ekranı için kazananı belirle
  useEffect(() => {
    if (gamePhase === "scoreboard" && votes.length === players.length) {
      // En çok oy alanı bul
      const voteCounts: Record<number, number> = {};
      votes.forEach((v) => {
        voteCounts[v.to] = (voteCounts[v.to] || 0) + 1;
      });
      const maxVotes = Math.max(...Object.values(voteCounts));
      const mostVoted = Object.keys(voteCounts).filter(
        (id) => voteCounts[Number(id)] === maxVotes
      );
      // Eğer spy en çok oy aldıysa siviller kazandı
      const spy = players.find((p) => p.role === "spy");
      if (spy && mostVoted.includes(String(spy.id))) {
        setWinner("civilians");
      } else {
        setWinner("spy");
      }
    }
  }, [gamePhase, votes, players, setWinner]);

  // Yeni Oyun/Devam Et modalı aç
  const handleNewGame = () => {
    setShowModal(true);
  };

  // Modal: Yeni Oyun
  const handleFullReset = async () => {
    setShowModal(false);
    await saveUsernamesToBlob([]); // Kullanıcı listesini blob'dan sil
    resetGame();
    router.push("/");
  };

  // Modal: Devam Et
  const handleContinue = () => {
    setShowModal(false);
    setContinueStep(true);
  };

  // Devam Et: yeni bölüm ve süre seçimi sonrası başlat
  const handleContinueStart = () => {
    // Yeni kelime havuzundan tekrar etmeyen bir kelime seç
    // (örnek: bölüm1.json'dan, usedWords içinde olmayan bir kelime)
    // Burada örnek olarak sabit bir kelime atanıyor, gerçek uygulamada JSON'dan çekilmeli
    const allWords = ["Kütüphane", "Plaj", "Uzay Üssü", "Restoran", "Hastane"];
    const available = allWords.filter((w) => !usedWords.includes(w));
    const newWord =
      available[Math.floor(Math.random() * available.length)] || "Kütüphane";
    setUsedWords([...usedWords, newWord]);
    continueGame(newWord, newTimer);
    setContinueStep(false);
    setShowScore(false);
    setStarted(false);
    setTimeLeft(newTimer);
  };

  // Oylama ekranı
  if (gamePhase === "voting") {
    const currentPlayer = players[votingIndex];
    const alreadyVoted = votes.some((v) => v.from === currentPlayer.id);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
        <h2 className="text-2xl font-bold mb-4">
          {currentPlayer.name} oy veriyor
        </h2>
        <div className="flex flex-col gap-2">
          {players
            .filter((p) => p.id !== currentPlayer.id)
            .map((p) => (
              <button
                key={p.id}
                className="px-6 py-3 rounded bg-white text-black font-bold mb-2"
                disabled={alreadyVoted}
                onClick={() => handlePlayerVote(p.id)}
              >
                {p.name}
              </button>
            ))}
        </div>
        {alreadyVoted && (
          <div className="mt-4 text-green-400">
            Oy verildi, sıradaki oyuncuya geçiliyor...
          </div>
        )}
      </div>
    );
  }

  // Skor ekranı
  if (showScore || gamePhase === "scoreboard") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
        <h2 className="text-3xl font-bold mb-6">Oyun Sonu</h2>
        <div className="mb-4">
          Kazanan:{" "}
          <span className="font-bold">
            {players.find((p) => p.role === "spy")?.name}
          </span>
        </div>
        <div className="mb-8">Oylama Sonuçları:</div>
        <ul className="mb-8">
          {players.map((p) => (
            <li key={p.id}>
              {p.name}: {votes.filter((v) => v.to === p.id).length} oy
            </li>
          ))}
        </ul>
        <button
          className="px-8 py-4 rounded-full bg-white text-black font-bold text-lg shadow-lg hover:bg-gray-200"
          onClick={handleNewGame}
        >
          Yeni Oyun
        </button>
        <AlertDialog open={showModal} onOpenChange={setShowModal}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Yeni Oyun Başlat</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={handleContinue}>
                Devam Et
              </AlertDialogAction>
              <AlertDialogCancel onClick={handleFullReset}>
                Tamamen Sıfırla
              </AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        {continueStep && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
            <div className="bg-black border border-white rounded-2xl p-6 shadow-2xl w-[95vw] max-w-sm flex flex-col items-center animate-grow text-white relative">
              <h3 className="text-xl font-bold mb-4 mt-2">Bölüm ve Süre Seç</h3>
              <input
                type="number"
                min={10}
                max={600}
                value={newTimer}
                onChange={(e) => setNewTimer(Number(e.target.value))}
                className="w-full px-4 py-3 border border-white bg-black text-white rounded text-lg text-center mb-4"
              />
              <button
                className="w-full px-8 py-3 rounded-full bg-white text-black font-bold text-lg shadow-lg hover:bg-gray-200 mb-2"
                onClick={handleContinueStart}
              >
                Devam Et
              </button>
              <button
                className="w-full px-8 py-3 rounded-full bg-gray-700 text-white font-bold text-lg shadow-lg hover:bg-gray-600"
                onClick={() => setContinueStep(false)}
              >
                Vazgeç
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen w-full transition-colors duration-200 ${
        flashing ? "bg-black animate-flash" : "bg-black"
      }`}
      style={{ fontFamily: "var(--font-geist-sans)" }}
    >
      <style jsx global>{`
        @keyframes flash {
          0%,
          100% {
            background: #000;
          }
          50% {
            background: #b91c1c;
          }
        }
        .animate-flash {
          animation: flash 0.7s infinite;
        }
      `}</style>
      {!started ? (
        <button
          className="w-full max-w-xs px-8 py-4 rounded-full bg-white text-black font-bold text-2xl shadow-lg hover:bg-gray-200 transition-colors duration-200 mb-8"
          onClick={handleStart}
        >
          Başla
        </button>
      ) : timeLeft > 0 ? (
        <>
          <div className="text-5xl font-bold mb-6 text-white">{timeLeft}</div>
          <div className="text-lg text-gray-300 mb-2">
            Süre dolunca oylama başlayacak
          </div>
        </>
      ) : (
        <button
          className="w-full max-w-xs px-8 py-4 rounded-full bg-red-600 text-white font-bold text-2xl shadow-lg hover:bg-red-700 transition-colors duration-200 animate-pulse"
          onClick={handleVote}
        >
          Oy ver
        </button>
      )}
    </div>
  );
}
