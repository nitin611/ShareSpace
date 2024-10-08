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
import { AppProvider } from './context/productcontext'; // Import the AppProvider

function App() {
  return (
    <AppProvider> {/* Wrap the entire app with AppProvider */}
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
        <Route path="*" element={<PageError />} />
      </Routes>
    </AppProvider>
  );
}

export default App;
