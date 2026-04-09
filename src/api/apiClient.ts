import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5050/api/', // Local API port
  // baseURL: 'https://furlable-shaunta-catarrhal.ngrok-free.dev/api/', // ngrok fallback
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': '69420', // Bypass Ngrok interstitial
  },
});

// Help handle auth tokens in the future
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
