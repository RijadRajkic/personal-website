"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { sendContactMessage, type ContactActionResult } from "@/app/actions/contact";
import { useFolderHero } from "@/components/navigation/FolderStack";
import { SOCIAL_LINKS } from "@/lib/site-config";

interface ContactFormValues {
 name: string;
 email: string;
 message: string;
}

const methods = [
 {
  label: "Email",
  value: SOCIAL_LINKS.email,
  href: `mailto:${SOCIAL_LINKS.email}`,
  icon: (
   <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M3 6h18a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1zm0 1.5v.4l9 5.6 9-5.6V7.5l-9 5.6L3 7.5z" />
   </svg>
  ),
 },
 {
  label: "GitHub",
  value: "@RijadRajkic",
  href: SOCIAL_LINKS.github,
  icon: (
   <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2.04c-3.2.69-3.87-1.36-3.87-1.36-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.24 3.34.95.1-.74.4-1.24.73-1.53-2.55-.29-5.23-1.27-5.23-5.66 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.17a10.96 10.96 0 0 1 5.74 0c2.19-1.48 3.15-1.17 3.15-1.17.62 1.58.23 2.75.11 3.04.74.8 1.18 1.82 1.18 3.07 0 4.4-2.69 5.36-5.25 5.65.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56C20.21 21.39 23.5 17.07 23.5 12c0-6.35-5.15-11.5-11.5-11.5z" />
   </svg>
  ),
 },
 {
  label: "LinkedIn",
  value: "/in/rijad-rajkic",
  href: SOCIAL_LINKS.linkedin,
  icon: (
   <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45z" />
   </svg>
  ),
 },
];

export default function ContactPanel() {
 const {
  register,
  handleSubmit,
  reset,
  formState: { errors },
 } = useForm<ContactFormValues>({ defaultValues: { name: "", email: "", message: "" } });

 const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
 const [serverMessage, setServerMessage] = useState<string | null>(null);
 const [isPending, startTransition] = useTransition();
 const { setHeroId } = useFolderHero();

 // Revert to default order ~1.6s after a successful send so the user sees the confirmation.
 useEffect(() => {
  if (status !== "success") return;
  const t = setTimeout(() => {
   setHeroId(null);
   setStatus("idle");
  }, 1600);
  return () => clearTimeout(t);
 }, [status, setHeroId]);

 const onSubmit = (values: ContactFormValues) => {
  setServerMessage(null);
  startTransition(async () => {
   const result: ContactActionResult = await sendContactMessage(values);
   if (result.ok) {
    setStatus("success");
    reset();
   } else {
    setStatus("error");
    setServerMessage(result.message ?? "Couldn't send. Try again or email me directly.");
   }
  });
 };

 return (
  <div className="flex h-full flex-col gap-3 overflow-y-auto md:gap-4">
   <div>
    <h2 className="text-lg font-bold tracking-tight text-(--color-text) md:text-xl lg:text-2xl">
     Get in touch
    </h2>
    <p className="mt-1 max-w-lg text-xs text-(--color-text-muted) md:text-sm">
     Questions, projects, or just want to say hello.
    </p>
   </div>

   {/* The grid (methods + form) is centered vertically inside whatever space remains
    * below the header — both columns use natural heights so neither stretches awkwardly. */}
   <div className="flex flex-1 items-center">
    <div className="flex w-full flex-col gap-3 md:flex-row md:gap-6">
     {/* ── Methods ── compact natural-height rows, vertically centered in the column. */}
     <div className="flex flex-col justify-center gap-2.5 md:flex-1">
      {methods.map((m) => (
       <a
        key={m.label}
        href={m.href}
        target={m.href.startsWith("mailto:") ? undefined : "_blank"}
        rel={m.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
        className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2 transition hover:border-white/10 hover:bg-white/[0.06]"
       >
       <span className="flex size-9 items-center justify-center rounded-lg bg-white/[0.05] text-(--color-text)">
        {m.icon}
       </span>
       <span className="flex flex-col gap-0.5">
        <span className="text-[0.6rem] font-medium uppercase tracking-[0.2em] text-(--color-text-muted)/70">
         {m.label}
        </span>
        <span className="text-xs text-(--color-text) md:text-sm">{m.value}</span>
       </span>
      </a>
     ))}
    </div>

    {/* ── Form ── natural-height rows; md:flex-1 keeps the column at 50% width on md+,
     * but unlike a plain flex-1 it doesn't stretch the form vertically inside its column. */}
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-center gap-3 md:flex-1">
     <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <label className="flex flex-col gap-1.5">
       <span className="text-[0.6rem] font-medium uppercase tracking-[0.2em] text-(--color-text-muted)/70">
        Name
       </span>
       <input
        type="text"
        {...register("name", { required: "Name is required.", maxLength: 100 })}
        className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-(--color-text) outline-none transition focus:border-white/25 focus:bg-black/30"
       />
       {errors.name && <span className="text-[0.65rem] text-molten-lava-400">{errors.name.message}</span>}
      </label>
      <label className="flex flex-col gap-1.5">
       <span className="text-[0.6rem] font-medium uppercase tracking-[0.2em] text-(--color-text-muted)/70">
        Email
       </span>
       <input
        type="email"
        {...register("email", {
         required: "Email is required.",
         pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email." },
        })}
        className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-(--color-text) outline-none transition focus:border-white/25 focus:bg-black/30"
       />
       {errors.email && <span className="text-[0.65rem] text-molten-lava-400">{errors.email.message}</span>}
      </label>
     </div>
     <label className="flex flex-col gap-1.5">
      <span className="text-[0.6rem] font-medium uppercase tracking-[0.2em] text-(--color-text-muted)/70">
       Message
      </span>
      <textarea
       rows={3}
       {...register("message", { required: "Message is required.", minLength: { value: 10, message: "A bit more, please." }, maxLength: 2000 })}
       className="resize-none rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-(--color-text) outline-none transition focus:border-white/25 focus:bg-black/30"
      />
      {errors.message && <span className="text-[0.65rem] text-molten-lava-400">{errors.message.message}</span>}
     </label>
     <div className="mt-1 flex items-center gap-3">
      <button
       type="submit"
       disabled={isPending}
       className="rounded-lg border border-white/15 bg-white/10 px-4 py-2 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-(--color-text) transition hover:bg-white/15 disabled:opacity-50"
      >
       {isPending ? "Sending..." : status === "success" ? "Sent ✓" : "Send message"}
      </button>
      {status === "success" && (
       <span className="text-xs text-evergreen-400">Thanks — I&apos;ll reply within a couple days.</span>
      )}
      {status === "error" && serverMessage && (
       <span className="text-xs text-molten-lava-400">{serverMessage}</span>
      )}
     </div>
    </form>
    </div>
   </div>
  </div>
 );
}
