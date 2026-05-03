"use client";

import { useState } from "react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionHeading from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { SOCIAL_LINKS } from "@/lib/site-config";

interface FormData {
 name: string;
 email: string;
 subject: string;
 message: string;
}

type FormStatus = "idle" | "submitting" | "success" | "error";

export default function ContactPage() {
 const [form, setForm] = useState<FormData>({
  name: "",
  email: "",
  subject: "",
  message: "",
 });
 const [status, setStatus] = useState<FormStatus>("idle");

 function handleChange(
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
 ) {
  setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
 }

 async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  setStatus("submitting");

  try {
   const res = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form),
   });

   if (!res.ok) throw new Error("Failed to submit");

   setStatus("success");
   setForm({ name: "", email: "", subject: "", message: "" });
  } catch {
   setStatus("error");
  }
 }

 const inputClasses =
  "w-full rounded-xl border border-(--color-border) bg-(--color-bg) px-4 py-3 text-sm text-(--color-text) placeholder:text-(--color-text-muted)/60 transition focus:border-(--color-brand) focus:outline-none focus:ring-2 focus:ring-(--color-brand)/20";

 return (
  <>
   {/* ───── Header ───── */}
   <AnimatedSection padded={false} className="pb-0 pt-24 md:pt-32">
    <SectionHeading
     eyebrow="Contact"
     title="Get in touch"
     description="Have a project in mind, a question, or just want to say hello? Drop me a message."
    />
   </AnimatedSection>

   {/* ───── Form ───── */}
   <AnimatedSection amount={0.1}>
    <div className="mx-auto max-w-xl">
     {status === "success" ? (
      <div className="animate fade-up rounded-2xl border border-evergreen-300/40 bg-evergreen-50/50 p-8 text-center">
       <h3 className="text-2xl font-bold text-(--color-text)">Message sent!</h3>
       <p className="mt-2 text-sm text-(--color-text-muted)">
        Thanks for reaching out. I&apos;ll get back to you as soon as I can.
       </p>
       <button
        type="button"
        onClick={() => setStatus("idle")}
        className="mt-6 text-sm font-semibold text-(--color-brand) transition hover:opacity-80"
       >
        Send another message
       </button>
      </div>
     ) : (
      <form onSubmit={handleSubmit} className="space-y-5">
       <div className="animate fade-up grid gap-5 sm:grid-cols-2" data-stagger="0">
        <div>
         <label
          htmlFor="name"
          className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-(--color-text-muted)"
         >
          Name
         </label>
         <input
          type="text"
          id="name"
          name="name"
          required
          value={form.name}
          onChange={handleChange}
          placeholder="Your name"
          className={inputClasses}
         />
        </div>
        <div>
         <label
          htmlFor="email"
          className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-(--color-text-muted)"
         >
          Email
         </label>
         <input
          type="email"
          id="email"
          name="email"
          required
          value={form.email}
          onChange={handleChange}
          placeholder="you@example.com"
          className={inputClasses}
         />
        </div>
       </div>

       <div className="animate fade-up" data-stagger="1">
        <label
         htmlFor="subject"
         className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-(--color-text-muted)"
        >
         Subject
        </label>
        <input
         type="text"
         id="subject"
         name="subject"
         required
         value={form.subject}
         onChange={handleChange}
         placeholder="What's this about?"
         className={inputClasses}
        />
       </div>

       <div className="animate fade-up" data-stagger="2">
        <label
         htmlFor="message"
         className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-(--color-text-muted)"
        >
         Message
        </label>
        <textarea
         id="message"
         name="message"
         required
         rows={6}
         value={form.message}
         onChange={handleChange}
         placeholder="Tell me about your project or question..."
         className={`${inputClasses} resize-none`}
        />
       </div>

       {status === "error" && (
        <p className="text-sm text-molten-lava-500">
         Something went wrong. Please try again or email me directly.
        </p>
       )}

       <div className="animate fade-up" data-stagger="3">
        <Button
         type="submit"
         size="lg"
         className="w-full"
         disabled={status === "submitting"}
        >
         {status === "submitting" ? "Sending..." : "Send Message"}
        </Button>
       </div>
      </form>
     )}
    </div>
   </AnimatedSection>

   {/* ───── Alternative contact ───── */}
   <AnimatedSection tone="surface" amount={0.15}>
    <div className="mx-auto max-w-xl text-center">
     <p className="animate fade-up text-sm text-(--color-text-muted)" data-stagger="0">
      You can also find me on{" "}
      <a
       href={SOCIAL_LINKS.github}
       target="_blank"
       rel="noopener noreferrer"
       className="font-semibold text-(--color-brand) transition hover:opacity-80"
      >
       GitHub
      </a>{" "}
      and{" "}
      <a
       href={SOCIAL_LINKS.linkedin}
       target="_blank"
       rel="noopener noreferrer"
       className="font-semibold text-(--color-brand) transition hover:opacity-80"
      >
       LinkedIn
      </a>
      .
     </p>
    </div>
   </AnimatedSection>
  </>
 );
}
