export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { isAdminRequest } from "@/lib/auth";

export async function GET() {
  const db = supabaseAdmin();
  const { data, error } = await db.from("settings").select("*");
  if (error) return NextResponse.json({});
  const result = {};
  data?.forEach(row => { result[row.key] = row.value; });
  return NextResponse.json(result);
}

export async function PUT(request) {
  if (!isAdminRequest(request))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = supabaseAdmin();
  const body = await request.json();
  const updates = Object.entries(body).map(([key, value]) => ({
    key, value, updated_at: new Date().toISOString(),
  }));
  const { error } = await db.from("settings").upsert(updates, { onConflict: "key" });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
