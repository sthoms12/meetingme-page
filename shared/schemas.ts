import { z } from "zod";

const slugPattern = /^[a-z0-9-]{3,30}$/;
const variantSlugPattern = /^[a-z0-9-]{2,30}$/;
const dataImagePattern = /^data:image\/(?:png|jpeg|jpg|webp|gif);base64,[a-z0-9+/=]+$/i;
const xHandlePattern = /^@?[A-Za-z0-9_]{1,15}$/;

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .transform((value) => value ?? "")
  .refine((value) => value === "" || z.string().url().safeParse(value).success, {
    message: "Must be a valid URL",
  });

export const normalizeTwitterInput = (value?: string | null) => {
  const trimmed = (value ?? "").trim();
  if (!trimmed) return "";

  if (xHandlePattern.test(trimmed)) {
    return `https://x.com/${trimmed.replace(/^@/, "")}`;
  }

  try {
    const url = new URL(trimmed);
    const host = url.hostname.toLowerCase();
    if (["x.com", "www.x.com", "twitter.com", "www.twitter.com"].includes(host)) {
      const handle = url.pathname.split("/").filter(Boolean)[0];
      if (handle && xHandlePattern.test(handle)) {
        return `https://x.com/${handle.replace(/^@/, "")}`;
      }
    }
  } catch {
    return trimmed;
  }

  return trimmed;
};

const optionalTwitterProfile = z
  .string()
  .trim()
  .optional()
  .transform((value) => value ?? "")
  .refine((value) => {
    if (value === "") return true;
    if (xHandlePattern.test(value)) return true;
    try {
      const url = new URL(value);
      return ["x.com", "www.x.com", "twitter.com", "www.twitter.com"].includes(url.hostname.toLowerCase());
    } catch {
      return false;
    }
  }, {
    message: "Enter an X handle like @name or a full profile URL",
  })
  .transform((value) => normalizeTwitterInput(value));

export const slugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(slugPattern, "Slug must be 3-30 characters using lowercase letters, numbers, or hyphens");

export const variantSchema = z.object({
  id: z.string().trim().min(1),
  name: z.string().trim().min(1).max(40),
  variantSlug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(variantSlugPattern, "Variant slug must be 2-30 characters using lowercase letters, numbers, or hyphens"),
  bio: z.string().trim().min(10).max(300),
  focus: z.string().trim().max(60).optional().transform((value) => value ?? ""),
  topics: z.union([z.array(z.string().trim().min(1).max(40)).max(8), z.string().trim().max(240)]),
  meetingNote: z.string().trim().max(200).optional().transform((value) => value ?? ""),
  views: z.number().int().min(0),
});

const profilePhotoSchema = z
  .string()
  .trim()
  .optional()
  .transform((value) => value ?? "")
  .refine(
    (value) =>
      value === "" ||
      dataImagePattern.test(value) ||
      z.string().url().safeParse(value).success,
    { message: "Profile photo must be a valid URL or supported image upload" },
  );

const baseProfileFields = {
  fullName: z.string().trim().min(2).max(80),
  jobTitle: z.string().trim().min(2).max(100),
  company: z.string().trim().min(2).max(100),
  profilePhoto: profilePhotoSchema,
  linkedinUrl: optionalUrl,
  websiteUrl: optionalUrl,
  videoUrl: optionalUrl,
  twitterUrl: optionalTwitterProfile,
  githubUrl: optionalUrl,
  phone: z.string().trim().max(40).optional().transform((value) => value ?? ""),
};

export const createProfileInputSchema = z.object({
  ...baseProfileFields,
  customSlug: z.string().trim().toLowerCase().optional().transform((value) => value ?? ""),
  password: z.string().trim().optional().transform((value) => value ?? ""),
  variantName: z.string().trim().min(1).max(40),
  variantSlug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(variantSlugPattern, "Variant slug must be 2-30 characters using lowercase letters, numbers, or hyphens"),
  bio: z.string().trim().min(10).max(300),
  focus: z.string().trim().max(60).optional().transform((value) => value ?? ""),
  topics: z.string().trim().max(240).optional().transform((value) => value ?? ""),
  meetingNote: z.string().trim().max(200).optional().transform((value) => value ?? ""),
}).superRefine((value, ctx) => {
  if (value.customSlug && !slugPattern.test(value.customSlug)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["customSlug"],
      message: "Slug must be 3-30 characters using lowercase letters, numbers, or hyphens",
    });
  }

  if (value.password && value.password.length < 8) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["password"],
      message: "Password must be at least 8 characters",
    });
  }
});

export const updateProfileInputSchema = z
  .object({
    ...baseProfileFields,
    password: z.string().min(8).max(128).optional().transform((value) => value ?? ""),
    removePassword: z.boolean().optional().default(false),
    primaryVariantId: z.string().trim().min(1),
    variants: z.array(variantSchema).min(1).max(3),
  })
  .superRefine((value, ctx) => {
    const seen = new Set<string>();

    for (const [index, variant] of value.variants.entries()) {
      if (seen.has(variant.variantSlug)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["variants", index, "variantSlug"],
          message: "Variant slugs must be unique",
        });
      }

      seen.add(variant.variantSlug);
    }

    if (!value.variants.some((variant) => variant.id === value.primaryVariantId)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["primaryVariantId"],
        message: "Primary variant must match one of the submitted variants",
      });
    }
  });

export const verifyPasswordInputSchema = z.object({
  password: z.string().min(1).max(128),
  variantSlug: z.string().trim().toLowerCase().optional(),
});

export const sessionExchangeInputSchema = z.object({
  editToken: z.string().trim().min(32).max(256),
});

export const restoreSnapshotInputSchema = z.object({
  timestamp: z.string().datetime(),
});

export const passkeyRegisterCompleteInputSchema = z.object({
  response: z.record(z.string(), z.unknown()),
  deviceLabel: z.string().trim().max(60).optional(),
});

export const passkeyAuthCompleteInputSchema = z.object({
  response: z.record(z.string(), z.unknown()),
});

export const recoveryCodeRedeemInputSchema = z.object({
  code: z.string().trim().min(6).max(64),
});

export type CreateProfileInput = z.infer<typeof createProfileInputSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileInputSchema>;
export type VerifyPasswordInput = z.infer<typeof verifyPasswordInputSchema>;
export type SessionExchangeInput = z.infer<typeof sessionExchangeInputSchema>;
export type RestoreSnapshotInput = z.infer<typeof restoreSnapshotInputSchema>;
export type PasskeyRegisterCompleteInput = z.infer<typeof passkeyRegisterCompleteInputSchema>;
export type PasskeyAuthCompleteInput = z.infer<typeof passkeyAuthCompleteInputSchema>;
export type RecoveryCodeRedeemInput = z.infer<typeof recoveryCodeRedeemInputSchema>;
