import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import KavachShell from './KavachShell.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <KavachShell />
  </StrictMode>,
)
