export type ValidationResult<T> =
 | { ok: true; value: T }
 | { ok: false; errors: Partial<Record<keyof T, string>> };

export interface ContactInput {
 name: string;
 email: string;
 message: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_MAX = 100;
const MESSAGE_MIN = 10;
const MESSAGE_MAX = 2000;

export function validateContactInput(input: unknown): ValidationResult<ContactInput> {
 if (typeof input !== "object" || input === null) {
  return { ok: false, errors: { name: "Invalid submission." } };
 }

 const record = input as Record<string, unknown>;
 const name = typeof record.name === "string" ? record.name.trim() : "";
 const email = typeof record.email === "string" ? record.email.trim() : "";
 const message = typeof record.message === "string" ? record.message.trim() : "";

 const errors: Partial<Record<keyof ContactInput, string>> = {};
 if (!name) errors.name = "Name is required.";
 else if (name.length > NAME_MAX) errors.name = `Name must be under ${NAME_MAX} characters.`;

 if (!email) errors.email = "Email is required.";
 else if (!EMAIL_REGEX.test(email)) errors.email = "Enter a valid email.";

 if (!message) errors.message = "Message is required.";
 else if (message.length < MESSAGE_MIN) errors.message = `Message must be at least ${MESSAGE_MIN} characters.`;
 else if (message.length > MESSAGE_MAX) errors.message = `Message must be under ${MESSAGE_MAX} characters.`;

 if (Object.keys(errors).length > 0) return { ok: false, errors };
 return { ok: true, value: { name, email, message } };
}
