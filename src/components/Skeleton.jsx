const Skeleton = ({ className }) => (
  <div
    className={`animate-pulse bg-surface-tertiary rounded-xl ${className}`}
  />
);

export const PhaseCardSkeleton = () => (
  <div className="rounded-2xl p-6 bg-surface-secondary border border-border h-[200px] flex flex-col gap-4">
    <Skeleton className="w-12 h-12 rounded-xl" />
    <Skeleton className="w-1/2 h-5" />
    <div className="space-y-2">
      <Skeleton className="w-full h-3" />
      <Skeleton className="w-2/3 h-3" />
    </div>
  </div>
);

export const ChatMessageSkeleton = () => (
  <div className="flex gap-3 justify-start">
    <Skeleton className="w-8 h-8 rounded-full shrink-0" />
    <div className="space-y-2 w-[250px]">
      <Skeleton className="w-full h-10 rounded-2xl" />
      <Skeleton className="w-24 h-3 rounded-full" />
    </div>
  </div>
);

export default Skeleton;
