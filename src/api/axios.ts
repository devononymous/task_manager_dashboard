// src/api/axios.ts
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://task-manager-mock-backend-u8d4.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
