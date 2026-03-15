import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import api from "@/lib/api";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Brikien Labs",
  description: "Official website of Brikien Labs",
};

async function getSiteConfig() {
  try {
    const res = await api.get('/public/site-config');
    return res.data.data;
  } catch (error) {
    return null;
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = await getSiteConfig();

  return (
    <html lang="en" className="dark" data-theme="dark" style={{ colorScheme: 'dark' }} suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col bg-background text-foreground`}>
        <Navbar />
        <main className="flex-1 mt-16">
          {children}
        </main>
        <Footer config={config} />
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
