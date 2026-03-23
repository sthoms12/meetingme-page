import { Hono } from "hono";
import { Env } from './core-utils';
import type { Profile, ApiResponse, ProfileFormData } from '@shared/types';
import { nanoid } from 'nanoid';
export function userRoutes(app: Hono<{ Bindings: Env }>) {
    // Slug validation helper
    const isValidSlug = (slug: string) => /^[a-z0-9-]{3,30}$/.test(slug);
    // Availability check
    app.get('/api/profiles/availability/:slug', async (c) => {
        const slug = c.req.param('slug').toLowerCase();
        if (!isValidSlug(slug)) {
            return c.json({ success: true, data: { available: false, error: 'Invalid format' } });
        }
        const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        const existing = await stub.getProfile(slug);
        return c.json({ success: true, data: { available: !existing } });
    });
    // Public Get Profile
    app.get('/api/profiles/:slug', async (c) => {
        const slug = c.req.param('slug');
        const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        // Increment views asynchronously - we don't strictly need to wait for it for the response
        // but for data integrity in the response we'll await it or fetch the profile after
        await stub.incrementProfileViews(slug);
        const profile = await stub.getProfile(slug);
        if (!profile) {
            return c.json({ success: false, error: 'Profile not found' } satisfies ApiResponse, 404);
        }
        const { editToken: _, ...publicProfile } = profile;
        return c.json({ success: true, data: publicProfile } as ApiResponse);
    });
    // Create Profile
    app.post('/api/profiles', async (c) => {
        const body = (await c.req.json()) as ProfileFormData & { customSlug?: string };
        const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        let slug = body.customSlug?.toLowerCase() || nanoid(10);
        if (body.customSlug) {
            if (!isValidSlug(slug)) {
                return c.json({ success: false, error: 'Slug must be 3-30 alphanumeric characters or hyphens' } satisfies ApiResponse, 400);
            }
            const existing = await stub.getProfile(slug);
            if (existing) {
                return c.json({ success: false, error: 'This URL is already taken' } satisfies ApiResponse, 409);
            }
        }
        const editToken = nanoid(32);
        const newProfile: Profile = {
            fullName: body.fullName,
            jobTitle: body.jobTitle,
            company: body.company,
            bio: body.bio,
            profilePhoto: body.profilePhoto,
            linkedinUrl: body.linkedinUrl,
            websiteUrl: body.websiteUrl,
            videoUrl: body.videoUrl,
            slug,
            editToken,
            views: 0,
            createdAt: new Date().toISOString()
        };
        await stub.createProfile(newProfile);
        return c.json({ success: true, data: newProfile } satisfies ApiResponse<Profile>);
    });
    // Update Profile
    app.put('/api/profiles/:slug', async (c) => {
        const slug = c.req.param('slug');
        const body = (await c.req.json()) as Partial<Profile> & { editToken?: string };
        const { editToken, ...updates } = body;
        if (!editToken) {
            return c.json({ success: false, error: 'Unauthorized' } satisfies ApiResponse, 401);
        }
        const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        const updated = await stub.updateProfile(slug, editToken, updates);
        if (!updated) {
            return c.json({ success: false, error: 'Update failed or unauthorized' } satisfies ApiResponse, 403);
        }
        return c.json({ success: true, data: updated } satisfies ApiResponse<Profile>);
    });
}