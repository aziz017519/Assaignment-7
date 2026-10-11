import type { Metadata } from "next";
import { Geist, Hind_Siliguri, Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";
import Header from "./components/Headerx";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";
import Marquee from "./components/Marquee";
const hindSiliguri = Hind_Siliguri({
  variable: "--font-hind-siliguri",
  subsets: ["latin", "bengali"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const notoBengali = Noto_Sans_Bengali({
  variable: "--font-noto-bengali",
  subsets: ["bengali", "latin"],
  display: "swap",
});
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "বাজার দর",
  description: "আজকের বাজারের দাম এক নজরে",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="bn"
      data-scroll-behavior="smooth"
      data-theme="light"
      className={`${geistSans.variable} ${hindSiliguri.variable} ${notoBengali.variable} h-full antialiased scroll-smooth`}
    >
      <body className={`${hindSiliguri.variable} font-sans flex min-h-screen flex-col bg-[#F0F5F0]`}>
        
      <div className="sticky top-0 z-50">
         <Header></Header>
     <Nav></Nav>
 
      </div>
          <Marquee></Marquee>
        <main>
            <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            success: { duration: 3000 },
            error: { duration: 3000 },
          }}></Toaster>
          {children}
        </main>
        <Footer></Footer>
        </body>
    </html>
  );
}
