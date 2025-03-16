import './App.css';
import './config/axios';  // Import axios config for point notifications
import { Routes, Route } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import About from './Pages/About';
import ContactUs from './Pages/ContactUs';
import PageError from './Pages/PageError';
import Signup from './Pages/Auth/Signup';
import Signin from './Pages/Auth/Signin';
import PrivateRoute from './Components/Routes/Private';
import AdminRoute from './Components/Routes/AdminRoute'; 
import Dashboard from './Pages/user/Dashboard';
import CreateProduct from './Pages/user/CreateProduct';
import UpdateProduct from './Pages/user/UpdateProduct';
import Products from './Pages/user/Products';
import Profile from './Pages/user/Profile';
import Order from './Pages/user/Order';
import Orders from './Pages/user/OrderDone'
import AdminDashboard from './Pages/Admin/AdminDashboard';
import CreateCategory from './Pages/Admin/CreateCategory';
import Users from './Pages/Admin/Users';
import CartPage from './Pages/CartPage'; 
import ViewUserDetails from './Pages/Admin/ViewUserDetails';
import { CartProvider } from './context/CartContext';
import Search from './Pages/search';
import ProductDetails from './Pages/ProductDetails';

function App() {
  return (
    <CartProvider>
      <Routes>
        {/* Public Routes */}
        <Route path='/' element={<HomePage />} />
        <Route path='/product/:id' element={<ProductDetails />} />
        <Route path='/search' element={<Search />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<ContactUs />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/signin' element={<Signin />} />
        <Route path='/cart' element={<CartPage />} /> 

        {/* User Dashboard Routes */}
        <Route path='/dashboard' element={<PrivateRoute />}>
          <Route path='user' element={<Dashboard />} />
          <Route path='user/create-product' element={<CreateProduct />} />
          <Route path='user/update-product/:id' element={<UpdateProduct />} />
          <Route path='user/products' element={<Products />} />
          <Route path='user/order' element={<Order />} />
          <Route path='user/orders' element={<Orders />} />
          <Route path='user/profile' element={<Profile />} />
        </Route>

        {/* Admin Dashboard Routes */}
        <Route path='/dashboard' element={<AdminRoute />}>
          <Route path='admin' element={<AdminDashboard />} />
          <Route path='admin/create-category' element={<CreateCategory />} />
          <Route path='admin/users' element={<Users />} />
          <Route path="admin/viewUserDetails/:id" element={<ViewUserDetails />} />
        </Route>

        <Route path="*" element={<PageError />} />
      </Routes>
    </CartProvider>
  );
}

export default App;