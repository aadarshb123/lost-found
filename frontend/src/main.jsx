import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {App, DarkModeToggle} from './Home.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <DarkModeToggle />
  </StrictMode>,
)
