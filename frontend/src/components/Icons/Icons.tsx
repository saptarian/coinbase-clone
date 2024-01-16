import React from "react"
export type IconProps = React.SVGAttributes<SVGElement>


export const ArrowLeft: React.FC<IconProps> = ({className}) => (
  <svg 
    className={className ?? 
    "w-4 h-4 text-gray-800 dark:text-white"} 
    aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" d="M13 5H1m0 0 4 4M1 5l4-4"/>
  </svg>
)


export const AngleRight: React.FC<IconProps> = ({className}) => (
  <svg 
    className={className ?? 
    "w-4 h-4 text-gray-800 dark:text-white"}
    aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 8 14">
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" d="m1 13 5.7-5.326a.909.909 0 0 0 0-1.348L1 1"/>
  </svg>
)


export const Eye: React.FC<IconProps> = ({className}) => (
  <svg 
    className={className ?? 
    "w-4 h-4 text-gray-800 dark:text-white"} 
    aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 14">
    <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4">
      <path d="M10 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
      <path d="M10 13c4.97 0 9-2.686 9-6s-4.03-6-9-6-9 2.686-9 6 4.03 6 9 6Z"/>
    </g>
  </svg>
)


export const EyeSlash: React.FC<IconProps> = ({className}) => (
  <svg 
    className={className ?? 
    "w-4 h-4 text-gray-800 dark:text-white"} 
    aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 18">
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" d="M1.933 10.909A4.357 4.357 0 0 1 1 9c0-1 4-6 9-6m7.6 3.8A5.068 5.068 0 0 1 19 9c0 1-3 6-9 6-.314 0-.62-.014-.918-.04M2 17 18 1m-5 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
  </svg>
)


export const Home: React.FC<IconProps> = ({className}) => (
  <svg 
    className={className ?? 
    "w-4 h-4 text-gray-800 dark:text-white"} 
    aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8v10a1 1 0 0 0 1 1h4v-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5h4a1 1 0 0 0 1-1V8M1 10l9-9 9 9"/>
  </svg>
)


export const ChartMixed: React.FC<IconProps> = ({className}) => (
  <svg 
    className={className ?? 
    "w-4 h-4 text-gray-800 dark:text-white"} 
    aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 19 21">
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.6 16.733c.234.268.548.456.895.534a1.4 1.4 0 0 0 1.75-.762c.172-.615-.445-1.287-1.242-1.481-.796-.194-1.41-.862-1.241-1.481a1.4 1.4 0 0 1 1.75-.763c.343.078.654.261.888.525m-1.358 4.017v.617m0-5.94v.726M1 10l5-4 4 1 7-6m0 0h-3.207M17 1v3.207M5 19v-6m-4 6v-4m17 0a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z"/>
  </svg>
)


export const UserCircle: React.FC<IconProps> = ({className, strokeWidth, fill}) => (
  <svg 
    className={className ?? 
    "w-4 h-4 text-gray-800 dark:text-white"} 
    aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill={fill || "none"} viewBox="0 0 20 20">
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth ?? 2} d="M10 19a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0a8.949 8.949 0 0 0 4.951-1.488A3.987 3.987 0 0 0 11 14H9a3.987 3.987 0 0 0-3.951 3.512A8.948 8.948 0 0 0 10 19Zm3-11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
  </svg>
)


export const ChartLineUp: React.FC<IconProps> = ({className}) => (
  <svg 
    className={className ?? 
    "w-4 h-4 text-gray-800 dark:text-white"} 
    aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 16">
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1v14h16M4 10l3-4 4 4 5-5m0 0h-3.207M16 5v3.207"/>
  </svg>
)


export const Globe: React.FC<IconProps> = ({className}) => (
  <svg 
    className={className ?? 
    "w-4 h-4 text-gray-800 dark:text-white"} 
    aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 21 20">
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6.487 1.746c0 4.192 3.592 1.66 4.592 5.754 0 .828 1 1.5 2 1.5s2-.672 2-1.5a1.5 1.5 0 0 1 1.5-1.5h1.5m-16.02.471c4.02 2.248 1.776 4.216 4.878 5.645C10.18 13.61 9 19 9 19m9.366-6h-2.287a3 3 0 0 0-3 3v2m6-8a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
  </svg>
)


export const BadgeCheck: React.FC<IconProps> = ({className}) => (
  <svg 
    className={className ?? 
    "w-4 h-4 text-gray-800 dark:text-white"} 
    aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 21 21">
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m6.072 10.072 2 2 6-4m3.586 4.314.9-.9a2 2 0 0 0 0-2.828l-.9-.9a2 2 0 0 1-.586-1.414V5.072a2 2 0 0 0-2-2H13.8a2 2 0 0 1-1.414-.586l-.9-.9a2 2 0 0 0-2.828 0l-.9.9a2 2 0 0 1-1.414.586H5.072a2 2 0 0 0-2 2v1.272a2 2 0 0 1-.586 1.414l-.9.9a2 2 0 0 0 0 2.828l.9.9a2 2 0 0 1 .586 1.414v1.272a2 2 0 0 0 2 2h1.272a2 2 0 0 1 1.414.586l.9.9a2 2 0 0 0 2.828 0l.9-.9a2 2 0 0 1 1.414-.586h1.272a2 2 0 0 0 2-2V13.8a2 2 0 0 1 .586-1.414Z"/>
  </svg>
)


export const SearchLoop: React.FC<IconProps> = ({className}) => (
  <svg 
    className={className ?? 
    "w-4 h-4 text-gray-800 dark:text-white"} 
    aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
  </svg>
)


export const ArrowLeftToBracket: React.FC<IconProps> = ({className}) => (
  <svg 
    className={className ?? 
    "w-4 h-4 text-gray-800 dark:text-white"} 
    aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 16">
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
      d="M1 7.64h11m0 0L8 3.85m4 3.79-4 3.791m4-10.424h3c.53 0 1.04.2 1.414.555.375.355.586.837.586 1.34v9.477c0 .503-.21.985-.586 1.34a2.057 2.057 0 0 1-1.414.556h-3"/>
  </svg>
)


export const ArrowRightToBracket: React.FC<IconProps> = ({className}) => (
  <svg 
    className={className ?? 
    "w-4 h-4 text-gray-800 dark:text-white"} 
    aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 16">
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
      d="M4 7.64h11m0 0-4-3.79m4 3.79-4 3.791m-5 2.844H3c-.53 0-1.04-.2-1.414-.556A1.846 1.846 0 0 1 1 12.38V2.902c0-.503.21-.985.586-1.34A2.057 2.057 0 0 1 3 1.007h3"/>
  </svg>
)


export const Close: React.FC<IconProps> = ({className}) => (
  <svg 
    className={className ?? 
    "w-4 h-4 text-gray-800 dark:text-white"} 
    aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
  </svg>
)
