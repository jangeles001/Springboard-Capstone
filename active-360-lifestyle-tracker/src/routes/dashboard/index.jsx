import { createFileRoute } from '@tanstack/react-router'
import Graph from '../../components/Graph'

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

  return (
    <div className='flex justify-center w-full'>
      <div className="w-[40%]">
        <Graph type='line' data={data} />
      </div>
    </div>
  )
}
