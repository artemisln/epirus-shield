import { ReactNode } from "react";

interface OptionCardProps {
  icon?: ReactNode;
  label: string;
  sublabel?: string;
  selected?: boolean;
  onClick: () => void;
  className?: string;
}

export function OptionCard({
  icon,
  label,
  sublabel,
  selected = false,
  onClick,
  className = "",
}: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-full text-left bg-surface rounded-xl p-6 transition-all duration-200
        border-2
        ${selected 
          ? "border-foreground" 
          : "border-border hover:bg-surface-elevated hover:border-muted"
        }
        focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2
        ${className}
      `}
      aria-pressed={selected}
    >
      {icon && (
        <div className="w-12 h-12 mb-4 flex items-center justify-center rounded-lg bg-surface-elevated text-muted">
          {icon}
        </div>
      )}
      <p className="text-lg font-medium text-foreground">{label}</p>
      {sublabel && (
        <p className="text-sm text-muted mt-1">{sublabel}</p>
      )}
    </button>
  );
}

interface OptionCardGridProps {
  children: ReactNode;
  columns?: 2 | 3;
  className?: string;
}

export function OptionCardGrid({
  children,
  columns = 2,
  className = "",
}: OptionCardGridProps) {
  const gridCols = columns === 3 
    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" 
    : "grid-cols-1 sm:grid-cols-2";
  
  return (
    <div className={`grid ${gridCols} gap-4 ${className}`}>
      {children}
    </div>
  );
}
