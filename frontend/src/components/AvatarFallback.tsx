"use client";
import React, { useState } from "react";

interface AvatarFallbackProps {
  name?: string;
  src?: string | null;
  alt?: string;
  className?: string;
}

export function AvatarFallback({ name = "", src, alt = "", className = "" }: AvatarFallbackProps) {
  const [error, setError] = useState(false);
  const initial = name ? name.charAt(0).toUpperCase() : "?";

  if (src && src.trim() !== "" && !error) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        onError={() => setError(true)}
      />
    );
  }

  return (
    <div
      className={`flex items-center justify-center bg-[#1e3e44] text-white font-bold select-none ${className}`}
    >
      {initial}
    </div>
  );
}
