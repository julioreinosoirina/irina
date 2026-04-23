import { useEffect, useMemo, useState } from "react";
import {
  CET_CATEGORIES,
  INCLUSION_CATEGORIES,
  INCLUSION_LEVELS,
  ROOT_FOLDER_ID,
  SYSTEM_2025_FOLDER_ID,
} from "../config";
import type { DriveItem, NavState } from "../types";
import { clearDriveCache, listSubfolders, resolvePath, resolveAreaLinks } from "../services/driveService";
import { listFiles, uploadFile, renameFile, deleteFile } from "../services/driveFiles";
import { Header } from "./Header";
import { CategoryButton } from "./CategoryButton";
import { FolderLink } from "./FolderLink";
import { FileItem } from "./FileItem";
import { UploadBar } from "./UploadBar";
import { Sistema2025Card } from "./Sistema2025Card";
import { SectionLabel } from "./SectionLabel";
import { Loading } from "./ui/Loading";
import { ErrorMessage } from "./ui/ErrorMessage";
import { EmptyState } from "./ui/EmptyState";

// Icons
function SchoolIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422A12.083 12.083 0 0121 13c0 6.075-4.925 11-11 11S1 19.075 1 13c0-.937.117-1.848.34-2.717L12 14z" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  );
}

function ChildrenIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="7" r="4" strokeWidth={2} />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

function StudentIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  );
}

function FolderGenericIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
    </svg>
  );
}

interface MainAppProps {
  userEmail: string;
  token: string;
  onLogout: () => void;
}

