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
  Legend
);

export default function Graph({ type = "line", data = [], options = {} }) {
  if(data.length === 0)  
    return <span className='flex text-center'>NO DATA <br></br>Record a workout to begin tracking your progress.</span>

  return (
    <>
      {
        type === "line" &&
          <Chart type={type} data={data} options={options} />
      }
      {
        type === "mixed-line" && <></>
        
      }
      
    </>
  ) 
}