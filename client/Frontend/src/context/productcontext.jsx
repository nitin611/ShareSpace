import { createContext, useContext, useEffect, useReducer } from "react";
import axios from "axios";

const AppContext = createContext();

const API = "https://fakestoreapi.com/products";

const initialState = {
  loading: false,
  products: [],
};

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

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const getProducts = async () => {
    dispatch({ type: "SET_LOADING" });
    try {
      const res = await axios.get(API);
      const products = res.data.map(product => ({
        ...product,
        price: (product.price * 83).toFixed(2) // Convert price to INR (approx 1 USD = ₹83)
      }));
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

const useProductContext = () => {
  return useContext(AppContext);
};

export { AppProvider, AppContext, useProductContext };
