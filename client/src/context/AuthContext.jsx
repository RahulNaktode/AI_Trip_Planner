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
                setUser(null);
                return;
            }

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

            const { data } = await authAPI.getMe();

            if (isMounted) {
                setUser(data.data);
                localStorage.setItem(
                    "wander_user",
                    JSON.stringify(data.data)
                );
            }
        } catch (error) {
            console.error("Auth initialization error:", error);

            if (error.response?.status === 401) {
                localStorage.removeItem("wander_token");
                localStorage.removeItem("wander_user");

                if (isMounted) {
                    setUser(null);
                }
            }
        } finally {
            if (isMounted) {
                setLoading(false);
            }
        }
    };

    const syncAuth = (e) => {
        if (e.key === "wander_token" && !e.newValue) {
            setUser(null);
        }
    };

    window.addEventListener("storage", syncAuth);
    initializeAuth();

    return () => {
        isMounted = false;
        window.removeEventListener("storage", syncAuth);
    };
}, []);


    const handleLogin = useCallback(async (email, password) => {
        const { data } = await authAPI.login({email, password});
        localStorage.setItem("wander_token", data.token);
        localStorage.setItem("wander_user", JSON.stringify(data.user));
        setUser(data.user);
        return data;
    }, []);

    const handleLogout = useCallback(() => {
        localStorage.removeItem("wander_token");
        localStorage.removeItem("wander_user");
        setUser(null);
        window.location.href = "/login";
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
            logout: handleLogout,
            isAuthentication: !!user,
            isPro: user?.plan === "pro",
            currency: user?.currency || "USD",
        }),
        [user, loading, handleeRegister, handleLogin, handleLogout],
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