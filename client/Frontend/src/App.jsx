
import './App.css'
// import Structure from './Components/structure/Structure'
import { Routes,Route } from 'react-router-dom'
import HomePage from './Pages/HomePage'
import About from './Pages/About'
import ContactUs from './Pages/ContactUs'
import PageError from './Pages/PageError'
import Signup from './Pages/Auth/Signup'
import Signin from './Pages/Auth/Signin'
import PrivateRoute from './Components/Routes/Private'
import AdminDashboard from './Pages/Admin/AdminDashboard'
import Dashboard from './Pages/user/Dashboard'
import AdminRoute from './Components/Routes/AdminRoute'
import { AppProvider } from './context/productcontext';





function App() {
  return (
    <AppProvider>
    <Routes>
      <Route path='/' element={<HomePage/>}></Route>
     
      {/* user dashboard */}
      <Route path='/dashboard' element={<PrivateRoute/>}>
      <Route path='user' element={<Dashboard/>}></Route>
      </Route>
      {/* admin dashboard */}
      <Route path='/dashboard' element={<AdminRoute/>}>
      <Route path='admin' element={<AdminDashboard/>}></Route>
      </Route>

      <Route path='/about' element={<About/>}></Route>
      <Route path='/contact' element={<ContactUs/>}></Route>
      <Route path='/signup' element={<Signup/>}></Route>
      <Route path='/signin' element={<Signin/>}></Route>
      <Route path="*" element={<PageError/>}></Route>
    </Routes>
    </AppProvider>
  )
}

export default App;
