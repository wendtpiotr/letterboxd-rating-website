import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"
// Configure Geist fonts
const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
    display: "swap",
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
    display: "swap",
});

// Configure Inter font as requested
const inter = Inter({
    subsets: ["latin"],
    weight: ["400", "700", "900"],
    display: "swap",
    variable: "--font-inter",
});

export const metadata = {
    title: "RATR.",
    description: "Weighted movie rating logic and genre-specific scoring.",
    viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
        <head>
            <style dangerouslySetInnerHTML={{ __html: `
          .perspective-1000 {
            perspective: 1000px;
          }
        `}} />
            <meta charSet="utf-8" />
            <meta name="viewport" content={metadata.viewport} />
            <meta name="description" content={metadata.description} />
            <title>{metadata.title}</title>
        </head>
        <body
            className={`
          ${geistSans.variable} 
          ${geistMono.variable} 
          ${inter.variable} 
          ${inter.className} 
          antialiased
        `}
        >
        {children}
        <Analytics />
        </body>
        </html>
    );
}