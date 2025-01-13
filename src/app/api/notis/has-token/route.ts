import { getNotificationTokenForFid } from "~/lib/database";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const app = searchParams.get("app");
  const fid = searchParams.get("fid");

  if (!fid || !app) {
    return Response.json({ hasToken: false });
  }

  const token = await getNotificationTokenForFid(app, Number(fid));
  return Response.json({ hasToken: !!token });
}
