const API_BASE_URL = 'http://10.65.109.218:5000/api';

class ApiClient {
  constructor() {
    this.baseUrl = API_BASE_URL;
    this.token = null;
  }

  setToken(token) {
    this.token = token;
  }

  clearToken() {
    this.token = null;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  get(endpoint) {
    return this.request(endpoint);
  }

  post(endpoint, body) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  put(endpoint, body) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient();

export const authApi = {
  sendOtp: (phone) => apiClient.post('/auth/send-otp', { phone }),
  verifyOtp: (phone, otp) => apiClient.post('/auth/verify-otp', { phone, otp }),
  getProfile: () => apiClient.get('/auth/profile'),
  updateProfile: (data) => apiClient.put('/auth/profile', data),
  updateFcmToken: (token) => apiClient.put('/auth/fcm-token', { fcmToken: token }),
};

export const symptomApi = {
  report: (data) => apiClient.post('/symptoms/report', data),
  getHistory: () => apiClient.get('/symptoms/history'),
};

export const outbreakApi = {
  getNearby: (pincode) => apiClient.get(`/outbreak/nearby?pincode=${pincode}`),
  getHistory: (pincode, limit) => apiClient.get(`/outbreak/history?pincode=${pincode}&limit=${limit || 20}`),
};

export const medicineApi = {
  scan: (barcode) => apiClient.get(`/medicine/scan/${barcode}`),
  search: (q, limit) => apiClient.get(`/medicine/search?q=${q}&limit=${limit || 20}`),
  add: (data) => apiClient.post('/medicine', data),
};

export const recordApi = {
  getAll: (memberId) => apiClient.get(`/records${memberId ? `?memberId=${memberId}` : ''}`),
  get: (id) => apiClient.get(`/records/${id}`),
  add: (data) => apiClient.post('/records', data),
  delete: (id) => apiClient.delete(`/records/${id}`),
};

export const familyApi = {
  getAll: () => apiClient.get('/family'),
  add: (data) => apiClient.post('/family', data),
  update: (id, data) => apiClient.put(`/family/${id}`, data),
  delete: (id) => apiClient.delete(`/family/${id}`),
};

export const phcApi = {
  getNearby: (lat, lng, radius) => apiClient.get(`/phc/nearby?lat=${lat}&lng=${lng}&radius=${radius || 20}`),
  getByPincode: (pincode) => apiClient.get(`/phc/nearby?pincode=${pincode}`),
  search: (q, type) => apiClient.get(`/phc/search?q=${q}${type ? `&type=${type}` : ''}`),
  getDetails: (id) => apiClient.get(`/phc/${id}`),
};

export const ashaApi = {
  getAlerts: () => apiClient.get('/asha/alerts'),
  resolveAlert: (id) => apiClient.put(`/asha/alert/${id}/resolve`),
  getReports: () => apiClient.get('/asha/reports'),
};