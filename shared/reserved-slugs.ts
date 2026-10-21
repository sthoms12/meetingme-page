/** Profile handles that collide with first-party app routes. */
export const RESERVED_PROFILE_SLUGS = new Set(["create"]);

export const isReservedProfileSlug = (slug: string) =>
  RESERVED_PROFILE_SLUGS.has(slug.trim().toLowerCase());
