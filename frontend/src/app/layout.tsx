import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/firebase/AuthContext"; // 1. Import the provider

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SpendWise",
  description: "Your personal finance dashboard, powered by AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.JSX.Element {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider> {/* 2. Wrap the children */}
      </body>
    </html>
  );
}