export function MainApp({ userEmail, token, onLogout }: MainAppProps) {
  const [stack, setStack] = useState<NavState[]>([{ kind: "inicio" }]);
  const [folders, setFolders] = useState<DriveItem[]>([]);
  const [files, setFiles] = useState<DriveItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const current = stack[stack.length - 1];

  const push = (s: NavState) => {
    setStack((p) => [...p, s]);
    setFolders([]);
    setFiles([]);
    setError(null);
  };

  const pop = () => {
    if (stack.length > 1) {
      setStack((p) => p.slice(0, -1));
      setFolders([]);
      setFiles([]);
      setError(null);
    }
  };

  const refresh = () => {
    clearDriveCache();
    setRefreshKey((k) => k + 1);
  };

  const { title, subtitle } = useMemo(() => {
    switch (current.kind) {
      case "inicio":
        return { title: "Instituto Irina", subtitle: "Seleccioná una sección" };
      case "cet_sector":
        return { title: "CET", subtitle: "Seleccioná el sector" };
      case "cet_turno":
        return { title: current.path[current.path.length - 1] || "Turno", subtitle: "Seleccioná el turno" };
      case "cet_alumnos":
        return { title: `${current.path[1] || ""} · ${current.path[2] || ""}`, subtitle: "Seleccioná un alumno" };
      case "cet_categorias":
        return { title: current.alumno || "Categorías", subtitle: `${current.path[1] || ""} · ${current.path[2] || ""}` };
      case "cet_areas":
        return { title: current.categoria || "Áreas", subtitle: current.alumno || "" };
      case "inclusion_grupos":
        return { title: "INCLUSION", subtitle: "Seleccioná una sección" };
      case "inclusion_alumnos":
        return { title: current.nivel || "Alumnos", subtitle: "Seleccioná un alumno" };
      case "inclusion_categorias":
        return { title: current.alumno || "Categorías", subtitle: current.nivel || "" };
      case "folder_view":
        return { title: current.title, subtitle: "Archivos y carpetas" };
      default:
        return { title: "", subtitle: "" };
    }
  }, [current]);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      const needsLoad = [
        "cet_sector",
        "cet_alumnos",
        "cet_areas",
        "inclusion_grupos",
        "inclusion_alumnos",
        "inclusion_categorias",
        "folder_view",
      ].includes(current.kind);

      if (!needsLoad) return;

      setLoading(true);
      setError(null);
      setFolders([]);
      setFiles([]);

      try {
        if (current.kind === "cet_sector") {
          const cetId = await resolvePath(["CET"], token, ROOT_FOLDER_ID);
          if (!cetId) throw new Error("No se encontró la carpeta CET");
          const items = await listSubfolders(cetId, token);
          if (!cancelled) setFolders(items);
        } else if (current.kind === "cet_alumnos") {
          const path = ["CET", current.path[1], current.path[2], "EVALUACION ACTUAL"];
          const folderId = await resolvePath(path, token, ROOT_FOLDER_ID);
          if (!folderId) throw new Error(`No se encontró: ${path.join("/")}`);
          const items = await listSubfolders(folderId, token);
          if (!cancelled) setFolders(items);
        } else if (current.kind === "cet_areas") {
          const areas = await resolveAreaLinks(
            ["CET", current.path[1], current.path[2]],
            current.alumno,
            token,
            ROOT_FOLDER_ID
          );
          if (!cancelled) {
            if (areas.length === 0) {
              setError(`No se encontró la carpeta de ${current.alumno} en ${current.categoria}.`);
            } else {
              setFolders(areas);
            }
          }
        } else if (current.kind === "inclusion_grupos") {
          const incId = await resolvePath(["INCLUSION"], token, ROOT_FOLDER_ID);
          if (!incId) throw new Error("No se encontró la carpeta INCLUSION");
          const items = await listSubfolders(incId, token);
          if (!cancelled) setFolders(items);
        } else if (current.kind === "inclusion_alumnos") {
          const items = await listSubfolders(current.nivelId, token);
          if (!cancelled) setFolders(items);
        } else if (current.kind === "inclusion_categorias") {
          const items = await listSubfolders(current.alumnoId, token);
          if (!cancelled) setFolders(items);
        } else if (current.kind === "folder_view") {
          const items = await listFiles(current.folderId, token);
          if (!cancelled) {
            const subfolders = items.filter((i) => i.mimeType === "application/vnd.google-apps.folder");
            const files = items.filter((i) => i.mimeType !== "application/vnd.google-apps.folder");
            setFolders(subfolders);
            setFiles(files);
          }
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Error al conectar con Google Drive.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadData();
    return () => {
      cancelled = true;
    };
  }, [current, token, refreshKey]);

  const handleUpload = async (file: File, onProgress: (value: number) => void) => {
    if (current.kind !== "folder_view") return;
    await uploadFile(current.folderId, file, token, onProgress);
  };

  const handleRename = async (fileId: string, newName: string) => {
    await renameFile(fileId, newName, token);
    refresh();
  };

  const handleDelete = async (fileId: string) => {
    await deleteFile(fileId, token);
    refresh();
  };

  const showRefresh = [
    "cet_sector",
    "cet_alumnos",
    "cet_areas",
    "inclusion_grupos",
    "inclusion_alumnos",
    "folder_view",
  ].includes(current.kind);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#fafaf9" }}>
      <Header
        title={title}
        subtitle={subtitle}
        onBack={stack.length > 1 ? pop : undefined}
        onRefresh={showRefresh ? refresh : undefined}
        onLogout={onLogout}
        userEmail={userEmail}
      />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-6">
        {current.kind === "inicio" && (
          <div className="space-y-4">
            <CategoryButton
              label="CET"
              color="blue"
              icon={<SchoolIcon />}
              onClick={() => push({ kind: "cet_sector", path: ["CET"] })}
            />
            <CategoryButton
              label="INCLUSION"
              color="green"
              icon={<UsersIcon />}
              onClick={() => push({ kind: "inclusion_grupos", path: ["INCLUSION"] })}
            />
            <Sistema2025Card
              onClick={() =>
                push({
                  kind: "folder_view",
                  path: ["SISTEMA 2025"],
                  title: "Sistema Anterior Año 2025",
                  folderId: SYSTEM_2025_FOLDER_ID,
                  readOnly: true,
                })
              }
            />
          </div>
        )}

        {current.kind === "cet_sector" && (
          <div className="space-y-5">
            {loading && <Loading texto="Cargando secciones CET..." />}
            {error && <ErrorMessage mensaje={error} onRetry={refresh} />}
            {!loading && !error && folders.length === 0 && (
              <EmptyState texto="No se encontraron secciones." />
            )}
            {!loading && !error && folders.length > 0 && (
              <>
                {(() => {
                  const kids = folders.filter((f) =>
                    ["niños", "jovenes", "jóvenes"].includes(f.name.toLowerCase())
                  );
                  const others = folders.filter(
                    (f) => !["niños", "jovenes", "jóvenes"].includes(f.name.toLowerCase())
                  );
                  return (
                    <>
                      {kids.length > 0 && (
                        <div>
                          <SectionLabel texto="Sectores" />
                          <div className="space-y-3">
                            {kids.map((f) => (
                              <CategoryButton
                                key={f.id}
                                label={f.name}
                                color={f.name.toLowerCase().includes("ni") ? "teal" : "purple"}
                                icon={f.name.toLowerCase().includes("ni") ? <ChildrenIcon /> : <UserIcon />}
                                onClick={() =>
                                  push({ kind: "cet_turno", path: ["CET", f.name], sector: f.name })
                                }
                              />
                            ))}
                          </div>
                        </div>
                      )}
                      {others.length > 0 && (
                        <div>
                          <SectionLabel texto="Otras secciones" />
                          <div className="space-y-3">
                            {others.map((f) => (
                              <FolderLink
                                key={f.id}
                                label={f.name}
                                onClick={() =>
                                  push({
                                    kind: "folder_view",
                                    path: [...current.path, f.name],
                                    folderId: f.id,
                                    title: f.name,
                                  })
                                }
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()}
              </>
            )}
          </div>
        )}

        {current.kind === "cet_turno" && (
          <div className="space-y-4">
            <CategoryButton
              label="TURNO MAÑANA"
              color="orange"
              icon={<SunIcon />}
              onClick={() =>
                push({
                  kind: "cet_alumnos",
                  path: ["CET", current.path[1], "TURNO MAÑANA"],
                  sector: current.path[1],
                  turno: "TURNO MAÑANA",
                })
              }
            />
            <CategoryButton
              label="TURNO TARDE"
              color="indigo"
              icon={<MoonIcon />}
              onClick={() =>
                push({
                  kind: "cet_alumnos",
                  path: ["CET", current.path[1], "TURNO TARDE"],
                  sector: current.path[1],
                  turno: "TURNO TARDE",
                })
              }
            />
          </div>
        )}

        {current.kind === "cet_alumnos" && (
          <div className="space-y-3">
            {loading && <Loading texto="Cargando alumnos..." />}
            {error && <ErrorMessage mensaje={error} onRetry={refresh} />}
            {!loading && !error && folders.length === 0 && (
              <EmptyState texto="No se encontraron alumnos." />
            )}
            {!loading && !error &&
              folders.map((f) => (
                <CategoryButton
                  key={f.id}
                  label={f.name}
                  color="blue"
                  icon={<StudentIcon />}
                  onClick={() =>
                    push({
                      kind: "cet_categorias",
                      path: current.path,
                      sector: current.path[1],
                      turno: current.path[2],
                      alumno: f.name,
                    })
                  }
                />
              ))}
          </div>
        )}

        {current.kind === "cet_categorias" && (
          <div className="space-y-3">
            {CET_CATEGORIES.map((cat) => (
              <CategoryButton
                key={cat}
                label={cat}
                color="blue"
                icon={<FolderGenericIcon />}
                onClick={() =>
                  push({
                    kind: "cet_areas",
                    path: current.path,
                    sector: current.sector,
                    turno: current.turno,
                    alumno: current.alumno,
                    categoria: cat,
                  })
                }
              />
            ))}
          </div>
        )}

        {current.kind === "cet_areas" && (
          <div className="space-y-3">
            {loading && <Loading texto="Buscando carpeta..." />}
            {error && <ErrorMessage mensaje={error} onRetry={refresh} />}
            {!loading && !error && folders.length === 0 && (
              <EmptyState texto="No hay carpetas disponibles." />
            )}
            {!loading && !error &&
              folders.map((f) => (
                <FolderLink
                  key={f.id}
                  label={f.name}
                  onClick={() =>
                    push({
                      kind: "folder_view",
                      path: [...current.path, f.name],
                      folderId: f.id,
                      title: f.name,
                    })
                  }
                />
              ))}
          </div>
        )}

        {current.kind === "inclusion_grupos" && (
          <div className="space-y-5">
            {loading && <Loading texto="Cargando..." />}
            {error && <ErrorMessage mensaje={error} onRetry={refresh} />}
            {!loading && !error && folders.length === 0 && (
              <EmptyState texto="No se encontraron secciones." />
            )}
            {!loading && !error && (
              <>
                {(() => {
                  const levels = INCLUSION_LEVELS.map((l) => l.toLowerCase());
                  const nivelFolders = folders.filter((f) =>
                    levels.includes(f.name.toLowerCase())
                  );
                  const otherFolders = folders.filter(
                    (f) => !levels.includes(f.name.toLowerCase())
                  );
                  return (
                    <>
                      {nivelFolders.length > 0 && (
                        <div>
                          <SectionLabel texto="Niveles educativos" />
                          <div className="space-y-3">
                            {nivelFolders.map((f) => (
                              <CategoryButton
                                key={f.id}
                                label={f.name}
                                color="green"
                                icon={<BriefcaseIcon />}
                                onClick={() =>
                                  push({
                                    kind: "inclusion_alumnos",
                                    path: [...current.path, f.name],
                                    nivel: f.name,
                                    nivelId: f.id,
                                  })
                                }
                              />
                            ))}
                          </div>
                        </div>
                      )}
                      {otherFolders.length > 0 && (
                        <div>
                          <SectionLabel texto="Áreas — subir archivos" />
                          <div className="space-y-3">
                            {otherFolders.map((f) => (
                              <FolderLink
                                key={f.id}
                                label={f.name}
                                onClick={() =>
                                  push({
                                    kind: "folder_view",
                                    path: [...current.path, f.name],
                                    folderId: f.id,
                                    title: f.name,
                                  })
                                }
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()}
              </>
            )}
          </div>
        )}

        {current.kind === "inclusion_alumnos" && (
          <div className="space-y-3">
            {loading && <Loading texto="Cargando alumnos..." />}
            {error && <ErrorMessage mensaje={error} onRetry={refresh} />}
            {!loading && !error && folders.length === 0 && (
              <EmptyState texto="No se encontraron alumnos." />
            )}
            {!loading && !error &&
              folders.map((f) => (
                <CategoryButton
                  key={f.id}
                  label={f.name}
                  color="green"
                  icon={<StudentIcon />}
                  onClick={() =>
                    push({
                      kind: "inclusion_categorias",
                      path: current.path,
                      nivel: current.nivel,
                      alumno: f.name,
                      alumnoId: f.id,
                    })
                  }
                />
              ))}
          </div>
        )}

        {current.kind === "inclusion_categorias" && (
          <div className="space-y-3">
            {loading && <Loading texto="Cargando carpetas..." />}
            {error && <ErrorMessage mensaje={error} onRetry={refresh} />}
            {!loading && !error && (
              <>
                {(() => {
                  const normalize = (s: string) => s.toLowerCase().trim();
                  const folderMap = new Map(folders.map((f) => [normalize(f.name), f]));
                  return (
                    <>
                      {INCLUSION_CATEGORIES.map((cat) => {
                        const folder = folderMap.get(normalize(cat));
                        if (folder) {
                          return (
                            <FolderLink
                              key={cat}
                              label={cat}
                              onClick={() =>
                                push({
                                  kind: "folder_view",
                                  path: [...current.path, cat],
                                  folderId: folder.id,
                                  title: cat,
                                })
                              }
                            />
                          );
                        }
                        return (
                          <div
                            key={cat}
                            className="w-full bg-white rounded-3xl px-5 py-4 flex items-center gap-4 opacity-40"
                            style={{ border: "2px solid #e7e5e4" }}
                          >
                            <span
                              className="flex-shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center"
                              style={{ background: "#f5f5f4" }}
                            >
                              <FolderGenericIcon />
                            </span>
                            <span
                              className="text-sm font-bold text-left flex-1"
                              style={{ color: "#78716c" }}
                            >
                              {cat}
                            </span>
                            <span className="text-xs" style={{ color: "#a8a29e" }}>
                              No existe
                            </span>
                          </div>
                        );
                      })}
                    </>
                  );
                })()}
              </>
            )}
          </div>
        )}

        {current.kind === "folder_view" && (
          <div>
            {!current.readOnly && (
              <UploadBar
                folderId={current.folderId}
                token={token}
                onUploaded={refresh}
                onUpload={handleUpload}
              />
            )}
            {loading && <Loading texto="Cargando archivos..." />}
            {error && <ErrorMessage mensaje={error} onRetry={refresh} />}
            {!loading && !error && (
              <div className="space-y-5">
                {folders.length > 0 && (
                  <div>
                    <SectionLabel texto="Subcarpetas" />
                    <div className="space-y-3">
                      {folders.map((f) => (
                        <FolderLink
                          key={f.id}
                          label={f.name}
                          onClick={() =>
                            push({
                              kind: "folder_view",
                              path: [...current.path, f.name],
                              folderId: f.id,
                              title: f.name,
                              readOnly: current.readOnly,
                            })
                          }
                        />
                      ))}
                    </div>
                  </div>
                )}
                {files.length > 0 && (
                  <div>
                    <SectionLabel texto="Archivos" />
                    <div className="space-y-2">
                      {files.map((f) => (
                        <FileItem
                          key={f.id}
                          item={f}
                          token={token}
                          onRename={current.readOnly ? undefined : handleRename}
                          onDelete={current.readOnly ? undefined : handleDelete}
                        />
                      ))}
                    </div>
                  </div>
                )}
                {folders.length === 0 && files.length === 0 && (
                  <EmptyState texto="Esta carpeta está vacía. Usá el botón de arriba para subir el primer archivo." />
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
