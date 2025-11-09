import prisma from "@/db/prisma";
import { Api } from "@/generated/prisma";
import { getRedisData } from "@/lib/cache-handler";
import { NextRequest, NextResponse } from "next/server";

async function getUserFromRequest(request: NextRequest) {
  const privyId = request.headers.get("privy-token");

  if (!privyId) {
    throw new Error("Not authenticated");
  }

  const user = await prisma.user.findUnique({
    where: { privyId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    const url = new URL(request.url);
    const parts = url.pathname.split("/").filter(Boolean);
    const apiId = parts[parts.length - 1];
    const cachedApi = await getRedisData(apiId) as Api;

    const api = await prisma.api.findUnique({
      where: { id: cachedApi.id },
      include: {
        user: true,
      },
    })

    if (!api || api.userId !== user.id) {
      return NextResponse.json(
        { success: false, error: "API not found or unauthorized" },
        { status: 404 }
      );
    }

    const transformedApi = {
      id: api.id,
      name: api.name,
      description: api.description,
      endpoint: api.endpoint,
      wrappedUrl: api.wrappedUrl,
      pricePerRequest: api.pricePerRequest,
      status: api.status,
      requests: api.totalRequests,
      revenue: api.totalRevenue,
      successRate:
        api.totalRequests > 0
          ? Number(((api.successRequests / api.totalRequests) * 100).toFixed(1))
          : 0,
      createdAt: api.createdAt.toISOString(),
    };

    return NextResponse.json({ success: true, data: transformedApi });
  } catch (error) {
    console.error("Error fetching API:", error);
    if (error instanceof Error && error.message === "Not authenticated") {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: "Failed to fetch API" }, { status: 500 });
  }
}
