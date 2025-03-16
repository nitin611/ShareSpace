import { useState, useContext, createContext, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "./auth";
import { toast } from "react-hot-toast";

const PointContext = createContext();

const PointProvider = ({ children }) => {
  const [points, setPoints] = useState({
    totalPoints: 0,
    history: []
  });
  const [auth] = useAuth();

  // Get user points
  const getUserPoints = useCallback(async () => {
    try {
      if (auth?.user?._id && auth?.token) {
        const { data } = await axios.get(`/api/points/${auth.user._id}`, {
          headers: {
            Authorization: auth.token
          }
        });
        
        if (data) {
          setPoints({
            totalPoints: data.totalPoints || 0,
            history: data.history || []
          });
          console.log("Points fetched successfully:", data);
        }
      }
    } catch (error) {
      console.error("Error fetching points:", error);
      toast.error(error.response?.data?.message || "Error fetching points");
    }
  }, [auth?.user?._id, auth?.token]);

  // Update points when auth changes
  useEffect(() => {
    if (auth?.user?._id && auth?.token) {
      getUserPoints();
    } else {
      setPoints({ totalPoints: 0, history: [] });
    }
  }, [auth?.user?._id, auth?.token, getUserPoints]);

  // Refresh points periodically (every 30 seconds)
  useEffect(() => {
    if (auth?.user?._id && auth?.token) {
      const interval = setInterval(getUserPoints, 30000);
      return () => clearInterval(interval);
    }
  }, [auth?.user?._id, auth?.token, getUserPoints]);

  return (
    <PointContext.Provider value={[points, setPoints, getUserPoints]}>
      {children}
    </PointContext.Provider>
  );
};

// Custom hook to use points context
const usePoints = () => {
  const context = useContext(PointContext);
  if (!context) {
    throw new Error("usePoints must be used within a PointProvider");
  }
  return context;
};

export { usePoints, PointProvider };
