import { Skeleton, SkeletonText } from "@/components/ui/skeleton";

export default function ProductDetailLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Skeleton className="h-3 w-48" />
      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="space-y-4">
          <Skeleton className="aspect-4/5 w-full" />
          <div className="grid grid-cols-5 gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square" />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <SkeletonText lines={5} />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  );
}
