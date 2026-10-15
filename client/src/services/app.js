import axios from 'axios'
import toast from 'react-hot-toast'

const API_URL = "http://localhost:5080/api";

const api = axios.create({
    baseURL: API_URL,
    headers: { "Content-Type" : "application/json" },
    timeout: 9000,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('wander_token');
    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }
    return config;
},
(error) => Promise.reject(error),
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const { response } = error;

        if(response?.status === 401){
            if(!window.location.pathname.includes("/login")){
                toast.error("session expired, please login again");
                localStorage.clear();
                window.location.href = '/login';
            }
        }

        if(error.code === "ECONNABORTED") {
            toast.error("The AI is taking abit longer than usaul. Hang tight");
        }

        const errorMessage = response?.data.error || response?.data.message || "Connect Loast";

        if(response?.status !== 404 && response?.status !== 401){
            toast.error(errorMessage);
        }

        return Promise.reject(error);
    }
)

export const authAPI = {
    register: (data) => api.post("/auth/register", data),
    login: (data) => api.post("/auth/login", data),
    getMe: () => api.get("/auth/me"),
};

export default api;