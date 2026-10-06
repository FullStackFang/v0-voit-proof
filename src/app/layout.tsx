import type { ReactNode } from "react";
import { FONTS_URL, GATE } from "@/embed/styles";
import "./gate.css";

export const metadata = { title: "Voit Proof" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href={FONTS_URL} />
        <style dangerouslySetInnerHTML={{ __html: GATE }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
