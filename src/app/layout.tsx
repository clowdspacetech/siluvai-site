import type { Metadata } from "next";
import Script from "next/script";
import { Geist } from "next/font/google";
import "./globals.css";
import { DataProvider } from "@/lib/data-context";
import { ThemeProvider } from "@/lib/theme-context";
import { RegistrationIntentProvider } from "@/lib/registration-intent";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title: "Siluvai Media | Faith & Community Broadcasting",
  description:
    "UK registered charity propagating messages of love, salvation, and redemption through Christian broadcasting, digital media production, and leadership training.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" }
    ]
  }
};

const themeBootScript = `(function(){try{var t=localStorage.getItem("siluvai-theme");if(t==="light"||t==="dark"){document.documentElement.setAttribute("data-theme",t);}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body className={`${geist.variable} font-sans antialiased`}>
        <Script
          id="siluvai-theme-boot"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeBootScript }}
        />
        <DataProvider>
          <ThemeProvider>
            <RegistrationIntentProvider>{children}</RegistrationIntentProvider>
          </ThemeProvider>
        </DataProvider>
      </body>
    </html>
  );
}
