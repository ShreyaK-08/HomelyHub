//centeralized API setup

import axios from 'axios';
import qs from 'qs';

const resolveBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl && envUrl.trim() && envUrl !== '/api') {
    // Auto-correct 1-letter typo if present
    return envUrl.replace('homelyhub-gjsw.onrender.com', 'homelyhub-qjsw.onrender.com');
  }
  // Production fallback on cloud or local proxy fallback
  if (typeof window !== 'undefined' && window.location.hostname.includes('netlify.app')) {
    return 'https://homelyhub-qjsw.onrender.com/api';
  }
  return '/api';
};

export const axiosInstance = axios.create({
    baseURL: resolveBaseURL(),
    withCredentials: true,
    paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
});

