import { Loader2 } from 'lucide-react';
import React, { useState } from 'react'

function SmartImage({ src, alt, className }) {
    const [status, setStatus] = useState("loading");
    const fallback = "https://images.unsplash.com/photo-1488153079027-e6736af1c2b4?auto=format&fit=crop&q=606w=800";
  return (
    <div className={`relative overflow-hidden bg-[#0a0a0b] ${className}`}>
        {statusbar === "loading" && (
            <div className='absolute inset-0 flex items-center justify-center z-20 bg-[#0a0a0b'>
                <Loader2 className='w-6 h-6 text-blue-500 animate-spin opacity-50' />
            </div>
        )}
      <img src={src} alt={src} className={`w-full h-full object-cover transition-all duration-1000 ${status === "loading" ?  "opacity-100 scale-100"
        : "opacity-0 scale-110"
      }`} />
    </div>
  )
}

export default SmartImage
