import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await axios.post(
      `${process.env.API_URL}/auth/forgot-password`,
      body
    );

    var data = await response.data;

    console.log("Change password response from API:", data);

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Change password API error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
