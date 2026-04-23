import type { ReactNode } from "react";

const GRADIENTS: Record<string, string> = {
  blue: "linear-gradient(135deg, #dbeafe, #bfdbfe)",
  green: "linear-gradient(135deg, #d1fae5, #a7f3d0)",
  purple: "linear-gradient(135deg, #ede9fe, #ddd6fe)",
  orange: "linear-gradient(135deg, #ffedd5, #fed7aa)",
  indigo: "linear-gradient(135deg, #e0e7ff, #c7d2fe)",
  teal: "linear-gradient(135deg, #ccfbf1, #99f6e4)",
  amber: "linear-gradient(135deg, #fef3c7, #fde68a)",
};

const ICON_BG: Record<string, string> = {
  blue: "rgba(255,255,255,0.65)",
  green: "rgba(255,255,255,0.65)",
  purple: "rgba(255,255,255,0.65)",
  orange: "rgba(255,255,255,0.65)",
  indigo: "rgba(255,255,255,0.65)",
  teal: "rgba(255,255,255,0.65)",
  amber: "rgba(255,255,255,0.65)",
};

const TEXT_COLORS: Record<string, string> = {
  blue: "#1d4ed8",
  green: "#065f46",
  purple: "#5b21b6",
  orange: "#c2410c",
  indigo: "#3730a3",
  teal: "#0f766e",
  amber: "#92400e",
};

const ICON_COLORS: Record<string, string> = {
  blue: "#2563eb",
  green: "#059669",
  purple: "#7c3aed",
  orange: "#ea580c",
  indigo: "#4338ca",
  teal: "#0d9488",
  amber: "#d97706",
};

interface CategoryButtonProps {
  label: string;
  color?: "blue" | "green" | "purple" | "orange" | "indigo" | "teal" | "amber";
  icon?: ReactNode;
  onClick?: () => void;
}

export function CategoryButton({
  label,
  color = "blue",
  icon,
  onClick,
}: CategoryButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full font-semibold rounded-3xl px-5 py-4 text-left flex items-center gap-4 shadow-sm transition-all duration-150 active:scale-[0.97] select-none border-0"
      style={{ background: GRADIENTS[color] }}
    >
      {icon && (
        <span
          className="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{ background: ICON_BG[color], color: ICON_COLORS[color] }}
        >
          {icon}
        </span>
      )}
      <span
        className="text-base font-bold leading-snug flex-1"
        style={{ color: TEXT_COLORS[color] }}
      >
        {label}
      </span>
      <svg
        className="ml-auto flex-shrink-0 w-5 h-5"
        fill="none"
        stroke={TEXT_COLORS[color]}
        viewBox="0 0 24 24"
        style={{ opacity: 0.5 }}
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
