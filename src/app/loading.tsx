'use Counseling'; // Actually loading can be a simple client component for animation
'use client';

import React from 'react';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0d0d0c]">
      <div className="relative flex items-center justify-center">
        {/* Outer glowing ring */}
        <div className="absolute h-16 w-16 animate-ping rounded-full border border-[#d4af37]/30 opacity-75"></div>
        
        {/* Middle spinning gradient */}
        <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-r-2 border-[#d4af37]"></div>
        
        {/* Center dot */}
        <div className="absolute h-4 w-4 rounded-full bg-[#d4af37]"></div>
      </div>
      
      <p className="mt-6 text-sm font-light tracking-widest text-[#c5a880]/85 uppercase animate-pulse">
        Arab Cafe
      </p>
    </div>
  );
}
