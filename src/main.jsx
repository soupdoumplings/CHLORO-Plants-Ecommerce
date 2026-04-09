import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './lib/AuthContext' // ADD THIS

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>   {/* ADD THIS: wraps everything so useAuth() works everywhere */}
      <App />
    </AuthProvider>  {/* ADD THIS */}
  </StrictMode>,
)
