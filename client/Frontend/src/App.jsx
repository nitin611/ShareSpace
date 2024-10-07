
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
import SellerDashboard from './Pages/Seller/SellerDashboard'
import Dashboard from './Pages/user/Dashboard'





function App() {
 
  // with these routes we can navigate between different pages , as there is no <a></a> tag in react we use
  // routes to move around different pages in the application.

  return (
    <Routes>
      <Route path='/' element={<HomePage/>}></Route>
      <Route path='/admin' element={<SellerDashboard/>}></Route>
      <Route path='/dashboard' element={<PrivateRoute/>}>
      <Route path='' element={<Dashboard/>}></Route>
      
      </Route>
      <Route path='/about' element={<About/>}></Route>
      <Route path='/contact' element={<ContactUs/>}></Route>
      <Route path='/signup' element={<Signup/>}></Route>
      <Route path='/signin' element={<Signin/>}></Route>
      <Route path="*" element={<PageError/>}></Route>
    </Routes>
  )
}

export default App
