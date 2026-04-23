import type { DriveItem } from "../types";

const cache = new Map<string, DriveItem[]>();
const DRIVE_API = "https://www.googleapis.com/drive/v3/files";

const key = (parentId: string) => `subfolders:${parentId}`;

async function driveFetch<T>(url: string, token: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) throw new Error(`Drive API error ${res.status}`);
  return (await res.json()) as T;
}

export async function listSubfolders(parentId: string, token: string): Promise<DriveItem[]> {
  const cacheKey = key(parentId);
  if (cache.has(cacheKey)) return cache.get(cacheKey)!;
  const q = encodeURIComponent(`'${parentId}' in parents and trashed = false and mimeType = 'application/vnd.google-apps.folder'`);
  const url = `${DRIVE_API}?q=${q}&fields=files(id,name,mimeType)&orderBy=name_natural`;
  const data = await driveFetch<{ files: DriveItem[] }>(url, token);
  cache.set(cacheKey, data.files);
  return data.files;
}

export async function findFolder(parentId: string, name: string, token: string): Promise<DriveItem | null> {
  const folders = await listSubfolders(parentId, token);
  return folders.find((f) => f.name.trim().toLowerCase() === name.trim().toLowerCase()) ?? null;
}

export async function resolvePath(path: string[], token: string, rootId: string): Promise<string | null> {
  let current = rootId;
  for (const segment of path) {
    const folder = await findFolder(current, segment, token);
    if (!folder) return null;
    current = folder.id;
  }
  return current;
}

export async function resolveAreaLinks(path: string[], folderName: string, token: string, rootId: string): Promise<DriveItem[]> {
  const parent = await resolvePath(path, token, rootId);
  if (!parent) return [];
  const folder = await findFolder(parent, folderName, token);
  if (!folder) return [];
  return listSubfolders(folder.id, token);
}

export function clearDriveCache() {
  cache.clear();
}
