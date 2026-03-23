import { Hono } from "hono";
import { Env } from './core-utils';
import type { Profile, ApiResponse, ProfileFormData } from '@shared/types';
import { nanoid } from 'nanoid';
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
export function userRoutes(app: Hono<{ Bindings: Env }>) {
    const isValidSlug = (slug: string) => /^[a-z0-9-]{3,30}$/.test(slug);
    app.get('/api/profiles/availability/:slug', async (c) => {
        const slug = c.req.param('slug').toLowerCase();
        if (!isValidSlug(slug)) {
            return c.json({ success: true, data: { available: false, error: 'Invalid format' } });
        }
        const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        const existing = await stub.getProfile(slug);
        return c.json({ success: true, data: { available: !existing } });
    });
    app.get('/api/profiles/:slug', async (c) => {
        const slug = c.req.param('slug');
        const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        const profile = await stub.getProfile(slug);
        if (!profile) {
            return c.json({ success: false, error: 'Profile not found' } satisfies ApiResponse, 404);
        }
        if (profile.passwordHash) {
            return c.json({ 
                success: true, 
                data: { fullName: profile.fullName, isLocked: true } 
            });
        }
        await stub.incrementProfileViews(slug);
        const { editToken: _, passwordHash: __, ...publicProfile } = profile;
        return c.json({ success: true, data: { ...publicProfile, isLocked: false } });
    });
    app.post('/api/profiles/:slug/verify', async (c) => {
        const slug = c.req.param('slug');
        const { password } = await c.req.json();
        const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        const profile = await stub.getProfile(slug);
        if (!profile || !profile.passwordHash) {
            return c.json({ success: false, error: 'Not a protected profile' }, 400);
        }
        const inputHash = await hashPassword(password);
        if (inputHash !== profile.passwordHash) {
            return c.json({ success: false, error: 'Incorrect password' }, 401);
        }
        await stub.incrementProfileViews(slug);
        const { editToken: _, passwordHash: __, ...publicProfile } = profile;
        return c.json({ success: true, data: { ...publicProfile, isLocked: false } });
    });
    app.post('/api/profiles', async (c) => {
        const body = (await c.req.json()) as ProfileFormData & { customSlug?: string };
        const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        let slug = body.customSlug?.toLowerCase() || nanoid(10);
        if (body.customSlug) {
            if (!isValidSlug(slug)) {
                return c.json({ success: false, error: 'Invalid slug format' }, 400);
            }
            const existing = await stub.getProfile(slug);
            if (existing) return c.json({ success: false, error: 'URL already taken' }, 409);
        }
        const editToken = nanoid(32);
        let passwordHash: string | undefined;
        if (body.password) {
            passwordHash = await hashPassword(body.password);
        }
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
            passwordHash,
            views: 0,
            createdAt: new Date().toISOString()
        };
        await stub.createProfile(newProfile);
        return c.json({ success: true, data: newProfile });
    });
    app.put('/api/profiles/:slug', async (c) => {
        const slug = c.req.param('slug');
        const body = (await c.req.json()) as Partial<ProfileFormData> & { editToken: string; removePassword?: boolean };
        if (!body.editToken) return c.json({ success: false, error: 'Unauthorized' }, 401);
        const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        const existing = await stub.getProfile(slug);
        if (!existing || existing.editToken !== body.editToken) {
            return c.json({ success: false, error: 'Forbidden' }, 403);
        }
        const { editToken, password, removePassword, ...updates } = body;
        const profileUpdates: Partial<Profile> = { ...updates };
        if (removePassword) {
            profileUpdates.passwordHash = undefined;
        } else if (password) {
            profileUpdates.passwordHash = await hashPassword(password);
        }
        const updated = await stub.updateProfile(slug, editToken, profileUpdates);
        return c.json({ success: true, data: updated });
    });
}