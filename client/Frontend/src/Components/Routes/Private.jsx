import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import { Outlet } from "react-router-dom";
import axios from "axios";
import Spinner from "../Spinner";

export default function PrivateRoute() {
    const [ok, setOk] = useState(false);
    const [auth] = useAuth();

    useEffect(() => {
        const authCheck = async () => {
            try {
                console.log("Sending request to auth endpoint..."); // Log before the request
                const res = await axios.get('http://localhost:8080/api/auth/user-auth');
                console.log("Received response:", res.data); // Log the response
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
            console.log("No token found."); // Log if no token is found
            setOk(false); // If no token, set ok to false
        }
    }, [auth?.token]);

    return ok ? <Outlet /> : <Spinner path="signin" />; // Redirect to signin if not authenticated
}
