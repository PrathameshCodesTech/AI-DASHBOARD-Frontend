import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar, Pie, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ChartRenderer = ({ chartConfig }) => {
  console.log('ChartRenderer received:', chartConfig);
  console.log('Chart type:', chartConfig?.type);
  console.log('Chart data:', chartConfig?.data);
  console.log('Labels:', chartConfig?.data?.labels || chartConfig?.labels);
  console.log('Datasets:', chartConfig?.data?.datasets || chartConfig?.datasets);
  if (!chartConfig || !chartConfig.type) {
    return null;
  }

  // Handle both nested and flat data structures
  const chartData = chartConfig.data || {
    labels: chartConfig.labels || [],
    datasets: chartConfig.datasets || []
  };

  console.log('Dataset values:', chartConfig?.data?.datasets[0]?.data);
  // Dark theme chart options
// Light theme chart options for better visibility
const darkThemeOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: '#374151',
        font: {
          size: 12
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      titleColor: '#111827',
      bodyColor: '#374151',
      borderColor: '#d1d5db',
      borderWidth: 1
    }
  },
  scales: chartConfig.type !== 'pie' && chartConfig.type !== 'doughnut' ? {
    x: {
      grid: {
        color: 'rgba(209, 213, 219, 0.5)',
        drawBorder: false
      },
      ticks: {
        color: '#6b7280'
      }
    },
    y: {
      grid: {
        color: 'rgba(209, 213, 219, 0.5)',
        drawBorder: false
      },
      ticks: {
        color: '#6b7280'
      },
      beginAtZero: true
    }
  } : {}
};

  // Colorful datasets for dark theme
  const colorfulColors = [
    '#0ea5e9', '#d946ef', '#10b981', '#f59e0b', '#ef4444',
    '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316',
  ];

  // Ensure datasets have colors
  const finalChartData = {
    ...chartData,
    datasets: chartData.datasets?.map((dataset, index) => ({
      ...dataset,
      backgroundColor: dataset.backgroundColor || (
        Array.isArray(dataset.data) && dataset.data.length > 1
          ? colorfulColors.slice(0, dataset.data.length)
          : colorfulColors[index % colorfulColors.length]
      ),
      borderColor: dataset.borderColor || colorfulColors[index % colorfulColors.length],
      borderWidth: dataset.borderWidth || 2,
    })) || []
  };

const renderChart = () => {
  // Validate data before rendering
  const hasValidData = finalChartData.datasets?.[0]?.data?.some(val => val > 0);
  
  if (!hasValidData && chartConfig.type !== 'table' && chartConfig.type !== 'metric') {
    return <div className="text-center text-gray-500 py-8">No data available for chart</div>;
  }

  switch (chartConfig.type) {
    case 'bar':
      return <Bar data={finalChartData} options={darkThemeOptions} />;
    case 'pie':
      return <Pie data={finalChartData} options={darkThemeOptions} />;
    case 'line':
      return <Line data={finalChartData} options={darkThemeOptions} />;
    case 'doughnut':
      return <Doughnut data={finalChartData} options={darkThemeOptions} />;
    case 'area':
      const areaData = {
        ...finalChartData,
        datasets: finalChartData.datasets.map(dataset => ({
          ...dataset,
          fill: true,
          backgroundColor: 'rgba(14, 165, 233, 0.2)',
        }))
      };
      return <Line data={areaData} options={darkThemeOptions} />;
    case 'table':
      return <TableView data={chartConfig} />;
    case 'metric':
      return <MetricView data={chartConfig} />;
    default:
      return <div className="text-gray-500">Unsupported chart type: {chartConfig.type}</div>;
  }
};


  return (
    <div className="my-4 p-4 bg-white border border-gray-300 rounded-xl shadow-lg">
      {chartConfig.title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{chartConfig.title}</h3>
      )}
      <div style={{ 
        position: 'relative', 
        width: '100%', 
        height: '400px',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        padding: '10px'
      }}>
        {renderChart()}
      </div>
    </div>
  );


};


// Table View Component
const TableView = ({ data }) => {
  if (!data.tableData) return null;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-dark-700">
            {data.tableData.headers?.map((header, index) => (
              <th key={index} className="px-4 py-2 text-left text-dark-300 font-medium">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.tableData.rows?.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-dark-800 hover:bg-dark-800/50">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-4 py-2 text-dark-100">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Metric View Component
const MetricView = ({ data }) => {
  if (!data.metric) return null;

  return (
    <div className="text-center py-8">
      <div className="text-5xl font-bold gradient-text mb-2">
        {data.metric.value}
      </div>
      {data.metric.label && (
        <div className="text-dark-400 text-lg">{data.metric.label}</div>
      )}
    </div>
  );
};

export default ChartRenderer;