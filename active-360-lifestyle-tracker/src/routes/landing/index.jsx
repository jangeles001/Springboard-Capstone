import { createFileRoute, Link } from '@tanstack/react-router'
import Carousel from '../../components/Carousel'
import CookiesNotification from '../../features/cookies/component/CookiesNotification';

export const Route = createFileRoute('/landing/')({
  component: RouteComponent,
})

function RouteComponent() {

  const images = [
    "https://picsum.photos/seed/5371/600/400",
    "https://picsum.photos/seed/5850/600/400",
    "https://picsum.photos/seed/7807/600/400",
    "https://picsum.photos/seed/8223/600/400",
    "https://picsum.photos/seed/2921/600/400",
    "https://picsum.photos/seed/8185/600/400",
    "https://picsum.photos/seed/2255/600/400",
    "https://picsum.photos/seed/3851/600/400",
    "https://picsum.photos/seed/6274/600/400",
    "https://picsum.photos/seed/5881/600/400",
  ];

  return (
    <div>
      <CookiesNotification />
      <section class="text-center py-20 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
        <h1 class="text-5xl font-bold mb-4">Your Workout, Personalized</h1>
        <p class="text-lg mb-6">Get custom fitness recommendations based on your health data and goals.</p>
        <a href="/auth/ " class="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow hover:bg-gray-200">
          Start Free Today
        </a>
      </section>

      <section id="features" class="py-20 px-6 max-w-6xl mx-auto">
        <h2 class="text-3xl font-bold text-center mb-12">Why Choose Active360?</h2>
        <div class="grid md:grid-cols-3 gap-10 text-center">
          <div class="p-6 bg-white rounded-xl shadow">
            <h3 class="text-xl font-semibold mb-2">Personalized Plans</h3>
            <p>Tailored workouts built around your body, preferences, and lifestyle.</p>
          </div>
          <div class="p-6 bg-white rounded-xl shadow">
            <h3 class="text-xl font-semibold mb-2">Track Your Progress</h3>
            <p>Monitor performance and milestones with smart tracking tools.</p>
          </div>
          <div class="p-6 bg-white rounded-xl shadow">
            <h3 class="text-xl font-semibold mb-2">Stay Motivated</h3>
            <p>Daily reminders, progress badges, and streak tracking to keep you on track.</p>
          </div>
        </div>
      </section>

      <Carousel items={images} interval={6000} />

      <section class="py-20 text-center bg-blue-600 text-white">
        <h2 class="text-3xl font-bold mb-4">Ready to Transform Your Fitness?</h2>
        <p class="mb-6">Join Active360 and start your personalized fitness journey today.</p>
        <a href="/auth/" class="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow hover:bg-gray-200">
          Get Started
        </a>
      </section>

      <footer class="bg-gray-900 text-gray-300 py-6 text-center">
        <p>&copy; 2025 Active360. All rights reserved.</p>
        <div class="mt-2">
          <Link to="/legal/privacy" class="mx-2 hover:text-white">Privacy Policy</Link>
          <Link to="/legal/" class="mx-2 hover:text-white">Terms of Service</Link>
        </div>
      </footer>
    </div>
  )
}
