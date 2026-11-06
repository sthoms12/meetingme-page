// Stub for the retired profile system's Durable Object class.
//
// The class is intentionally NOT bound in wrangler.jsonc (no route reaches
// it, and the profile system is gone), but the export must remain until the
// class is deleted with a wrangler `deleted_classes` migration — a deploy
// that simply drops the export of a class with existing storage is refused.
// Per spec §7, that migration ships as the step AFTER the post-merge live
// smoke test passes; this stub is removed in the same change.
export class GlobalDurableObject {
  constructor(
    private readonly ctx: DurableObjectState,
    private readonly env: unknown,
  ) {
    void this.ctx;
    void this.env;
  }

  async fetch(): Promise<Response> {
    return new Response('Gone', { status: 410 });
  }
}
