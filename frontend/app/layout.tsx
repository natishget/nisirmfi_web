import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Intro } from "./components/ui/intro";
import Chat from "./components/chatbot/Chat";
import ReduxProvider from "@/state/provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nisir Microfinance",
  description: "Microfinance in Ethiopia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={` h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <ReduxProvider>
          {/* <Intro /> */}
          <Navbar />
          <Chat />
          {children}
          <Footer />
        </ReduxProvider>
      </body>
    </html>
  );
}
