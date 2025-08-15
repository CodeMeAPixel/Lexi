import "../styles/globals.css";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Navbar from "@/components/core/Navbar";
import Footer from "@/components/core/Footer";
import { Toaster } from "react-hot-toast";

const poppins = Poppins({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "Lexi - AI Writing Assistant",
    template: "%s - Lexi"
  },
  metadataBase: new URL("https://beta.lexiapp.space"),
  keywords: ["AI", "Writing Assistant", "Rephrase", "Text Enhancement"],
  description: "Your AI-powered writing assistant for rephrasing and enhancing text with ease.",
  applicationName: "Lexi",
  openGraph: {
    siteName: "Lexi",
    description: "Your AI-powered writing assistant for rephrasing and enhancing text with ease.",
    images: ["/images/og.png"],
    creators: ["@HeyLexicon", "@CodeMeAPixel"],
    locale: "en-US",
    url: "https://beta.lexiapp.space"
  },
  twitter: {
    title: "Lexi",
    description: "Your AI-powered writing assistant for rephrasing and enhancing text with ease.",
    images: "/images/og.png",
    creator: "@CodeMeAPixel",
    card: "summary_large_image",
    site: "https://beta.lexiapp.space"
  },
  appleWebApp: {
    statusBarStyle: "black-translucent",
    title: "Lexi",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/image.png",
    apple: "/image.png"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-video-preview": -1
    }
  },
  other: {
    "mobile-web-app-capable": "yes"
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.className} antialiased`}
      >
        <div className="App">
          <Navbar />
          <Toaster
            toastOptions={{
              style: {
                padding: "12px 24px",
                color: "#0D0D0D",
                background: "#fff",
              },
            }}
          />
          <main className="flex items-center justify-center w-full mt-20">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
