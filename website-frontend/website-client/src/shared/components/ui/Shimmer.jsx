import SkeletonBlock from '@/shared/components/skeleton/SkeletonBlock'

/** @deprecated Prefer `SkeletonBlock` from `@/shared/components/skeleton`. */
export function SkeletonBar({ className = '' }) {
  return <SkeletonBlock className={className} />
}

/** @deprecated Use SkeletonBar */
export default function Shimmer({ className = '' }) {
  return <SkeletonBar className={className} />
}
