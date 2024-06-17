import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';



Chart.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const TaskPieChart = ({ dataValues }) => {
  const data = {
    labels: ['Submitted', 'In Progress', 'Approved', 'Rejected'],
    datasets: [
      {
        data: dataValues,
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF8042'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF8042'],
      },
    ],
  };

  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            label += context.raw;
            return label;
          },
        },
      },
      datalabels: {
        color: '#fff',
        formatter: (value, context) => {
          return value;
        },
        font: {
          weight: 'bold',
          size: 14,
        },
        anchor: 'center',
        align: 'center',
      },
    },
  };

  return <Pie data={data} options={options} width="240px" height="240px"/>;
};


export default TaskPieChart;



