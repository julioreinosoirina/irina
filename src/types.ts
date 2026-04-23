export type NavState =
  | { kind: "inicio" }
  | { kind: "cet_sector"; path: string[] }
  | { kind: "cet_turno"; path: string[]; sector: string }
  | { kind: "cet_alumnos"; path: string[]; sector: string; turno: string }
  | { kind: "cet_categorias"; path: string[]; sector: string; turno: string; alumno: string }
  | { kind: "cet_areas"; path: string[]; sector: string; turno: string; alumno: string; categoria: string }
  | { kind: "inclusion_grupos"; path: string[] }
  | { kind: "inclusion_alumnos"; path: string[]; nivel: string; nivelId: string }
  | { kind: "inclusion_categorias"; path: string[]; nivel: string; alumno: string; alumnoId: string }
  | { kind: "folder_view"; path: string[]; title: string; folderId: string; readOnly?: boolean };

export type DriveItem = {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  modifiedTime?: string;
  webViewLink?: string;
};
