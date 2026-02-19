import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';



Chart.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const TaskPieChart = ({tasks }) => {


  console.log("tasks", tasks);

  const countStatuses = (tasks) => {
    const statusCounts = { 'Submitted': 0, 'In Progress': 0, 'Approved': 0, 'Rejected': 0 };
  
    tasks.forEach(task => {
      if (statusCounts.hasOwnProperty(task.status)) {
        statusCounts[task.status]++;
      }
    });
  
    return Object.values(statusCounts);
  };

  const dataValue = countStatuses(tasks);
  console.log("countStatuses", dataValue);

  const data = {
    labels: ['Submitted', 'In Progress', 'Approved', 'Rejected'],
    datasets: [
      {
        data: dataValue,
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF8042'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF8042'],
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#fff',
          font: { size: 13, weight: '600' },
          padding: 16,
          usePointStyle: true,
          pointStyleWidth: 10,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.label || '';
            if (label) label += ': ';
            label += context.raw;
            return label;
          },
        },
      },
      datalabels: {
        color: '#fff',
        formatter: (value) => (value > 0 ? value : ''),
        font: { weight: 'bold', size: 14 },
        anchor: 'center',
        align: 'center',
      },
    },
  };

  return (
    <div style={{ width: 260, height: 300 }}>
      <Pie data={data} options={options} />
    </div>
  );
};


export default TaskPieChart;



