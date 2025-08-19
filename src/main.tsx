import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './components/HomePage'
import UploadScan from './components/UploadScan'
import AnalysisReport from './components/AnalysisReport'
import OurProjectPage from './components/OurWorkPage'
import ContactPage from './components/ContactPage'
import LoginPage from './pages/LoginPage'
import CreateAccountPage from './pages/CreateAccountPage'
import VerifyEmailPage from './pages/VerifyEmailPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import OTPVerificationPage from './pages/OTPVerificationPage'
import OTPVerificationResetPage from './pages/OTPVerificationResetPage'
import './index.css'
import { ThemeProvider } from './theme/ThemeContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/upload" element={<UploadScan />} />
          <Route path="/report" element={<AnalysisReport />} />
          <Route path="/our-work" element={<OurProjectPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<CreateAccountPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/otp-verification" element={<OTPVerificationPage />} />
          <Route path="/otp-verification-reset" element={<OTPVerificationResetPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  </React.StrictMode>,
)