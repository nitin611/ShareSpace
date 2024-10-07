import axios from "axios";
import { useState,useEffect, useContext, createContext } from "react";

const authContext = createContext();

const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        user: null,
        token: ""
    });

    // private route ke - default axios check header
    axios.defaults.headers.common['Authorization']=auth?.token

    // useEffect hook for localStorage se data ko reload karne pe bhi rakhne ke liye-
    useEffect(() => {
        // get karo stored auth data ko local storage se-
        const storedAuth = localStorage.getItem('auth'); 
        if (storedAuth) {
            // local storage se data ko parse karo and then setAuth karo-
         const parseData=JSON.parse(storedAuth); 
         setAuth({
            ...auth,
            user: parseData.user,
            token: parseData.token
         })
        }
    }, []);
    
    return (
        <authContext.Provider value={[auth, setAuth]}>
            {children} 
        </authContext.Provider>
    );
}

// ---------------------------Custom hook----------------------------------------
const useAuth = () => useContext(authContext);

export { AuthProvider, useAuth }; 
