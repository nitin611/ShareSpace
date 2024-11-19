import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import { Outlet } from "react-router-dom";
import axios from "axios";
import Spinner from "../Spinner";
import API_BASE_URL from '../../apiConfig';

export default function AdminRoute() {
    const [ok, setOk] = useState(false);
    const [auth] = useAuth();

    useEffect(() => {
        const authCheck = async () => {
            try {
                console.log("Sending request to auth endpoint..."); 
                const res = await axios.get(`${API_BASE_URL}/api/auth/admin-auth`);
                console.log("Received response:", res.data); 
                if (res.data.ok) {
                    setOk(true);
                } else {
                    setOk(false);
                }
            } catch (error) {
                console.error("Error during authentication check:", error);
                setOk(false);
            }
        };

        if (auth?.token) {
            authCheck();
        } else {
            console.log("No token found."); 
            setOk(false); 
        }
    }, [auth?.token]);

    return ok ? <Outlet /> : <Spinner path="" />; 
}
