import { Hono } from "hono";
import { Env } from './core-utils';
import type { Profile, ApiResponse } from '@shared/types';
import { nanoid } from 'nanoid';
export function userRoutes(app: Hono<{ Bindings: Env }>) {
    // Public Get Profile
    app.get('/api/profiles/:slug', async (c) => {
        const slug = c.req.param('slug');
        const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        const profile = await stub.getProfile(slug);
        if (!profile) {
            return c.json({ success: false, error: 'Profile not found' } satisfies ApiResponse, 404);
        }
        // Strip editToken for public view
        const { editToken, ...publicProfile } = profile;
        return c.json({ success: true, data: publicProfile } as ApiResponse);
    });
    // Create Profile
    app.post('/api/profiles', async (c) => {
        const body = await c.req.json();
        const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        const slug = nanoid(10);
        const editToken = nanoid(32);
        const newProfile: Profile = {
            ...body,
            slug,
            editToken,
            createdAt: new Date().toISOString()
        };
        await stub.createProfile(newProfile);
        return c.json({ success: true, data: newProfile } satisfies ApiResponse<Profile>);
    });
    // Update Profile
    app.put('/api/profiles/:slug', async (c) => {
        const slug = c.req.param('slug');
        const body = await c.req.json();
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