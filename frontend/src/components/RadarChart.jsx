import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const RadarChart = ({ stats, labels, name, color = '#00ff88' }) => {
  // Helper to ensure color works with opacity even if it's a CSS variable or hex
  // For simplicity and performance, we'll assume hex colors for now as Chart.js
  // prefers resolved values.
  const data = {
    labels: labels || ['Shooting', 'Passing', 'Dribbling', 'Physical', 'Defense', 'Speed'],
    datasets: [
      {
        label: name,
        data: stats,
        backgroundColor: color.startsWith('#') ? `${color}44` : 'rgba(0, 255, 136, 0.2)', // 25% opacity
        borderColor: color,
        borderWidth: 3,
        pointBackgroundColor: color,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: color,
        fill: true,
      },
    ],
  };

  const options = {
    scales: {
      r: {
        angleLines: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        pointLabels: {
          color: '#fff',
          font: {
            family: 'Orbitron',
            size: 10,
          },
        },
        ticks: {
          display: false,
          stepSize: 20,
        },
        suggestedMin: 0,
        suggestedMax: 100,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="radar-container" style={{ width: '100%', height: '300px' }}>
      <Radar data={data} options={options} />
    </div>
  );
};

export default RadarChart;
