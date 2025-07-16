import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(req: NextRequest) {
  try {
    const usernames = await req.json();
    if (!Array.isArray(usernames)) {
      return NextResponse.json(
        { error: "Invalid usernames array" },
        { status: 400 }
      );
    }
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        { error: "BLOB_READ_WRITE_TOKEN is not set" },
        { status: 500 }
      );
    }
    const blob = new Blob([JSON.stringify(usernames)], {
      type: "application/json",
    });
    const { url } = await put("usernames.json", blob, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
      allowOverwrite: true,
    });
    return NextResponse.json({ url });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
