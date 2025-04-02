import { Navigate } from 'react-router-dom';

const AuthCheck = ({ children }) => {
  const loginHistory = JSON.parse(localStorage.getItem('loginHistory') || '[]');
  const currentUser = localStorage.getItem('userEmail');
  const isLoggedOut = localStorage.getItem('isLoggedOut') === 'true';

  // Show Landing page if:
  // 1. No login history exists OR
  // 2. User just logged out OR
  // 3. No current user is logged in
  if (loginHistory.length === 0 || isLoggedOut || !currentUser) {
    if (isLoggedOut) {
      localStorage.removeItem('isLoggedOut');
    }
    return children;
  }

  // Otherwise, redirect to Home
  return <Navigate to="/Home" replace />;
};

export default AuthCheck;