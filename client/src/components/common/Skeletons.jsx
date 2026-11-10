export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse flex flex-col">
      {/* Image Skeleton */}
      <div className="aspect-[3/4] w-full rounded-2xl bg-[#EBE4D8]/60 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
      </div>
      
      {/* Info Skeleton */}
      <div className="mt-5 space-y-3 px-1">
        <div className="h-4 w-2/3 rounded-full bg-[#EBE4D8]/60" />
        <div className="h-3 w-1/3 rounded-full bg-[#EBE4D8]/60" />
        
        <div className="pt-2 flex justify-between items-center">
          <div className="h-4 w-1/4 rounded-full bg-[#EBE4D8]/60" />
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-[#EBE4D8]/60" />
            <div className="h-3 w-3 rounded-full bg-[#EBE4D8]/60" />
            <div className="h-3 w-3 rounded-full bg-[#EBE4D8]/60" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}