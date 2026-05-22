interface SegmentedProgressProps {
  totalSteps: number;
  currentStep: number;
  className?: string;
}

export function SegmentedProgress({
  totalSteps,
  currentStep,
  className = "",
}: SegmentedProgressProps) {
  return (
    <div
      className={`flex gap-1 ${className}`}
      role="progressbar"
      aria-valuenow={currentStep + 1}
      aria-valuemin={1}
      aria-valuemax={totalSteps}
      aria-label={`Βήμα ${currentStep + 1} από ${totalSteps}`}
    >
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div
          key={index}
          className={`
            h-1 flex-1 rounded-full transition-colors duration-300
            ${index <= currentStep ? "bg-foreground" : "bg-muted-light"}
          `}
        />
      ))}
    </div>
  );
}

interface ProgressBarProps {
  progress: number;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-1",
  md: "h-1",
  lg: "h-1",
};

export function ProgressBar({
  progress,
  showLabel = false,
  size = "md",
  className = "",
}: ProgressBarProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between mb-1">
          <span className="text-sm text-muted">Πρόοδος</span>
          <span className="text-sm font-medium text-foreground">
            {Math.round(clampedProgress)}%
          </span>
        </div>
      )}
      <div
        className={`w-full bg-muted-light rounded-full overflow-hidden ${sizeClasses[size]}`}
        role="progressbar"
        aria-valuenow={clampedProgress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Πρόοδος: ${Math.round(clampedProgress)}%`}
      >
        <div
          className="h-full bg-foreground rounded-full transition-all duration-500 ease-out"
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
}
