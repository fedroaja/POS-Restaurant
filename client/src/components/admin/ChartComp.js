import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

function ChartComp(props) {

  const labels = ['Day-1', 'Day-2', 'Day-3', 'Day-4', 'Day-5', 'Day-6', 'Day-7'];
  const data = {
    labels,
    datasets: [
      {
        fill: true,
        label: 'Penjualan',
        data: props.penjualan,
        borderColor: '#9a4cb5',
        backgroundColor: 'rgba(247, 224, 255, 0.5)',
      },
      {
        fill: true,
        label: 'Product',
        data: props.product,
        borderColor: '#42bac9',
        backgroundColor: 'rgba(168, 245, 255, 0.5)',
      },
      {
        fill: true,
        label: 'Table',
        data: props.table,
        borderColor: '#ba773f',
        backgroundColor: 'rgba(255, 210, 173, 0.5)',
      },
    ],
  };

  return (
    <div style={{ position: "relative", margin: "auto", width: "50vw", height: '50vh' }}>
    <Line
      options={{
        responsive: true,
        maintainAspectRatio: true,
      }}
      data={data} 
    />
    </div>
  )
}

export default ChartComp
