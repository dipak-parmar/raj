import type { Metadata } from "next";
import { Playfair_Display, Inter, Poppins } from "next/font/google";
import "./globals.css";
import ClientLayout from "./ClientLayout";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
});



export const metadata: Metadata = {
  title: "RAJ MARKETING | Premium Organic Luxury Skincare & Cosmetics",
  description: "Experience the peak of organic skincare crafted with natural purity, botanical innovation, and over 35 years of legacy. Shop our premium range.",
  keywords: "Raj Marketing, cosmetics, organic skincare, natural beauty, luxury cosmetics, premium moisturizer, hydrating serum, clay mask",
  authors: [{ name: "Raj Marketing Team" }],
  icons: {
    icon: "/images/about/about-1.png",
  },
  openGraph: {
    title: "RAJ MARKETING | Premium Organic Luxury Skincare",
    description: "Experience pure organic skincare crafted back since 2004. Explore our collection of premium oils, botanical serums, and natural toners.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-backgroundCustom">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
