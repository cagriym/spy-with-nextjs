import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(req: NextRequest) {
  const usernames = await req.json();
  const blob = new Blob([JSON.stringify(usernames)], {
    type: "application/json",
  });
  const { url } = await put("usernames.json", blob, {
    access: "public",
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
  return NextResponse.json({ url });
}
