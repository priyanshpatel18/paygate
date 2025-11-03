import { NextRequest } from "next/server";

export async function getPrivyUser(request: NextRequest) {
  try {
    // Get Privy access token from Authorization header
    const authHeader = request.headers.get("authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.substring(7);

    // Verify token with Privy's API
    const response = await fetch("https://auth.privy.io/api/v1/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
        "privy-app-id": process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
      },
    });

    if (!response.ok) {
      return null;
    }

    const user = await response.json();
    return user;
  } catch (error) {
    console.error("Error verifying Privy token:", error);
    return null;
  }
}

// Alternative: Use Privy ID from custom header (simpler for beta)
export function getPrivyIdFromHeader(request: NextRequest): string | null {
  return request.headers.get("x-privy-id");
}