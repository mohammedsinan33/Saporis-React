import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Scale, Ruler, Calendar, Target, Save, Edit2, Activity } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

const UserProfile = ({ onClose }) => {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      const { data, error } = await supabase
        .from('Auth')
        .select('*')
        .eq('email', userEmail)
        .single();

      if (!error && data) {
        console.log('Fetched user data:', data); // Debug log
        setUserData(data);
        setEditedData(data);
      } else {
        console.error('Error fetching user data:', error);
      }
    }
  };

  const activityLevels = [
    {
      value: 1.2,
      label: 'Sedentary',
      description: 'Little or no exercise, desk job'
    },
    {
      value: 1.375,
      label: 'Lightly Active',
      description: 'Light exercise 1-3 days/week'
    },
    {
      value: 1.55,
      label: 'Moderately Active',
      description: 'Moderate exercise 3-5 days/week'
    },
    {
      value: 1.725,
      label: 'Very Active',
      description: 'Heavy exercise 6-7 days/week'
    },
    {
      value: 1.9,
      label: 'Extra Active',
      description: 'Very heavy exercise, physical job or training twice per day'
    }
  ];

  const getActivityLabel = (multiplier) => {
    const level = activityLevels.find(level => Math.abs(level.value - multiplier) < 0.01);
    return level ? level.label : 'Unknown';
  };

  const handleUpdate = async () => {
    try {
      if (!editedData) {
        console.error('No edited data available');
        return;
      }

      // Convert Multiplyer to number and validate
      const multiplyer = parseFloat(editedData.Multiplyer);
      if (isNaN(multiplyer)) {
        console.error('Invalid Multiplyer value:', editedData.Multiplyer);
        toast.error('Invalid activity level value');
        return;
      }

      // Prepare update data
      const updatedData = {
        First_Name: editedData.First_Name,
        Last_Name: editedData.Last_Name,
        Height: parseInt(editedData.Height),
        Weight: parseInt(editedData.Weight),
        Age: parseInt(editedData.Age),
        Multiplayer: multiplyer // Use validated number
      };

      console.log('Sending update to Supabase:', updatedData);

      // Update the Auth table
      const { data, error } = await supabase
        .from('Auth')
        .update(updatedData)
        .eq('email', userData.email)
        .select();

      if (error) {
        console.error('Supabase update error:', error);
        throw error;
      }

      console.log('Update successful, response:', data);
      
      toast.success('Profile updated successfully!');
      setIsEditing(false);
      await fetchUserData(); // Refresh data
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.message || 'Failed to update profile');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-br from-gray-900/95 via-purple-900/95 to-violet-900/95 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={e => e.stopPropagation()}
        className="relative max-w-lg w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            User Profile
          </h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <Edit2 className="w-5 h-5 text-purple-300" />
          </button>
        </div>

        {userData && (
          <div className="p-6 space-y-6">
            {/* Profile sections */}
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-purple-200">
                  <User className="w-5 h-5" />
                  <span className="font-medium">Name</span>
                </div>
                {isEditing ? (
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={editedData.First_Name}
                      onChange={e => setEditedData({...editedData, First_Name: e.target.value})}
                      className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                      placeholder="First Name"
                    />
                    <input
                      type="text"
                      value={editedData.Last_Name}
                      onChange={e => setEditedData({...editedData, Last_Name: e.target.value})}
                      className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                      placeholder="Last Name"
                    />
                  </div>
                ) : (
                  <p className="text-white text-lg">{`${userData.First_Name} ${userData.Last_Name}`}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-purple-200">
                  <Mail className="w-5 h-5" />
                  <span className="font-medium">Email</span>
                </div>
                <p className="text-white/80">{userData.email}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-purple-200">
                    <Scale className="w-5 h-5" />
                    <span className="font-medium">Weight</span>
                  </div>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editedData.Weight}
                      onChange={e => setEditedData({...editedData, Weight: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                    />
                  ) : (
                    <p className="text-white text-lg">{userData.Weight} kg</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-purple-200">
                    <Ruler className="w-5 h-5" />
                    <span className="font-medium">Height</span>
                  </div>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editedData.Height}
                      onChange={e => setEditedData({...editedData, Height: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                    />
                  ) : (
                    <p className="text-white text-lg">{userData.Height} cm</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-purple-200">
                    <Calendar className="w-5 h-5" />
                    <span className="font-medium">Age</span>
                  </div>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editedData.Age}
                      onChange={e => setEditedData({...editedData, Age: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                    />
                  ) : (
                    <p className="text-white text-lg">{userData.Age} years</p>
                  )}
                </div>

                <div className="space-y-2 col-span-full">
                  <div className="flex items-center space-x-2 text-purple-200">
                    <Activity className="w-5 h-5" />
                    <span className="font-medium">Activity Level</span>
                  </div>
                  {isEditing ? (
                    <select
                      value={editedData.Multiplyer || ''}
                      onChange={e => setEditedData({
                        ...editedData, 
                        Multiplyer: Number(e.target.value)
                      })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                    >
                      <option value="" disabled>Select activity level</option>
                      {activityLevels.map(level => (
                        <option 
                          key={level.value} 
                          value={level.value} 
                          className="bg-gray-800"
                        >
                          {level.label} - {level.description}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="text-white text-lg">
                      <p>{getActivityLabel(userData.Multiplyer)}</p>
                      <p className="text-sm text-white/60">
                        {activityLevels.find(l => Math.abs(l.value - userData.Multiplyer) < 0.01)?.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Save button */}
            {isEditing && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={handleUpdate}
                className="w-full py-3 px-4 bg-gradient-to-br from-purple-600 to-violet-600 rounded-lg text-white font-medium hover:shadow-lg transition-all flex items-center justify-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </motion.button>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default UserProfile;