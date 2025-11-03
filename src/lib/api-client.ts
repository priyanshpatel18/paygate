// lib/api-client.ts
// Client-side API helper that includes Privy authentication

import { usePrivy } from "@privy-io/react-auth";

interface FetchOptions extends RequestInit {
  body?: any;
}

export function useAuthenticatedFetch() {
  const { user } = usePrivy();

  const authenticatedFetch = async (url: string, options: FetchOptions = {}) => {
    if (!user?.id) {
      throw new Error("User not authenticated");
    }

    const headers = new Headers(options.headers);
    headers.set("Content-Type", "application/json");
    headers.set("x-privy-id", user.id);

    const config: RequestInit = {
      ...options,
      headers,
    };

    if (options.body && typeof options.body === "object") {
      config.body = JSON.stringify(options.body);
    }

    const response = await fetch(url, config);
    return response;
  };

  return authenticatedFetch;
}