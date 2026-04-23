import { useState } from "react";
import type { DriveItem } from "../types";
import { getFileUrl } from "../services/driveFiles";

interface FileItemProps {
  item: DriveItem;
  token: string;
  onRename?: (fileId: string, newName: string) => Promise<void>;
  onDelete?: (fileId: string) => Promise<void>;
}

function formatSize(bytes?: string): string {
  if (!bytes) return "";
  const size = parseInt(bytes, 10);
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(0)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function FileIcon({ mimeType }: { mimeType: string }) {
  if (mimeType.includes("pdf")) {
    return (
      <svg className="w-4 h-4" fill="none" stroke="#dc2626" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    );
  }
  if (mimeType.includes("image")) {
    return (
      <svg className="w-4 h-4" fill="none" stroke="#7c3aed" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    );
  }
  if (mimeType.includes("spreadsheet") || mimeType.includes("excel")) {
    return (
      <svg className="w-4 h-4" fill="none" stroke="#16a34a" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18M10 3v18M6 3h12a1 1 0 011 1v16a1 1 0 01-1 1H6a1 1 0 01-1-1V4a1 1 0 011-1z" />
      </svg>
    );
  }
  if (mimeType.includes("document") || mimeType.includes("word")) {
    return (
      <svg className="w-4 h-4" fill="none" stroke="#2563eb" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    );
  }
  return (
    <svg className="w-4 h-4" fill="none" stroke="#78716c" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
    </svg>
  );
}

export function FileItem({ item, onRename, onDelete }: FileItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [newName, setNewName] = useState(item.name);
  const [isLoading, setIsLoading] = useState(false);

  const fileUrl = getFileUrl(item.id, item.mimeType);

  async function handleRename() {
    const trimmed = newName.trim();
    if (!trimmed || trimmed === item.name) {
      setIsEditing(false);
      setNewName(item.name);
      return;
    }
    setIsLoading(true);
    try {
      await onRename?.(item.id, trimmed);
    } catch {
      setNewName(item.name);
    } finally {
      setIsLoading(false);
      setIsEditing(false);
    }
  }

  async function handleDelete() {
    setIsLoading(true);
    try {
      await onDelete?.(item.id);
    } finally {
      setIsLoading(false);
      setIsConfirmingDelete(false);
    }
  }

  if (isConfirmingDelete) {
    return (
      <div
        className="w-full bg-white rounded-2xl px-4 py-3"
        style={{ border: "1px solid #fca5a5" }}
      >
        <p className="text-sm font-semibold text-center mb-3" style={{ color: "#dc2626" }}>
          ¿Eliminar "{item.name}"?
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setIsConfirmingDelete(false)}
            disabled={isLoading}
            className="flex-1 py-2 rounded-xl text-sm font-semibold"
            style={{ background: "#f5f5f4", color: "#57534e" }}
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="flex-1 py-2 rounded-xl text-sm font-bold"
            style={{ background: "#dc2626", color: "#fff" }}
          >
            {isLoading ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div
        className="w-full bg-white rounded-2xl px-4 py-3"
        style={{ border: "1px solid #d4d2cf" }}
      >
        <input
          className="w-full text-sm font-semibold px-3 py-2 rounded-xl mb-3 outline-none"
          style={{
            border: "1.5px solid #f59e0b",
            color: "#1c1917",
            background: "#fffbeb",
          }}
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleRename();
            if (e.key === "Escape") {
              setIsEditing(false);
              setNewName(item.name);
            }
          }}
          autoFocus
        />
        <div className="flex gap-2">
          <button
            onClick={() => {
              setIsEditing(false);
              setNewName(item.name);
            }}
            disabled={isLoading}
            className="flex-1 py-2 rounded-xl text-sm font-semibold"
            style={{ background: "#f5f5f4", color: "#57534e" }}
          >
            Cancelar
          </button>
          <button
            onClick={handleRename}
            disabled={isLoading}
            className="flex-1 py-2 rounded-xl text-sm font-bold"
            style={{ background: "#f59e0b", color: "#fff" }}
          >
            {isLoading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full bg-white rounded-2xl"
      style={{ border: "1px solid #e7e5e4" }}
    >
      <a
        href={fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 px-4 py-3 transition-all active:scale-[0.97]"
        style={{ textDecoration: "none", display: "flex" }}
      >
        <span
          className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: "#f5f5f4" }}
        >
          <FileIcon mimeType={item.mimeType} />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate" style={{ color: "#1c1917" }}>
            {item.name}
          </p>
          <p className="text-xs mt-0.5" style={{ color: "#a8a29e" }}>
            {[formatSize(item.size), formatDate(item.modifiedTime)]
              .filter(Boolean)
              .join(" · ")}
          </p>
        </div>
        <svg
          className="w-4 h-4 flex-shrink-0"
          fill="none"
          stroke="#d4d2cf"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      </a>
      {(onRename || onDelete) && (
        <div
          className="flex border-t"
          style={{ borderColor: "#f0efee" }}
        >
          {onRename && (
            <button
              onClick={() => {
                setNewName(item.name);
                setIsEditing(true);
              }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold transition-colors"
              style={{
                color: "#78716c",
                background: "transparent",
                border: "none",
                cursor: "pointer",
              }}
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
              Renombrar
            </button>
          )}
          {onRename && onDelete && (
            <div style={{ width: "1px", background: "#f0efee" }} />
          )}
          {onDelete && (
            <button
              onClick={() => setIsConfirmingDelete(true)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold transition-colors"
              style={{
                color: "#dc2626",
                background: "transparent",
                border: "none",
                cursor: "pointer",
              }}
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Eliminar
            </button>
          )}
        </div>
      )}
    </div>
  );
}
