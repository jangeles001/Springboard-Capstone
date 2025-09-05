import { createFileRoute } from '@tanstack/react-router'
import Graph from '../../components/Graph'
import ContentBox from '../../components/ContentBox';

export const Route = createFileRoute('/dashboard/')({
  component: RouteComponent,
})

function RouteComponent() {
  
  const data = {
    labels: ['Jan', 'Feb', 'Mar'],
    datasets: [
      { label: 'Sales', data: [30, 50, 40], backgroundColor: 'rgba(75, 192, 192, 0.5)' }
    ],
  };

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
    <div className='flex flex-col justify-center w-full'>
      <div className="flex flex-col items-center mx-auto p-15">
        {data ? <Graph type='line' data={data} /> : <section className='flex flex-row justify-center p-20'>NO DATA</section>}
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
        <div className='flex flex-col items-center border-3 min-h-screen'>
          <div className='min-h-[50%]'>Friends</div>
          <div className=''>Posts</div>
        </div>
        
      </div>
    </div>
  )
}
