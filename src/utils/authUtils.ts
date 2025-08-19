export const isAuthenticated = (): boolean => {
  const localAuth = localStorage.getItem('isAuthenticated') === 'true';
  return localAuth;
};

import { API_ENDPOINTS } from '../config/api';

export const checkAuthWithBackend = async (): Promise<boolean> => {
  try {
    const response = await fetch(API_ENDPOINTS.CHECK_AUTH, {
      method: 'GET',
      credentials: 'include',
    });
    return response.ok;
  } catch (error) {
    console.error('Error checking authentication with backend:', error);
    return false;
  }
};

export const getUserData = () => {
  const userDataStr = localStorage.getItem('userData');
  return userDataStr ? JSON.parse(userDataStr) : null;
};

export const getLoginType = (): string | null => {
  return localStorage.getItem('loginType');
};

export const isOAuth2User = (): boolean => {
  return getLoginType() === 'GOOGLE_OAUTH2';
};

export const requireAuth = (navigate: any, redirectTo: string = '/login') => {
  if (!isAuthenticated()) {
    navigate(redirectTo);
    return false;
  }
  return true;
};

export const logout = () => {
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('userData');
  localStorage.removeItem('loginType');
  sessionStorage.clear();
}; 