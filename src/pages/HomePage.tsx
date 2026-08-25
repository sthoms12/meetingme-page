import React, { Suspense, lazy, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Sparkles, Send, ShieldCheck, LayoutGrid, Image as ImageIcon, Loader2, Link as LinkIcon, Linkedin, Globe, Video, Twitter, Github, Phone, Lock, Copy, Check, Info, Target, Fingerprint, X, ArrowDown, Eye, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ThemeToggle } from '@/components/ThemeToggle';
import { CopyBlurbGroup } from '@/components/CopyBlurbGroup';
import { SecurityFAQ } from '@/components/SecurityFAQ';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { setPageSeo } from '@/lib/seo';
import { buildManagementUrl } from '@/lib/management-link';

const xHandleOrUrlSchema = z.string().trim().refine((value) => {
  if (!value) return true;
  if (/^@?[A-Za-z0-9_]{1,15}$/.test(value)) return true;
  return z.string().url().safeParse(value).success;
}, 'Enter an X handle like @name or a full profile URL');

const formSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  jobTitle: z.string().min(2, 'Title is required'),
  company: z.string().min(2, 'Company is required'),
  bio: z.string().min(10, 'Bio must be 10+ chars').max(300, 'Max 300 chars'),
  focus: z.string().max(60, 'Focus should be concise').optional().or(z.literal('')),
  topics: z.string().optional().or(z.literal('')),
  meetingNote: z.string().max(200, 'Max 200 chars').optional().or(z.literal('')),
  profilePhoto: z.string().optional().or(z.literal('')),
  linkedinUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  websiteUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  videoUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  twitterUrl: xHandleOrUrlSchema.optional().or(z.literal('')),
  githubUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  customSlug: z.string().regex(/^[a-z0-9-]*$/, 'Lower, numbers, hyphens').min(3, '3+ chars').optional().or(z.literal('')),
  password: z.string().min(8, 'Min 8 characters').optional().or(z.literal('')),
  variantName: z.string().min(1, 'Required'),
  variantSlug: z.string().regex(/^[a-z0-9-]*$/, 'Invalid format').min(2, '2+ chars'),
});
type FormValues = z.infer<typeof formSchema>;
const ProfileCard = lazy(() => import('@/components/ProfileCard').then((module) => ({ default: module.ProfileCard })));

const previewFallback = <div className="mx-auto h-[34rem] w-full max-w-md animate-pulse rounded-3xl border bg-muted/60" aria-label="Loading preview" />;

