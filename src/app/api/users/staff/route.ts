import { NextResponse } from "next/server";
import { auth } from "src/lib/auth";
import microsoftGraphClient from "src/apiClients/microsoft-graph-client";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.microsoftGraphToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const groupId = searchParams.get("groupId");

  try {
    const response = await microsoftGraphClient.get(
      `/groups/${groupId}/members`,
      {
        headers: {
          Authorization: `Bearer ${session.microsoftGraphToken}`,
        },
      }
    );

    return NextResponse.json(response.data.value);
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.microsoftGraphToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { payload, groupId } = await request.json();

  try {
    const response = await microsoftGraphClient.post(
      `/groups/${groupId}/members/$ref`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${session.microsoftGraphToken}`,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.microsoftGraphToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const groupId = searchParams.get("groupId");
  const userId = searchParams.get("userId");

  try {
    const response = await microsoftGraphClient.delete(
      `/groups/${groupId}/members/${userId}/$ref`,
      {
        headers: {
          Authorization: `Bearer ${session.microsoftGraphToken}`,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
