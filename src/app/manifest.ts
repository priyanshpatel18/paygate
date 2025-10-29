import type { MetadataRoute } from "next";

const { appName, description } = {
  appName: "PayGate",
  description:
    "PayGate is the x402 payment gateway for APIs. Monetize any API endpoint instantly with Solana micropayments. Add one line of code, start earning. No complex integrations, no minimum fees—just simple pay-per-request monetization for developers.",
};

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: appName,
    short_name: appName,
    description: description,
    start_url: "/",
    display: "standalone",
    background_color: "#fff",
    theme_color: "#fff",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}