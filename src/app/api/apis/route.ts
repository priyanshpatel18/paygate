import { PrismaClient, RequestType } from "@/generated/prisma";
import { setRedisData } from "@/lib/cache-handler";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// Helper to get user from Privy header
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

// GET - List all APIs for user
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);

    const apis = await prisma.api.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    // Calculate stats
    const stats = {
      totalAPIs: apis.length,
      activeAPIs: apis.filter((api) => api.status === "active").length,
      totalRequests: apis.reduce((sum, api) => sum + api.totalRequests, 0),
      totalRevenue: apis.reduce((sum, api) => sum + api.totalRevenue, 0),
    };

    // Transform data for frontend
    const transformedApis = apis.map((api) => ({
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
    }));

    return NextResponse.json({
      success: true,
      data: transformedApis,
      stats,
    });
  } catch (error) {
    console.error("Error fetching APIs:", error);

    if (error instanceof Error && error.message === "Not authenticated") {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to fetch APIs" },
      { status: 500 }
    );
  }
}

// POST - Create new API
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);

    const form = await request.formData();


    const title = form.get("title")?.toString() || "";
    const description = form.get("description")?.toString() || "";
    const endpoint = form.get("url")?.toString() || "";
    const pricePerRequest = form.get("price")?.toString() || "";
    const testMode = form.get("testMode")?.toString() || "";
    const requestType = (form.get("requestType")?.toString() || "") as RequestType;

    if (!endpoint || !pricePerRequest || !requestType) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const price = parseFloat(pricePerRequest);
    if (isNaN(price) || price < 0.01 || price > 1000) {
      return NextResponse.json(
        { success: false, error: "Invalid price" },
        { status: 400 }
      );
    }

    const uniqueId = nanoid(10);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://paygate.solixdb.xyz";
    const wrappedUrl = `${baseUrl}/api/paywall/${uniqueId}`;

    const api = await prisma.api.create({
      data: {
        name: title,
        description,
        endpoint,
        wrappedUrl,
        pricePerRequest: price,
        userId: user.id,
        testMode: testMode === "true",
        requestType
      },
    });

    await setRedisData(uniqueId, JSON.stringify({
      endpoint
    }));

    return NextResponse.json({ success: true, data: api });
  } catch (error) {
    console.error("Error creating API:", error);
    return NextResponse.json({ success: false, error: "Failed to create API" }, { status: 500 });
  }
}