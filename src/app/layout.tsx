import type { Metadata, Viewport } from "next";
import { Noto_Sans, Outfit, Fira_Code } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { Toaster } from "@/components/shared/toast";
import { AuthProvider } from "@/components/shared/auth-provider";

const notoSans = Noto_Sans({ 
  subsets: ["latin", "devanagari"], 
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const outfit = Outfit({ 
  subsets: ["latin"], 
  variable: "--font-heading",
  display: "swap",
});

const firaCode = Fira_Code({ 
  subsets: ["latin"], 
  variable: "--font-mono",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};

export const metadata: Metadata = {
  title: {
    template: "%s | AtmoCraft",
    default: "AtmoCraft | IMD Learning Portal",
  },
  description: "Official Digital Capacity Building & LMS Portal for the India Meteorological Department.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${notoSans.variable} ${outfit.variable} ${firaCode.variable} antialiased font-body`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
