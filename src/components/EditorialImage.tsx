import React, { useState, useEffect } from 'react';
import { getProceduralArtUrl } from '../utils/proceduralArt';

interface EditorialImageProps {
  artKey: string;
  customSrc?: string;
  alt: string;
  className?: string;
  aspectClassName?: string;
  loading?: 'lazy' | 'eager';
  width?: number;
  height?: number;
}

export const EditorialImage: React.FC<EditorialImageProps> = ({
  artKey,
  customSrc,
  alt,
  className = '',
  aspectClassName = 'aspect-[4/3]',
  loading = 'lazy',
  width = 960,
  height = 720,
}) => {
  const [imgSrc, setImgSrc] = useState<string>('');
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
    if (customSrc && customSrc.trim() !== '') {
      setImgSrc(customSrc);
    } else {
      const generated = getProceduralArtUrl(artKey, width, height);
      setImgSrc(generated);
    }
  }, [artKey, customSrc, width, height]);

  return (
    <div
      className={`relative overflow-hidden bg-[#171918] ${aspectClassName} ${className}`}
    >
      {imgSrc && !hasError ? (
        <img
          src={imgSrc}
          alt={alt}
          loading={loading}
          referrerPolicy="no-referrer"
          onError={() => {
            // Fall back to procedural studio canvas art if an external URL fails
            const fallback = getProceduralArtUrl(artKey, width, height);
            if (imgSrc !== fallback && fallback) {
              setImgSrc(fallback);
            } else {
              setHasError(true);
            }
          }}
          className="h-full w-full object-cover transition-transform duration-700 ease-out"
        />
      ) : (
        <div
          className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#171918] via-[#241E1A] to-[#121312] p-6 text-center"
          role="img"
          aria-label={alt}
        >
          <svg
            className="mb-3 h-8 w-8 text-[#B8754D]/80"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zm4-6v2m4-2v2m4-2v2"
            />
          </svg>
          <span className="font-mono-tabular text-[11px] tracking-widest text-[#F2EBDD]/70 uppercase">
            {alt}
          </span>
        </div>
      )}
    </div>
  );
};
