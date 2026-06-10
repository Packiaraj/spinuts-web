import type { Metadata } from "next";
import "./globals.css";
import NavFooterWrapper from "@/components/NavFooterWrapper";

export const metadata: Metadata = {
  title: "SpiNuts — Pure spices. Real origin. No middlemen.",
  description: "Whole spices and nuts sourced directly from real farmers of the Western Ghats. Premium quality, delivered to your door.",
  keywords: "Western Ghats spices, whole spices, nuts, seeds, millets, dry fruits, farm direct India",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <NavFooterWrapper>{children}</NavFooterWrapper>
      </body>
    </html>
  );
}
