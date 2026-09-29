import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/lib/context/ThemeContext";
import { AuthProvider } from "@/lib/context/AuthContext";
import { CurrencyProvider } from "@/lib/context/CurrencyContext";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

export const metadata: Metadata = {
  title: "Startup Buddy — Validate Your Startup Idea in 60 Seconds",
  description:
    "Transform your startup idea into a comprehensive validation report — SWOT analysis, MVP roadmap, tech stack, financial breakdown — powered by AI.",
  keywords: "startup, AI, business validation, founder, entrepreneur, MVP, SWOT analysis, startup buddy",
  openGraph: {
    title: "Startup Buddy",
    description: "Your AI-powered startup co-founder. Validate ideas in 60 seconds.",
    type: "website",
    siteName: "Startup Buddy",
  },
  twitter: {
    card: "summary_large_image",
    title: "Startup Buddy",
    description: "Validate your startup idea with AI in 60 seconds.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-animated" style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <ThemeProvider>
          <AuthProvider>
            <CurrencyProvider>
              <Navbar />
              <main style={{ flex: 1 }}>
                {children}
              </main>
              <Footer />
            </CurrencyProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
