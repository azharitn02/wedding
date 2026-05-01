import { cn, getAssetPath } from '@/lib/utils';
import Image from 'next/image';

interface StampProps {
  children: React.ReactNode;
  className?: string;
}

export default function Stamp({ children, className }: StampProps) {
  return (
    <div className={cn(
      "relative",
      className
    )}>
      {/* Background border using bg1.png */}
      {/* <div className="absolute inset-[-20px] md:inset-[-40px] z-[-1] drop-shadow-xl"> */}
      <div className="absolute inset-0 z-[-1] drop-shadow-xl">
        <Image 
          src={getAssetPath('/bg1.png')} 
          alt="Stamp Border" 
          fill
          className="object-contain"
          referrerPolicy="no-referrer"
        />
      </div>
      
      {/* Container for children content inside the stamp border */}
      <div className="relative z-10 h-full p-4 md:p-8 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}
