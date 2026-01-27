export default function NotFoundPage() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-blue-500">404</h1>
        <p className="mt-4 text-lg text-gray-700">Oops! Page not found.</p>
        <a
          href="/"
          className="mt-6 inline-block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Go Home
        </a>
      </div>
    </div>
  )
}