import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './FilterBar.css'
import App from './FilterBarTemplate.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
