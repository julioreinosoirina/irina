export function ErrorMessage({ mensaje, onRetry }: { mensaje: string; onRetry: () => void }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-3xl px-5 py-6 text-center space-y-3">
      <p className="text-red-700 text-sm leading-relaxed">{mensaje}</p>
      <button onClick={onRetry} className="text-sm underline" style={{ color: "#f59e0b" }}>
        Reintentar
      </button>
    </div>
  );
}