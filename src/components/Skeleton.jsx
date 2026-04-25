import React from 'react';

const Skeleton = ({ className }) => {
  return (
    <div className={`animate-pulse bg-white/5 rounded-xl ${className}`}></div>
  );
};

export const PhaseCardSkeleton = () => (
  <div className="rounded-3xl p-6 bg-white/5 border border-white/5 h-[200px] flex flex-col gap-4">
    <Skeleton className="w-14 h-14 rounded-2xl" />
    <Skeleton className="w-1/2 h-6" />
    <div className="space-y-2">
      <Skeleton className="w-full h-4" />
      <Skeleton className="w-2/3 h-4" />
    </div>
  </div>
);

export const ChatMessageSkeleton = () => (
  <div className="flex gap-3 justify-start">
    <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
    <div className="space-y-2 w-[250px]">
      <Skeleton className="w-full h-12 rounded-2xl rounded-tl-none" />
    </div>
  </div>
);

export default Skeleton;
