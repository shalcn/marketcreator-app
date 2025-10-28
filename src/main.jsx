import { StrictMode } from 'react' // PERBAIKAN BARIS 1
import { createRoot } from 'react-dom/client'
import './index.css'
import MarketCreator from './MarketCreator.jsx' // ASUMSI OPSI 2 DAN NAMA FILE MARKETCREATOR.JSX

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MarketCreator /> 
  </StrictMode>,
)
