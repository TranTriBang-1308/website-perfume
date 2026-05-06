import { SkeletonProductCard, Skeleton } from "@/components/ui/skeleton";

export default function ProductsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="border-b border-border-soft pb-8">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-3 h-12 w-72" />
      </div>
      <div className="mt-10 grid gap-10 lg:grid-cols-[260px_1fr]">
        <aside className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-3 w-1/3" />
              <Skeleton className="h-3 w-2/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </aside>
        <div>
          <div className="grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <SkeletonProductCard key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
