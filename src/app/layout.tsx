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
  title: "Lexi",
  description: "Rephrase sentences with the tone you want. Crisp results, streaming in real time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} antialiased`}
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
          <main className="flex items-center justify-center w-full mt-14">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
