import prisma from "@/db/prisma";
import { Api } from "@/generated/prisma";
import { getRedisData } from "@/lib/cache-handler";
import { NextRequest, NextResponse } from "next/server";
import { paymentMiddleware, Resource } from "x402-express";
import { Address } from "@solana/kit";

const facilitatorUrl = process.env.FACILITATOR_URL as Resource;

interface ExpressLikeRequest {
  method: string;
  url: string;
  headers: Record<string, string>;
}

interface ExpressLikeResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
  setHeader: (key: string, value: string) => void;
  end: (body: string) => void;
}

export async function GET(request: NextRequest) {
  // Get uniqueId from the URL path
  const uniqueId = request.nextUrl.pathname.split("/").filter(Boolean).slice(2).join("/");

  const cachedApi = (await getRedisData(uniqueId)) as Api | null;
  if (!cachedApi) {
    return NextResponse.json({ error: "API not found" }, { status: 404 });
  }

  const api = await prisma.api.findUnique({
    where: { id: cachedApi.id },
    include: { user: true },
  });

  if (!api) {
    return NextResponse.json({ error: "API not found" }, { status: 404 });
  }

  // Check if request is from a browser by examining Accept header
  const acceptHeader = request.headers.get("accept") || "";
  const isBrowser = acceptHeader.includes("text/html");

  // If request is from a browser, redirect to the paywall page
  if (isBrowser) {
    return NextResponse.redirect(new URL(`${request.nextUrl.origin}/paywall/${uniqueId}`, request.url));
  }

  const middleware = paymentMiddleware(
    api.payTo as Address,
    {
      [`${api.requestType} ${api.endpoint}`]: {
        price: `${api.pricePerRequest}`,
        network: api.testMode ? "solana-devnet" : "solana",
      },
    },
    { url: facilitatorUrl }
  );

  const req: ExpressLikeRequest = {
    method: request.method,
    url: api.endpoint,
    headers: Object.fromEntries(request.headers.entries()),
  };

  const res: ExpressLikeResponse = {
    statusCode: 200,
    headers: {},
    body: "",
    setHeader(key, value) {
      this.headers[key] = value;
    },
    end(body) {
      this.body = body;
    },
  };

  await new Promise<void>((resolve, reject) => {
    middleware(req as unknown as Request, res as unknown as Response, (err?: unknown) => {
      if (err) reject(err);
      else resolve();
    });
  });

  // If middleware already handled response (e.g., 402)
  if (res.statusCode !== 200 && res.body) {
    try {
      const parsed = JSON.parse(res.body);
      return NextResponse.json(parsed, { status: res.statusCode });
    } catch {
      return NextResponse.json({ error: res.body }, { status: res.statusCode });
    }
  }

  return NextResponse.json(
    {
      success: false,
      error: "Payment Required",
      message: "This resource requires payment to access. Please include valid payment credentials.",
      data: {
        uniqueId,
        protocol: "x402",
        paymentRequired: true,
      },
    },
    { status: 402 }
  );
}
