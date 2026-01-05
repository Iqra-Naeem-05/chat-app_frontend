import React, { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axiosInstance.get("/me");
                setUser(res.data.user);
            } catch (err) {
                setUser(null);
            } finally {
                setLoading(false)
            }
        };
        fetchUser();
    }, [])


    const login = (userData) => {
        setUser(userData);
    }

    const logout = async () => {
        await axiosInstance.post("/logout");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user,loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context)  throw new Error("useAuth must be used within AuthProvider");

    return context;
};