interface FolderLinkProps {
  label: string;
  onClick?: () => void;
}

export function FolderLink({ label, onClick }: FolderLinkProps) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-3xl px-5 py-4 flex items-center gap-4 shadow-sm transition-all duration-150 active:scale-[0.97] select-none text-left"
      style={{ border: "2px solid #e7e5e4" }}
    >
      <span
        className="flex-shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center"
        style={{ background: "#fef3c7" }}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="#d97706"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
          />
        </svg>
      </span>
      <span className="text-sm font-bold flex-1" style={{ color: "#1c1917" }}>
        {label}
      </span>
      <svg
        className="w-5 h-5 flex-shrink-0"
        fill="none"
        stroke="#d4d2cf"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.5}
          d="M9 5l7 7-7 7"
        />
      </svg>
    </button>
  );
}
