import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "../../lib/utils";

const CircularProgress = React.forwardRef(
  ({ className, value = 0, size = 40, ...props }, ref) => {
    const isComplete = value >= 100;
    const strokeWidth = 4;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const progressOffset = circumference - (value / 100) * circumference;
    const [displayValue, setDisplayValue] = React.useState(0);

    React.useEffect(() => {
      // Smoothly animate the display value
      const animateValue = (start, end, duration) => {
        const startTime = performance.now();

        const updateValue = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);

          const currentValue = Math.round(start + (end - start) * progress);
          setDisplayValue(currentValue);

          if (progress < 1) {
            requestAnimationFrame(updateValue);
          }
        };

        requestAnimationFrame(updateValue);
      };

      animateValue(displayValue, value, 500); // 500ms duration
    }, [value]);

    return (
      <div
        className={cn(
          "relative inline-flex items-center justify-center",
          className
        )}
        style={{ width: size, height: size }}
        ref={ref}
        {...props}
      >
        {/* Background circle */}
        <svg className="absolute -rotate-90" width={size} height={size}>
          <circle
            className="text-gray-100"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />

          {/* Progress circle */}
          <circle
            className="text-blue-500 transition-all duration-300 ease-in-out"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={progressOffset}
            strokeLinecap="round"
            fill="none"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex items-center justify-center">
          {isComplete ? (
            <Check
              className="h-5 w-5 text-blue-500 animate-scale-check"
              strokeWidth={3}
            />
          ) : (
            <span className="text-xs font-medium text-blue-500">
              {displayValue}%
            </span>
          )}
        </div>
      </div>
    );
  }
);

CircularProgress.displayName = "CircularProgress";

export { CircularProgress };