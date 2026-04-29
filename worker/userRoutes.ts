import { Hono } from "hono";
import { Env } from './core-utils';
import type { Profile, ApiResponse, ProfileFormData, ProfileVariant } from '@shared/types';
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
    if (!isValidSlug(slug)) return c.json({ success: true, data: { available: false, error: 'Invalid format' } });
    const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
    const existing = await stub.getProfile(slug);
    return c.json({ success: true, data: { available: !existing } });
  });
  app.get('/api/profiles/:slug', async (c) => {
    const slug = c.req.param('slug');
    const variantSlug = c.req.query('variant');
    const editToken = c.req.query('editToken');
    const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
    const profile = await stub.getProfile(slug);
    if (!profile) return c.json({ success: false, error: 'Profile not found' }, 404);
    if (editToken && profile.editToken === editToken) {
      return c.json({ success: true, data: profile });
    }
    const variant = variantSlug
      ? profile.variants.find(v => v.variantSlug === variantSlug)
      : profile.variants.find(v => v.id === profile.primaryVariantId);
    if (!variant) return c.json({ success: false, error: 'Variant not found' }, 404);
    if (profile.passwordHash) {
      return c.json({ success: true, data: { fullName: profile.fullName, isLocked: true } });
    }
    await stub.incrementProfileViews(slug, variant.variantSlug);
    const { editToken: _, passwordHash: __, variants: ___, ...rest } = profile;
    return c.json({ success: true, data: { ...rest, activeVariant: variant, isLocked: false } });
  });
  app.post('/api/profiles/:slug/verify', async (c) => {
    const slug = c.req.param('slug');
    const { password, variantSlug } = await c.req.json();
    const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
    const profile = await stub.getProfile(slug);
    if (!profile || !profile.passwordHash) return c.json({ success: false, error: 'Invalid request' }, 400);
    if ((await hashPassword(password)) !== profile.passwordHash) {
      return c.json({ success: false, error: 'Incorrect password' }, 401);
    }
    const variant = variantSlug
      ? profile.variants.find(v => v.variantSlug === variantSlug)
      : profile.variants.find(v => v.id === profile.primaryVariantId);
    if (!variant) return c.json({ success: false, error: 'Variant not found' }, 404);
    await stub.incrementProfileViews(slug, variant.variantSlug);
    const { editToken: _, passwordHash: __, variants: ___, ...rest } = profile;
    return c.json({ success: true, data: { ...rest, activeVariant: variant, isLocked: false } });
  });
  app.post('/api/profiles', async (c) => {
    const body = (await c.req.json()) as ProfileFormData & { customSlug?: string };
    const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
    const slug = body.customSlug?.toLowerCase() || nanoid(10);
    if (body.customSlug && !isValidSlug(slug)) return c.json({ success: false, error: 'Invalid format' }, 400);
    if (await stub.getProfile(slug)) return c.json({ success: false, error: 'Taken' }, 409);
    const variantId = nanoid();
    const topicsArray = body.topics ? body.topics.split(',').map(t => t.trim()).filter(Boolean) : [];
    const initialVariant: ProfileVariant = {
      id: variantId,
      name: body.variantName || 'Default',
      variantSlug: body.variantSlug || 'intro',
      bio: body.bio,
      focus: body.focus || '',
      topics: topicsArray,
      meetingNote: body.meetingNote || '',
      views: 0
    };
    const newProfile: Profile = {
      fullName: body.fullName,
      jobTitle: body.jobTitle,
      company: body.company,
      profilePhoto: body.profilePhoto,
      linkedinUrl: body.linkedinUrl,
      websiteUrl: body.websiteUrl,
      videoUrl: body.videoUrl,
      slug,
      editToken: nanoid(32),
      passwordHash: body.password ? await hashPassword(body.password) : undefined,
      createdAt: new Date().toISOString(),
      variants: [initialVariant],
      primaryVariantId: variantId
    };
    await stub.createProfile(newProfile);
    return c.json({ success: true, data: newProfile });
  });
  app.put('/api/profiles/:slug', async (c) => {
    const slug = c.req.param('slug');
    const body = (await c.req.json()) as any;
    const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
    const existing = await stub.getProfile(slug);
    if (!existing || existing.editToken !== body.editToken) {
      return c.json({ success: false, error: 'Forbidden' }, 403);
    }
    const { editToken, removePassword, password, ...updates } = body;
    const finalUpdates: Partial<Profile> = { ...updates };
    if (removePassword) {
      finalUpdates.passwordHash = undefined;
    } else if (password) {
      finalUpdates.passwordHash = await hashPassword(password);
    }
    const updated = await stub.updateProfile(slug, editToken, finalUpdates);
    return c.json({ success: true, data: updated });
  });
}