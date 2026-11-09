import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import Script from "next/script";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { site, siteUrl } from "@/site.config";
import "./globals.css";

const mono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.person.name.toLowerCase()} · ${site.person.role.toLowerCase()} at mantaq`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  openGraph: {
    siteName: site.name,
    type: "website",
    locale: "en_US",
  },
  twitter: { card: "summary_large_image" },
  verification: {
    google: site.googleSiteVerification,
    other: { "msvalidate.01": site.bingSiteVerification },
  },
};

// Runs before first paint so the saved (or system) theme applies without a flash.
const themeScript = `try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.dataset.theme=t}catch(e){}`;

const gtmScript = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${site.gtmId}');`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={mono.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="alternate" type="application/rss+xml" title={site.name} href="/rss.xml" />
      </head>
      <body className="min-h-screen bg-bg text-fg">
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${site.gtmId}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <div className="mx-auto flex min-h-screen max-w-[680px] flex-col px-6">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Script id="gtm" strategy="afterInteractive">
          {gtmScript}
        </Script>
      </body>
    </html>
  );
}
