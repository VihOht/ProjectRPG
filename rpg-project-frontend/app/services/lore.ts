import { api } from './api';
import type {
  CreateLoreDocumentRequest,
  CreateLoreDocumentResponse,
  CreateLoreImageRequest,
  CreateLoreImageResponse,
  CreateLoreSessionRequest,
  CreateLoreSessionResponse,
  CreateLoreSubdocumentRequest,
  CreateLoreSubdocumentResponse,
  DeleteLoreDocumentResponse,
  DeleteLoreImageResponse,
  DeleteLoreSessionResponse,
  DeleteLoreSubdocumentResponse,
  GetLoreSessionResponse,
  GetLoreSessionsResponse,
} from '../types/lore';

export const loreService = {
  getAllLoreSessions: async (): Promise<GetLoreSessionsResponse> => {
    const response = await api.get<GetLoreSessionsResponse>('/api/lore/sessions');
    return response.data;
  },

  getLoreSessionById: async (sessionId: number): Promise<GetLoreSessionResponse> => {
    const response = await api.get<GetLoreSessionResponse>(`/api/lore/sessions/${sessionId}`);
    return response.data;
  },

  createLoreSession: async (data: CreateLoreSessionRequest): Promise<CreateLoreSessionResponse> => {
    const response = await api.post<CreateLoreSessionResponse>('/api/lore/sessions', data);
    return response.data;
  },

  deleteLoreSession: async (sessionId: number): Promise<DeleteLoreSessionResponse> => {
    const response = await api.delete<DeleteLoreSessionResponse>(`/api/lore/sessions/${sessionId}`);
    return response.data;
  },

  createLoreDocument: async (
    sessionId: number,
    data: CreateLoreDocumentRequest
  ): Promise<CreateLoreDocumentResponse> => {
    const response = await api.post<CreateLoreDocumentResponse>(`/api/lore/sessions/${sessionId}/documents`, data);
    return response.data;
  },

  deleteLoreDocument: async (documentId: number): Promise<DeleteLoreDocumentResponse> => {
    const response = await api.delete<DeleteLoreDocumentResponse>(`/api/lore/documents/${documentId}`);
    return response.data;
  },

  createLoreImage: async (sessionId: number, data: CreateLoreImageRequest): Promise<CreateLoreImageResponse> => {
    const response = await api.post<CreateLoreImageResponse>(`/api/lore/sessions/${sessionId}/images`, data);
    return response.data;
  },

  deleteLoreImage: async (imageId: number): Promise<DeleteLoreImageResponse> => {
    const response = await api.delete<DeleteLoreImageResponse>(`/api/lore/images/${imageId}`);
    return response.data;
  },

  createLoreSubdocument: async (
    documentId: number,
    data: CreateLoreSubdocumentRequest
  ): Promise<CreateLoreSubdocumentResponse> => {
    const response = await api.post<CreateLoreSubdocumentResponse>(`/api/lore/documents/${documentId}/subdocuments`, data);
    return response.data;
  },

  deleteLoreSubdocument: async (subdocumentId: number): Promise<DeleteLoreSubdocumentResponse> => {
    const response = await api.delete<DeleteLoreSubdocumentResponse>(`/api/lore/subdocuments/${subdocumentId}`);
    return response.data;
  },
};
