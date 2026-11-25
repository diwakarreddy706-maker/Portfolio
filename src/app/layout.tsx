import type { Metadata } from "next";
import { Archivo_Black, Plus_Jakarta_Sans, Space_Mono } from "next/font/google";
import "./globals.css";
import { CustomCursor } from "../components/CustomCursor";
import { ToastProvider } from "../components/CopyToast";

const archivoBlack = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-mono",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Diwakar Reddy | Full-stack & AI Developer, Bengaluru",
  description:
    "Portfolio of Diwakar Reddy, Computer Science and Design student at RRCE, Bengaluru. Full-stack & AI developer crafting practical software and web systems with Python, React, Django, and local AI.",
  openGraph: {
    title: "Diwakar Reddy | Full-stack & AI Developer, Bengaluru",
    description:
      "Portfolio of Diwakar Reddy, Computer Science and Design student at RRCE, Bengaluru. Full-stack & AI developer crafting practical software and web systems with Python, React, Django, and local AI.",
    url: siteUrl,
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Diwakar Reddy - Full-stack & AI Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Diwakar Reddy | Full-stack & AI Developer, Bengaluru",
    description:
      "Portfolio of Diwakar Reddy, Computer Science and Design student at RRCE, Bengaluru. Full-stack & AI developer crafting practical software and web systems with Python, React, Django, and local AI.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Diwakar Reddy",
  givenName: "Diwakar",
  familyName: "Reddy",
  url: siteUrl,
  email: "diwakarreddy706@gmail.com",
  jobTitle: "Full-stack & AI Developer",
  description:
    "Computer Science and Design student at Rajarajeswari College of Engineering building practical software, AI applications, and responsive web systems.",
  alumniOf: {
    "@type": "EducationalOrganization",
    name: "Rajarajeswari College of Engineering (RRCE), Bengaluru",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Bengaluru",
    addressRegion: "Karnataka",
    addressCountry: "India",
  },
  sameAs: [
    "https://www.linkedin.com/in/diwakar-reddy-10141b448",
    "https://github.com/diwakarreddy706-maker",
    "https://www.instagram.com/_diwakar__12?mdxt=b2gyeGdpcWcyN3Bx&utm_source=qr",
  ],
  knowsAbout: [
    "Python",
    "React.js",
    "Django",
    "SQL",
    "Artificial Intelligence",
    "PySide6",
    "Next.js",
    "TypeScript",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body
        className={`${plusJakartaSans.variable} ${archivoBlack.variable} ${spaceMono.variable} font-sans bg-[#0a0a0a] text-white selection:bg-neutral-800 selection:text-white`}
      >
        <ToastProvider>
          {/* Interactive Trailing Cursor */}
          <CustomCursor />

          {/* 4-column architectural hairline grid lines (#1F1F1F) */}
          <div
            className="fixed inset-0 pointer-events-none z-0 grid grid-cols-4 max-w-7xl mx-auto px-6 md:px-12 opacity-60"
            aria-hidden="true"
          >
            <div className="border-r border-[#1F1F1F] h-full" />
            <div className="border-r border-[#1F1F1F] h-full" />
            <div className="border-r border-[#1F1F1F] h-full" />
            <div className="h-full" />
          </div>

          <div className="relative z-10">{children}</div>
        </ToastProvider>
      </body>
    </html>
  );
}
