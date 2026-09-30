import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 100 100" 
      fill="none" 
      className={cn("w-10 h-10", className)}
    >
      <defs>
        <linearGradient id="cloudGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#5b9bd5"/>
          <stop offset="100%" stopColor="#1e3a5f"/>
        </linearGradient>
        <linearGradient id="accentGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f0ab5e"/>
          <stop offset="100%" stopColor="#e8943a"/>
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      
      {/* Soft Cloud Shape */}
      <path 
        d="M 28 55 A 12 12 0 0 1 42 42 A 18 18 0 0 1 73 52 A 12 12 0 0 1 73 76 L 28 76 A 12 12 0 0 1 28 55 Z" 
        fill="url(#cloudGrad)"
      />
      
      {/* Network / Graduation Nodes */}
      <circle cx="36" cy="62" r="3.5" fill="url(#accentGrad)" filter="url(#glow)"/>
      <circle cx="53" cy="53" r="4.5" fill="url(#accentGrad)" filter="url(#glow)"/>
      <circle cx="68" cy="65" r="3.5" fill="url(#accentGrad)" filter="url(#glow)"/>
      
      {/* Connecting Lines */}
      <path 
        d="M 36 62 L 53 53 L 68 65" 
        stroke="white" 
        strokeWidth="1.5" 
        strokeLinecap="round"
        strokeLinejoin="round"
        className="opacity-90"
      />
      
      {/* Academic Cap Tassel hint */}
      <path 
        d="M 53 53 L 57 68" 
        stroke="url(#accentGrad)" 
        strokeWidth="1.5" 
        strokeLinecap="round"
      />
    </svg>
  );
}
