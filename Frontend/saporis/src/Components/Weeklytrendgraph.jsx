import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js';
import React from 'react';
import { Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler
);

const WeeklyTrendGraph = ({ data }) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const chartData = {
    labels: days,
    datasets: [
      {
        data: data.values,
        fill: true,
        borderColor: '#9333EA',
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        tension: 0.4,
        pointBackgroundColor: '#9333EA',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#9333EA',
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
          drawBorder: false,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          padding: 10,
        },
      },
    },
    plugins: {
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(8px)',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 12,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        displayColors: false,
        callbacks: {
          label: (context) => `${context.parsed.y} calories`,
        },
      },
    },
  };

  return (
    <div className="w-full h-full p-4">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default WeeklyTrendGraph;