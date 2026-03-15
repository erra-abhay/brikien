import axios from 'axios';
const isServer = typeof window === 'undefined';

const baseURL = isServer 
  ? (process.env.INTERNAL_API_URL || 'http://api:5000') 
  : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:55524');

const api = axios.create({
  baseURL: `${baseURL}/api/v1`,
});

export default api;
