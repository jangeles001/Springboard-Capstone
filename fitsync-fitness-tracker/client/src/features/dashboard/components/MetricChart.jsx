import { Bar, Line, Chart } from "react-chartjs-2";

export function MetricChart({ type, data, options }) {
  if (type === "combo") {
    return <Chart type="bar" data={data} options={options} />;
  }

  if (type === "line") {
    return <Line data={data} options={options} />;
  }

  return <Bar data={data} options={options} />;
}