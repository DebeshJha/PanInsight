// API Configuration
export const API_BASE_URL = 'https://api.paninsight.org';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  LOGOUT: `${API_BASE_URL}/api/auth/logout`,
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  CHECK_AUTH: `${API_BASE_URL}/api/auth/check-auth`,
  VERIFY_EMAIL: `${API_BASE_URL}/api/auth/verify-email`,
  VERIFY_REGISTRATION_OTP: `${API_BASE_URL}/api/auth/verify-registration-otp`,
  VERIFY_RESET_OTP: `${API_BASE_URL}/api/auth/verify-reset-otp`,
  FORGOT_PASSWORD: `${API_BASE_URL}/api/auth/forgot-password`,
  RESET_PASSWORD: `${API_BASE_URL}/api/auth/reset-password`,
  RESEND_VERIFICATION: `${API_BASE_URL}/api/auth/resend-verification`,
  RESEND_REGISTRATION_OTP: `${API_BASE_URL}/api/auth/resend-registration-otp`,
  OAUTH2_SUCCESS: `${API_BASE_URL}/api/auth/oauth2-success`,
  OAUTH2_GOOGLE: `${API_BASE_URL}/oauth2/authorization/google`,
  
 
  CHATBOT_ASK: `${API_BASE_URL}/api/ask`,
};
