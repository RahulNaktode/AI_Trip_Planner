import { createContext, useContext, useState, useMemo, useCallback } from "react";
import { authAPI } from "../services/app";

const AuthContext = createContext(null);

export function AuthProvide({ children }){
    const [user, setUser] = useState(null);
    const [loading, setLoading ] = useState(true);

    const handleeRegister = useCallback(async(formdata) => {
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
            register: handleeRegister
        }),
        [user, loading, handleeRegister],
    );

    return(
        <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
    )
}

function useAuth(){
    const context = useContext(AuthContext);

    if(!context){
        throw new Error("user Auth must be consumed within a Auth Provider");
    }

    return context;
}

export { useAuth }