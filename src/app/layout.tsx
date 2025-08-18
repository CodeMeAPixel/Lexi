import "../styles/globals.css";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import ToasterClient from "@/components/core/ToasterClient";
import SessionProviderClient from "@/components/core/SessionProviderClient";
import Footer from "@/components/core/Footer";
import Navbar from "@/components/core/Navbar";
import { SidebarProvider } from "@/components/core/SidebarContext";
import SidebarLayoutWrapper from "@/components/core/SidebarLayoutWrapper";
import GlobalLoader from "@/components/core/GlobalLoader";
import { Suspense } from "react";

const poppins = Poppins({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Lexi - Your AI Writing Assistant",
    template: "%s - Lexi",
  },
  metadataBase: new URL("https://beta.lexiapp.space"),
  keywords: ["AI", "Writing Assistant", "Rephrase", "Text Enhancement"],
  description:
    "Your AI-powered writing assistant for rephrasing and enhancing text with ease.",
  applicationName: "Lexi",
  openGraph: {
    siteName: "Lexi",
    description:
      "Your AI-powered writing assistant for rephrasing and enhancing text with ease.",
    images: ["/og.png"],
    creators: ["@HeyLexicon", "@CodeMeAPixel"],
    locale: "en-US",
    url: "https://beta.lexiapp.space",
  },
  twitter: {
    title: "Lexi",
    description:
      "Your AI-powered writing assistant for rephrasing and enhancing text with ease.",
    images: "/og.png",
    creator: "@CodeMeAPixel",
    card: "summary_large_image",
    site: "https://beta.lexiapp.space",
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
    apple: "/image.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>
        <div className="overflow-hidden App">
          <SessionProviderClient>
            <SidebarProvider>
              <Navbar />
              <ToasterClient />
              <Suspense fallback={<GlobalLoader />}>
                <SidebarLayoutWrapper>{children}</SidebarLayoutWrapper>
              </Suspense>
              <Footer />
            </SidebarProvider>
          </SessionProviderClient>
        </div>
      </body>
    </html>
  );
}
