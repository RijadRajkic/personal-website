import { NextResponse } from "next/server";

export async function POST(request: Request) {
 try {
  const body = await request.json();
  const { name, email, subject, message } = body;

  if (!name || !email || !subject || !message) {
   return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }

  // TODO: Phase 4 — forward to Notion database or email service
  console.log("[contact]", { name, email, subject, message });

  return NextResponse.json({ success: true });
 } catch {
  return NextResponse.json({ error: "Invalid request." }, { status: 400 });
 }
}
