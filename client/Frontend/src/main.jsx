import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/auth.jsx'
import { SearchProvider } from './context/search.jsx'
createRoot(document.getElementById('root')).render(
  // browsesr router se routing enable ho gayi pages ke beech me-
  <AuthProvider>
    <SearchProvider>
    <BrowserRouter>
    <App />
  </BrowserRouter>
    </SearchProvider>

  </AuthProvider>
 
)
