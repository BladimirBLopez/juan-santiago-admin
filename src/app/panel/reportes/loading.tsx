export default function Loading() {
  return (
    <main className="px-4 py-5 max-w-2xl mx-auto animate-pulse space-y-3">
      <div className="h-6 w-28 bg-[#e5e5eb] dark:bg-[#2a2a3d] rounded mb-2" />
      <div className="grid grid-cols-2 gap-2.5">
        <div className="h-20 bg-[#e5e5eb] dark:bg-[#2a2a3d] rounded-xl" />
        <div className="h-20 bg-[#e5e5eb] dark:bg-[#2a2a3d] rounded-xl" />
      </div>
      <div className="h-40 bg-[#e5e5eb] dark:bg-[#2a2a3d] rounded-xl" />
      <div className="h-40 bg-[#e5e5eb] dark:bg-[#2a2a3d] rounded-xl" />
    </main>
  );
}
