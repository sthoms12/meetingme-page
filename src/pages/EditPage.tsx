import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { startAuthentication } from '@simplewebauthn/browser';
import { Save, ArrowLeft, Loader2, Plus, Trash2, LayoutGrid, ExternalLink, Image as ImageIcon, BarChart3, History, Code, Clock, Linkedin, Globe, Video, Link as LinkIcon, CheckCircle2, Twitter, Github, Phone, QrCode, Lock, Target, MessageSquare, Fingerprint, ShieldCheck, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ProfileCard } from '@/components/ProfileCard';
import { ThemeToggle } from '@/components/ThemeToggle';
import { CopyBlurbGroup } from '@/components/CopyBlurbGroup';
import { QRCodeDialog } from '@/components/QRCodeDialog';
import { AccessPanel } from '@/components/AccessPanel';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { nanoid } from 'nanoid';
import { cn } from '@/lib/utils';
import type { Profile, ApiResponse } from '@shared/types';
import { setPageSeo } from '@/lib/seo';
import { consumeManagementToken } from '@/lib/management-link';
import { processPhotoUpload } from '@/lib/photo-upload';

const xHandleOrUrlSchema = z.string().trim().refine((value) => {
  if (!value) return true;
  if (/^@?[A-Za-z0-9_]{1,15}$/.test(value)) return true;
  return z.string().url().safeParse(value).success;
}, 'Enter an X handle like @name or a full profile URL');

