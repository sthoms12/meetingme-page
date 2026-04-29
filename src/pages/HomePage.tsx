import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import QRCode from 'qrcode';
import { Sparkles, Send, ShieldCheck, LayoutGrid, Image as ImageIcon, Loader2, Link as LinkIcon, Linkedin, Globe, Video } from 'lucide-react';
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
  customSlug: z.string().regex(/^[a-z0-9-]*$/, 'Lower, numbers, hyphens').min(3, '3+ chars').optional().or(z.literal('')),
  password: z.string().min(4).optional().or(z.literal('')),
  variantName: z.string().min(1, 'Required'),
  variantSlug: z.string().regex(/^[a-z0-9-]*$/, 'Invalid format').min(2, '2+ chars'),
});
type FormValues = z.infer<typeof formSchema>;
export function HomePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [publishedData, setPublishedData] = useState<{ slug: string } | null>(null);
  const [qrCodeData, setQrCodeData] = useState<string>('');
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '', jobTitle: '', company: '', bio: '', focus: '', topics: '', meetingNote: '', profilePhoto: '',
      linkedinUrl: '', websiteUrl: '', videoUrl: '',
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
        setPublishedData({ slug: result.data.slug });
        localStorage.setItem(`profile_${result.data.slug}_token`, result.data.editToken);
        const url = `${window.location.origin}/${result.data.slug}`;
        setQrCodeData(await QRCode.toDataURL(url));
        toast.success('Your MeetingMe page is live!');
      } else { toast.error(result.error); }
    } catch { toast.error('Error publishing'); }
    finally { setIsSubmitting(false); }
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-12 md:py-20 lg:py-24 space-y-16">
        <ThemeToggle />
        <header className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[11px] font-black uppercase tracking-[0.2em] shadow-sm border border-primary/5">
            <Sparkles size={14} /> <span>Professional Network Tools</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.05]">
            Professional context <br />
            <span className="text-primary">before the meeting</span>.
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl max-w-2xl leading-relaxed">
            Send a single link to introduce yourself. No ads, no fluff, just the facts your audience needs to know.
          </p>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-12">
            {publishedData ? (
              <div className="bg-card border-2 border-primary/10 rounded-4xl p-10 shadow-soft space-y-8 animate-scale-in">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="flex-1 space-y-4 w-full">
                    <div className="size-14 rounded-2xl bg-green-500/10 text-green-600 flex items-center justify-center"><ShieldCheck size={28} /></div>
                    <h3 className="text-2xl font-bold">Page is Published</h3>
                    <div className="p-4 bg-muted rounded-xl text-sm font-mono break-all border">
                      {window.location.origin}/{publishedData.slug}
                    </div>
                  </div>
                  <img src={qrCodeData} alt="QR" className="size-36 bg-white p-3 rounded-2xl border-2 border-muted" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button asChild size="lg" className="h-14 text-lg font-bold rounded-2xl"><Link to={`/${publishedData.slug}`}>View Live Page</Link></Button>
                  <Button variant="outline" asChild size="lg" className="h-14 text-lg font-bold rounded-2xl"><Link to={`/${publishedData.slug}/edit`}>Manage Details</Link></Button>
                </div>
                <CopyBlurbGroup
                  fullName={watchAll.fullName}
                  jobTitle={watchAll.jobTitle}
                  company={watchAll.company}
                  url={`${window.location.origin}/${publishedData.slug}`}
                  className="pt-8 border-t"
                />
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10 bg-card p-8 md:p-12 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-soft">
                  <div className="space-y-6">
                    <FormField control={form.control} name="customSlug" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/70">Public Handle</FormLabel>
                        <FormControl><Input className="h-14 text-lg rounded-2xl border-slate-200" placeholder="jane-doe" {...field} /></FormControl>
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
                        <FormItem><FormLabel className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/70">Full Name</FormLabel><FormControl><Input className="h-14 text-lg rounded-2xl" {...field} /></FormControl></FormItem>
                      )} />
                      <FormField control={form.control} name="jobTitle" render={({ field }) => (
                        <FormItem><FormLabel className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/70">Job Title</FormLabel><FormControl><Input className="h-14 text-lg rounded-2xl" {...field} /></FormControl></FormItem>
                      )} />
                    </div>
                    <div className="pt-2">
                      <FormLabel className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/70 mb-2 block">Profile Photo</FormLabel>
                      <div className="flex items-center gap-4">
                        <Button type="button" variant="outline" className="h-14 px-6 rounded-2xl border-dashed border-2 relative overflow-hidden group">
                          <input type="file" accept="image/*" onChange={handlePhotoUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                          <ImageIcon size={18} className="mr-2 text-primary" />
                          <span className="font-bold">Upload Photo</span>
                        </Button>
                        {watchAll.profilePhoto && (
                          <div className="size-14 rounded-2xl border bg-muted overflow-hidden">
                            <img src={watchAll.profilePhoto} alt="Preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="pt-8 border-t space-y-8">
                    <div className="flex items-center gap-3">
                      <LinkIcon className="text-primary size-5" />
                      <span className="text-sm font-black uppercase tracking-[0.2em]">Professional Links</span>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                      <FormField control={form.control} name="linkedinUrl" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/70">LinkedIn Profile</FormLabel>
                          <div className="relative">
                            <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <FormControl><Input className="h-12 pl-10 rounded-xl" placeholder="https://linkedin.com/in/username" {...field} /></FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="websiteUrl" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/70">Personal Website</FormLabel>
                          <div className="relative">
                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <FormControl><Input className="h-12 pl-10 rounded-xl" placeholder="https://yourwebsite.com" {...field} /></FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="videoUrl" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/70">Video Intro URL (Loom/Youtube)</FormLabel>
                          <div className="relative">
                            <Video className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <FormControl><Input className="h-12 pl-10 rounded-xl" placeholder="https://loom.com/share/..." {...field} /></FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                  </div>
                  <div className="pt-8 border-t space-y-8">
                    <div className="flex items-center gap-3">
                      <LayoutGrid className="text-primary size-5" />
                      <span className="text-sm font-black uppercase tracking-[0.2em]">Default Context</span>
                    </div>
                    <FormField control={form.control} name="variantName" render={({ field }) => (
                      <FormItem>
                        <Select onValueChange={(val) => { field.onChange(val); form.setValue('variantSlug', val.toLowerCase().replace(/\s+/g, '-')) }} defaultValue={field.value}>
                          <FormControl><SelectTrigger className="h-14 text-lg rounded-2xl"><SelectValue placeholder="Audience Profile" /></SelectTrigger></FormControl>
                          <SelectContent className="rounded-2xl"><SelectItem value="Default">General Purpose</SelectItem><SelectItem value="Client Meeting">Client Facing</SelectItem><SelectItem value="Interview">Job Interview</SelectItem><SelectItem value="Investor">Investor Pitch</SelectItem></SelectContent>
                        </Select>
                      </FormItem>
                    )} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField control={form.control} name="focus" render={({ field }) => (
                        <FormItem><FormLabel className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/70">Main Focus</FormLabel><FormControl><Input className="h-12 rounded-xl" placeholder="Strategic GTM..." {...field} /></FormControl></FormItem>
                      )} />
                      <FormField control={form.control} name="topics" render={({ field }) => (
                        <FormItem><FormLabel className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/70">Topics (CSV)</FormLabel><FormControl><Input className="h-12 rounded-xl" placeholder="SaaS, Growth..." {...field} /></FormControl></FormItem>
                      )} />
                    </div>
                    <FormField control={form.control} name="meetingNote" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/70">Before We Meet</FormLabel>
                        <FormControl><Textarea className="h-28 resize-none rounded-2xl p-4 text-base" placeholder="Optional context or agenda preference..." {...field} /></FormControl>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="bio" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/70">Short Bio</FormLabel>
                        <FormControl><Textarea className="h-32 resize-none rounded-2xl p-4 text-base" placeholder="Brief intro (max 300 characters)..." {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <Button type="submit" size="lg" className="w-full h-16 text-xl rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-95 transition-all" disabled={isSubmitting || slugAvailable === false}>
                    {isSubmitting ? "Publishing..." : "Create My Page"} <Send size={20} className="ml-3" />
                  </Button>
                </form>
              </Form>
            )}
          </div>
          <div className="lg:sticky lg:top-12 space-y-6">
            <div className="flex items-center justify-between px-2">
              <span className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.3em]">Live Preview</span>
              <div className="flex gap-2 items-center">
                <div className="size-2 rounded-full bg-green-500 shadow-glow animate-pulse" />
                <span className="text-xs text-muted-foreground font-bold">{watchAll.variantName} Mode</span>
              </div>
            </div>
            <ProfileCard data={watchAll} className="scale-105 origin-top transition-transform" />
          </div>
        </div>

        <section className="pt-20 pb-12 border-t border-slate-200 dark:border-slate-800">
          <SecurityFAQ />
        </section>
      </div>
    </div>
  );
}