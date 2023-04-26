import axios from 'axios';
import { getSession } from 'next-auth/react';

const apiUrl = process.env.NEXT_PUBLIC_API_URL!

const api = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(async (request) => {
  const session = await getSession()
  if (session) {
    request.headers["Authorization"] = `${session.accessToken}`
  }
  return request
})


export default api;
