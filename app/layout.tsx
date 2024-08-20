import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import StoreProvider from "@/components/providers/store-provider";
import ModalProvider from "@/components/providers/modal-provider";
import SessionWrapper from "@/components/providers/session-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TaSk",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionWrapper>
      <html lang="en">
        <body className={inter.className}>
          <StoreProvider>
            <ModalProvider />
            <ThemeProvider enableSystem attribute="class" defaultTheme="dark">
              {children}
            </ThemeProvider>
          </StoreProvider>
        </body>
      </html>
    </SessionWrapper>
  );
}
