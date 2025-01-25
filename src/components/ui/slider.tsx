import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"


const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
  
    <SliderPrimitive.Track className="relative h-px w-full grow bg-3a-gray">
      <SliderPrimitive.Range className="absolute -top-0.5 -bottom-0.5 bg-3a-white" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block w-px h-5 cursor-ew-resize transition-colors relative after:content-[''] after:absolute after:top-0 after:bottom-0 after:left-1/2 after:w-px after:bg-3a-white before:content-[''] before:absolute before:bottom-0 before:left-[-1rem] before:top-1/2 before:-translate-y-1/2 before:h-[2rem] before:rounded-full after:-translate-x-1/2  before:w-[2rem] before:bg-transparent hover:before:bg-3a-white/10 before:transition-all before:duration-300"  />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
