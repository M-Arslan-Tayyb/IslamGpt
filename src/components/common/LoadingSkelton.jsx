import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div className="lg:col-span-2">
      <div className="bg-white rounded-lg p-6">
        {/* Query skeleton */}
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-8 w-[200px]" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
        {/* AI Response skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-[90%]" />
          <Skeleton className="h-4 w-[80%]" />
          <Skeleton className="h-4 w-[85%]" />
        </div>
      </div>
      {/* Chat input skeleton */}
      <div className="mt-6">
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>
    </div>
    <div className="lg:col-span-1">
      <div className="bg-white rounded-lg p-6">
        {/* Related content header skeleton */}
        <Skeleton className="h-7 w-[150px] mb-4" />
        {/* Tabs skeleton */}
        <Skeleton className="h-10 w-full mb-4" />
        {/* Content items skeleton */}
        <div className="space-y-4">
          <div className="space-y-3">
            <Skeleton className="h-20 w-full rounded-lg" />
            <Skeleton className="h-20 w-full rounded-lg" />
            <Skeleton className="h-20 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default LoadingSkeleton;
