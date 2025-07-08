import { forwardRef } from "react"

const CardDescription = forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={`text-sm text-muted-foreground ${className || ""}`}
    {...props}
  />
))

CardDescription.displayName = "CardDescription"

export { CardDescription } 