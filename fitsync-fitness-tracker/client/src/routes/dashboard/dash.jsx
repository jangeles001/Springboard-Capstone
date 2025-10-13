import { createFileRoute } from "@tanstack/react-router";
import Graph from '../../components/Graph';
import { WorkoutsListDisplay } from "../../features/workouts/components//WorkoutsListDisplay";

export const Route = createFileRoute('/dashboard/dash') ({
    component: dash,
})

function dash() {

    const data = null;
    
    // const data = {
    //   labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug'],
    //   datasets: [
    //     { label: ['Me'], data: [30, 50, 40, 30, 50, 100], backgroundColor: 'rgba(75, 192, 192, 0.5)' },
    //     { label: ['You'], data: [10, 20, 30, 40,50, 40], backgroundColor: 'rgba(130, 192, 75, 0.5)' }
    //   ],
    // };
    
    // const prevWorkouts = [
      // {
      //   name: "Workout1",
      //   information:  "This is the workout information!"
      // },
      // {
      //   name: "Workout2",
      //   information:  "This is the workout information!"
      // },
    //];
    
    return (
        <div className='flex flex-col bg-gradient-to-r from-blue-500 to-indigo-600 h-full'>

          <div className="flex flex-col p-15">
            <section className='flex justify-center items-center w-full h-[400px] text-gray-400 bg-gray-100 rounded-2xl border border-gray-200 shadow-sm p-15'>
              { data ? 
                <Graph type='line' data={data} options={{ responsive: true, maintainAspectRatio: false }}/> 
                : <span className='flex text-center'>NO DATA <br></br>Record a workout to begin tracking your progress.</span>
              }
            </section>
          </div>
          

          <div className="flex flex-col justify-center items-center rounded-2xl h-[700px] min-w-full px-10 gap-5 md:flex-row">
            <div className='flex items-center bg-white border rounded-2xl border-gray-700 shadow-sm h-full min-w-1/2 py-10'>
              <WorkoutsListDisplay />
            </div>
            <div className='flex flex-col items-center bg-white border border-gray-700 rounded-2xl p-5 shadow-sm h-full min-w-1/2 md:w-auto'>
              <div className='h-1/2'>Friends</div>
              <div className='h-1/2'>Posts</div>
            </div>
          </div>
        </div>
    )
}