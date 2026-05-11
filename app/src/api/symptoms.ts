import { apiClient } from './index';
import type { SymptomReport, SymptomReportData } from '../types';

export const symptomApi = {
  report: async (data: SymptomReportData): Promise<{ success: boolean; report: SymptomReport }> => {
    const response = await apiClient.post('/symptoms/report', data);
    return response as { success: boolean; report: SymptomReport };
  },

  getHistory: async (): Promise<{ reports: SymptomReport[] }> => {
    const response = await apiClient.get('/symptoms/history');
    return response as { reports: SymptomReport[] };
  },
};

export default symptomApi;