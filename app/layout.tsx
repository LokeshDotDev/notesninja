import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers/SessionProvider";
import { DynamicNavbar } from "@/components/custom/DynamicNavbar";
import JsonLd from "@/components/custom/JsonLd";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import VisitorTracker from "@/components/analytics/GoogleAnalytics";
import MetaPixel from "@/components/analytics/MetaPixel";
import PerformanceMonitor from "@/components/custom/PerformanceMonitor";
import NavigationLoader from "@/components/custom/NavigationLoader";
import settings from "@/lib/settings";
import { GTM_ID } from "@/lib/gtm";
import Script from "next/script";
import { WhatsAppChat } from "@/components/ui/WhatsAppChat";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: `${settings.site.name}`,
  description: settings.site.description,
  keywords: settings.site.keywords,
  authors: [{ name: settings.site.author }],
  creator: settings.site.author,
  publisher: settings.site.publisher,
  formatDetection: {
    email: false,
    telephone: false,
  },
  metadataBase: new URL(settings.site.url),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${settings.site.name}`,
    description: settings.site.description,
    url: settings.site.url,
    siteName: settings.site.name,
    images: [
      {
        url: settings.site.ogImage,
        width: 1200,
        height: 630,
        alt: `${settings.site.name}`,
      },
    ],
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    card: "summary_large_image",
    title: `${settings.site.name}`,
    description: settings.site.description,
    images: [settings.site.twitterImage],
  },
  verification: settings.site.verification,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <html lang="en">
        <head>
          <link rel="canonical" href={settings.site.url} />
          <link rel="icon" type="image/png" href="/assets/Notes ninja Logo.png" />
          <meta name="geo.region" content={settings.site.geo.region} />
          <meta name="geo.position" content={settings.site.geo.position} />
          <meta name="ICBM" content={settings.site.geo.icbm} />
          <meta name="google-site-verification" content="mNmK_1WM8JiHujcMV8GhkRvaFpkm0q-1XPVzYzvAXK4" />

          {/* Google Tag Manager */}
          <Script id="gtm-script" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_ID}');
            `}
          </Script>

          {/* Razorpay Script */}
          <Script 
            src="https://checkout.razorpay.com/v1/checkout.js" 
            strategy="afterInteractive"
          />
        </head>
        <body
          className={`${poppins.variable} font-sans antialiased pt-20`}
        >
          <GoogleAnalytics ga_id={settings.site.analytics_ga_id} />
          <VisitorTracker ga_id={settings.site.analytics_ga_id} />
          <MetaPixel />
          <JsonLd />
          <PerformanceMonitor />
          <NavigationLoader />
          <DynamicNavbar />
          {children}
          <WhatsAppChat />

          {/* Google Tag Manager (noscript) */}
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        </body>
      </html>
    </Providers>
  );
}
