import React, { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import QRCode from 'qrcode';
import { Copy, Check, ExternalLink, Sparkles, Send, QrCode as QrIcon, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { ProfileCard } from '@/components/ProfileCard';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Link } from 'react-router-dom';
import { useDebounce } from 'react-use';
const formSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  jobTitle: z.string().min(2, 'Title is required'),
  company: z.string().min(2, 'Company is required'),
  bio: z.string().min(10, 'Bio must be at least 10 characters').max(300, 'Keep it punchy (max 300 chars)'),
  profilePhoto: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  linkedinUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  websiteUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  videoUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  customSlug: z.string().regex(/^[a-z0-9-]*$/, 'Only lowercase, numbers, and hyphens').min(3, 'At least 3 chars').max(30).optional().or(z.literal('')),
});
type FormValues = z.infer<typeof formSchema>;
export function HomePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [publishedData, setPublishedData] = useState<{ slug: string; editToken: string } | null>(null);
  const [qrCodeData, setQrCodeData] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '', jobTitle: '', company: '', bio: '', profilePhoto: '', linkedinUrl: '', websiteUrl: '', videoUrl: '', customSlug: '',
    },
  });
  const watchAll = form.watch();
  const customSlug = form.watch('customSlug');
  useDebounce(async () => {
    if (customSlug && customSlug.length >= 3) {
      try {
        const res = await fetch(`/api/profiles/availability/${customSlug}`);
        const result = await res.json();
        setSlugAvailable(result.data.available);
      } catch (e) {
        setSlugAvailable(null);
      }
    } else {
      setSlugAvailable(null);
    }
  }, 500, [customSlug]);
  const onSubmit = useCallback(async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const result = await response.json();
      if (result.success && result.data) {
        setPublishedData({ slug: result.data.slug, editToken: result.data.editToken });
        localStorage.setItem(`profile_${result.data.slug}_token`, result.data.editToken);
        const url = `${window.location.origin}/${result.data.slug}`;
        const qr = await QRCode.toDataURL(url, { width: 400, margin: 2, color: { dark: '#0f172a', light: '#ffffff' } });
        setQrCodeData(qr);
        toast.success('Your MeetingMe page is live!');
      } else {
        toast.error(result.error || 'Failed to publish');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, []);
  const copyLink = useCallback(() => {
    if (!publishedData) return;
    const url = `${window.location.origin}/${publishedData.slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success('Link copied');
  }, [publishedData]);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12">
        <ThemeToggle />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
            <header className="space-y-3 no-print">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold dark:bg-indigo-950 dark:text-indigo-300">
                <Sparkles size={14} />
                <span>Professional Intros</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground tracking-tight">
                Share who you are <br />
                <span className="text-indigo-600 dark:text-indigo-400">before</span> the meeting.
              </h1>
              <p className="text-lg text-muted-foreground max-w-md">
                Create a clean, skimmable profile to send before you meet.
              </p>
            </header>
            {publishedData ? (
              <div className="bg-card border border-border rounded-2xl p-8 shadow-soft space-y-6 animate-scale-in dark:bg-slate-900/60 no-print">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="flex-1 space-y-4 w-full">
                    <h3 className="text-xl font-semibold text-foreground">It's live!</h3>
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Your URL</p>
                      <div className="flex items-center gap-2 p-3 bg-muted border border-border rounded-lg">
                        <code className="flex-1 text-sm text-indigo-600 dark:text-indigo-400 truncate">
                          meetingme.page/{publishedData.slug}
                        </code>
                        <Button size="sm" variant="ghost" onClick={copyLink}>
                          {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                       <Button asChild className="w-full gap-2">
                        <Link to={`/${publishedData.slug}`}>View Profile <ExternalLink size={16} /></Link>
                      </Button>
                      <Button variant="outline" asChild className="w-full">
                        <Link to={`/${publishedData.slug}/edit`}>Edit Details</Link>
                      </Button>
                    </div>
                  </div>
                  <div className="shrink-0 space-y-2 text-center">
                    <div className="p-2 bg-white rounded-xl border shadow-sm">
                      <img src={qrCodeData} alt="QR Code" className="size-32" />
                    </div>
                    <Button variant="ghost" size="sm" className="text-xs h-8 gap-1" asChild>
                      <a href={qrCodeData} download={`meetingme-${publishedData.slug}.png`}>
                        <Download size={14} /> Download QR
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="customSlug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Custom URL (Optional)</FormLabel>
                        <FormControl>
                          <div className="relative flex items-center">
                            <span className="absolute left-3 text-muted-foreground text-sm font-medium">meetingme.page/</span>
                            <Input className="pl-[104px]" placeholder="john-doe" {...field} />
                          </div>
                        </FormControl>
                        <FormDescription className="flex items-center justify-between">
                          <span>Choose a professional handle.</span>
                          {slugAvailable !== null && customSlug && (
                            <span className={slugAvailable ? "text-green-600 text-xs font-bold" : "text-destructive text-xs font-bold"}>
                              {slugAvailable ? "Available" : "Taken"}
                            </span>
                          )}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="fullName" render={({ field }) => (
                      <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="profilePhoto" render={({ field }) => (
                      <FormItem><FormLabel>Avatar URL</FormLabel><FormControl><Input placeholder="https://..." {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="jobTitle" render={({ field }) => (
                      <FormItem><FormLabel>Job Title</FormLabel><FormControl><Input placeholder="Product Designer" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="company" render={({ field }) => (
                      <FormItem><FormLabel>Company</FormLabel><FormControl><Input placeholder="Acme Inc." {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="bio" render={({ field }) => (
                    <FormItem><FormLabel>Bio (max 300 chars)</FormLabel><FormControl><Textarea className="h-24" placeholder="Briefly share who you are..." {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <Button type="submit" size="lg" className="w-full gap-2 h-12 shadow-lg" disabled={isSubmitting || (!!customSlug && slugAvailable === false)}>
                    {isSubmitting ? "Publishing..." : "Publish Page"} <Send size={18} />
                  </Button>
                </form>
              </Form>
            )}
          </div>
          <div className="lg:sticky lg:top-12 no-print">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Real-time Preview</span>
              </div>
              <ProfileCard data={watchAll} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}