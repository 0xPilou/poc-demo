import "./globals.css";
import type { Metadata } from "next";
import { headers } from "next/headers";
import ContextProvider from "@/context";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "Superfluid Pools",
  description: "Create, fund, and collect rewards from Superfluid Pools",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookies = (await headers()).get("cookie");

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 min-h-screen flex flex-col">
        <ThemeProvider defaultTheme="system">
          <ContextProvider cookies={cookies}>
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </ContextProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
