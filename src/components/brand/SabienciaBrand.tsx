import React from 'react';
import { cn } from '../ui/utils';

type BrandSvgProps = React.SVGProps<SVGSVGElement> & {
  title?: string;
};

function BrandTitle({ title }: { title?: string }) {
  return title ? <title>{title}</title> : null;
}

export function SabienciaSymbol({ title = 'Sabiencia', ...props }: BrandSvgProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <BrandTitle title={title} />
      <g stroke="#3b82f6" strokeWidth="2" strokeLinecap="round">
        <line x1="16" y1="16" x2="6.47" y2="10.5" />
        <line x1="16" y1="16" x2="25.53" y2="10.5" />
        <line x1="16" y1="16" x2="16" y2="29.2" />
      </g>
      <circle cx="16" cy="16" r="3" fill="#1e40af" />
    </svg>
  );
}

export function SabienciaHorizontalLogo({ title = 'Sabiencia', ...props }: BrandSvgProps) {
  return (
    <svg
      viewBox="0 0 216 40"
      fill="none"
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <BrandTitle title={title} />
      <g transform="translate(0, 4)">
        <g stroke="#3b82f6" strokeWidth="2" strokeLinecap="round">
          <line x1="16" y1="16" x2="6.47" y2="10.5" />
          <line x1="16" y1="16" x2="25.53" y2="10.5" />
          <line x1="16" y1="16" x2="16" y2="29.2" />
        </g>
        <circle cx="16" cy="16" r="3" fill="#1e40af" />
      </g>
      <text
        x="50"
        y="28"
        fill="#0f172a"
        fontFamily="Poppins, system-ui, sans-serif"
        fontSize="30"
        fontWeight="500"
        letterSpacing="-0.5"
      >
        Sabiencia
      </text>
    </svg>
  );
}

interface SabienciaMonogramBadgeProps {
  className?: string;
  labelClassName?: string;
}

export function SabienciaMonogramBadge({
  className,
  labelClassName,
}: SabienciaMonogramBadgeProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center bg-gradient-to-br from-[#3b82f6] to-[#1e40af] text-white',
        className
      )}
      aria-label="Monograma Sabiencia"
    >
      <span className={cn('font-bold', labelClassName)}>Sa</span>
    </div>
  );
}
