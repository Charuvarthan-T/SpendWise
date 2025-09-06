import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/firebase/AuthContext";
import { ThemeProvider } from "@/components/theme-provider"; 

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
    // 2. Add suppressHydrationWarning to the html tag
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {/* 3. Wrap everything in the ThemeProvider */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>{children}</AuthProvider> {/* AuthProvider is now nested inside */}
        </ThemeProvider>
      </body>
    </html>
  );
}