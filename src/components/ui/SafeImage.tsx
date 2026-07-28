"use client";

import { useState, useRef, useEffect } from "react";
import { ImageOff } from "lucide-react";

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackClassName?: string;
  containerClassName?: string;
  onClick?: () => void;
  loading?: "lazy" | "eager";
}

export default function SafeImage({
  src,
  alt,
  className = "",
  fallbackClassName = "",
  containerClassName = "",
  onClick,
  loading = "lazy",
}: SafeImageProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  /* Whenever `src` changes, reset so a new load attempt is made */
  useEffect(() => {
    setError(false);
    setLoaded(false);

    /* If the image already loaded (e.g. browser cache before React attached handlers),
       sync state immediately so the opacity transition finishes. */
    const img = imgRef.current;
    if (img?.complete) {
      if (img.naturalWidth === 0) setError(true);
      else setLoaded(true);
    }
  }, [src]);

  if (error) {
    return (
      <div
        className={`flex items-center justify-center bg-[#F0F3F8] ${
          fallbackClassName || containerClassName
        }`}
      >
        <div className="flex flex-col items-center gap-2 text-[#94A3B8]">
          <ImageOff size={32} />
          <span className="text-xs">{alt}</span>
        </div>
      </div>
    );
  }

  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      className={`${className} ${
        !loaded ? "opacity-0" : "opacity-100"
      } transition-opacity duration-300`}
      onLoad={() => setLoaded(true)}
      onError={() => setError(true)}
      onClick={onClick}
      loading={loading}
    />
  );
}