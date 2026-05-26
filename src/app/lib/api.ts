import axios from 'axios';
import type {
  Assignment,
  CreateAssignmentDTO,
  GeneratedPaper,
} from '../../packages/shared-types/src/index';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const AssignmentAPI = {
  list: (search?: string) =>
    api
      .get<{ success: boolean; data: Assignment[] }>('/assignments', {
        params: search ? { search } : {},
      })
      .then((r) => r.data.data),

  get: (id: string) =>
    api
      .get<{ success: boolean; data: Assignment }>(`/assignments/${id}`)
      .then((r) => r.data.data),

  create: (dto: CreateAssignmentDTO) =>
    api
      .post<{ success: boolean; data: Assignment }>('/assignments', dto)
      .then((r) => r.data.data),

  delete: (id: string) => api.delete(`/assignments/${id}`),

  regenerate: (id: string) =>
    api
      .post<{ success: boolean; data: Assignment }>(
        `/assignments/${id}/regenerate`
      )
      .then((r) => r.data.data),

  getPDFUrl: (id: string) => `${API_URL}/assignments/${id}/pdf`,

  extractText: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post<{ success: boolean; text: string }>(
      '/upload/extract-text',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return res.data.text;
  },
};
