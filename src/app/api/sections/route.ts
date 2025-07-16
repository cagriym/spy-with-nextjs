import { NextRequest, NextResponse } from "next/server";
import { saveSectionToBlob } from "@/lib/blob";

export async function POST(req: NextRequest) {
  try {
    const { sectionName, data } = await req.json();
    if (!sectionName || !data) {
      return NextResponse.json({ error: "Eksik veri" }, { status: 400 });
    }
    const url = await saveSectionToBlob(sectionName, data);
    return NextResponse.json({ url });
  } catch {
    return NextResponse.json({ error: "Bölüm kaydedilemedi" }, { status: 500 });
  }
}
