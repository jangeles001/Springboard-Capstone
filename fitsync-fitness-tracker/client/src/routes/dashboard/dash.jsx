import { createFileRoute } from "@tanstack/react-router";
import Graph from '../../features/dashboard/components/DashboardDisplay/Graph.jsx';
import { Dashboard } from "../../features/dashboard/components/Dashboard.jsx";

export const Route = createFileRoute('/dashboard/dash') ({
    component: dash,
})

function dash() {
    return (
      <Dashboard />

    //     <div className='flex flex-col bg-gradient-to-r from-blue-500 to-indigo-600 h-full'>
    //       <div className="flex flex-col p-15">
    //         <section className='flex justify-center items-center w-full h-[400px] text-gray-400 bg-gray-100 rounded-2xl border border-gray-200 shadow-sm p-15'>
    //           { data ? 
    //             <Graph type='line' data={data} options={{ responsive: true, maintainAspectRatio: false }}/> 
    //             : <span className='flex text-center'>NO DATA <br></br>Record a workout to begin tracking your progress.</span>
    //           }
    //         </section>
    //       </div>
          

    //       <div className="flex flex-col justify-center items-center rounded-2xl h-[700px] min-w-full px-10 gap-5 md:flex-row">
    //         <div className='flex bg-white border rounded-2xl border-gray-700 shadow-sm h-full min-w-1/2 py-10'>
    //         <h1></h1>

    //         </div>
    //         <div className='flex flex-col items-center bg-white border border-gray-700 rounded-2xl p-5 shadow-sm h-full min-w-1/2 md:w-auto'>
    //           <div className='h-1/2'>Friends</div>
    //           <div className='h-1/2'>Posts</div>
    //         </div>
    //       </div>
    //     </div>
    )
}