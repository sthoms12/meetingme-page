import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Sparkles, Send, ShieldCheck, LayoutGrid, Image as ImageIcon, Loader2, Link as LinkIcon, Linkedin, Globe, Video, Twitter, Github, Phone, Lock, Copy, Check, Info, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProfileCard } from '@/components/ProfileCard';
import { ThemeToggle } from '@/components/ThemeToggle';
import { CopyBlurbGroup } from '@/components/CopyBlurbGroup';
import { SecurityFAQ } from '@/components/SecurityFAQ';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { generateQrCodeDataUrl } from '@/lib/qrcode';
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
  twitterUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  githubUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  customSlug: z.string().regex(/^[a-z0-9-]*$/, 'Lower, numbers, hyphens').min(3, '3+ chars').optional().or(z.literal('')),
  password: z.string().min(8, 'Min 8 characters').optional().or(z.literal('')),
  variantName: z.string().min(1, 'Required'),
  variantSlug: z.string().regex(/^[a-z0-9-]*$/, 'Invalid format').min(2, '2+ chars'),
});
type FormValues = z.infer<typeof formSchema>;
export function HomePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [publishedData, setPublishedData] = useState<{ slug: string; editToken: string } | null>(null);
  const [qrCodeData, setQrCodeData] = useState<string>('');
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  const [copiedPrivate, setCopiedPrivate] = useState(false);
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
  useEffect(() => {
    if (!customSlug || customSlug.length < 3) { setSlugAvailable(null); return; }
    setIsCheckingSlug(true);
    const h = setTimeout(async () => {
      try {
        const res = await fetch(`/api/profiles/availability/${customSlug}`);
        const result = await res.json();
        setSlugAvailable(result.success ? result.data.available : null);
      } catch { setSlugAvailable(null); }
      finally { setIsCheckingSlug(false); }
    }, 500);
    return () => clearTimeout(h);
  }, [customSlug]);
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
      const res = await fetch('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const result = await res.json();
      if (result.success) {
        const slug = result.data.slug;
        const editToken = result.data.editToken;
        setPublishedData({ slug, editToken });
        const url = `${window.location.origin}/${slug}`;
        const qr = await generateQrCodeDataUrl(url);
        setQrCodeData(qr);
        toast.success('Your MeetingMe page is live!');
      } else { toast.error(result.error); }
    } catch (err) {
      console.error('Publishing error:', err);
      toast.error('Error publishing');
    } finally { setIsSubmitting(false); }
  };
  const handleCopyPrivate = () => {
    if (!publishedData) return;
    const managementUrl = `${window.location.origin}/${publishedData.slug}/edit?token=${publishedData.editToken}`;
    navigator.clipboard.writeText(managementUrl);
    setCopiedPrivate(true);
    toast.success('Private management link copied');
    setTimeout(() => setCopiedPrivate(false), 2000);
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-14 lg:py-16 space-y-12">
        <ThemeToggle className="fixed top-5 right-5 rounded-full border bg-card/80 backdrop-blur" />
        <header className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-end">
          <div className="max-w-4xl space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full border bg-card/80 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-primary shadow-soft backdrop-blur">
              <Sparkles size={14} /> <span>MeetingMe Page</span>
            </div>
            <h1 className="font-display text-6xl md:text-7xl lg:text-8xl tracking-normal text-foreground leading-[0.92]">
              Send the context before the calendar invite.
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl leading-relaxed">
              Build a concise meeting intro page with the facts, links, topics, and private context people need before they talk to you.
            </p>
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
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-9 hairline-panel p-6 md:p-8 rounded-3xl">
                  <div className="flex items-center justify-between gap-4 border-b pb-5">
                    <div>
                      <h2 className="text-xl font-bold tracking-tight">Create your intro</h2>
                      <p className="mt-1 text-sm text-muted-foreground">Start with the public handle, then add the context people should know first.</p>
                    </div>
                    <div className="hidden sm:flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Send size={20} />
                    </div>
                  </div>
                  <div className="space-y-6">
                    <FormField control={form.control} name="customSlug" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">Public Handle</FormLabel>
                        <FormControl><Input className="h-12 text-base rounded-xl border bg-background/80" placeholder="jane-doe" {...field} /></FormControl>
                        {customSlug && customSlug.length >= 3 && (
                          <FormDescription className={cn("text-[11px] font-bold flex items-center gap-1.5", isCheckingSlug ? "text-muted-foreground" : slugAvailable === true ? "text-green-600" : "text-destructive")}>
                            {isCheckingSlug ? (
                              <><Loader2 size={12} className="animate-spin" /> Verifying availability...</>
                            ) : slugAvailable === true ? (
                              "✓ Handle is available"
                            ) : (
                              "✗ This handle is already taken"
                            )}
                          </FormDescription>
                        )}
                      </FormItem>
                    )} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField control={form.control} name="fullName" render={({ field }) => (
                        <FormItem><FormLabel className="text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">Full Name</FormLabel><FormControl><Input className="h-12 rounded-xl bg-background/80" placeholder="John Doe" {...field} /></FormControl></FormItem>
                      )} />
                      <FormField control={form.control} name="jobTitle" render={({ field }) => (
                        <FormItem><FormLabel className="text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">Job Title</FormLabel><FormControl><Input className="h-12 rounded-xl bg-background/80" placeholder="Founder & CEO" {...field} /></FormControl></FormItem>
                      )} />
                    </div>
                    <FormField control={form.control} name="company" render={({ field }) => (
                      <FormItem><FormLabel className="text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">Organization</FormLabel><FormControl><Input className="h-12 rounded-xl bg-background/80" placeholder="Acme Inc." {...field} /></FormControl></FormItem>
                    )} />
                    <div className="pt-2">
                      <FormLabel className="text-xs font-black uppercase tracking-[0.16em] text-muted-foreground mb-2 block">Profile Photo</FormLabel>
                      <div className="flex items-center gap-4">
                        <Button type="button" variant="outline" className="h-12 px-5 rounded-xl border-dashed border-2 relative overflow-hidden group bg-background/80">
                          <input type="file" accept="image/*" onChange={handlePhotoUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                          <ImageIcon size={18} className="mr-2 text-primary" />
                          <span className="font-bold">Upload Photo</span>
                        </Button>
                        {watchAll.profilePhoto && (
                          <div className="size-14 rounded-2xl border bg-muted overflow-hidden shadow-sm">
                            <img src={watchAll.profilePhoto} alt="Preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="pt-7 border-t space-y-7">
                    <div className="flex items-center gap-3">
                      <LinkIcon className="text-primary size-5" />
                      <span className="text-sm font-black uppercase tracking-[0.16em]">Professional Links</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField control={form.control} name="linkedinUrl" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/70">LinkedIn Profile</FormLabel>
                          <div className="relative">
                            <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <FormControl><Input className="h-12 pl-10 rounded-xl" placeholder="https://..." {...field} /></FormControl>
                          </div>
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="websiteUrl" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/70">Portfolio / Web</FormLabel>
                          <div className="relative">
                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <FormControl><Input className="h-12 pl-10 rounded-xl" placeholder="https://..." {...field} /></FormControl>
                          </div>
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="videoUrl" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/70">Video Intro URL</FormLabel>
                          <div className="relative">
                            <Video className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <FormControl><Input className="h-12 pl-10 rounded-xl" placeholder="Loom / YouTube link" {...field} /></FormControl>
                          </div>
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="phone" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/70">Phone Number</FormLabel>
                          <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <FormControl><Input className="h-12 pl-10 rounded-xl" placeholder="+1 (555) 000-0000" {...field} /></FormControl>
                          </div>
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="twitterUrl" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/70">Twitter / X</FormLabel>
                          <div className="relative">
                            <Twitter className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <FormControl><Input className="h-12 pl-10 rounded-xl" placeholder="https://x.com/..." {...field} /></FormControl>
                          </div>
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="githubUrl" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/70">GitHub</FormLabel>
                          <div className="relative">
                            <Github className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <FormControl><Input className="h-12 pl-10 rounded-xl" placeholder="https://github.com/..." {...field} /></FormControl>
                          </div>
                        </FormItem>
                      )} />
                    </div>
                  </div>
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
                        </FormItem>
                      )} />
                    </div>
                    <FormField control={form.control} name="topics" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/70">Discussion Topics</FormLabel>
                        <FormControl><Input className="h-14 text-lg rounded-2xl" placeholder="AI, SaaS, GTM Strategy (comma separated)" {...field} /></FormControl>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="bio" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/70">Quick Bio</FormLabel>
                          <FormControl><Textarea className="h-32 resize-none rounded-xl bg-background/80 p-4 text-base" placeholder="Brief intro for this context..." {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="meetingNote" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/70">Pre-Meeting Note</FormLabel>
                        <FormControl><Textarea className="h-24 resize-none rounded-xl p-4 text-base bg-primary/5 border-primary/10" placeholder="e.g. Really looking forward to our chat about the Q3 roadmap..." {...field} /></FormControl>
                      </FormItem>
                    )} />
                  </div>
                  <div className="pt-7 border-t space-y-6">
                    <div className="flex items-center gap-3">
                      <Lock className="text-primary size-5" />
                      <span className="text-sm font-black uppercase tracking-[0.16em]">Privacy & Access</span>
                    </div>
                    <FormField control={form.control} name="password" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/70">Optional Password</FormLabel>
                        <FormControl><Input type="password" className="h-12 rounded-xl bg-background/80" placeholder="Leave empty for public access" {...field} /></FormControl>
                        <FormDescription className="text-[10px] leading-relaxed">
                          If set, visitors must enter this password to view your card.
                        </FormDescription>
                      </FormItem>
                    )} />
                  </div>
                  <Button type="submit" size="lg" className="w-full h-14 text-base rounded-xl font-bold active:scale-[0.99] transition-all" disabled={isSubmitting || slugAvailable === false}>
                    {isSubmitting ? "Publishing..." : "Create My Page"} <Send size={20} className="ml-3" />
                  </Button>
                </form>
              </Form>
            )}
          </div>
          <div className="lg:sticky lg:top-8 space-y-6">
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
            <ProfileCard data={watchAll} className="origin-top transition-transform" />
            <div className="p-5 rounded-2xl bg-card/80 border flex items-start gap-4 shadow-soft backdrop-blur">
               <Info className="size-5 text-primary shrink-0 mt-0.5" />
               <p className="text-xs text-muted-foreground leading-relaxed">
                 This preview updates in real time. Keep it skimmable: role, focus, topics, and one useful meeting note.
               </p>
            </div>
          </div>
        </div>
        <section className="pt-20 pb-12 border-t border-slate-200 dark:border-slate-800">
          <SecurityFAQ />
        </section>
      </div>
    </div>
  );
}
