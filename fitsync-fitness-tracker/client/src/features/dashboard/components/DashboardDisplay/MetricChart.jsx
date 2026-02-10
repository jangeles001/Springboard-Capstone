import { Bar, Line, Chart } from "react-chartjs-2";

export function MetricChart({ type, data, options }) {
  console.log("Rendering MetricChart with type:", type);
  console.log("Data:", data);
  return (
    <div className="rounded-xl border h-full bg-gray-50 p-6 shadow-sm">
      {type === "combo" && <Chart type="bar" data={data} options={options} />}
      {type === "line" && <Line data={data} options={options} />}
      {type === "bar" && <Bar data={data} options={options} />}
    </div>
  )
}