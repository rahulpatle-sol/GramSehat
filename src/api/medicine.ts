import { apiClient } from '../../app/src/api/client';
import type { Medicine, MedicineScanResult } from '../types';

export const medicineApi = {
  scan: async (barcode: string): Promise<MedicineScanResult> => {
    const response = await apiClient.get<MedicineScanResult>(`/medicine/scan/${barcode}`);
    return response;
  },

  search: async (q: string, limit: number = 20): Promise<{ medicines: Medicine[] }> => {
    const response = await apiClient.get<{ medicines: Medicine[] }>(`/medicine/search?q=${encodeURIComponent(q)}&limit=${limit}`);
    return response;
  },

  add: async (data: Partial<Medicine>): Promise<{ medicine: Medicine }> => {
    const response = await apiClient.post<{ medicine: Medicine }>('/medicine', data);
    return response;
  },
};