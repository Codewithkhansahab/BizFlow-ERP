import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

export const AppContent = createContext();

export const AppContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    // Try to get login state from localStorage
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        const saved = localStorage.getItem("isLoggedIn");
        return saved === "true" ? true : false;
    });

    const [userData, setUserData] = useState(() => {
        const saved = localStorage.getItem("userData");
        return saved ? JSON.parse(saved) : null;
    });

    // Save to localStorage whenever state changes
    useEffect(() => {
        localStorage.setItem("isLoggedIn", isLoggedIn);
        if(userData) {
            localStorage.setItem("userData", JSON.stringify(userData));
        }
    }, [isLoggedIn, userData]);

    // Ensure axios sends cookies by default
    useEffect(() => {
        axios.defaults.withCredentials = true;
    }, []);

    // Validate session on app load to prevent stale localStorage auth
    useEffect(() => {
        const validateSession = async () => {
            try {
                if (!isLoggedIn) return;
                await axios.post(`${backendUrl}/api/users/is-auth`);
                // If OK, session is valid; do nothing
            } catch (err) {
                // If 401 or error, clear auth state and storage
                localStorage.removeItem("isLoggedIn");
                localStorage.removeItem("userData");
                setIsLoggedIn(false);
                setUserData(null);
                if (window.location.pathname !== "/login") {
                    window.location.replace("/login");
                }
            }
        };
        validateSession();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Global 401 interceptor: redirect to login and clear state
    useEffect(() => {
        const interceptorId = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error?.response?.status === 401) {
                    localStorage.removeItem("isLoggedIn");
                    localStorage.removeItem("userData");
                    setIsLoggedIn(false);
                    setUserData(null);
                    if (window.location.pathname !== "/login") {
                        window.location.replace("/login");
                    }
                }
                return Promise.reject(error);
            }
        );

        return () => axios.interceptors.response.eject(interceptorId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const value = {
        backendUrl,
        isLoggedIn,
        setIsLoggedIn,
        userData,
        setUserData,
    };

    return (
        <AppContent.Provider value={value}>
            {props.children}
        </AppContent.Provider>
    );
};

// Custom hook to use the app context
export const useApp = () => {
    const context = useContext(AppContent);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppContextProvider');
    }
    return context;
};
