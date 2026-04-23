export function EmptyState({ texto }: { texto: string }) {
  return (
    <div className="rounded-3xl px-5 py-10 text-center" style={{ background: "#f5f5f4", border: "2px solid #e7e5e4" }}>
      <p className="text-sm" style={{ color: "#a8a29e" }}>{texto}</p>
    </div>
  );
}