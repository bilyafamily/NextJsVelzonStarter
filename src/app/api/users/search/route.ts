import { NextResponse } from "next/server";
import microsoftGraphClient from "src/apiClients/microsoft-graph-client";
import { auth } from "src/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: { groupId: string } }
) {
  const session = await auth();
  if (!session?.microsoftGraphToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  try {
    const response = await microsoftGraphClient.get(
      `/users?$filter=startswith(displayName,'${query}') or startswith(mail,'${query}') or startswith(userPrincipalName,'${query}')&$select=id,displayName,mail,userPrincipalName`,
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
