import { apiClient } from '../../app/src/api/client';
import type { SymptomReport, SymptomReportData } from '../types';

export const symptomApi = {
  report: async (data: SymptomReportData): Promise<{ success: boolean; report: SymptomReport }> => {
    const response = await apiClient.post<{ success: boolean; report: SymptomReport }>('/symptoms/report', data);
    return response;
  },

  getHistory: async (): Promise<{ reports: SymptomReport[] }> => {
    const response = await apiClient.get<{ reports: SymptomReport[] }>('/symptoms/history');
    return response;
  },
};