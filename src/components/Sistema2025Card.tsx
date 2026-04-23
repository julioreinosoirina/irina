interface Sistema2025CardProps {
  onClick?: () => void;
}

export function Sistema2025Card({ onClick }: Sistema2025CardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-3xl overflow-hidden shadow-sm active:scale-[0.97] transition-all duration-150 select-none text-left"
      style={{ border: "2px solid #fed7aa" }}
    >
      <div
        className="flex items-center gap-2 px-4 py-2"
        style={{ background: "#f97316" }}
      >
        <svg
          className="flex-shrink-0 w-3.5 h-3.5"
          fill="none"
          stroke="#fff"
          strokeWidth={2.5}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <span
          className="text-xs font-extrabold uppercase tracking-wide"
          style={{ color: "#fff" }}
        >
          Acceso a información del año anterior
        </span>
      </div>
      <div
        className="flex items-center gap-3 px-4 py-3.5"
        style={{ background: "#fff7ed" }}
      >
        <span
          className="flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center"
          style={{ background: "#ffedd5" }}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="#c2410c"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
            />
          </svg>
        </span>
        <div className="flex-1 min-w-0">
          <p
            className="text-sm font-extrabold"
            style={{ color: "#7c2d12" }}
          >
            Sistema Anterior Año 2025
          </p>
          <p className="text-xs mt-0.5" style={{ color: "#c2410c" }}>
            Solo lectura · No modifica el ciclo 2026
          </p>
        </div>
        <svg
          className="w-5 h-5 flex-shrink-0"
          fill="none"
          stroke="#fed7aa"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </button>
  );
}
