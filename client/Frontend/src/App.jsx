import './App.css'; 
import { Routes, Route } from 'react-router-dom';

// Importing all the Pages
import HomePage from './Pages/HomePage';
import About from './Pages/About';
import ContactUs from './Pages/ContactUs';
import PageError from './Pages/PageError';
import Signup from './Pages/Auth/Signup';
import Signin from './Pages/Auth/Signin';
import PrivateRoute from './Components/Routes/Private';
import AdminRoute from './Components/Routes/AdminRoute'; // Added AdminRoute for admin routes

// User-related pages
import Dashboard from './Pages/user/Dashboard';
import CreateProduct from './Pages/user/CreateProduct';
import UpdateProduct from './Pages/user/UpdateProduct';
import Products from './Pages/user/Products';
import Profile from './Pages/user/Profile';
import Order from './Pages/user/Order';

// Admin-related pages
import AdminDashboard from './Pages/Admin/AdminDashboard'; 
import CreateCategory from './Pages/Admin/CreateCategory';
import Users from './Pages/Admin/Users';

// Cart Page
import CartPage from './Pages/CartPage'; 

// Context Providers
import { AppProvider } from './context/productcontext'; 
import { CartProvider } from './context/cartContext'; 

function App() {
  return (
    <AppProvider> {/* Wrap the app with AppProvider */}
      <CartProvider> {/* Wrap the app with CartProvider */}
        <Routes>
          {/* Public Routes */}
          <Route path='/' element={<HomePage />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<ContactUs />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/signin' element={<Signin />} />
          <Route path='/cart' element={<CartPage />} /> {/* Cart Page route */}

          {/* User Dashboard Routes */}
          <Route path='/dashboard' element={<PrivateRoute />}>
            <Route path='user' element={<Dashboard />} />
            <Route path='user/create-product' element={<CreateProduct />} />
            <Route path='user/update-product' element={<UpdateProduct />} />
            <Route path='user/products' element={<Products />} />
            <Route path='user/order' element={<Order />} />
            <Route path='user/profile' element={<Profile />} />
          </Route>

          {/* Admin Dashboard Routes */}
          <Route path='/dashboard' element={<AdminRoute />}>
            <Route path='admin' element={<AdminDashboard />} />
            <Route path='admin/create-category' element={<CreateCategory />} />
            <Route path='admin/users' element={<Users />} />
          </Route>

          {/* Catch-all route for undefined pages */}
          <Route path="*" element={<PageError />} />
        </Routes>
      </CartProvider>
    </AppProvider>
  );
}

export default App;
