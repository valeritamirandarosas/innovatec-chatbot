export const Logo = (props: React.SVGProps<SVGSVGElement>) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <path d="m12 3-1.9 1.9a3 3 0 0 0 0 4.2L12 11l1.9-1.9a3 3 0 0 0 0-4.2Z" fill="hsl(var(--primary))" />
      <path d="m12 11 1.9 1.9a3 3 0 0 1 0 4.2L12 19l-1.9-1.9a3 3 0 0 1 0-4.2Z" fill="hsl(var(--secondary))" />
      <path d="M5 21a7 7 0 0 0 14 0" />
      <path d="M5 3a7 7 0 0 1 14 0" />
    </svg>
  );
  