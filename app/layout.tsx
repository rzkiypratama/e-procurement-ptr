import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LayoutWithContext from '@/components/Layout';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Delapan Pilar Intisolusi",
  description: "Delapan Pilar Intisolusi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
