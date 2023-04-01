import React, { useEffect, useState } from "react";
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
} from "chart.js";
import { Line } from "react-chartjs-2";

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
  const labels = [
    "January",
    "February",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "July",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  const [data, setData] = useState({
    labels,
    datasets: [
      {
        fill: true,
        label: "Earning",
        data: props.earning,
        borderColor: "#9a4cb5",
        backgroundColor: "rgba(247, 224, 255, 0.5)",
      },
    ],
  });

  // useEffect(()=>{
  //   (async function(){
  //     let myUser = await fetch("http://localhost:5000/trans/graph", {method:"get", credentials:"include"});
  //     let myRes = await myUser.json().then(res =>{
  //       // data.datasets[0].data = [];
  //       // data.datasets[1].data = [];

  //       res.earning.forEach(e => {
  //         data.datasets[0].data.push(e.totalEarning)
  //       });
  //       res.product.forEach(e => {
  //         data.datasets[1].data.push(e.totalProduct)
  //       });
  //     });

  //     setIsLoad(false);

  //     // const newEarning = {...data.datasets};
  //     // newEarning[0].data = myEarning;
  //     // setData((prev) => ({
  //     //   ...prev,
  //     // }));

  //     console.log(data)

  //   })();
  // }, [])

  return (
    <div
      style={{
        position: "relative",
        margin: "auto",
        width: "50vw",
        height: "50vh",
      }}
    >
      <Line
        options={{
          responsive: true,
          maintainAspectRatio: true,
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: "Earning This Year",
            },
          },
        }}
        data={data}
      />
    </div>
  );
}

export default ChartComp;
