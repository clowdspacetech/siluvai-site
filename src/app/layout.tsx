import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { DataProvider } from "@/lib/data-context";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title: "Siluvai Media | Faith & Community Broadcasting",
  description:
    "UK registered charity propagating messages of love, salvation, and redemption through Christian broadcasting, digital media production, and leadership training.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} font-sans antialiased`}>
        <DataProvider>{children}</DataProvider>
      </body>
    </html>
  );
}
