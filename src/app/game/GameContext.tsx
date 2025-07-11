"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

export type Player = {
  id: number;
  name: string;
  role: "spy" | "civilian";
};

export type Vote = { from: number; to: number };

export type GameState = {
  players: Player[];
  selectedPlace: string;
  spyId: number;
  mode: "two" | "multi";
  timer: number;
  currentRevealIndex: number;
  gamePhase: "playing" | "voting" | "scoreboard";
  votes: Vote[];
  winner: "spy" | "civilians" | null;
  usedWords: string[]; // yeni eklendi
  votingIndex: number; // yeni eklendi: oylama sırası
};

type GameContextType = GameState & {
  setPlayers: (players: Player[]) => void;
  setSelectedPlace: (place: string) => void;
  setSpyId: (id: number) => void;
  setMode: (mode: "two" | "multi") => void;
  setTimer: (timer: number) => void;
  setCurrentRevealIndex: (idx: number) => void;
  setGamePhase: (phase: "playing" | "voting" | "scoreboard") => void;
  setVotes: (votes: Vote[]) => void;
  setWinner: (winner: "spy" | "civilians" | null) => void;
  resetGame: () => void;
  setUsedWords: (words: string[]) => void; // yeni eklendi
  setVotingIndex: (idx: number) => void; // yeni eklendi
  continueGame: (newPlace: string, timer: number) => void; // yeni eklendi
};

const defaultState: GameState = {
  players: [],
  selectedPlace: "",
  spyId: -1,
  mode: "multi",
  timer: 300,
  currentRevealIndex: 0,
  gamePhase: "playing",
  votes: [],
  winner: null,
  usedWords: [],
  votingIndex: 0,
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [players, setPlayers] = useState<Player[]>(defaultState.players);
  const [selectedPlace, setSelectedPlace] = useState(
    defaultState.selectedPlace
  );
  const [spyId, setSpyId] = useState(defaultState.spyId);
  const [mode, setMode] = useState<"two" | "multi">(defaultState.mode);
  const [timer, setTimer] = useState(defaultState.timer);
  const [currentRevealIndex, setCurrentRevealIndex] = useState(
    defaultState.currentRevealIndex
  );
  const [gamePhase, setGamePhase] = useState<
    "playing" | "voting" | "scoreboard"
  >(defaultState.gamePhase);
  const [votes, setVotes] = useState<Vote[]>(defaultState.votes);
  const [winner, setWinner] = useState<"spy" | "civilians" | null>(
    defaultState.winner
  );
  const [usedWords, setUsedWords] = useState<string[]>(defaultState.usedWords);
  const [votingIndex, setVotingIndex] = useState<number>(
    defaultState.votingIndex
  );

  // Persist to localStorage
  useEffect(() => {
    const data = {
      players,
      selectedPlace,
      spyId,
      mode,
      timer,
      currentRevealIndex,
      gamePhase,
      votes,
      winner,
      usedWords,
      votingIndex,
    };
    localStorage.setItem("spy-game-state", JSON.stringify(data));
  }, [
    players,
    selectedPlace,
    spyId,
    mode,
    timer,
    currentRevealIndex,
    gamePhase,
    votes,
    winner,
    usedWords,
    votingIndex,
  ]);

  // Rehydrate from localStorage
  useEffect(() => {
    const data = localStorage.getItem("spy-game-state");
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (parsed.players) setPlayers(parsed.players);
        if (parsed.selectedPlace) setSelectedPlace(parsed.selectedPlace);
        if (typeof parsed.spyId === "number") setSpyId(parsed.spyId);
        if (parsed.mode) setMode(parsed.mode);
        if (typeof parsed.timer === "number") setTimer(parsed.timer);
        if (typeof parsed.currentRevealIndex === "number")
          setCurrentRevealIndex(parsed.currentRevealIndex);
        if (parsed.gamePhase) setGamePhase(parsed.gamePhase);
        if (Array.isArray(parsed.votes)) setVotes(parsed.votes);
        if (
          parsed.winner === "spy" ||
          parsed.winner === "civilians" ||
          parsed.winner === null
        )
          setWinner(parsed.winner);
        if (Array.isArray(parsed.usedWords)) setUsedWords(parsed.usedWords);
        if (typeof parsed.votingIndex === "number")
          setVotingIndex(parsed.votingIndex);
      } catch {}
    }
  }, []);

  const resetGame = () => {
    setPlayers([]);
    setSelectedPlace("");
    setSpyId(-1);
    setMode("multi");
    setTimer(300);
    setCurrentRevealIndex(0);
    setGamePhase("playing");
    setVotes([]);
    setWinner(null);
    setUsedWords([]);
    setVotingIndex(0);
    localStorage.removeItem("spy-game-state");
  };

  // Devam Et fonksiyonu
  const continueGame = (newPlace: string, timer: number) => {
    setSelectedPlace(newPlace);
    setTimer(timer);
    setCurrentRevealIndex(0);
    setGamePhase("playing");
    setVotes([]);
    setWinner(null);
    setVotingIndex(0);
  };

  return (
    <GameContext.Provider
      value={{
        players,
        selectedPlace,
        spyId,
        mode,
        timer,
        currentRevealIndex,
        gamePhase,
        votes,
        winner,
        setPlayers,
        setSelectedPlace,
        setSpyId,
        setMode,
        setTimer,
        setCurrentRevealIndex,
        setGamePhase,
        setVotes,
        setWinner,
        resetGame,
        usedWords,
        setUsedWords,
        votingIndex,
        setVotingIndex,
        continueGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGameContext() {
  const ctx = useContext(GameContext);
  if (!ctx)
    throw new Error("useGameContext must be used within a GameProvider");
  return ctx;
}
