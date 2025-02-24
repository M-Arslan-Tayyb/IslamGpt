import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    {/* Main Content */}
    <div className="lg:col-span-2">
      <div className="bg-gray-50 rounded-lg p-6 flex flex-col justify-center items-center h-48 relative">
        {/* Placeholder text */}
        <Skeleton className="h-6 w-[120px]" />

        {/* Icons in top right */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>
      </div>
    </div>

    {/* Sidebar */}
    <div className="lg:col-span-1">
      <div className="bg-orange-50 rounded-lg p-4">
        {/* Related Quran */}
        <div className="flex items-center justify-between mb-3">
          <Skeleton className="h-5 w-[100px]" />
          <Skeleton className="h-4 w-4" />
        </div>
        <Skeleton className="h-6 w-full mb-4" />

        {/* Related Hadiths */}
        <div className="flex items-center justify-between mb-3">
          <Skeleton className="h-5 w-[120px]" />
          <Skeleton className="h-4 w-4" />
        </div>
        <Skeleton className="h-6 w-full" />
      </div>
    </div>
  </div>
);

export default LoadingSkeleton;
