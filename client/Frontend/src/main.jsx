import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  // browsesr router se routing enable ho gayi pages ke beech me-
  <BrowserRouter>
  
    <App />
  
  </BrowserRouter>
 
)
