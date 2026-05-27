import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dress-Up Adventure",
  description: "Mix & match looks across different themes",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
