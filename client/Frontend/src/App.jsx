import './App.css';
import { Routes, Route } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import About from './Pages/About';
import ContactUs from './Pages/ContactUs';
import PageError from './Pages/PageError';
import Signup from './Pages/Auth/Signup';
import Signin from './Pages/Auth/Signin';
import PrivateRoute from './Components/Routes/Private';
import SellerDashboard from './Pages/Seller/SellerDashboard';
import Dashboard from './Pages/user/Dashboard';
import { AppProvider } from './context/productcontext';
import { CartProvider } from './context/cartContext'; // Import CartProvider
import CartPage from './Pages/CartPage';

function App() {
  return (
    <AppProvider> {/* Wrap the entire app with AppProvider */}
      <CartProvider> {/* Wrap the entire app with CartProvider */}
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/admin' element={<SellerDashboard />} />
          <Route path='/dashboard' element={<PrivateRoute />}>
            <Route path='' element={<Dashboard />} />
          </Route>
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<ContactUs />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/signin' element={<Signin />} />
          <Route path='/cart' element={<CartPage />} /> {/* Cart Page route */}
          <Route path="*" element={<PageError />} />
        </Routes>
      </CartProvider>
    </AppProvider>
  );
}

export default App;
