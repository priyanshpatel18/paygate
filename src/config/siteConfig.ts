import { Metadata } from "next";

const { title, description, ogImage, baseURL } = {
  title: "PayGate",
  description:
    "PayGate is the x402 payment gateway for APIs. Monetize any API endpoint instantly with Solana micropayments. Add one line of code, start earning. No complex integrations, no minimum fees—just simple pay-per-request monetization for developers.",
  baseURL: "https://paygate.solixdb.xyz",
  ogImage: `https://paygate.solixdb.xyz/open-graph.png`,
};

export const siteConfig: Metadata = {
  title,
  description,
  metadataBase: new URL(baseURL),
  openGraph: {
    title,
    description,
    images: [ogImage],
    url: baseURL,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [ogImage],
  },
  icons: {
    icon: "/favicon.ico",
  },
  applicationName: "PayGate",
  alternates: {
    canonical: baseURL,
  },
  keywords: [
    "x402 Protocol",
    "API Monetization",
    "Solana Payments",
    "Micropayments API",
    "Pay-per-request",
    "API Gateway",
    "Crypto Payments",
    "Developer Tools",
    "HTTP 402",
    "API Wrapper",
    "Solana API",
    "Agent Payments",
  ],
};