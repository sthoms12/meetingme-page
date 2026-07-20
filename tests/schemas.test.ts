import { describe, expect, test } from "bun:test";
import {
  createProfileInputSchema,
  normalizeTwitterInput,
  updateProfileInputSchema,
} from "../shared/schemas";

const validCreateInput = {
  fullName: "Jane Doe",
  jobTitle: "Product Lead",
  company: "Example Co",
  profilePhoto: "https://example.com/jane.jpg",
  linkedinUrl: "https://www.linkedin.com/in/jane",
  websiteUrl: "https://example.com",
  videoUrl: "",
  twitterUrl: "@jane",
  githubUrl: "https://github.com/jane",
  phone: "",
  customSlug: "jane-doe",
  password: "long-enough-password",
  variantName: "Default",
  variantSlug: "intro",
  bio: "I help teams make better product decisions.",
  focus: "Product strategy",
  topics: "AI, collaboration",
  meetingNote: "Bring your hardest product question.",
};

describe("profile input validation", () => {
  test("accepts a valid profile and normalizes the X handle", () => {
    const result = createProfileInputSchema.safeParse(validCreateInput);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.twitterUrl).toBe("https://x.com/jane");
  });

  test("rejects executable and non-web URL schemes", () => {
    for (const websiteUrl of ["javascript:alert(1)", "data:text/html,test", "file:///etc/passwd"]) {
      const result = createProfileInputSchema.safeParse({ ...validCreateInput, websiteUrl });
      expect(result.success).toBe(false);
    }
  });

  test("rejects non-web profile-photo URLs", () => {
    const result = createProfileInputSchema.safeParse({
      ...validCreateInput,
      profilePhoto: "javascript:alert(1)",
    });
    expect(result.success).toBe(false);
  });

  test("rejects duplicate variant slugs during updates", () => {
    const variant = {
      id: "one",
      name: "Default",
      variantSlug: "intro",
      bio: validCreateInput.bio,
      focus: "",
      topics: [],
      meetingNote: "",
      views: 0,
    };
    const result = updateProfileInputSchema.safeParse({
      ...validCreateInput,
      primaryVariantId: "one",
      variants: [variant, { ...variant, id: "two" }],
      removePassword: false,
    });
    expect(result.success).toBe(false);
  });
});

test("normalizes supported X profile inputs", () => {
  expect(normalizeTwitterInput("https://twitter.com/jane/status/1")).toBe("https://x.com/jane");
});
