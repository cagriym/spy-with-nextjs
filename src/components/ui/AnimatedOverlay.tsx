"use client";
import { ReactNode, useEffect, useState, useRef } from "react";

export default function AnimatedOverlay({
  open,
  children,
  onExit,
  direction = "left",
}: {
  open: boolean;
  children: ReactNode;
  onExit?: () => void;
  direction?: "left" | "right";
}) {
  const [visible, setVisible] = useState(open);
  const [exiting, setExiting] = useState(false);
  const exitTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (open) {
      setVisible(true);
      setExiting(false);
    } else if (!open && visible) {
      setExiting(true);
      exitTimeout.current = setTimeout(() => {
        setVisible(false);
        setExiting(false);
        if (onExit) onExit();
      }, 120);
    }
    return () => {
      if (exitTimeout.current) clearTimeout(exitTimeout.current);
    };
  }, [open, onExit, visible]);

  // direction='left': ileri (slide out left), direction='right': geri (slide out right)
  const getTranslateClass = () => {
    if (open && !exiting) return "translate-x-0";
    if (direction === "left") return "-translate-x-full"; // ileri
    return "translate-x-full"; // geri
  };

  return (
    <>
      {visible && (
        <div
          className={`fixed inset-0 z-40 flex items-center justify-center transition-all duration-120 ${
            open && !exiting
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
          style={{
            background: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(2px)",
            fontFamily: "var(--font-geist-sans)",
          }}
        >
          <div
            className={`relative w-full max-w-xl mx-auto transition-transform duration-120 ${getTranslateClass()}`}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </div>
        </div>
      )}
      <style jsx global>{`
        .transition-all {
          transition-property: opacity, transform;
        }
      `}</style>
    </>
  );
}
