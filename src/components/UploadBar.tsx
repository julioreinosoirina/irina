import { useRef, useState } from "react";

interface UploadBarProps {
  folderId: string;
  token: string;
  onUploaded?: () => void;
  onUpload?: (file: File, onProgress: (value: number) => void) => Promise<void>;
}

function UploadIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
      />
    </svg>
  );
}

export function UploadBar({ onUploaded, onUpload }: UploadBarProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [successName, setSuccessName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const docsRef = useRef<HTMLInputElement>(null);
  const mediaRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !onUpload) return;

    setIsUploading(true);
    setProgress(0);
    setSuccessName(null);
    setError(null);

    try {
      await onUpload(file, (value) => setProgress(value));
      setSuccessName(file.name);
      onUploaded?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir el archivo");
    } finally {
      setIsUploading(false);
      if (docsRef.current) docsRef.current.value = "";
      if (mediaRef.current) mediaRef.current.value = "";
    }
  }

  return (
    <div className="mb-5">
      <input
        ref={docsRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.rtf,.odt,.ods,.odp,.zip,.rar"
      />
      <input
        ref={mediaRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
        accept="image/*,video/*,audio/*"
      />

      {isUploading ? (
        <div
          className="w-full py-4 rounded-3xl font-bold text-sm flex items-center justify-center gap-3"
          style={{ background: "#fde68a", color: "#92400e" }}
        >
          <div
            className="w-4 h-4 border-2 rounded-full animate-spin"
            style={{
              borderColor: "rgba(146,64,14,.3)",
              borderTopColor: "#92400e",
            }}
          />
          Subiendo... {progress}%
        </div>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={() => {
              setSuccessName(null);
              setError(null);
              docsRef.current?.click();
            }}
            className="flex-1 py-3 rounded-3xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
            style={{
              background: "linear-gradient(135deg, #f59e0b, #d97706)",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(245,158,11,0.35)",
            }}
          >
            <UploadIcon />
            Documentos
          </button>
          <button
            onClick={() => {
              setSuccessName(null);
              setError(null);
              mediaRef.current?.click();
            }}
            className="flex-1 py-3 rounded-3xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(124,58,237,0.35)",
            }}
          >
            <UploadIcon />
            Fotos / Video
          </button>
        </div>
      )}

      {isUploading && (
        <div
          className="mt-2 h-1.5 rounded-full overflow-hidden"
          style={{ background: "#fde68a" }}
        >
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${progress}%`, background: "#f59e0b" }}
          />
        </div>
      )}

      {successName && (
        <p
          className="text-xs font-semibold text-center mt-2"
          style={{ color: "#16a34a" }}
        >
          ✓ "{successName}" subido correctamente
        </p>
      )}

      {error && (
        <p
          className="text-xs font-semibold text-center mt-2"
          style={{ color: "#dc2626" }}
        >
          ✗ {error}
        </p>
      )}
    </div>
  );
}
