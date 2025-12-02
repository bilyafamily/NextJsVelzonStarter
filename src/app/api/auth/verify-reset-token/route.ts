import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const email = request.nextUrl.searchParams.get("email");
    const token = request.nextUrl.searchParams.get("token");

    const response = await axios.get(
      `${process.env.API_URL}/auth/verify-reset-token?email=${email}&token=${token}`
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Change password API error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