const formSchema = z.object({
  fullName: z.string().min(2),
  jobTitle: z.string().min(2),
  company: z.string().min(2),
  profilePhoto: z.string().optional().or(z.literal('')),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  websiteUrl: z.string().url().optional().or(z.literal('')),
  videoUrl: z.string().url().optional().or(z.literal('')),
  twitterUrl: xHandleOrUrlSchema.optional().or(z.literal('')),
  githubUrl: z.string().url().optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  password: z.string().min(8, 'Min 8 characters').max(128).optional().or(z.literal('')),
  removePassword: z.boolean().optional(),
  variants: z.array(z.object({
    id: z.string(),
    name: z.string().min(1),
    variantSlug: z.string().min(2),
    bio: z.string().min(10).max(300),
    focus: z.string().max(60).optional().or(z.literal('')),
    topics: z.string().optional().or(z.literal('')),
    meetingNote: z.string().max(200).optional().or(z.literal('')),
    views: z.number()
  })).min(1).max(3),
  primaryVariantId: z.string()
});
type FormValues = z.infer<typeof formSchema>;
export function EditPage() {
  const { slug } = useParams<{ slug: string }>();
  const [managementToken] = useState(() => consumeManagementToken());
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeVariantIndex, setActiveVariantIndex] = useState(0);
  const [sessionResolved, setSessionResolved] = useState(false);
  const [hasSessionAccess, setHasSessionAccess] = useState(true);
  const [hasVisitorPassword, setHasVisitorPassword] = useState(false);
  useEffect(() => {
    if (!slug) return;
    setPageSeo({
      title: `Manage ${slug} | B4WeMeet`,
      description: 'Private B4WeMeet dashboard for managing your meeting intro page.',
      canonicalPath: `/${slug}/edit`,
      robots: 'noindex,nofollow',
    });
  }, [slug]);
  useEffect(() => {
    const tokenFromUrl = managementToken;
    if (!slug) {
      setSessionResolved(true);
      return;
    }
    if (!tokenFromUrl) {
      setSessionResolved(true);
      return;
    }
    let cancelled = false;
    setSessionResolved(false);
    fetch(`/api/profiles/${slug}/session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ editToken: tokenFromUrl }),
    })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok || !payload.success) {
          throw new Error(payload.error || 'Management link expired');
        }
        if (cancelled) return;
        setHasSessionAccess(true);
        toast.success('Management access restored');
      })
      .catch((error) => {
        if (cancelled) return;
        setHasSessionAccess(false);
        toast.error(error instanceof Error ? error.message : 'Management link expired');
      })
      .finally(() => {
        if (!cancelled) setSessionResolved(true);
      });
    return () => {
      cancelled = true;
    };
  }, [managementToken, slug]);
  const { data: profile, isLoading, refetch } = useQuery<Profile>({
    queryKey: ['profile-manage', slug],
    queryFn: async () => {
      const res = await fetch(`/api/profiles/${slug}/manage`);
      const json = await res.json() as ApiResponse<Profile>;
      if (!json.success || !json.data) {
        if (res.status === 401) setHasSessionAccess(false);
        throw new Error(json.error || 'Failed to fetch profile');
      }
      setHasSessionAccess(true);
      return json.data;
    },
    retry: false,
    enabled: !!slug && sessionResolved,
  });
  const [isRecoveringPasskey, setIsRecoveringPasskey] = useState(false);
  const [isRedeemingCode, setIsRedeemingCode] = useState(false);
  const [recoveryCodeInput, setRecoveryCodeInput] = useState('');
  const recoverWithPasskey = async () => {
    if (!slug) return;
    setIsRecoveringPasskey(true);
    try {
      const startRes = await fetch(`/api/profiles/${slug}/passkey/auth/start`, { method: 'POST' });
      const startJson = await startRes.json();
      if (!startJson.success) throw new Error(startJson.error || 'No passkey found for this page');
      const assertion = await startAuthentication({ optionsJSON: startJson.data });
      const completeRes = await fetch(`/api/profiles/${slug}/passkey/auth/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ response: assertion }),
      });
      const completeJson = await completeRes.json();
      if (!completeJson.success) throw new Error(completeJson.error || 'Could not verify passkey');
      setHasSessionAccess(true);
      toast.success('Signed back in with passkey');
      refetch();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Passkey sign-in failed');
    } finally {
      setIsRecoveringPasskey(false);
    }
  };
  const redeemRecoveryCode = async () => {
    if (!slug || !recoveryCodeInput.trim()) return;
    setIsRedeemingCode(true);
    try {
      const res = await fetch(`/api/profiles/${slug}/recovery-code/redeem`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: recoveryCodeInput.trim() }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Invalid backup code');
      setHasSessionAccess(true);
      toast.success('Signed back in with backup code');
      refetch();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Invalid backup code');
    } finally {
      setIsRedeemingCode(false);
    }
  };
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '', jobTitle: '', company: '', profilePhoto: '',
      linkedinUrl: '', websiteUrl: '', videoUrl: '', twitterUrl: '', githubUrl: '', phone: '',
      password: '', removePassword: false,
      variants: [{ id: 'initial', name: 'Default', variantSlug: 'intro', bio: '', focus: '', topics: '', meetingNote: '', views: 0 }],
      primaryVariantId: 'initial'
    }
  });
  useEffect(() => {
    if (profile) {
      form.reset({
        fullName: profile.fullName,
        jobTitle: profile.jobTitle,
        company: profile.company,
        profilePhoto: profile.profilePhoto || '',
        linkedinUrl: profile.linkedinUrl || '',
        websiteUrl: profile.websiteUrl || '',
        videoUrl: profile.videoUrl || '',
        twitterUrl: profile.twitterUrl || '',
        githubUrl: profile.githubUrl || '',
        phone: profile.phone || '',
        password: '',
        removePassword: false,
        variants: profile.variants.map(v => ({
          id: v.id,
          name: v.name,
          variantSlug: v.variantSlug,
          bio: v.bio,
          focus: v.focus || '',
          topics: Array.isArray(v.topics) ? v.topics.join(', ') : '',
          meetingNote: v.meetingNote || '',
          views: v.views
        })),
        primaryVariantId: profile.primaryVariantId
      });
    }
  }, [profile, form]);
  useEffect(() => {
    if (profile) setHasVisitorPassword(Boolean(profile.hasVisitorPassword));
  }, [profile]);
  // Warn before leaving with unsaved changes.
  useEffect(() => {
    const handler = (event: BeforeUnloadEvent) => {
      if (form.formState.isDirty) event.preventDefault();
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [form]);
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const dataUrl = await processPhotoUpload(file);
      form.setValue('profilePhoto', dataUrl, { shouldDirty: true });
      toast.success('Photo uploaded — save to apply');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not read that image');
    }
  };
  const handleRestore = async (timestamp: string) => {
    const snapshot = profile?.history?.find((entry) => entry.timestamp === timestamp);
    const when = new Date(timestamp).toLocaleString();
    const summary = snapshot?.fullName
      ? `${snapshot.fullName} — ${snapshot.jobTitle} @ ${snapshot.company}, ${snapshot.variants.length} audience version(s)`
      : `${snapshot?.variants.length ?? 0} audience version(s) (older snapshot: identity and links stay as they are now)`;
    if (!confirm(`Restore the version from ${when}?\n\nThis restores: ${summary}, including links and photo. Your current state is saved to history first, so this restore can itself be undone.`)) return;
    try {
      const res = await fetch(`/api/profiles/${slug}/history/restore`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ timestamp })
      });
      if (res.ok) {
        toast.success('Version restored successfully');
        queryClient.invalidateQueries({ queryKey: ['profile-manage', slug] });
      }
    } catch { toast.error('Restore failed'); }
  };
  const onSubmit = async (values: FormValues) => {
    if (!slug) return;
    setIsUpdating(true);
    try {
      const { password, removePassword, ...rest } = values;
      const payload = {
        ...rest,
        // Only send password fields when the owner actually acted on them:
        // an empty password field means "keep the current password".
        ...(password ? { password } : {}),
        ...(removePassword ? { removePassword: true } : {}),
        variants: values.variants.map(v => ({
          ...v,
          topics: v.topics ? v.topics.split(',').map(t => t.trim()).filter(Boolean) : []
        }))
      };
      const res = await fetch(`/api/profiles/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (result.success) {
        toast.success('Settings updated');
        if (removePassword) setHasVisitorPassword(false);
        else if (password) setHasVisitorPassword(true);
        form.reset({ ...values, password: '', removePassword: false });
        queryClient.invalidateQueries({ queryKey: ['profile-manage', slug] });
      } else { toast.error(result.error || 'Update failed'); }
    } catch { toast.error('Save failed'); }
    finally { setIsUpdating(false); }
  };
  const addVariant = () => {
    const current = form.getValues('variants');
    if (current.length >= 3) return;
    const newVariant = { id: nanoid(), name: 'New Segment', variantSlug: `v-${current.length + 1}`, bio: 'Bio...', focus: '', topics: '', meetingNote: '', views: 0 };
    form.setValue('variants', [...current, newVariant]);
    setActiveVariantIndex(current.length);
    toast.success('New variant added');
  };
  const deleteVariant = (index: number) => {
    const current = form.getValues('variants');
    if (current.length <= 1) return;
    const variantToDelete = current[index];
    const filtered = current.filter((_, i) => i !== index);
    if (form.getValues('primaryVariantId') === variantToDelete.id) {
      form.setValue('primaryVariantId', filtered[0].id);
    }
    form.setValue('variants', filtered);
    setActiveVariantIndex(0);
    toast.info('Variant removed');
  };
  const setPrimary = (id: string) => {
    form.setValue('primaryVariantId', id);
    toast.success('Primary variant updated', { description: 'Save changes to apply globally.' });
  };
  if (!sessionResolved) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary size-10" /></div>;
  if (!hasSessionAccess) return (
    <div className="max-w-xl mx-auto py-32 px-6">
      <div className="text-center">
        <div className="size-20 rounded-3xl bg-slate-100 flex items-center justify-center mx-auto mb-8"><Lock size={40} className="text-slate-400" /></div>
        <h2 className="text-3xl font-bold mb-4">Access Restricted</h2>
        <p className="text-muted-foreground mb-8 text-lg">Management link required. If you've set up a passkey or backup code, you can use those to sign back in instead.</p>
      </div>
      <div className="space-y-4">
        <Button onClick={recoverWithPasskey} disabled={isRecoveringPasskey} size="lg" variant="outline" className="rounded-2xl h-14 w-full font-bold">
          {isRecoveringPasskey ? <Loader2 className="size-5 animate-spin mr-3" /> : <Fingerprint size={20} className="mr-3" />}
          Recover with passkey
        </Button>
        <div className="flex items-center gap-3">
          <Input
            placeholder="Backup code"
            value={recoveryCodeInput}
            onChange={(e) => setRecoveryCodeInput(e.target.value)}
            className="h-14 rounded-2xl bg-secondary/40 border-none font-mono"
          />
          <Button onClick={redeemRecoveryCode} disabled={isRedeemingCode || !recoveryCodeInput.trim()} size="lg" variant="outline" className="rounded-2xl h-14 px-6 font-bold shrink-0">
            {isRedeemingCode ? <Loader2 className="size-5 animate-spin" /> : <ShieldCheck size={20} />}
          </Button>
        </div>
        <Button asChild size="lg" className="rounded-2xl h-14 w-full font-bold shadow-soft"><a href="/">Back to Home</a></Button>
      </div>
    </div>
  );
  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary size-10" /></div>;
  if (!profile) return (
    <div className="max-w-xl mx-auto py-32 text-center px-6">
      <div className="size-20 rounded-3xl bg-slate-100 flex items-center justify-center mx-auto mb-8"><Lock size={40} className="text-slate-400" /></div>
      <h2 className="text-3xl font-bold mb-4">Management Unavailable</h2>
      <p className="text-muted-foreground mb-8 text-lg">Refresh the magic link or sign in again to continue.</p>
      <Button asChild size="lg" className="rounded-2xl h-14 w-full font-bold shadow-soft"><a href="/">Back to Home</a></Button>
    </div>
  );
  const watchAll = form.watch();
  const currentVariant = watchAll.variants?.[activeVariantIndex];
  const embedCode = `<iframe src="${window.location.origin}/${slug}?embed=1" style="width:100%; max-width:480px; height:680px; border:none; border-radius:2.5rem; box-shadow: 0 4px 20px rgba(0,0,0,0.1);" title="B4WeMeet Card"></iframe>`;
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-12 md:py-20">
        <ThemeToggle />
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-8">
          <div className="space-y-4">
            <Link to={`/${slug}`} className="tap-link -mx-3 text-xs font-black uppercase tracking-widest text-muted-foreground gap-2 hover:text-primary transition-colors">
              <ArrowLeft size={14} /> Back to Public Page
            </Link>
            <h1 className="text-4xl font-bold tracking-tight">Professional Dashboard</h1>
          </div>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={isUpdating} size="lg" className="h-14 px-10 text-lg font-bold rounded-2xl shadow-lg shadow-primary/20 active:scale-95 transition-all">
            {isUpdating ? <Loader2 className="size-5 animate-spin mr-3" /> : <Save size={20} className="mr-3" />}
            Save Changes
          </Button>
        </div>
        <Tabs defaultValue="builder" className="space-y-12">
          <TabsList className="bg-muted p-1 rounded-2xl h-auto flex flex-wrap gap-1">
            <TabsTrigger value="builder" className="rounded-xl px-6 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm"><LayoutGrid size={16} className="mr-2" /> Builder</TabsTrigger>
            <TabsTrigger value="analytics" className="rounded-xl px-6 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm"><BarChart3 size={16} className="mr-2" /> Analytics</TabsTrigger>
            <TabsTrigger value="embed" className="rounded-xl px-6 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm"><Code size={16} className="mr-2" /> Embed</TabsTrigger>
            <TabsTrigger value="history" className="rounded-xl px-6 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm"><History size={16} className="mr-2" /> History</TabsTrigger>
            <TabsTrigger value="access" className="rounded-xl px-6 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm"><KeyRound size={16} className="mr-2" /> Access</TabsTrigger>
          </TabsList>
          <TabsContent value="builder" className="m-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              <div className="space-y-12">
                <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar -mx-1 px-1">
                  {watchAll.variants?.map((v, i) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setActiveVariantIndex(i)}
                      className={cn(
                        "px-6 py-4 rounded-2xl border-2 text-sm font-bold transition-all shrink-0 flex flex-col items-start gap-1 relative",
                        activeVariantIndex === i
                          ? "bg-slate-900 text-white border-slate-900 shadow-lg dark:bg-white dark:text-slate-950"
                          : "bg-card text-muted-foreground border-slate-100 hover:border-slate-300 dark:border-slate-800"
                      )}
                    >
                      <span className="flex items-center gap-2">
                        {v.name}
                        {watchAll.primaryVariantId === v.id && <CheckCircle2 size={12} className={activeVariantIndex === i ? "text-primary-foreground" : "text-primary"} />}
                      </span>
                      <Badge className={activeVariantIndex === i ? "bg-primary/20 text-white border-none" : "bg-muted text-muted-foreground"}>{v.views} views</Badge>
                    </button>
                  ))}
                  {watchAll.variants?.length < 3 && (
                    <Button variant="outline" size="icon" type="button" onClick={addVariant} className="rounded-2xl border-2 border-dashed h-[4.8rem] w-14 shrink-0"><Plus size={24} /></Button>
                  )}
                </div>
                <Form {...form}>
                  <div className="space-y-12">
                    {currentVariant && (
                      <div className="bg-card p-8 md:p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-soft space-y-8">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-black uppercase tracking-widest text-primary">Target: {currentVariant.name}</h3>
                          <div className="flex items-center gap-4">
                            {watchAll.primaryVariantId !== currentVariant.id && (
                              <button type="button" onClick={() => setPrimary(currentVariant.id)} className="text-[10px] text-muted-foreground hover:text-primary font-bold uppercase tracking-widest">Set as Primary</button>
                            )}
                            {watchAll.variants.length > 1 && (
                              <Button variant="ghost" size="sm" type="button" onClick={() => deleteVariant(activeVariantIndex)} className="text-destructive hover:bg-destructive/5 uppercase font-black text-[10px] tracking-widest"><Trash2 size={16} className="mr-2" /> Delete</Button>
                            )}
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField control={form.control} name={`variants.${activeVariantIndex}.name`} render={({ field }) => (
                            <FormItem><FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Display Name</FormLabel><FormControl><Input className="bg-secondary/40 h-14 rounded-2xl border-none" {...field} /></FormControl></FormItem>
                          )} />
                          <FormField control={form.control} name={`variants.${activeVariantIndex}.variantSlug`} render={({ field }) => (
                            <FormItem><FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">URL Path</FormLabel><FormControl><Input className="bg-secondary/40 h-14 rounded-2xl border-none" {...field} /></FormControl></FormItem>
                          )} />
                        </div>
                        <FormField control={form.control} name={`variants.${activeVariantIndex}.bio`} render={({ field }) => (
                          <FormItem><FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Professional Intro</FormLabel><FormControl><Textarea className="min-h-[140px] bg-secondary/40 rounded-2xl border-none p-4" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField control={form.control} name={`variants.${activeVariantIndex}.focus`} render={({ field }) => (
                            <FormItem><FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground/60"><div className="flex items-center gap-2"><Target size={12} /> Primary Focus</div></FormLabel><FormControl><Input className="bg-secondary/40 h-14 rounded-2xl border-none" {...field} /></FormControl></FormItem>
                          )} />
                          <FormField control={form.control} name={`variants.${activeVariantIndex}.topics`} render={({ field }) => (
                            <FormItem><FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Key Topics (CSV)</FormLabel><FormControl><Input className="bg-secondary/40 h-14 rounded-2xl border-none" {...field} /></FormControl></FormItem>
                          )} />
                        </div>
                        <FormField control={form.control} name={`variants.${activeVariantIndex}.meetingNote`} render={({ field }) => (
                          <FormItem><FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground/60"><div className="flex items-center gap-2"><MessageSquare size={12} /> Pre-Meeting Context</div></FormLabel><FormControl><Textarea className="min-h-[80px] bg-primary/5 rounded-2xl border-none p-4" {...field} /></FormControl></FormItem>
                        )} />
                      </div>
                    )}
                    <div className="space-y-10 pt-10 border-t border-dashed">
                      <div className="flex items-center gap-3"><LinkIcon className="text-primary size-5" /><span className="text-sm font-black uppercase tracking-[0.2em]">Global Identity</span></div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField control={form.control} name="fullName" render={({ field }) => (
                          <FormItem><FormLabel className="text-sm font-bold">Public Name</FormLabel><FormControl><Input className="bg-secondary/40 h-14 rounded-2xl border-none" {...field} /></FormControl></FormItem>
                        )} />
                        <FormField control={form.control} name="jobTitle" render={({ field }) => (
                          <FormItem><FormLabel className="text-sm font-bold">Role</FormLabel><FormControl><Input className="bg-secondary/40 h-14 rounded-2xl border-none" {...field} /></FormControl></FormItem>
                        )} />
                      </div>
                      <FormField control={form.control} name="company" render={({ field }) => (
                        <FormItem><FormLabel className="text-sm font-bold">Company / Organization</FormLabel><FormControl><Input className="bg-secondary/40 h-14 rounded-2xl border-none" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <div className="space-y-3">
                        <span className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2"><ImageIcon size={12} /> Profile Photo</span>
                        <div className="flex items-center gap-4">
                          {watchAll.profilePhoto ? (
                            <div className="size-14 rounded-2xl border bg-muted overflow-hidden shadow-sm shrink-0">
                              <img src={watchAll.profilePhoto} alt="Profile photo preview" className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <div className="size-14 rounded-2xl border border-dashed bg-muted/40 flex items-center justify-center shrink-0"><ImageIcon size={20} className="text-muted-foreground" /></div>
                          )}
                          <label className="relative flex h-12 cursor-pointer items-center overflow-hidden rounded-xl border-2 border-dashed bg-background/80 px-5 transition-colors hover:border-primary/60">
                            <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={handlePhotoUpload} className="absolute inset-0 cursor-pointer opacity-0" aria-label="Upload profile photo" />
                            <ImageIcon size={18} className="mr-2 text-primary" />
                            <span className="font-bold">{watchAll.profilePhoto ? 'Change Photo' : 'Upload Photo'}</span>
                          </label>
                          {watchAll.profilePhoto && (
                            <Button type="button" variant="ghost" size="sm" className="text-destructive hover:bg-destructive/5 uppercase font-black text-[10px] tracking-widest" onClick={() => form.setValue('profilePhoto', '', { shouldDirty: true })}>
                              <Trash2 size={16} className="mr-2" /> Remove
                            </Button>
                          )}
                        </div>
                        <p className="text-[11px] text-muted-foreground">PNG, JPEG, WebP or GIF, up to 1MB. Changes apply when you save.</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormField control={form.control} name="linkedinUrl" render={({ field }) => (
                          <FormItem><FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">LinkedIn</FormLabel><div className="relative"><Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" /><FormControl><Input className="bg-secondary/40 h-12 pl-10 rounded-xl border-none" {...field} /></FormControl></div><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="websiteUrl" render={({ field }) => (
                          <FormItem><FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Portfolio</FormLabel><div className="relative"><Globe className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" /><FormControl><Input className="bg-secondary/40 h-12 pl-10 rounded-xl border-none" {...field} /></FormControl></div><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="phone" render={({ field }) => (
                          <FormItem><FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Phone</FormLabel><div className="relative"><Phone className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" /><FormControl><Input className="bg-secondary/40 h-12 pl-10 rounded-xl border-none" {...field} /></FormControl></div><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="videoUrl" render={({ field }) => (
                          <FormItem><FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Video Intro</FormLabel><div className="relative"><Video className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" /><FormControl><Input className="bg-secondary/40 h-12 pl-10 rounded-xl border-none" placeholder="Loom / YouTube link" {...field} /></FormControl></div><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="twitterUrl" render={({ field }) => (
                          <FormItem><FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">X / Twitter</FormLabel><div className="relative"><Twitter className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" /><FormControl><Input className="bg-secondary/40 h-12 pl-10 rounded-xl border-none" placeholder="@handle or https://x.com/handle" {...field} /></FormControl></div><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="githubUrl" render={({ field }) => (
                          <FormItem><FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">GitHub</FormLabel><div className="relative"><Github className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" /><FormControl><Input className="bg-secondary/40 h-12 pl-10 rounded-xl border-none" placeholder="https://github.com/..." {...field} /></FormControl></div><FormMessage /></FormItem>
                        )} />
                      </div>
                      <div className="space-y-6 pt-10 border-t border-dashed">
                        <div className="flex items-center gap-3"><Lock className="text-primary size-5" /><span className="text-sm font-black uppercase tracking-[0.2em]">Privacy</span></div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {hasVisitorPassword
                            ? 'A visitor password is currently set — visitors must enter it to view your page.'
                            : 'No visitor password is set — anyone with your link can view your page.'}
                        </p>
                        {!watchAll.removePassword && (
                          <FormField control={form.control} name="password" render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">{hasVisitorPassword ? 'Change Visitor Password' : 'Set a Visitor Password'}</FormLabel>
                              <FormControl><Input type="password" autoComplete="new-password" className="bg-secondary/40 h-12 rounded-xl border-none" placeholder={hasVisitorPassword ? 'Leave blank to keep the current password' : 'Min 8 characters'} {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                        )}
                        {hasVisitorPassword && (
                          <FormField control={form.control} name="removePassword" render={({ field }) => (
                            <FormItem className="flex items-center gap-3 space-y-0">
                              <FormControl>
                                <input
                                  type="checkbox"
                                  className="size-4 accent-red-500"
                                  checked={Boolean(field.value)}
                                  onChange={(event) => field.onChange(event.target.checked)}
                                  aria-label="Remove visitor password"
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-bold text-destructive">Remove visitor password (page becomes public on save)</FormLabel>
                            </FormItem>
                          )} />
                        )}
                      </div>
                    </div>
                  </div>
                </Form>
              </div>
              <div className="lg:sticky lg:top-12 space-y-8">
                <div className="flex items-center justify-between px-2">
                  <span className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.3em]">Live Preview: {currentVariant?.name}</span>
                  <div className="flex items-center gap-4">
                    <QRCodeDialog url={`${window.location.origin}/${slug}`} trigger={<Button variant="ghost" className="text-xs font-bold text-primary gap-2"><QrCode size={14} /> QR</Button>} />
                    <a href={`/${slug}`} target="_blank" rel="noopener noreferrer" className="tap-link text-xs font-bold text-primary gap-2 hover:underline"><ExternalLink size={14} /> Open Live</a>
                  </div>
                </div>
                <ProfileCard data={{ ...watchAll, bio: currentVariant?.bio, focus: currentVariant?.focus, topics: currentVariant?.topics, meetingNote: currentVariant?.meetingNote }} slug={slug} />
                <CopyBlurbGroup fullName={watchAll.fullName} jobTitle={watchAll.jobTitle} company={watchAll.company} url={`${window.location.origin}/${slug}`} className="bg-card p-8 rounded-[2.5rem] border border-dashed" />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="analytics" className="m-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="rounded-[2rem] border-none shadow-soft"><CardHeader><CardTitle className="text-sm uppercase tracking-widest text-muted-foreground">Total Views</CardTitle></CardHeader><CardContent><div className="text-5xl font-black text-primary">{profile?.variants.reduce((acc, v) => acc + (v.views || 0), 0)}</div></CardContent></Card>
              <Card className="rounded-[2rem] border-none shadow-soft md:col-span-2"><CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader><CardContent><div className="space-y-4">{profile?.analytics?.length ? profile.analytics.map((log, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-muted/40 rounded-2xl border border-muted"><div className="flex items-center gap-4"><div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center"><Clock size={18} /></div><div><div className="text-sm font-bold">New View via {log.source}</div><div className="text-xs text-muted-foreground">{new Date(log.timestamp).toLocaleString()}</div></div></div><Badge variant="secondary">{profile.variants.find(v => v.id === log.variantId)?.name || 'Unknown'}</Badge></div>
              )) : <p className="text-muted-foreground py-8 text-center italic">No views yet.</p>}</div></CardContent></Card>
            </div>
          </TabsContent>
          <TabsContent value="embed" className="m-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
               <div className="space-y-6"><h2 className="text-3xl font-bold">Widget</h2><p className="text-muted-foreground">Add to your personal site.</p><div className="bg-slate-900 text-slate-100 p-8 rounded-3xl relative font-mono text-xs border-4 border-slate-800"><div className="break-all whitespace-pre-wrap">{embedCode}</div><Button variant="secondary" size="sm" className="absolute top-4 right-4 rounded-xl font-bold" onClick={() => { navigator.clipboard.writeText(embedCode); toast.success('Copied'); }}>Copy</Button></div></div>
               <div className="flex justify-center bg-slate-100 dark:bg-slate-900/40 p-8 rounded-[3rem] border border-dashed"><div className="bg-white dark:bg-black rounded-[2.5rem] shadow-glass p-1 border overflow-hidden scale-75 lg:scale-90 origin-top"><iframe src={`${window.location.origin}/${slug}?embed=1`} style={{ width: '380px', height: '600px', border: 'none' }} title="Preview" /></div></div>
             </div>
          </TabsContent>
          <TabsContent value="history" className="m-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Card className="rounded-[2.5rem] border-none shadow-soft overflow-hidden"><CardHeader><CardTitle>Snapshots</CardTitle><CardDescription>Restoring brings back the full profile — name, role, company, links, photo and audience versions. Your current state is saved here first, so a restore can be undone.</CardDescription></CardHeader><CardContent className="p-0"><div className="divide-y border-t">{profile?.history?.length ? profile.history.map((h, i) => (
              <div key={i} className="p-6 flex items-center justify-between gap-6 hover:bg-muted/30 transition-colors"><div><div className="font-bold text-lg">{h.label}</div><div className="text-sm text-muted-foreground">{new Date(h.timestamp).toLocaleString()}</div><div className="text-sm text-muted-foreground mt-1">{h.fullName ? <>{h.fullName} — {h.jobTitle} @ {h.company} · {h.variants.length} version{h.variants.length === 1 ? '' : 's'} · Primary: {h.variants.find(v => v.id === h.primaryVariantId)?.name || 'first version'}</> : <>{h.variants.length} version{h.variants.length === 1 ? '' : 's'} · Older snapshot — identity and links stay as they are now</>}</div></div><Button variant="outline" className="rounded-xl px-6 shrink-0" onClick={() => handleRestore(h.timestamp)}>Restore</Button></div>
            )) : <div className="p-20 text-center text-muted-foreground italic">No history.</div>}</div></CardContent></Card>
          </TabsContent>
          <TabsContent value="access" className="m-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {slug && <AccessPanel slug={slug} />}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
