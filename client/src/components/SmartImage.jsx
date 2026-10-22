
import React, { useState } from "react";
import { Loader2 } from "lucide-react";

function SmartImage({ src, alt, className = "" }) {
  const [status, setStatus] = useState("loading");

  const fallback =
    "https://images.unsplash.com/photo-1488153079027-e6736af1c2b4?auto=format&fit=crop&q=60&w=800";

  const handleError = () => {
    if (imageSrc !== fallback) {
      setImageSrc(fallback);
      setStatus("loading");
    } else {
      setStatus("error");
    }
  };

  return (
    <div
      className={`relative overflow-hidden bg-[#0a0a0b] ${className}`}
    >
      {status === "loading" && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#0a0a0b]">
          <Loader2 className="h-6 w-6 animate-spin text-blue-500 opacity-50" />
        </div>
      )}

      {status === "error" ? (
        <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
          Image unavailable
        </div>
      ) : (
        <img
          src={src}
          alt={alt || "Image"}
          onLoad={() => setStatus("loaded")}
          onError={(e) => {
          setStatus("error");
          e.target.src = fallback;
        }}
          className={`h-full w-full object-cover transition-all duration-1000 ${
            status === "loaded"
              ? "scale-100 opacity-100"
              : "scale-110 opacity-0"
          }`}
        />
      )}
    </div>
  );
}

export default SmartImage;
