import axios from 'axios'
import toast from 'react-hot-toast'

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}`,
    headers: { "Content-Type" : "application/json" },
    timeout: 60000,
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

export const tripApi = {
    generate: (data) => api.post("/trip/generate", data),
    getHistory: async () => {
        const res = await api.get("/trip/history");
        return res.data.trips || [];
    },
    
    history: async function (){
        return this.getHistory;
    },
    getById: (id) => api.get(`/trip/${id}`),
    delete: (id) => api.delete(`/trip/${id}`),
   
};

export const budgetApi = {
    calculate: (data) => api.post("/budget/calculate", data),
    getInsight:  (budgetId) => api.post("/budget/ai-insights", {budgetId}),
    getHistory: async () => {
        const res = await api.get("/budget/history");
        return res.data.budgets || [];
    },
    getById: (id) => api.get(`/budget/${id}`),
    updateStats: (id, status) => api.post(`/budget/${id}`, { status }),
    delete: (id) => api.delete(`/budget/${id}`),
};

export default api;