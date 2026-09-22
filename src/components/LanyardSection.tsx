'use client';

import dynamic from 'next/dynamic';

const Lanyard = dynamic(() => import('@/components/Lanyard'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-transparent flex items-center justify-center" />,
});

interface LanyardSectionProps {
  className?: string;
  position?: [number, number, number];
  gravity?: [number, number, number];
  fov?: number;
  transparent?: boolean;
  triggerKey?: number | string;
}

export default function LanyardSection({
  className = '',
  position = [0, 0, 20],
  gravity = [0, -40, 0],
  fov = 20,
  transparent = true,
  triggerKey,
}: LanyardSectionProps) {
  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <Lanyard
        position={position}
        gravity={gravity}
        fov={fov}
        transparent={transparent}
        className="w-full h-full"
        triggerKey={triggerKey}
      />
    </div>
  );
}
