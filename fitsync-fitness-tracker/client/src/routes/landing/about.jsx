import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/landing/about')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="px-6 md:px-10 py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-5xl mx-auto text-center">
          <p className="inline-block text-sm font-medium tracking-wide uppercase text-gray-500">
            About Us
          </p>
          <h1 className="mt-3 text-4xl md:text-5xl font-extrabold leading-tight">
            Smarter workouts, built for your body.
          </h1>
          <p className="mt-4 md:mt-6 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Personalized training plans powered by your unique health data — so you can train
            safer, progress faster, and stay consistent.
          </p>
          <div className="mt-8">
          <a
          href="/auth/login"
          className="inline-flex items-center gap-2 rounded-2xl border border-transparent bg-blue-600 px-6 py-3 text-white font-semibold shadow hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            Get Started Today
          </a>
          </div>
        </div>
      </header>

      <main className="px-6 md:px-10 pb-20">
        <div className="max-w-5xl mx-auto">
          <section className="py-12 border-b border-gray-100">
            <h2 className="text-2xl md:text-3xl font-bold">My Mission</h2>
            <p className="mt-4 text-gray-700 leading-relaxed">
              My mission is to empower individuals to take control of their fitness journey by providing
              <span className="font-semibold"> personalized workout recommendations</span> built around their
              unique health data. I believe that lasting progress comes from plans designed for real people
              not cookie-cutter routines. By combining smart insights with a simple, user-friendly experience,
              we help you stay motivated, track your growth, and reach your goals with confidence.
            </p>
          </section>
          <section className="py-12 border-b border-gray-100">
            <h2 className="text-2xl md:text-3xl font-bold">My Story</h2>
            <p className="mt-4 text-gray-700 leading-relaxed">
              I started this project after realizing most fitness apps take a one-size-fits-all approach.
              Everyone's body, health history, and lifestyle are different. Generic workouts can leave people
              stuck, frustrated, or injured. I built this app to change that by making workouts adaptable to
              your data - fitness level, goals, schedule, and recovery needs so your plan fits your life and
              grows with you.
            </p>
          </section>
          <section className="py-12 border-b border-gray-100">
            <h2 className="text-2xl md:text-3xl font-bold">My Values</h2>
            <ul className="mt-6 grid gap-6 md:grid-cols-2">
              <li className="rounded-2xl border border-gray-200 p-5 shadow-sm">
                <div className="text-xl font-semibold">Personalization</div>
                <p className="mt-2 text-gray-700">Every workout adapts to you, not the other way around.</p>
              </li>
              <li className="rounded-2xl border border-gray-200 p-5 shadow-sm">
                <div className="text-xl font-semibold">Accessibility</div>
                <p className="mt-2 text-gray-700">Fitness should be achievable for anyone, at any level.</p>
              </li>
              <li className="rounded-2xl border border-gray-200 p-5 shadow-sm">
                <div className="text-xl font-semibold">Sustainability</div>
                <p className="mt-2 text-gray-700">We focus on long-term progress, not quick fixes.</p>
              </li>
              <li className="rounded-2xl border border-gray-200 p-5 shadow-sm">
                <div className="text-xl font-semibold">Data‑Driven</div>
                <p className="mt-2 text-gray-700">Smarter recommendations for safer, more effective training.</p>
              </li>
            </ul>
          </section>



          <section className="py-12 border-b border-gray-100">
            <h2 className="text-2xl md:text-3xl font-bold">How It Works</h2>
            <ol className="mt-6 grid gap-6 md:grid-cols-3">
              <li className="rounded-2xl border border-gray-200 p-5 shadow-sm">
                <div className="text-sm font-medium text-gray-500">Step 1</div>
                <div className="mt-1 text-lg font-semibold">Enter your health data</div>
                <p className="mt-2 text-gray-700">Share your fitness level, goals, preferences, and schedule.</p>
              </li>
              <li className="rounded-2xl border border-gray-200 p-5 shadow-sm">
                <div className="text-sm font-medium text-gray-500">Step 2</div>
                <div className="mt-1 text-lg font-semibold">Get your plan</div>
                <p className="mt-2 text-gray-700">Receive personalized workout recommendations tailored to you.</p>
              </li>
              <li className="rounded-2xl border border-gray-200 p-5 shadow-sm">
                <div className="text-sm font-medium text-gray-500">Step 3</div>
                <div className="mt-1 text-lg font-semibold">Track & evolve</div>
                <p className="mt-2 text-gray-700">Adjust as you progress and keep momentum week after week.</p>
              </li>
            </ol>
          </section>



          <section className="py-12">
            <h2 className="text-2xl md:text-3xl font-bold">The Road Ahead</h2>
            <ul className="mt-6 grid gap-6 md:grid-cols-2">
              <li className="rounded-2xl border border-gray-200 p-5 shadow-sm">
                <div className="text-lg font-semibold">Nutrition insights</div>
                <p className="mt-2 text-gray-700">Pair training with simple nutrition guidance.</p>
              </li>
              <li className="rounded-2xl border border-gray-200 p-5 shadow-sm">
                <div className="text-lg font-semibold">Community challenges</div>
                <p className="mt-2 text-gray-700">Stay motivated with group goals and friendly competition.</p>
              </li>
              <li className="rounded-2xl border border-gray-200 p-5 shadow-sm">
                <div className="text-lg font-semibold">Device syncing</div>
                <p className="mt-2 text-gray-700">Connect wearables for deeper health tracking.</p>
              </li>
              <li className="rounded-2xl border border-gray-200 p-5 shadow-sm">
                <div className="text-lg font-semibold">Progress insights</div>
                <p className="mt-2 text-gray-700">Clear trends to help you plan each phase smarter.</p>
              </li>
            </ul>
          </section>
        </div>
      </main>


      <footer className="px-6 md:px-10 py-12 bg-gray-50">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <h3 className="text-xl font-semibold">Ready to start?</h3>
          <a
          href="/auth/login"
          className="inline-flex items-center gap-2 rounded-2xl border border-transparent bg-blue-600 px-6 py-3 text-white font-semibold shadow hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            Create Your Plan
          </a>
        </div>
      </footer>
    </div>
  )
}
