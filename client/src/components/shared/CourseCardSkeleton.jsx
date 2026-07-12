export default function CourseCardSkeleton() {
  return (
    <div className="card">
      <div className="skeleton h-48 w-full" />
      <div className="p-5 space-y-3">
        <div className="skeleton h-4 w-1/3" />
        <div className="skeleton h-6 w-full" />
        <div className="skeleton h-4 w-2/3" />
        <div className="flex items-center gap-4 pt-2">
          <div className="skeleton h-4 w-20" />
          <div className="skeleton h-4 w-16" />
        </div>
      </div>
    </div>
  );
}
