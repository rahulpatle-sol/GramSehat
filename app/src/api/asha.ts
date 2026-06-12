import { apiClient } from './client';
import type { OutbreakAlert, SymptomReport } from '../types';

export const ashaApi = {
  getAlerts: async (): Promise<{ alerts: OutbreakAlert[] }> => {
    const response = await apiClient.get('/asha/alerts');
    return response as { alerts: OutbreakAlert[] };
  },

  resolveAlert: async (id: number): Promise<{ alert: OutbreakAlert }> => {
    const response = await apiClient.put(`/asha/alert/${id}/resolve`);
    return response as { alert: OutbreakAlert };
  },

  getReports: async (): Promise<{ reports: SymptomReport[] }> => {
    const response = await apiClient.get('/asha/reports');
    return response as { reports: SymptomReport[] };
  },
};

export default ashaApi;