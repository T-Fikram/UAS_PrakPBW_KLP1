import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

export default function DoughnutChart({ data, labels, colors }) {
  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: colors || [
          '#10b981', // emerald
          '#3b82f6', // blue
          '#f59e0b', // amber
          '#ef4444', // red
        ],
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#64748b',
          padding: 20,
          font: { size: 12 },
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        padding: 12,
        cornerRadius: 12,
        backgroundColor: '#1e293b',
        titleFont: { size: 13, weight: 'bold' },
        bodyFont: { size: 12 },
      },
    },
    cutout: '70%',
  };

  return (
    <div className="w-full h-full min-h-[200px]">
      <Doughnut data={chartData} options={options} />
    </div>
  );
}
