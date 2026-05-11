import { apiClient } from './index';
import type { Medicine, MedicineScanResult } from '../types';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.65.109.218:5000/api';

export const medicineApi = {
  scan: async (formData: FormData): Promise<MedicineScanResult> => {
    const token = await import('@react-native-async-storage/async-storage').then(m => m.default.getItem('authToken'));
    const response = await fetch(`${API_BASE_URL}/medicine/scan`, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Scan failed');
    return data as MedicineScanResult;
  },

  search: async (q: string, limit: number = 20): Promise<{ medicines: Medicine[] }> => {
    const response = await apiClient.get(`/medicine/search?q=${encodeURIComponent(q)}&limit=${limit}`);
    return response as { medicines: Medicine[] };
  },

  add: async (data: Partial<Medicine>): Promise<{ medicine: Medicine }> => {
    const response = await apiClient.post('/medicine', data);
    return response as { medicine: Medicine };
  },
};

export default medicineApi;
