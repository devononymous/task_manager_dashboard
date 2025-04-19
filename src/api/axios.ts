// src/api/axios.ts
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000', // json-server must be running here
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
