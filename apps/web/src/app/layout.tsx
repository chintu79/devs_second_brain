import type { Metadata } from "next";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { AccentProvider } from "@/components/theme/accent-provider";

export const metadata: Metadata = {
  title: "Dev Second Brain",
  description: "Your developer knowledge management platform.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#6366f1" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="apple-touch-icon" href="/icons/icon-512.svg" />
        <script dangerouslySetInnerHTML={{
          __html: `(function(){try{var t=localStorage.getItem("theme");if(t==="light"){document.documentElement.classList.remove("dark")}else{document.documentElement.classList.add("dark")}}catch(e){}})()`
        }} />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <AccentProvider>
            {children}
            <Toaster position="bottom-right" richColors closeButton />
          </AccentProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
