import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "SpiNuts — Pure spices. Real origin. No middlemen.",
  description: "Family sourced whole spices and nuts directly from Kerala and Tamil Nadu farms. Premium quality, delivered to your door.",
  keywords: "Kerala spices, whole spices, nuts, seeds, millets, dry fruits, India",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
