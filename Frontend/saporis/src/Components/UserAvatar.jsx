import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const UserAvatar = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const userEmail = localStorage.getItem('userEmail');
      if (userEmail) {
        const { data, error } = await supabase
          .from('Auth')
          .select('First_Name, Last_Name, Bg_colour, Font_colour')
          .eq('email', userEmail)
          .single();

        if (!error && data) {
          setUserData(data);
        }
      }
    };

    fetchUserData();
  }, []);

  if (!userData) return null;

  const initials = userData.First_Name[0];

  return (
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center"
      style={{ 
        backgroundColor: userData.Bg_colour,
        color: userData.Font_colour
      }}
    >
      <span className="text-lg font-semibold">{initials}</span>
    </div>
  );
};

export default UserAvatar;