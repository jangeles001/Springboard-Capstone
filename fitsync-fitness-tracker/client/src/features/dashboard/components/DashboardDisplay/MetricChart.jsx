import { Bar, Line, Chart } from "react-chartjs-2";

export function MetricChart({ title, type, data, options }) {
  if (!data || !data.datasets.length) {
    return <div className="w-full h-[400px]">NO DATA</div>;
  }

  return (
    <div className="rounded-xl border h-full bg-gray-50 p-10 shadow-sm">
      <h3 className="text-center font-semibold">{title}</h3>
      {type === "combo" && <Chart type="bar" data={data} options={options} />}
      {type === "line" && <Line data={data} options={options} />}
      {type === "bar" && <Bar data={data} options={options} />}
    </div>
  )
}