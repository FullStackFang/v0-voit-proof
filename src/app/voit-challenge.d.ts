import type { DetailedHTMLProps, HTMLAttributes } from "react";

// <voit-challenge> is the player from /embed.js, a custom element React renders as-is.
declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "voit-challenge": DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & { pack: string; mode?: "embed" | "practice" };
    }
  }
}
