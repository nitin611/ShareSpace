import { createContext, useContext, useEffect, useReducer } from "react";
import axios from "axios";

// Creating Product Context
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

// AppProvider component for providing product data
const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const getProducts = async () => {
    dispatch({ type: "SET_LOADING" });
    try {
      const res = await axios.get(API);
      const products = res.data.map(product => ({
        ...product, 
        price: (product.price * 100).toFixed(2) 
      })); // Scaling price
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

export { AppProvider, useProductContext };
