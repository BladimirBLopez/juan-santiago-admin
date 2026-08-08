export default function Loading() {
  return (
    <main className="px-4 py-5 max-w-2xl mx-auto animate-pulse">
      <div className="h-6 w-32 bg-[#e5e5eb] dark:bg-[#2a2a3d] rounded mb-5" />
      <div className="h-10 bg-[#e5e5eb] dark:bg-[#2a2a3d] rounded-lg mb-4" />
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-[#e5e5eb] dark:bg-[#2a2a3d] rounded-xl" />
        ))}
      </div>
    </main>
  );
}
