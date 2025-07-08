import { forwardRef } from "react"

const CardHeader = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`flex flex-col space-y-1.5 p-6 ${className || ""}`}
    {...props}
  />
))

CardHeader.displayName = "CardHeader"

export { CardHeader } 