export function Loading({ texto }: { texto: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="w-10 h-10 border-4 rounded-full animate-spin" style={{ borderColor: "#fde68a", borderTopColor: "#f59e0b" }} />
      <p className="text-sm" style={{ color: "#a8a29e" }}>{texto}</p>
    </div>
  );
}