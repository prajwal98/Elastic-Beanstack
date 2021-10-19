import React from "react";
import { Bar } from "react-chartjs-2";
export default function BarChart() {
  return (
    <div style={{ width: "200px", height: "200px" }}>
      <Bar
        data={{
          labels: ["Red", "Yellow", "Green", "red", "yellow", "green"],
          datasets: [
            {
              label: "# of Votes",
              data: [12, 19, 3, 5, 2, 3],
              backgroundColor: "red",// "yellow", "green","red", "yellow", "green"],
              borderWidth: 1,
              barThickness: 10,
              maxBarThickness: 10,
            },
          ],
        }}
        width={100}
        height={50}
        options={{ maintainAspectRatio: false }}
      />
    </div>
  );
}
