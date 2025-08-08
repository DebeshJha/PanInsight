export const isAuthenticated = (): boolean => {
  return localStorage.getItem('isAuthenticated') === 'true';
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