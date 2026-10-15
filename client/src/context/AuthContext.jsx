import { createContext, useContext, useState, useMemo, useCallback, useEffect } from "react";
import { authAPI } from "../services/app";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
         let isMounted = true;

        const initializeAuth = async () => {
            try {
                const token = localStorage.getItem("wander_token");
                const storedUser = localStorage.getItem("wander_user");

                if (!token) {
                    localStorage.removeItem("wander_user");
                    return;
                }

                // Parse stored user safely
                if (storedUser && storedUser !== "undefined") {
                    try {
                        const parsedUser = JSON.parse(storedUser);

                        if (isMounted) {
                            setUser(parsedUser);
                        }
                    } catch {
                        localStorage.removeItem("wander_user");
                    }
                }

                // Verify token with backend
                const { data } = await authAPI.getMe();

                if (isMounted) {
                    setUser(data.user);
                    localStorage.setItem(
                        "wander_user",
                        JSON.stringify(data.user)
                    );
                }
            } catch (error) {
                console.error("Session Integrity compromised", error);
            }
            setLoading(false);
        };

        const syncAuth = (e) => {
            if(e.key === "wander_token" && !e.newValue){
                setUser(null);
                window.location.href = '/login';
            }
        };

        window.addEventListener("storage", syncAuth);
        initializeAuth();

        return () => window.removeEventListener("storage", syncAuth);
    }, [])

    const handleLogin = useCallback(async (email, password) => {
        const { data } = await authAPI.login({email, password});
        localStorage.setItem("wander_token", data.token);
        localStorage.setItem("wander_user", JSON.stringify(data.user));

         console.log("Login response:", data);
        console.log("Token received:", data.token);
        setUser(data.user);
        return data;

    }, []);

    const handleeRegister = useCallback(async (formdata) => {
        const { data } = await authAPI.register(formdata);
        localStorage.setItem("wander_token", data.token);
        localStorage.setItem("wander_user", JSON.stringify(data.user));
        setUser(data.user);
        return data;
    }, []);

    const authValue = useMemo(
        () => ({
            user,
            loading,
            register: handleeRegister,
            login: handleLogin,
            isAuthentication: !!user,
            isPro: user?.plan === "pro",
            currency: user?.currency || "USD",
        }),
        [user, loading, handleeRegister],
    );

    return (
        <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
    )
}

function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("user Auth must be consumed within a Auth Provider");
    }

    return context;
}

export { useAuth }