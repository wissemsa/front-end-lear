import React, { useState, useEffect } from 'react';
import { Layers } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  fallbackTitle?: string;
  fallbackSubtitle?: string;
  className?: string;
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  fallbackTitle,
  fallbackSubtitle,
  className = 'w-full h-full object-cover'
}) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  if (!src || hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-950 text-zinc-100 select-none ${className}`}
        role="img"
        aria-label={alt}
      >
        <div className="w-12 h-12 rounded-xl border border-zinc-700/80 flex items-center justify-center mb-3 bg-zinc-800/50">
          <Layers className="w-5 h-5 text-zinc-300" />
        </div>
        <p className="font-display font-semibold text-base tracking-tight text-zinc-100 max-w-xs">
          {fallbackTitle || alt}
        </p>
        {fallbackSubtitle && (
          <p className="text-xs text-zinc-400 mt-1 max-w-xs">{fallbackSubtitle}</p>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
      loading="lazy"
    />
  );
};
