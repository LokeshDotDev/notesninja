import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers/SessionProvider";
import { DynamicNavbar } from "@/components/custom/DynamicNavbar";
import JsonLd from "@/components/custom/JsonLd";
import settings from "@/lib/settings";
import { GTM_ID } from "@/lib/gtm";
import Script from "next/script";
import dynamic from "next/dynamic";

// Lazy load Footer (it's at the bottom of the page)
const Footer = dynamic(() => import("@/components/content/Footer"), { 
  loading: () => null 
});

// Client-side only components - loaded after hydration  
const ClientOnlyComponents = dynamic(() => import("@/components/custom/ClientOnlyComponents"), {
  loading: () => null
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap", // Add font-display swap for better performance
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
          {/* Inline critical CSS to reduce render-blocking */}
          <style dangerouslySetInnerHTML={{
            __html: `
              html { overflow-x: hidden; }
              body { margin: 0; padding: 0; font-family: var(--font-poppins), -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
              .hero-section { content-visibility: auto; }
              img { display: block; }
            `
          }} />

          {/* Critical: Preload LCP image - hero slider with responsive sizes */}
          <link 
            rel="preload" 
            as="image" 
            href="/assets/slider/Slide 1.webp"
            type="image/webp"
            fetchPriority="high"
            imageSrcSet="/assets/slider/Slide 1.webp"
            imageSizes="100vw"
          />
          
          {/* Preload critical fonts */}
          <link 
            rel="preload" 
            href="/_next/static/media/0484562807a97172-s.p.woff2" 
            as="font" 
            type="font/woff2" 
            crossOrigin="anonymous"
          />
          
          {/* Preconnect to critical domains with high priority */}
          <link rel="preconnect" href="https://www.googletagmanager.com" />
          <link rel="preconnect" href="https://www.google-analytics.com" />
          <link rel="dns-prefetch" href="https://connect.facebook.net" />
          <link rel="dns-prefetch" href="https://checkout.razorpay.com" />
          <link rel="dns-prefetch" href="https://res.cloudinary.com" />
          <link rel="dns-prefetch" href="https://media.gumlet.io" />
          
          <link rel="canonical" href={settings.site.url} />
          <link rel="icon" type="image/png" href="/assets/Notes ninja Logo.png" />
          <meta name="geo.region" content={settings.site.geo.region} />
          <meta name="geo.position" content={settings.site.geo.position} />
          <meta name="ICBM" content={settings.site.geo.icbm} />
          <meta name="google-site-verification" content="mNmK_1WM8JiHujcMV8GhkRvaFpkm0q-1XPVzYzvAXK4" />

          {/* Google Tag Manager - Deferred to lazyOnload to avoid render blocking */}
          <Script id="gtm-script" strategy="lazyOnload" async>
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_ID}');
            `}
          </Script>

          {/* Razorpay Script - lazy load only when checkout is triggered */}
          <Script 
            src="https://checkout.razorpay.com/v1/checkout.js" 
            strategy="lazyOnload"
            async
          />
        </head>
        <body
          className={`${poppins.variable} font-sans antialiased pt-20`}
        >
          <JsonLd />
          <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-white focus:text-black">Skip to main content</a>
          <DynamicNavbar />
          <main id="main-content" role="main">
            {children}
          </main>
          <Footer />
          <ClientOnlyComponents ga_id={settings.site.analytics_ga_id} />

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
