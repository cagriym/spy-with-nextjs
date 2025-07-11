"use client";

export default function MobileAppBar({
  title,
  onBack,
  onNext,
  nextLabel,
}: {
  title: string;
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
}) {
  return (
    <header
      className="fixed top-0 left-0 w-full h-14 flex items-center justify-between px-2 z-50"
      style={{
        background: "#000",
        color: "#fff",
        borderBottom: "1px solid #222",
      }}
    >
      <div className="flex-1 flex items-center">
        {onBack ? (
          <button
            onClick={onBack}
            className="text-white text-2xl font-bold bg-transparent border-none focus:outline-none px-2 py-1"
            aria-label="Geri dön"
          >
            ←
          </button>
        ) : (
          <span className="w-8" />
        )}
      </div>
      <div className="flex-1 flex items-center justify-center">
        <span
          className="text-base font-semibold truncate"
          style={{ color: "#fff" }}
        >
          {title}
        </span>
      </div>
      <div className="flex-1 flex items-center justify-end">
        {onNext && nextLabel ? (
          <button
            onClick={onNext}
            className="text-black bg-white rounded-full px-4 py-1 font-bold text-base shadow hover:bg-gray-200 transition-colors"
            aria-label={nextLabel}
          >
            {nextLabel}
          </button>
        ) : (
          <span className="w-8" />
        )}
      </div>
    </header>
  );
}
