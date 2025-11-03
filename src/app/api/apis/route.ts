import { PrismaClient } from "@/generated/prisma";
import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";

const prisma = new PrismaClient();

// Helper to get user from Privy header
async function getUserFromRequest(request: NextRequest) {
  console.log(request.headers);
  const privyId = request.headers.get("x-privy-id");
  
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
      originalUrl: api.originalUrl,
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
    console.log(user);
    
    const body = await request.json();

    const { name, originalUrl, endpoint, pricePerRequest, description } = body;

    // Validation
    if (!name || !originalUrl || !endpoint || !pricePerRequest) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate URL
    try {
      new URL(originalUrl);
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid original URL" },
        { status: 400 }
      );
    }

    // Validate endpoint starts with /
    if (!endpoint.startsWith("/")) {
      return NextResponse.json(
        { success: false, error: "Endpoint must start with /" },
        { status: 400 }
      );
    }

    // Validate price
    const price = parseFloat(pricePerRequest);
    if (isNaN(price) || price < 0.01 || price > 1000) {
      return NextResponse.json(
        { success: false, error: "Price must be between $0.01 and $1000" },
        { status: 400 }
      );
    }

    // Generate unique wrapped URL
    const uniqueId = nanoid(10);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://paygate.solixdb.xyz";
    const wrappedUrl = `${baseUrl}/${uniqueId}${endpoint}`;

    // Create API
    const api = await prisma.api.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        endpoint: endpoint.trim(),
        originalUrl: originalUrl.trim(),
        wrappedUrl,
        pricePerRequest: price,
        userId: user.id,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: api.id,
        name: api.name,
        endpoint: api.endpoint,
        wrappedUrl: api.wrappedUrl,
        pricePerRequest: api.pricePerRequest,
      },
    });
  } catch (error) {
    console.error("Error creating API:", error);

    if (error instanceof Error && error.message === "Not authenticated") {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to create API" },
      { status: 500 }
    );
  }
}