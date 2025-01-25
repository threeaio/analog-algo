import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer relative flex h-px w-6 shrink-0 cursor-pointer items-center bg-3a-gray transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-3a-white",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "block h-5 w-px bg-3a-white transition-transform data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-0  relative after:content-[''] after:absolute after:top-0 after:bottom-0 after:left-1/2 after:w-px after:-translate-x-1/2 after:bg-3a-white before:content-[''] before:absolute before:bottom-0 before:left-[-1rem] before:top-1/2 before:-translate-y-1/2 before:h-[2rem] before:rounded-full before:w-[2rem] before:bg-transparent hover:before:bg-3a-white/10 before:transition-all before:duration-300"
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
