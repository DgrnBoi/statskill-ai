import type { SVGProps } from 'react'

// Stylised Ashoka Chakra (24-spoke wheel) — decorative government mark.
export function AshokaChakra(props: SVGProps<SVGSVGElement>) {
  const spokes = Array.from({ length: 24 })
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" {...props}>
      <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="4" />
      <circle cx="50" cy="50" r="7" fill="currentColor" />
      {spokes.map((_, i) => (
        <line
          key={i}
          x1="50"
          y1="50"
          x2="50"
          y2="6"
          stroke="currentColor"
          strokeWidth="1.5"
          transform={`rotate(${(360 / 24) * i} 50 50)`}
        />
      ))}
    </svg>
  )
}

// Stylised blooming lotus — Karmayogi Bharat brand mark.
export function LotusMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" {...props}>
      <g fill="currentColor">
        <path d="M50 18c6 12 6 26 0 44-6-18-6-32 0-44Z" opacity="0.95" />
        <path d="M50 62C36 50 28 40 26 26c14 2 22 12 24 28 2-16 10-26 24-28-2 14-10 24-24 36Z" opacity="0.75" />
        <path d="M50 66C30 60 16 54 8 44c14-4 30 0 42 14 12-14 28-18 42-14-8 10-22 16-42 22Z" opacity="0.55" />
      </g>
      <path
        d="M20 74c8 8 18 12 30 12s22-4 30-12"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.9"
      />
    </svg>
  )
}
