import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Chart } from "react-chartjs-2";

// Register chart components (add more as needed)
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// export function CaloriesChart({ data }) {
//     const caloriesData = buildCaloriesChartData(data.dailyLogs, data.nutritionGoals);
//     const options = buildCaloriesChartData(data.dailyLogs, data.nutritionGoals)
//   return (
//     <div className="w-full h-full">
//       <Chart data={caloriesData} options={{...options}} />
//     </div>
//   );
// }

import { buildMacroChartData } from "../../utils/nutritionChartData";

export function MacroChart({ title, logs, nutritionGoals, periodLength, type="line" }) {
 if(!logs) return (
    <div className="w-full h-[400px]">
      <p>NO DATA</p>
    </div>
  )
  const data = buildMacroChartData(logs, nutritionGoals, periodLength);

  return (
    <div className="w-full h-[400px] px-20">
      <h3 className="text-center font-semibold mb-4">
        {title}
      </h3>
      <Chart type={type} data={data} options={{responsive: true, plugins:{ legend: {
        display: false,
      }}}}/>
    </div>
  );
}
