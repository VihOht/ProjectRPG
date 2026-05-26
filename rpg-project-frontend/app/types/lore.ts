export interface LoreSubdocument {
  id: number;
  title: string;
  content: string;
  document_id: number;
  order: number;
}

export interface LoreDocument {
  id: number;
  title: string;
  content: string;
  session_id: number;
  order: number;
  subdocuments: LoreSubdocument[];
}

export interface LoreImage {
  id: number;
  url: string;
  session_id: number;
  order: number;
}

export interface LoreSession {
  id: number;
  name: string;
  description: string;
  documents: LoreDocument[];
  images: LoreImage[];
}

export interface GetLoreSessionsResponse {
  sessions: LoreSession[];
}

export interface GetLoreSessionResponse {
  session: LoreSession;
}

export interface CreateLoreSessionRequest {
  name: string;
  description: string;
}

export interface CreateLoreSessionResponse {
  message: string;
  session: LoreSession;
}

export interface DeleteLoreSessionResponse {
  message: string;
}

export interface CreateLoreDocumentRequest {
  title: string;
  content: string;
}

export interface CreateLoreDocumentResponse {
  message: string;
  document: LoreDocument;
}

export interface DeleteLoreDocumentResponse {
  message: string;
}

export interface CreateLoreImageRequest {
  url: string;
}

export interface CreateLoreImageResponse {
  message: string;
  image: LoreImage;
}

export interface DeleteLoreImageResponse {
  message: string;
}

export interface CreateLoreSubdocumentRequest {
  title: string;
  content: string;
}

export interface CreateLoreSubdocumentResponse {
  message: string;
  subdocument: LoreSubdocument;
}

export interface DeleteLoreSubdocumentResponse {
  message: string;
}
