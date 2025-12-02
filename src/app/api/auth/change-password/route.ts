import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import axios from "axios";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    console.log("Session access token:", session.accessToken);

    const body = await request.json();

    console.log("Change password request body:", body);

    const response = await axios.post(
      `${process.env.API_URL}/auth/change-password`,
      body,
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
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
