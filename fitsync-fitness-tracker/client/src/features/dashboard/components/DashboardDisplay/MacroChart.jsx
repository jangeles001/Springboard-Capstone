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

export function MacroChart({ title, data, type = "bar" }) {
  if (!data || !data.datasets.length) {
    return <div className="w-full h-[400px]">NO DATA</div>;
  }

  return (
    <div className="rounded-xl border h-full bg-gray-50 p-6 shadow-sm">
      <h3 className="text-center font-semibold">{title}</h3>
      <Chart
        type={type}
        data={data}
        options={{ responsive: true, maintainAspectRatio: false }}
      />
    </div>
  );
}
