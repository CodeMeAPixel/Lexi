import Navbar from "@/components/core/Navbar";
import Footer from "@/components/core/Footer";

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (

        <div className="App">
            <div className="sticky top-0 z-50">
                <Navbar />
            </div>
            <main className="flex items-center justify-center w-full mt-20 mb-20">
                {children}
            </main>
            <Footer />
        </div>
    );
}
