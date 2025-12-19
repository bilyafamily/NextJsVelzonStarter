import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { backendApiClient } from "src/lib/backend.api";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const templates = await backendApiClient.get(`/templates`);

    return NextResponse.json(templates);
  } catch (error) {
    console.error("Error fetching templates:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const formData = await request.formData();

    const file = formData.get("template") as File | null;

    console.log(file);

    const name = formData.get("name") as string;

    console.log("Name:", name);
    console.log("File:", file);

    const template = await backendApiClient.postFormData(
      `/templates`,
      formData
    );

    return NextResponse.json(template);
  } catch (error) {
    console.error("Error saving template:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
