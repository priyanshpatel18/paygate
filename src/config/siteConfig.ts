import { Metadata } from "next";

const { title, description, ogImage, baseURL } = {
  title: "Paygate - The Monetization Layer on Solana",
  description: "The Monetization Layer on Solana. Turn any API into a revenue stream in 60 seconds. One line of code to accept Solana payments—no smart contracts, no complexity. Built on x402 Protocol.",
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
  applicationName: "Paygate",
  alternates: {
    canonical: baseURL,
  },
  keywords: [
    "Monetization Layer",
    "Solana Monetization",
    "API Monetization",
    "Solana Payments",
    "x402 Protocol",
    "Micropayments API",
    "Pay-per-request",
    "API Gateway",
    "Developer Tools",
    "Instant Payments",
    "Solana API",
    "Agent Payments",
    "Revenue Stream",
  ],
};