"use server";

import "server-only";
import { Resend } from "resend";
import { validateContactInput, type ContactInput } from "@/lib/validation/contact";

export type ContactActionResult =
 | { ok: true }
 | { ok: false; errors?: Partial<Record<keyof ContactInput, string>>; message?: string };

export async function sendContactMessage(input: ContactInput): Promise<ContactActionResult> {
 const validation = validateContactInput(input);
 if (!validation.ok) return { ok: false, errors: validation.errors };

 const { name, email, message } = validation.value;
 const apiKey = process.env.RESEND_API_KEY;
 const fromEmail = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
 const toEmail = process.env.CONTACT_TO_EMAIL ?? "rijadrajkic@gmail.com";

 // Graceful degradation — without an API key we still acknowledge the submit so dev works.
 if (!apiKey) {
  console.log("[contact] RESEND_API_KEY not set; would have sent:", { name, email, message });
  return { ok: true };
 }

 try {
  const resend = new Resend(apiKey);
  const result = await resend.emails.send({
   from: `Rijad Rajkic Contact <${fromEmail}>`,
   to: toEmail,
   subject: `New contact form message — ${name}`,
   replyTo: email,
   text: `From: ${name} <${email}>\n\n${message}`,
  });
  if (result.error) {
   return { ok: false, message: result.error.message };
  }
  return { ok: true };
 } catch (e) {
  return { ok: false, message: e instanceof Error ? e.message : "Unknown error sending message." };
 }
}
