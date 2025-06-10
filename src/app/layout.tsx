import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Transaction Tracker - Personal Finance Management",
  description: "A simple and effective transaction tracker for managing personal finances",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex items-center justify-between">
              <a href="/" className="text-xl font-bold text-blue-600">FinTrack</a>
              <div className="space-x-4">
                <a href="/dashboard" className="text-gray-600 hover:text-blue-600">Dashboard</a>
                <a href="/transactions" className="text-gray-600 hover:text-blue-600">Transactions</a>
              </div>
            </nav>
          </div>
        </header>
        <main>
          {children}
        </main>
        <footer className="bg-gray-50 border-t mt-12">
          <div className="container mx-auto px-4 py-6">
            <p className="text-center text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} FinTrack. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
