import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TribeMapper",
  description: "Map your tribe's relationships and dynamics",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
