import { motion } from 'framer-motion';
import { PieChart, TrendingUp } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PieChartComponent from '../Components/Pie-chart';
import Sidenavbar from '../Components/Sidenavbar';
import WeeklyTrendGraph from '../Components/Weeklytrendgraph';
import { supabase } from '../lib/supabase';

const Analysis = () => {
  const navigate = useNavigate();
  const [analysisData, setAnalysisData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [nutritionData, setNutritionData] = useState([]);
  const [weeklyData, setWeeklyData] = useState({ values: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userEmail = localStorage.getItem('userEmail');
        if (!userEmail) {
          // Default data handling remains the same
          setAnalysisData([
            { type: 'Calories', value: 2500, trend: '+5%' },
            { type: 'Protein', value: '75g', trend: '+12%' },
            { type: 'Carbs', value: '310g', trend: '-3%' },
            { type: 'Fat', value: '65g', trend: '+2%' }
          ]);
          setNutritionData([
            { label: 'Protein', value: 25, color: '#9333EA' },
            { label: 'Carbs', value: 45, color: '#7C3AED' },
            { label: 'Fat', value: 30, color: '#6366F1' }
          ]);
          setWeeklyData({
            values: [2100, 2300, 1950, 2400, 2200, 1900, 2500]
          });
          setIsLoading(false);
          return;
        }

        // Fetch all data from the last 7 days
        const { data: weekData, error: weekError } = await supabase
          .from('Food_and_calorie_details')
          .select('*')
          .eq('email', userEmail);

        if (weekError) throw weekError;

        // Get today's weekday name
        const today = new Date();
        const todayWeekday = today.toLocaleString('en-US', { weekday: 'long' });
        
        // Get yesterday's weekday name
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayWeekday = yesterday.toLocaleString('en-US', { weekday: 'long' });

        // Get today's and yesterday's data
        const todayData = weekData.find(d => d.Day_in_week === todayWeekday) || {
          Consumed_Calorie: 0,
          Protien: 0,
          Carb: 0,
          Fat: 0
        };
        
        const yesterdayData = weekData.find(d => d.Day_in_week === yesterdayWeekday);

        const calculateTrend = (current, previous) => {
          if (!previous || !current) return '+0%';
          const diff = ((current - previous) / previous) * 100;
          return `${diff > 0 ? '+' : ''}${diff.toFixed(1)}%`;
        };

        // Set analysis data with trends
        setAnalysisData([
          { 
            type: 'Calories', 
            value: Math.round(todayData.Consumed_Calorie) || 2500, 
            trend: calculateTrend(todayData.Consumed_Calorie, yesterdayData?.Consumed_Calorie) 
          },
          { 
            type: 'Protein', 
            value: `${Math.round(todayData.Protien) || 75}g`, 
            trend: calculateTrend(todayData.Protien, yesterdayData?.Protien) 
          },
          { 
            type: 'Carbs', 
            value: `${Math.round(todayData.Carb) || 310}g`, 
            trend: calculateTrend(todayData.Carb, yesterdayData?.Carb) 
          },
          { 
            type: 'Fat', 
            value: `${Math.round(todayData.Fat) || 65}g`, 
            trend: calculateTrend(todayData.Fat, yesterdayData?.Fat) 
          }
        ]);

        // Calculate macros distribution
        const totalMacros = todayData.Protien + todayData.Carb + todayData.Fat;
        setNutritionData([
          { 
            label: 'Protein', 
            value: Math.round((todayData.Protien / totalMacros) * 100) || 25, 
            color: '#9333EA' 
          },
          { 
            label: 'Carbs', 
            value: Math.round((todayData.Carb / totalMacros) * 100) || 45, 
            color: '#7C3AED' 
          },
          { 
            label: 'Fat', 
            value: Math.round((todayData.Fat / totalMacros) * 100) || 30, 
            color: '#6366F1' 
          }
        ]);

        // Map the weekly data
        const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const weeklyValues = weekdays.map(day => {
          const dayData = weekData.find(d => d.Day_in_week === day);
          return dayData ? Math.round(dayData.Consumed_Calorie) : 0;
        });

        setWeeklyData({
          values: weeklyValues
        });

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching analysis data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-screen h-screen flex bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white overflow-hidden">
      <Sidenavbar />
      <div className="flex-1 flex flex-col h-full">
        {/* Header Section - Fixed */}
        <div className="p-6 border-b border-white/10 bg-white/5 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center"
          >
            <PieChart className="w-6 h-6 text-purple-400 mr-3" />
            <h1 className="text-2xl font-semibold">Nutrition Analysis</h1>
          </motion.div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : (
            <div className="space-y-6 max-w-7xl mx-auto">
              {/* Stats Grid */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
              >
                {analysisData.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
                  >
                    <h3 className="text-lg font-medium text-purple-300">{item.type}</h3>
                    <div className="mt-2 flex items-end justify-between">
                      <span className="text-2xl font-semibold">{item.value}</span>
                      <span className={`text-sm ${
                        item.trend.startsWith('+') ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {item.trend}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Charts Section */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-medium mb-4 text-purple-300">Weekly Trends</h3>
                  <div className="h-64 bg-white/5 rounded-lg">
                    <WeeklyTrendGraph data={weeklyData} />
                  </div>
                </div>

                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-medium mb-4 text-purple-300">Nutrient Distribution</h3>
                  <div className="h-64 bg-white/5 rounded-lg flex items-center justify-center relative">
                    <PieChartComponent data={nutritionData} />
                  </div>
                </div>
              </motion.div>

              {/* Timeline Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
              >
                <h3 className="text-lg font-medium mb-4 text-purple-300">Monthly Progress</h3>
                <div className="h-72 bg-white/5 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-white/30" />
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analysis;