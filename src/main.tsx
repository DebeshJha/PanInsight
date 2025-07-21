import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './components/HomePage'
import UploadScan from './components/UploadScan'
import AnalysisReport from './components/AnalysisReport'
import './index.css'
import { ThemeProvider } from './theme/ThemeContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <Router basename="/PanInsight">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/upload" element={<UploadScan />} />
          <Route path="/report" element={<AnalysisReport />} />
        </Routes>
      </Router>
    </ThemeProvider>
  </React.StrictMode>,
)