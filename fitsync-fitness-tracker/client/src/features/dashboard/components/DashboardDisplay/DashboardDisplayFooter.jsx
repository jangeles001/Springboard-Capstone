export function DashboardDisplayFooter(){
  return (
    <div className="rounded-2xl border bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        AI Coach Insights
      </h3>

      <p className="text-sm text-gray-600">
        Personalized recommendations and progress summaries will appear here.
      </p>

      <div className="mt-4 h-24 rounded-lg bg-white/60 animate-pulse" />
    </div>
  );
}