import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/auth.jsx'
import { SearchProvider } from './context/search.jsx'
import { PointProvider } from './context/points.jsx'
import { Toaster } from 'react-hot-toast'
import './config/axios.js'  

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <PointProvider>
      <SearchProvider>
        <BrowserRouter>
          <Toaster 
            position="top-right"
            toastOptions={{
              success: {
                style: {
                  background: '#4ade80',
                  color: 'white',
                },
              },
              error: {
                style: {
                  background: '#ef4444',
                  color: 'white',
                },
              },
            }}
          />
          <App />
        </BrowserRouter>
      </SearchProvider>
    </PointProvider>
  </AuthProvider>
);