export function HomePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [publishedData, setPublishedData] = useState<{ slug: string; editToken: string } | null>(null);
  const [qrCodeData, setQrCodeData] = useState<string>('');
  const [slugStatus, setSlugStatus] = useState<'available' | 'taken' | 'invalid' | 'error' | null>(null);
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  const [copiedPrivate, setCopiedPrivate] = useState(false);
  const [isAddingPasskey, setIsAddingPasskey] = useState(false);
  const [passkeyAdded, setPasskeyAdded] = useState(false);
  const [passkeyPromptDismissed, setPasskeyPromptDismissed] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [showDesktopPreview, setShowDesktopPreview] = useState(false);
  const [showMobileActions, setShowMobileActions] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '', jobTitle: '', company: '', bio: '', focus: '', topics: '', meetingNote: '', profilePhoto: '',
      linkedinUrl: '', websiteUrl: '', videoUrl: '', twitterUrl: '', githubUrl: '', phone: '',
      customSlug: '', password: '', variantName: 'Default', variantSlug: 'intro'
    },
  });
  const watchAll = form.watch();
  const customSlug = watchAll.customSlug;
  const errorLabels: Record<string, string> = {
    fullName: 'Full Name',
    jobTitle: 'Job Title',
    company: 'Organization',
    bio: 'Quick Bio',
    focus: 'Primary Focus',
    topics: 'Discussion Topics',
    meetingNote: 'Pre-Meeting Note',
    profilePhoto: 'Profile Photo',
    linkedinUrl: 'LinkedIn Profile',
    websiteUrl: 'Portfolio / Web',
    videoUrl: 'Video Intro URL',
    twitterUrl: 'Twitter / X',
    githubUrl: 'GitHub',
    phone: 'Phone Number',
    customSlug: 'Public Handle',
    password: 'Password',
    variantName: 'Audience Group',
    variantSlug: 'Audience Group',
  };
  const validationSummary = Object.keys(form.formState.errors).map((key) => errorLabels[key] || key);
  useEffect(() => {
    setPageSeo({
      title: 'B4WeMeet | Pre-meeting intro pages for better meetings',
      description: 'Create a concise pre-meeting intro page with your bio, role, links, focus areas, and talking points so people arrive prepared.',
      canonicalPath: '/',
    });
  }, []);
  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)');
    const update = () => setShowDesktopPreview(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    const update = () => {
      const formElement = document.getElementById('create-page');
      setShowMobileActions(Boolean(formElement && formElement.getBoundingClientRect().top < window.innerHeight * 0.88));
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [publishedData]);
  useEffect(() => {
    if (!customSlug || customSlug.length < 3) { setSlugStatus(null); return; }
    setIsCheckingSlug(true);
    const h = setTimeout(async () => {
      try {
        const res = await fetch(`/api/profiles/availability/${customSlug}`);
        const result = await res.json();
        if (!result.success) { setSlugStatus('error'); }
        else if (result.data.error) { setSlugStatus('invalid'); }
        else { setSlugStatus(result.data.available ? 'available' : 'taken'); }
      } catch { setSlugStatus('error'); }
      finally { setIsCheckingSlug(false); }
    }, 500);
    return () => clearTimeout(h);
  }, [customSlug]);

  const normalizeSlugInput = (value: string) => value.toLowerCase().replace(/\s+/g, '-');
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        toast.error("Image too large (max 1MB)");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue('profilePhoto', reader.result as string);
        toast.success("Photo uploaded");
      };
      reader.readAsDataURL(file);
    }
  };
  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...values,
        password: values.password?.trim() ? values.password : undefined,
      };
      const res = await fetch('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (result.success) {
        const slug = result.data.slug;
        const editToken = result.data.editToken;
        setPublishedData({ slug, editToken });
        const url = `${window.location.origin}/${slug}`;
        const { generateQrCodeDataUrl } = await import('@/lib/qrcode');
        const qr = await generateQrCodeDataUrl(url);
        setQrCodeData(qr);
        toast.success('Your B4WeMeet page is live!');
      } else { toast.error(result.error); }
    } catch (err) {
      console.error('Publishing error:', err);
      toast.error('Error publishing');
    } finally { setIsSubmitting(false); }
  };
  const onInvalid = (errors: typeof form.formState.errors) => {
    const names = Object.keys(errors).map((key) => errorLabels[key] || key);
    toast.error(names.length ? `Please fix: ${names.join(', ')}` : 'Please check the highlighted fields');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handleCopyPrivate = () => {
    if (!publishedData) return;
    const managementUrl = buildManagementUrl(window.location.origin, publishedData.slug, publishedData.editToken);
    navigator.clipboard.writeText(managementUrl);
    setCopiedPrivate(true);
    toast.success('Private management link copied');
    setTimeout(() => setCopiedPrivate(false), 2000);
  };
  const addPasskeyNow = async () => {
    if (!publishedData) return;
    setIsAddingPasskey(true);
    try {
      const startRes = await fetch(`/api/profiles/${publishedData.slug}/passkey/register/start`, { method: 'POST' });
      const startJson = await startRes.json();
      if (!startJson.success) throw new Error(startJson.error || 'Could not start passkey setup');
      const { startRegistration } = await import('@simplewebauthn/browser');
      const attestation = await startRegistration({ optionsJSON: startJson.data });
      const deviceLabel = typeof navigator !== 'undefined' ? navigator.userAgent.split(' ').slice(-2).join(' ') : undefined;
      const completeRes = await fetch(`/api/profiles/${publishedData.slug}/passkey/register/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ response: attestation, deviceLabel }),
      });
      const completeJson = await completeRes.json();
      if (!completeJson.success) throw new Error(completeJson.error || 'Could not save passkey');
      setPasskeyAdded(true);
      toast.success('Passkey added. You can now recover access without your management link.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not add passkey');
    } finally {
      setIsAddingPasskey(false);
    }
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <a href="#create-page" className="skip-link">Skip to page creator</a>
      <div className="py-8 md:py-14 lg:py-16 space-y-12">
        <ThemeToggle className="fixed top-5 right-5 rounded-full border bg-card/80 backdrop-blur" />
        <header className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-end">
          <div className="max-w-4xl space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full border bg-card/80 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-primary shadow-soft backdrop-blur">
              <Sparkles size={14} /> <span>B4WeMeet</span>
            </div>
            <h1 className="font-display text-6xl md:text-7xl lg:text-8xl tracking-normal text-foreground leading-[0.92]">
              Send the context before the calendar invite.
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl leading-relaxed">
              Build a concise meeting intro page with the facts, links, topics, and private context people need before they talk to you.
            </p>
            <Button asChild size="lg" className="h-12 rounded-xl px-6 font-bold sm:w-fit">
              <a href="#create-page">Create your page <ArrowDown size={17} className="ml-2" /></a>
            </Button>
          </div>
          <div className="hairline-panel rounded-2xl p-5">
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                ['01', 'Create'],
                ['02', 'Share'],
                ['03', 'Meet'],
              ].map(([number, label]) => (
                <div key={label} className="rounded-xl border bg-background/60 p-4">
                  <div className="font-display text-3xl text-primary">{number}</div>
                  <div className="mt-1 text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Designed for warm intros, client calls, interviews, advisory chats, and any meeting where a short briefing beats a long bio.
            </p>
          </div>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.02fr)_minmax(360px,0.98fr)] gap-10 xl:gap-14 items-start">
          <div className="space-y-12">
            {publishedData ? (
              <div className="hairline-panel rounded-3xl p-8 md:p-10 space-y-10 animate-scale-in">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="flex-1 space-y-4 w-full text-center md:text-left">
                    <div className="size-14 rounded-2xl bg-green-500/10 text-green-600 flex items-center justify-center mx-auto md:mx-0"><ShieldCheck size={28} /></div>
                    <h3 className="text-2xl font-bold">Your page is live</h3>
                    <div className="p-4 bg-muted rounded-xl text-sm font-mono break-all border group relative overflow-hidden">
                      <span className="text-muted-foreground">{window.location.origin}/</span>{publishedData.slug}
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    {qrCodeData && <img src={qrCodeData} alt="QR" className="size-32 bg-white p-2 rounded-2xl border-2 border-muted" />}
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Public Scan</span>
                  </div>
                </div>
                <div className="p-6 md:p-8 rounded-3xl bg-slate-900 text-white space-y-4 border border-slate-800 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10 text-white">
                    <Lock size={80} />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-primary rounded-lg text-white">
                      <Lock size={14} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary-foreground/70">Secure Magic Link</span>
                  </div>
                  <h4 className="text-lg font-bold">Private Management Access</h4>
                  <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
                    Bookmark this private URL to manage your page from any device. This contains your edit token—keep it secret.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      variant="secondary"
                      onClick={handleCopyPrivate}
                      className="flex-1 h-12 rounded-xl font-bold gap-2 text-slate-900"
                    >
                      {copiedPrivate ? <Check size={16} /> : <Copy size={16} />}
                      {copiedPrivate ? "Copied" : "Copy Private Link"}
                    </Button>
                    <Button variant="outline" asChild className="h-12 rounded-xl px-4 border-slate-700 bg-transparent text-white hover:bg-slate-800">
                      <Link to={`/${publishedData.slug}/edit`}>
                        Open Dashboard
                      </Link>
                    </Button>
                  </div>
                </div>
                {!passkeyAdded && !passkeyPromptDismissed && (
                  <div className="p-6 rounded-3xl bg-primary/5 border border-primary/20 space-y-4 relative">
                    <button type="button" onClick={() => setPasskeyPromptDismissed(true)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"><X size={16} /></button>
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center"><Fingerprint size={20} /></div>
                      <h4 className="text-lg font-bold pr-6">Secure this page with a passkey</h4>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                      If you ever lose your management link, a passkey lets you sign back in instantly with Face ID, Touch ID, or a security key.
                    </p>
                    <Button onClick={addPasskeyNow} disabled={isAddingPasskey} className="h-12 rounded-xl font-bold">
                      {isAddingPasskey ? <Loader2 size={16} className="mr-2 animate-spin" /> : <Fingerprint size={16} className="mr-2" />}
                      Add a passkey
                    </Button>
                  </div>
                )}
                {passkeyAdded && (
                  <div className="p-4 rounded-2xl bg-green-500/10 text-green-700 dark:text-green-400 flex items-center gap-3 text-sm font-bold">
                    <ShieldCheck size={18} /> Passkey added
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button asChild size="lg" className="h-14 text-lg font-bold rounded-2xl"><Link to={`/${publishedData.slug}`}>View Public Page</Link></Button>
                  <Button variant="outline" asChild size="lg" className="h-14 text-lg font-bold rounded-2xl"><Link to="/">Create Another</Link></Button>
                </div>
                <CopyBlurbGroup
                  fullName={watchAll.fullName}
                  jobTitle={watchAll.jobTitle}
                  company={watchAll.company}
                  url={`${window.location.origin}/${publishedData.slug}`}
                  className="pt-8 border-t border-dashed"
                />
              </div>
            ) : (
              <Form {...form}>
                <form id="create-page" onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-9 hairline-panel p-6 md:p-8 rounded-3xl">
                  <div className="flex items-center justify-between gap-4 border-b pb-5">
                    <div>
                      <h2 className="text-xl font-bold tracking-tight">Create your intro</h2>
                      <p className="mt-1 text-sm text-muted-foreground">Start with the public handle, then add the context people should know first.</p>
                    </div>
                    <div className="hidden sm:flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Send size={20} />
                    </div>
                  </div>
                  {validationSummary.length > 0 && (
                    <div className="rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                      <div className="font-bold">Finish these fields before creating your page:</div>
                      <div className="mt-1">{validationSummary.join(', ')}</div>
                    </div>
                  )}
                  <div className="space-y-6">
                    <FormField control={form.control} name="customSlug" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">Public Handle</FormLabel>
                        <FormControl><Input className="h-12 text-base rounded-xl border bg-background/80" placeholder="jane-doe" autoCapitalize="none" autoCorrect="off" spellCheck={false} {...field} value={field.value ?? ''} onChange={(event) => field.onChange(normalizeSlugInput(event.target.value))} /></FormControl>
                        {customSlug && customSlug.length >= 3 && (
                          <FormDescription className={cn("text-[11px] font-bold flex items-center gap-1.5", isCheckingSlug ? "text-muted-foreground" : slugStatus === 'available' ? "text-green-600" : "text-destructive")}>
                            {isCheckingSlug ? (
                              <><Loader2 size={12} className="animate-spin" /> Verifying availability...</>
                            ) : slugStatus === 'available' ? (
                              "✓ Handle is available"
                            ) : slugStatus === 'invalid' ? (
                              "✗ Use 3-30 lowercase letters, numbers, or hyphens"
                            ) : slugStatus === 'error' ? (
                              "⚠ Couldn't check availability, try again"
                            ) : (
                              "✗ This handle is already taken"
                            )}
                          </FormDescription>
                        )}
                        <FormMessage />
                      </FormItem>
                    )} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField control={form.control} name="fullName" render={({ field }) => (
                        <FormItem><FormLabel className="text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">Full Name</FormLabel><FormControl><Input className="h-12 rounded-xl bg-background/80" placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="jobTitle" render={({ field }) => (
                        <FormItem><FormLabel className="text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">Job Title</FormLabel><FormControl><Input className="h-12 rounded-xl bg-background/80" placeholder="Founder & CEO" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                    </div>
                    <FormField control={form.control} name="company" render={({ field }) => (
                      <FormItem><FormLabel className="text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">Organization</FormLabel><FormControl><Input className="h-12 rounded-xl bg-background/80" placeholder="Acme Inc." {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <details className="group rounded-2xl border bg-background/45 p-4">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                        <span className="flex items-center gap-2"><ImageIcon size={17} className="text-primary" /> Add a profile photo <span className="text-xs font-medium text-muted-foreground">Optional</span></span>
                        <span className="text-xs text-muted-foreground group-open:hidden">Add</span>
                        <span className="hidden text-xs text-muted-foreground group-open:inline">Close</span>
                      </summary>
                      <div className="pt-4">
                        <div className="flex items-center gap-4">
                        <label className="relative flex h-12 cursor-pointer items-center overflow-hidden rounded-xl border-2 border-dashed bg-background/80 px-5 transition-colors hover:border-primary/60">
                          <input type="file" accept="image/*" onChange={handlePhotoUpload} className="absolute inset-0 cursor-pointer opacity-0" aria-label="Upload profile photo" />
                          <ImageIcon size={18} className="mr-2 text-primary" />
                          <span className="font-bold">Upload Photo</span>
                        </label>
                        {watchAll.profilePhoto && (
                          <div className="size-14 rounded-2xl border bg-muted overflow-hidden shadow-sm">
                            <img src={watchAll.profilePhoto} alt="Profile photo preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                      </div>
                    </details>
                  </div>
                  <details className="group border-t pt-7">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                      <span className="flex items-center gap-3">
                      <LinkIcon className="text-primary size-5" />
                      <span><span className="block text-sm font-black uppercase tracking-[0.16em]">Professional links</span><span className="mt-1 block text-xs font-medium normal-case tracking-normal text-muted-foreground">LinkedIn, website, video, phone, X, and GitHub · Optional</span></span>
                      </span>
                      <SlidersHorizontal size={18} className="text-muted-foreground transition-transform group-open:rotate-90" />
                    </summary>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-7">
                      <FormField control={form.control} name="linkedinUrl" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/70">LinkedIn Profile</FormLabel>
                          <div className="relative">
                            <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <FormControl><Input className="h-12 pl-10 rounded-xl" placeholder="https://..." {...field} /></FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="websiteUrl" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/70">Portfolio / Web</FormLabel>
                          <div className="relative">
                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <FormControl><Input className="h-12 pl-10 rounded-xl" placeholder="https://..." {...field} /></FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="videoUrl" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/70">Video Intro URL</FormLabel>
                          <div className="relative">
                            <Video className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <FormControl><Input className="h-12 pl-10 rounded-xl" placeholder="Loom / YouTube link" {...field} /></FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="phone" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/70">Phone Number</FormLabel>
                          <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <FormControl><Input className="h-12 pl-10 rounded-xl" placeholder="+1 (555) 000-0000" {...field} /></FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="twitterUrl" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/70">Twitter / X</FormLabel>
                          <div className="relative">
                            <Twitter className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <FormControl><Input className="h-12 pl-10 rounded-xl" placeholder="@handle or https://x.com/handle" autoCapitalize="none" autoCorrect="off" spellCheck={false} {...field} /></FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="githubUrl" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/70">GitHub</FormLabel>
                          <div className="relative">
                            <Github className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <FormControl><Input className="h-12 pl-10 rounded-xl" placeholder="https://github.com/..." {...field} /></FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                  </details>
                  <div className="pt-7 border-t space-y-7">
                    <div className="flex items-center gap-3">
                      <LayoutGrid className="text-primary size-5" />
                      <span className="text-sm font-black uppercase tracking-[0.16em]">Initial Context</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField control={form.control} name="variantName" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/70">Audience Group</FormLabel>
                          <Select onValueChange={(val) => { field.onChange(val); form.setValue('variantSlug', val.toLowerCase().replace(/\s+/g, '-')) }} defaultValue={field.value}>
                            <FormControl><SelectTrigger className="h-14 text-lg rounded-2xl"><SelectValue placeholder="Audience Profile" /></SelectTrigger></FormControl>
                            <SelectContent className="rounded-2xl"><SelectItem value="Default">General Purpose</SelectItem><SelectItem value="Client Meeting">Client Facing</SelectItem><SelectItem value="Interview">Job Interview</SelectItem><SelectItem value="Investor">Investor Pitch</SelectItem></SelectContent>
                          </Select>
                        </FormItem>
                      )} />
                    <FormField control={form.control} name="focus" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/70">Primary Focus</FormLabel>
                          <FormControl><Input className="h-14 text-lg rounded-2xl" placeholder="Scale Engineering Teams" {...field} /></FormControl>
                          <div className="flex items-start justify-between gap-3"><FormMessage /><span className="ml-auto text-[10px] tabular-nums text-muted-foreground">{(field.value || '').length}/60</span></div>
                        </FormItem>
                      )} />
                    </div>
                    <FormField control={form.control} name="topics" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/70">Discussion Topics</FormLabel>
                        <FormControl><Input className="h-14 text-lg rounded-2xl" placeholder="AI, SaaS, GTM Strategy (comma separated)" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="bio" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/70">Quick Bio</FormLabel>
                          <FormControl><Textarea className="h-32 resize-none rounded-xl bg-background/80 p-4 text-base" placeholder="Brief intro for this context..." {...field} /></FormControl>
                        <div className="flex items-start justify-between gap-3"><FormMessage /><span className="ml-auto text-[10px] tabular-nums text-muted-foreground">{(field.value || '').length}/300</span></div>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="meetingNote" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/70">Pre-Meeting Note</FormLabel>
                        <FormControl><Textarea className="h-24 resize-none rounded-xl p-4 text-base bg-primary/5 border-primary/10" placeholder="e.g. Really looking forward to our chat about the Q3 roadmap..." {...field} /></FormControl>
                        <div className="flex items-start justify-between gap-3"><FormMessage /><span className="ml-auto text-[10px] tabular-nums text-muted-foreground">{(field.value || '').length}/200</span></div>
                      </FormItem>
                    )} />
                  </div>
                  <details className="group border-t pt-7">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                      <span className="flex items-center gap-3">
                      <Lock className="text-primary size-5" />
                      <span><span className="block text-sm font-black uppercase tracking-[0.16em]">Privacy & access</span><span className="mt-1 block text-xs font-medium normal-case tracking-normal text-muted-foreground">Password protection · Optional</span></span>
                      </span>
                      <SlidersHorizontal size={18} className="text-muted-foreground transition-transform group-open:rotate-90" />
                    </summary>
                    <div className="pt-6"><FormField control={form.control} name="password" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/70">Optional Password</FormLabel>
                        <FormControl><Input type="password" className="h-12 rounded-xl bg-background/80" placeholder="Leave empty for public access" {...field} /></FormControl>
                        <FormDescription className="text-[10px] leading-relaxed">
                          If set, visitors must enter this password to view your card.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )} /></div>
                  </details>
                  <Button type="submit" size="lg" className="w-full h-14 text-base rounded-xl font-bold active:scale-[0.99] transition-all" disabled={isSubmitting || slugStatus === 'taken' || slugStatus === 'invalid'}>
                    {isSubmitting ? "Publishing..." : "Create My Page"} <Send size={20} className="ml-3" />
                  </Button>
                </form>
              </Form>
            )}
          </div>
          <div id="preview" className="lg:sticky lg:top-8 space-y-6">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                 <Target className="text-primary size-3.5" />
                 <span className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.3em]">Live Preview</span>
              </div>
              <div className="flex gap-2 items-center">
                <div className="size-2 rounded-full bg-green-500 shadow-glow animate-pulse" />
                <span className="text-xs text-muted-foreground font-bold">{watchAll.variantName} Mode</span>
              </div>
            </div>
            {showDesktopPreview ? (
              <Suspense fallback={previewFallback}><ProfileCard data={watchAll} className="origin-top transition-transform" /></Suspense>
            ) : (
              <div className="rounded-2xl border bg-card/80 p-5 text-sm text-muted-foreground lg:hidden">Use Preview to see your page as you build it.</div>
            )}
            <div className="p-5 rounded-2xl bg-card/80 border flex items-start gap-4 shadow-soft backdrop-blur">
               <Info className="size-5 text-primary shrink-0 mt-0.5" />
               <p className="text-xs text-muted-foreground leading-relaxed">
                 This preview updates in real time. Keep it skimmable: role, focus, topics, and one useful meeting note.
               </p>
            </div>
          </div>
        </div>
        {!publishedData && showMobileActions && (
          <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-12px_40px_-24px_rgba(15,23,42,0.55)] backdrop-blur lg:hidden">
            <div className="mx-auto flex max-w-lg gap-3">
              <Button type="button" variant="outline" className="h-12 flex-1 rounded-xl font-bold" onClick={() => setShowMobilePreview(true)}>
                <Eye size={17} className="mr-2" /> Preview
              </Button>
              <Button type="submit" form="create-page" className="h-12 flex-[1.35] rounded-xl font-bold" disabled={isSubmitting || slugStatus === 'taken' || slugStatus === 'invalid'}>
                {isSubmitting ? <><Loader2 size={17} className="mr-2 animate-spin" /> Publishing</> : <>Create page <Send size={17} className="ml-2" /></>}
              </Button>
            </div>
          </div>
        )}
        {showMobilePreview && !publishedData && (
          <div className="fixed inset-0 z-50 bg-foreground/35 p-3 backdrop-blur-sm lg:hidden" role="dialog" aria-modal="true" aria-labelledby="mobile-preview-title">
            <div className="mx-auto flex h-full max-w-lg flex-col overflow-hidden rounded-3xl border bg-background shadow-2xl">
              <div className="flex items-center justify-between border-b px-5 py-4">
                <div>
                  <h2 id="mobile-preview-title" className="text-lg font-bold">Page preview</h2>
                  <p className="text-xs text-muted-foreground">Updates as you complete the form</p>
                </div>
                <Button type="button" variant="ghost" size="icon" className="rounded-full" onClick={() => setShowMobilePreview(false)} aria-label="Close preview">
                  <X size={19} />
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                <Suspense fallback={previewFallback}><ProfileCard data={watchAll} /></Suspense>
              </div>
            </div>
          </div>
        )}
        <section id="security" className="pt-20 pb-12 border-t border-slate-200 dark:border-slate-800">
          <SecurityFAQ />
        </section>
        <footer className="border-t border-slate-200 py-8 text-center text-sm text-muted-foreground dark:border-slate-800">
          Created by <a className="underline hover:text-foreground" href="https://www.linkedin.com/in/steve-thoms-81381990" rel="me">Steve Thoms</a>.
        </footer>
      </div>
    </div>
  );
}
