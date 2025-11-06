import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    data: {
      uniqueId: request.nextUrl.pathname.split("/")[2],
    },
  });
}