import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TribeMapper - Understand Your Community",
  description: "Map your tribe's relationships, roles, and dynamics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
