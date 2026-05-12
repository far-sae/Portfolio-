'use client';

import { useState } from 'react';

export function BrandLogo({
  slug,
  name,
  color,
  size = 40,
  className,
  monochrome = false
}: {
  slug: string;
  name: string;
  color?: string;
  size?: number;
  className?: string;
  monochrome?: boolean;
}) {
  const [errored, setErrored] = useState(false);
  const src = monochrome
    ? `https://cdn.simpleicons.org/${slug}/e7e9ee`
    : color
      ? `https://cdn.simpleicons.org/${slug}/${color}`
      : `https://cdn.simpleicons.org/${slug}`;

  if (errored) {
    return (
      <div
        className={`flex items-center justify-center rounded-md border border-line bg-bg/60 ${className ?? ''}`}
        style={{ width: size, height: size }}
      >
        <span className="mono text-[10px] uppercase tracking-wider text-muted">
          {name.slice(0, 2)}
        </span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={name}
      width={size}
      height={size}
      onError={() => setErrored(true)}
      className={className}
      loading="lazy"
    />
  );
}
