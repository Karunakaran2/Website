import React from "react";
import SkeletonBlock from "./SkeletonBlock";

const COL_CLASS = {
  2: "grid gap-3 sm:grid-cols-2",
  3: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
  6: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
};

/** Form field grid skeleton — personal details / profile sections */
export default function FormSkeleton({ fields = 9, cols = 3, className = "" }) {
  const gridClass = COL_CLASS[cols] || COL_CLASS[3];

  return (
    <div className={`${gridClass} ${className}`.trim()} aria-hidden="true">
      {Array.from({ length: fields }).map((_, index) => (
        <div key={index} className="space-y-1.5">
          <SkeletonBlock className="h-3 w-20 sm:w-28" />
          <SkeletonBlock className="h-10 w-full rounded-md" />
        </div>
      ))}
    </div>
  );
}
