import type { DriveItem } from "../types";

const DRIVE_API = "https://www.googleapis.com/drive/v3/files";
const UPLOAD_API = "https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable";

export async function listFiles(folderId: string, token: string): Promise<DriveItem[]> {
  const q = encodeURIComponent(`'${folderId}' in parents and trashed = false`);
  const fields = encodeURIComponent("files(id,name,mimeType,size,modifiedTime,webViewLink)");
  const url = `${DRIVE_API}?q=${q}&fields=${fields}&orderBy=folder,name_natural`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error("No se pudieron listar archivos");
  const data = (await res.json()) as { files: DriveItem[] };
  return data.files;
}

export async function renameFile(fileId: string, newName: string, token: string): Promise<void> {
  const res = await fetch(`${DRIVE_API}/${fileId}`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ name: newName }),
  });
  if (!res.ok) throw new Error("No se pudo renombrar");
}

export async function deleteFile(fileId: string, token: string): Promise<void> {
  const res = await fetch(`${DRIVE_API}/${fileId}`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ trashed: true }),
  });
  if (!res.ok) throw new Error("No se pudo eliminar");
}

export async function uploadFile(
  folderId: string,
  file: File,
  token: string,
  onProgress?: (value: number) => void,
): Promise<void> {
  const start = await fetch(UPLOAD_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json; charset=UTF-8",
      "X-Upload-Content-Type": file.type || "application/octet-stream",
      "X-Upload-Content-Length": String(file.size),
    },
    body: JSON.stringify({ name: file.name, parents: [folderId] }),
  });
  if (!start.ok) throw new Error("No se pudo iniciar subida");
  const location = start.headers.get("Location");
  if (!location) throw new Error("No se obtuvo URL de subida");

  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", location);
    xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress?.(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error("Fallo en subida")));
    xhr.onerror = () => reject(new Error("Error de red al subir archivo"));
    xhr.send(file);
  });
}

export function getFileUrl(id: string, mimeType: string): string {
  if (mimeType === "application/vnd.google-apps.folder") return `https://drive.google.com/drive/folders/${id}`;
  if (mimeType.startsWith("image/") || mimeType === "application/pdf") return `https://drive.google.com/file/d/${id}/view`;
  return `https://drive.google.com/open?id=${id}`;
}
