import { createFileRoute } from '@tanstack/react-router'
import Graph from '../../components/Graph'
import ContentBox from '../../components/ContentBox';

export const Route = createFileRoute('/dashboard/')({
  component: RouteComponent,
})

function RouteComponent() {
  
  const data = null;

  // const data = {
  //   labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug'],
  //   datasets: [
  //     { label: ['Me'], data: [30, 50, 40, 30, 50, 100], backgroundColor: 'rgba(75, 192, 192, 0.5)' },
  //     { label: ['You'], data: [10, 20, 30, 40,50, 40], backgroundColor: 'rgba(130, 192, 75, 0.5)' }
  //   ],
  // };

  const prevWorkouts = [{
    name: "Workout1",
    information:  "This is the workout information!"
  },
  {
    name: "Workout2",
    information:  "This is the workout information!"
  },
  {
    name: "Workout3",
    information:  "This is the workout information!"
  },
  {
    name: "Workout4",
    information:  "This is the workout information!"
  },
  {
    name: "Workout5",
    information:  "This is the workout information!"
  },
];

  return (
    <div className='flex flex-col'>
      <div className="flex flex-col p-15">
        {data ? <section className='flex justify-center w-full h-[400px]'><Graph type='line' data={data} options={{ responsive: true, maintainAspectRatio: false }}/></section> : 
        <section className='flex flex-col items-center p-20 text-gray-400 opacity-40 h-[300px]'><span className='mt-10'>NO DATA</span>Record a workout to begin tracking your progress.</section>}
      </div>
      <div className='grid grid-cols-3'>
        <div className='flex flex-col items-center col-span-2 border-3'>
          <section>Previous Workouts</section>
          {prevWorkouts.map((workout) => {
            return (
              <div className='flex p-5'>
                <ContentBox title={workout.name} content={workout.information} />
              </div>
            )
          })}
        </div>
        <div className='flex flex-col items-center border-3 min--screen'>
          <div className='min-h-[50%]'>Friends</div>
          <div className=''>Posts</div>
        </div>
        
      </div>
    </div>
  )
}
