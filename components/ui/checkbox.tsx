"use client";

import * as React from "react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        `
          peer
          relative
          flex
          size-5
          shrink-0
          items-center
          justify-center
          rounded-md
          border
          cursor-pointer
          border-zinc-300
          bg-white
          transition-colors

          hover:border-blue-400

          data-[state=checked]:border-blue-500
          data-[state=checked]:bg-blue-500

          focus-visible:ring-2
          focus-visible:ring-blue-200

          disabled:cursor-not-allowed
          disabled:opacity-50
        `,
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator />
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
