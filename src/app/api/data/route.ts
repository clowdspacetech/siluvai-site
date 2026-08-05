import { NextResponse } from "next/server";
import { getRepository } from "@/lib/db";
import type { AppData } from "@/lib/types";

export async function GET() {
  try {
    const repo = getRepository();
    const data = await repo.getAppData();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[API /data GET]", error);
    return NextResponse.json({ error: "Failed to load data" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const repo = getRepository();
    const body = (await request.json()) as AppData;
    const data = await repo.saveAppData(body);
    return NextResponse.json(data);
  } catch (error) {
    console.error("[API /data PUT]", error);
    return NextResponse.json({ error: "Failed to save data" }, { status: 500 });
  }
}
