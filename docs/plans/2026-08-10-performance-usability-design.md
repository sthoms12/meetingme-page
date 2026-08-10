# B4WeMeet performance and usability design

## Status

Approved for implementation on 2026-08-10. This design follows the production audit and supersedes no existing product behavior.

## Goal

Improve mobile loading and make page creation easier without changing the profile schema, API contract, stored Durable Object data, public profile URLs, management access, or desktop workflow.

## Performance changes

- Render the homepage directly instead of placing the primary route behind a lazy-loading boundary.
- Defer passkey browser code until the user chooses to add a passkey.
- Keep QR generation deferred until a profile has been created.
- Replace decorative Framer Motion usage in the shared profile card with the existing CSS entry animation.
- Resolve failed ZoAnalytics collection and avoid incompatible Cloudflare browser scripts.
- Preserve route-level splitting for public profile and management pages.

## Usability changes

- Add a clear mobile hero action that moves directly to creation.
- Keep the required identity and meeting-context fields visible.
- Put optional photo, professional links, and privacy controls behind explicit progressive disclosure.
- Add character counts to constrained text fields.
- Add a mobile preview sheet so users can inspect the card without completing or scrolling beyond the form.
- Add a mobile sticky action bar for preview and publishing, shown only while creation is in progress.
- Correct the photo upload label and add a keyboard-accessible skip link.

## Error handling and compatibility

The existing validation summary, inline field messages, slug availability checks, and submit behavior remain authoritative. Optional sections automatically open when validation finds an error inside them. Existing public and management pages remain unchanged.

## Verification

Run lint, TypeScript, tests, production build, frozen installation, dependency audit, desktop/mobile browser checks, accessibility checks, and Lighthouse. Production release proceeds only after GitHub CI and Cloudflare Workers branch checks pass.
