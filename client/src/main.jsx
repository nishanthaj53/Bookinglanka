import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { FeedbackProvider } from './context/FeedbackContext'

// ✅ Bootstrap global import
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/gotur.css";
import "./assets/css/custom.css";


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <FeedbackProvider>
      <App />
    </FeedbackProvider>
  </React.StrictMode>,
)
