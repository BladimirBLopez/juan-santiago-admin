export default function Loading() {
  return (
    <main className="px-4 py-5 max-w-2xl mx-auto animate-pulse space-y-2.5">
      <div className="h-6 w-24 bg-[#e5e5eb] dark:bg-[#2a2a3d] rounded mb-3" />
      {[1, 2, 3, 4, 5, 6, 7].map((i) => (
        <div key={i} className="h-14 bg-[#e5e5eb] dark:bg-[#2a2a3d] rounded-xl" />
      ))}
    </main>
  );
}
