import { useId } from 'react';

interface BrandLogoProps {
  className?: string;
  priority?: boolean;
  variant?: 'full' | 'mark';
}

export default function BrandLogo({ className = '', variant = 'full' }: BrandLogoProps) {
  const prefix = useId().replace(/:/g, '');
  const oceanId = `${prefix}-ocean`;
  const growthId = `${prefix}-growth`;
  const earthId = `${prefix}-earth`;
  const madagascarId = `${prefix}-madagascar`;
  const shadowId = `${prefix}-shadow`;
  const isMark = variant === 'mark';

  return (
    <svg
      viewBox={isMark ? '90 55 650 510' : '70 55 675 690'}
      role="img"
      aria-label="Logo FEDEM Madagascar"
      className={className}
      preserveAspectRatio="xMidYMid meet"
      shapeRendering="geometricPrecision"
    >
      <defs>
        <linearGradient id={oceanId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c4e0f2" />
          <stop offset="0.44" stopColor="#278fc9" />
          <stop offset="1" stopColor="#0871ae" />
        </linearGradient>
        <linearGradient id={growthId} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#07385f" />
          <stop offset="1" stopColor="#074a78" />
        </linearGradient>
        <clipPath id={earthId}>
          <circle cx="355" cy="322" r="228" />
        </clipPath>
        <clipPath id={madagascarId}>
          <path d="M560 318c13-14 25-21 34-17 8 4 7 17 13 27 6 11 7 23 16 33-4 13-2 25-7 36 6 15 1 29-3 42-5 19-5 38-15 55-10 18-24 34-40 38-15-1-29-11-36-26-5-15 1-31-5-46-5-15-13-27-8-42 5-12 2-25 9-36 7-11 15-19 19-32 5-14 12-25 23-32z" />
        </clipPath>
        <filter id={shadowId} x="-20%" y="-20%" width="150%" height="160%">
          <feDropShadow dx="0" dy="7" stdDeviation="8" floodColor="#052f50" floodOpacity="0.16" />
        </filter>
      </defs>

      <circle cx="355" cy="322" r="228" fill={`url(#${oceanId})`} filter={`url(#${shadowId})`} />
      <g clipPath={`url(#${earthId})`} fill="none" stroke="#fff" strokeWidth="5" opacity="0.96">
        <ellipse cx="355" cy="322" rx="116" ry="228" />
        <ellipse cx="355" cy="322" rx="185" ry="228" />
        <path d="M127 322h456M157 210c112 45 283 47 395-4M159 434c114-46 272-47 390-4M355 94v456" />
      </g>
      <g clipPath={`url(#${earthId})`} fill="#fff" opacity="0.97">
        <path d="M221 134l43-19 36 10 27-12 40 12-12 19-38 5-20 16-37-5-24 14-32-10z" />
        <path d="M393 126l38 6 30 25 40 11 31 29-12 36-36 21-33-11-16-30-35-7-23-29 9-24z" />
        <path d="M311 255l40-24 51 15 17 33-16 25 9 26-25 38-12 46-35 27-33-33 5-34-22-31 12-30-11-29z" />
        <path d="M193 290l29-25 38 4 20 24-15 31-31 7-27-15zM463 389l20-13 16 11-4 23-23 5z" />
      </g>

      <path d="M145 545L231 368 332 425 431 254 532 307 616 172" fill="none" stroke={`url(#${growthId})`} strokeWidth="68" strokeLinejoin="miter" />
      <path d="M575 146l143-31-23 143-34-55-38 62-53-33 38-61z" fill={`url(#${growthId})`} />

      <g filter={`url(#${shadowId})`}>
        <path d="M560 318c13-14 25-21 34-17 8 4 7 17 13 27 6 11 7 23 16 33-4 13-2 25-7 36 6 15 1 29-3 42-5 19-5 38-15 55-10 18-24 34-40 38-15-1-29-11-36-26-5-15 1-31-5-46-5-15-13-27-8-42 5-12 2-25 9-36 7-11 15-19 19-32 5-14 12-25 23-32z" fill="#fff" />
        <g clipPath={`url(#${madagascarId})`}>
          <rect x="564" y="296" width="76" height="114" fill="#ef4038" />
          <rect x="564" y="410" width="76" height="135" fill="#07813f" />
        </g>
        <path d="M560 318c13-14 25-21 34-17 8 4 7 17 13 27 6 11 7 23 16 33-4 13-2 25-7 36 6 15 1 29-3 42-5 19-5 38-15 55-10 18-24 34-40 38-15-1-29-11-36-26-5-15 1-31-5-46-5-15-13-27-8-42 5-12 2-25 9-36 7-11 15-19 19-32 5-14 12-25 23-32z" fill="none" stroke="#073e64" strokeWidth="5" />
      </g>

      {!isMark && (
        <text x="405" y="694" fill="#074675" fontFamily="Arial, Helvetica, sans-serif" fontSize="118" fontWeight="800" textAnchor="middle" letterSpacing="2">
          FEDEM
        </text>
      )}
    </svg>
  );
}