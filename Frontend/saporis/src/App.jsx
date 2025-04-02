import { Toaster } from 'react-hot-toast';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import LoginPopup from './Auth/Login';
import Signup from "./Auth/Signup";
import ProtectedRoute from './Components/ProtectedRoute';
import Analysis from './Pages/Analysis';
import Home from './Pages/Home';
import Landing from './Pages/Landing';
import UserProfile from './Components/UserProfile';
import AuthCheck from './Components/AuthCheck';
import AuthCallback from './Auth/AuthCallback';

function App() {
  return (
    <div className="min-h-screen w-full">
      <Toaster />
      <Routes>
        <Route 
          path="/" 
          element={
            <AuthCheck>
              <Landing />
            </AuthCheck>
          } 
        />
        <Route path="/login" element={<LoginPopup />} />
        <Route path="/signup" element={<Signup />} />
        <Route 
          path="/home" 
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/analysis" 
          element={
            <ProtectedRoute>
              <Analysis />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/UserProfile" 
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          } 
        />
        <Route path="/auth/callback" element={<AuthCallback />} />
      </Routes>
    </div>
  );
}

export default App;