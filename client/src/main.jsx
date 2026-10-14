import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvide } from './context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <AuthProvide>
    <StrictMode>
      <App />
    </StrictMode>
  </AuthProvide>
)
