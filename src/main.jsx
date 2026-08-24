import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import PhoneFrame from './components/PhoneFrame.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <PhoneFrame>
        <App />
      </PhoneFrame>
    </ErrorBoundary>
  </StrictMode>,
)
