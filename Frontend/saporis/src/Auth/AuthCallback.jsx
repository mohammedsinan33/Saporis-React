import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

const checkExistingUser = async (email) => {
  try {
    const { data, error } = await supabase
      .from('Auth')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error checking user:', error);
    return null;
  }
};

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        toast.error('Authentication failed');
        navigate('/');
        return;
      }

      if (session?.user) {
        try {
          // Check if user exists in Auth table
          const existingUser = await checkExistingUser(session.user.email);

          if (existingUser) {
            // User exists, save session and redirect
            localStorage.setItem('userEmail', session.user.email);
            localStorage.setItem('userName', existingUser.First_Name);
            // Save to login history
            const existingHistory = JSON.parse(localStorage.getItem('loginHistory') || '[]');
            if (!existingHistory.includes(session.user.email)) {
              localStorage.setItem('loginHistory', JSON.stringify([...existingHistory, session.user.email]));
            }
            toast.success('Welcome back!');
            navigate('/Home');
          } else {
            // Store Google user data for registration forms
            const userData = {
              email: session.user.email,
              First_Name: session.user.user_metadata.full_name.split(' ')[0],
              Last_Name: session.user.user_metadata.full_name.split(' ').slice(1).join(' ')
            };
            localStorage.setItem('googleUserData', JSON.stringify(userData));
            navigate('/signup', { state: { isGoogleSignup: true }});
          }
        } catch (error) {
          toast.error('Something went wrong');
          navigate('/');
        }
      }
    };

    handleCallback();
  }, [navigate]);

  return null;
};

export default AuthCallback;