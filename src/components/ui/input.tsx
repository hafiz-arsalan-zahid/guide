import * as React from "react"

import { cn } from "@/lib/utils"

// Added Loader2 for potential loading states within inputs, though not used by default
import { Loader2 } from "lucide-react"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  isLoading?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, isLoading, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            isLoading && "pr-10", // Add padding for loader
            className
          )}
          ref={ref}
          {...props}
          disabled={isLoading || props.disabled}
        />
        {isLoading && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
