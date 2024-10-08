import { createContext, useContext, useEffect, useReducer } from "react";
import axios from "axios";

// Creating context
const AppContext = createContext();

// API endpoint
const API = "https://fakestoreapi.com/products";

// Initial state
const initialState = {
  loading: false,
  products: [],
};

// Reducer function to manage the state
const reducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: true };
    case "SET_PRODUCTS":
      return { ...state, loading: false, products: action.payload };
    default:
      return state;
  }
};

// AppProvider component
const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Fetch products from the API
  const getProducts = async () => {
    dispatch({ type: "SET_LOADING" });
    try {
      const res = await axios.get(API);
      const products = await res.data; // assuming the data structure is correct
      dispatch({ type: "SET_PRODUCTS", payload: products });
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <AppContext.Provider value={{ ...state }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the AppContext
const useProductContext = () => {
  return useContext(AppContext);
};

export { AppProvider, AppContext, useProductContext };
