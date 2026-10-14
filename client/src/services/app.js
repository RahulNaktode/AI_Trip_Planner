import axios from 'axios'
import toast from 'react-hot-toast'

const API_URL = "http://localhost:5080/api";

const api = axios.create({
    baseURL: API_URL,
    headers: { "Content-Type" : "application/json" },
    timeout: 9000,
});

export const authAPI = {
    register: (data) => api.post("/auth/register", data),
};

export default api;