import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import QRCode from 'qrcode';
import { Copy, Check, ExternalLink, Sparkles, Send, Download, Mail, Upload, X, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { ProfileCard } from '@/components/ProfileCard';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
const formSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  jobTitle: z.string().min(2, 'Title is required'),
  company: z.string().min(2, 'Company is required'),
  bio: z.string().min(10, 'Bio must be at least 10 characters').max(300, 'Keep it punchy (max 300 chars)'),
  profilePhoto: z.string().optional().or(z.literal('')),
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
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  const [useUrlForPhoto, setUseUrlForPhoto] = useState(false);
  const [prefixWidth, setPrefixWidth] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const prefixRef = useRef<HTMLSpanElement>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '', jobTitle: '', company: '', bio: '', profilePhoto: '', linkedinUrl: '', websiteUrl: '', videoUrl: '', customSlug: '',
    },
  });
  const watchAll = form.watch();
  const customSlug = watchAll.customSlug;
  const profilePhoto = watchAll.profilePhoto;
  // Measure prefix width for tight visual join
  useEffect(() => {
    if (prefixRef.current) {
      setPrefixWidth(prefixRef.current.offsetWidth);
    }
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setPrefixWidth(entry.contentRect.width);
      }
    });
    if (prefixRef.current) observer.observe(prefixRef.current);
    return () => observer.disconnect();
  }, []);
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File is too large. Max 2MB.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.src = reader.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 400;
        const scale = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        form.setValue('profilePhoto', dataUrl);
      };
    };
    reader.readAsDataURL(file);
  };
  useEffect(() => {
    if (!customSlug || customSlug.length < 3) {
      setSlugAvailable(null);
      setIsCheckingSlug(false);
      return;
    }
    setIsCheckingSlug(true);
    const handler = setTimeout(async () => {
      try {
        const res = await fetch(`/api/profiles/availability/${customSlug}`);
        const result = await res.json();
        if (result.success) {
          setSlugAvailable(result.data.available);
        } else {
          setSlugAvailable(null);
        }
      } catch (e) {
        setSlugAvailable(null);
      } finally {
        setIsCheckingSlug(false);
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [customSlug]);
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
  const shareViaEmail = useCallback(() => {
    if (!publishedData) return;
    const url = `${window.location.origin}/${publishedData.slug}`;
    const subject = encodeURIComponent(`Meet ${watchAll.fullName}`);
    const body = encodeURIComponent(`Hi,\n\nI'm looking forward to our meeting. Here's a quick background on who I am and what I do:\n\n${url}\n\n"${watchAll.bio}"\n\nSee you soon!`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  }, [publishedData, watchAll]);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12">
        <ThemeToggle />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
            <header className="space-y-3 no-print">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold dark:bg-indigo-950 dark:text-indigo-300">
                <Sparkles size={14} />
                <span>V1 Professional</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground tracking-tight leading-tight">
                Share who you are <br />
                <span className="text-indigo-600 dark:text-indigo-400">before</span> the meeting.
              </h1>
            </header>
            {publishedData ? (
              <div className="bg-card border border-border rounded-2xl p-8 shadow-soft space-y-6 animate-scale-in dark:bg-slate-900/60 no-print">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="flex-1 space-y-4 w-full">
                    <h3 className="text-xl font-semibold">It's live!</h3>
                    <div className="flex items-center gap-2 p-3 bg-muted border rounded-lg">
                      <code className="flex-1 text-xs truncate">meetingme.page/{publishedData.slug}</code>
                      <Button size="sm" variant="ghost" type="button" onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/${publishedData.slug}`); setCopied(true); setTimeout(()=>setCopied(false), 2000); }}>
                        {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      <Button asChild className="w-full gap-2"><Link to={`/${publishedData.slug}`}>View Profile <ExternalLink size={16} /></Link></Button>
                      <Button variant="secondary" type="button" onClick={shareViaEmail} className="w-full gap-2"><Mail size={16} /> Share via Email</Button>
                      <Button variant="outline" asChild className="w-full"><Link to={`/${publishedData.slug}/edit`}>Manage Profile</Link></Button>
                    </div>
                  </div>
                  <img src={qrCodeData} alt="QR" className="size-32 border rounded-xl p-1 bg-white" />
                </div>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField control={form.control} name="customSlug" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Custom Handle</FormLabel>
                      <FormControl>
                        <div className="relative flex items-center group">
                          <span 
                            ref={prefixRef}
                            className="absolute left-3 text-sm text-muted-foreground/60 select-none pointer-events-none transition-colors group-focus-within:text-indigo-500/50"
                          >
                            meetingme.page/
                          </span>
                          <Input 
                            className="h-11 shadow-none focus-visible:ring-1 focus-visible:ring-indigo-500 transition-all bg-secondary/50 border-input"
                            placeholder="jane-doe" 
                            style={{ paddingLeft: `${prefixWidth + 14}px` }}
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormDescription className="flex justify-between items-center px-1">
                        <span>Lowercase & hyphens only.</span>
                        {customSlug && customSlug.length >= 3 && (
                          <span className={cn("text-xs font-bold transition-colors", isCheckingSlug ? "text-muted-foreground" : slugAvailable ? "text-green-600" : "text-destructive")}>
                            {isCheckingSlug ? "Checking..." : slugAvailable ? "Available" : "Taken"}
                          </span>
                        )}
                      </FormDescription>
                    </FormItem>
                  )} />
                  <div className="space-y-3">
                    <FormLabel>Profile Photo</FormLabel>
                    {useUrlForPhoto ? (
                      <div className="flex gap-2">
                        <Input 
                          placeholder="https://image-url.com/photo.jpg" 
                          className="bg-secondary/50"
                          value={profilePhoto} 
                          onChange={(e) => form.setValue('profilePhoto', e.target.value)} 
                        />
                        <Button variant="ghost" size="icon" type="button" onClick={() => setUseUrlForPhoto(false)}><Upload size={18} /></Button>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-muted-foreground/20 rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/30 hover:border-indigo-500/30 transition-all"
                      >
                        {profilePhoto ? (
                          <div className="relative">
                            <img src={profilePhoto} className="w-20 h-20 rounded-full object-cover border-2 border-background shadow-md" alt="Preview" />
                            <button 
                              type="button" 
                              onClick={(e) => { e.stopPropagation(); form.setValue('profilePhoto', ''); }} 
                              className="absolute -top-1 -right-1 bg-destructive text-white rounded-full p-1 shadow-sm hover:scale-110 transition-transform"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="p-3 rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400"><Upload size={24} /></div>
                            <p className="text-sm font-medium">Click or drag to upload photo</p>
                          </>
                        )}
                        <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                        <Button type="button" variant="link" size="sm" onClick={(e) => { e.stopPropagation(); setUseUrlForPhoto(true); }} className="text-xs text-muted-foreground/60 hover:text-indigo-600">Or use image URL</Button>
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="fullName" render={({ field }) => (
                      <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input className="bg-secondary/50" placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="jobTitle" render={({ field }) => (
                      <FormItem><FormLabel>Job Title</FormLabel><FormControl><Input className="bg-secondary/50" placeholder="Product Lead" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="company" render={({ field }) => (
                    <FormItem><FormLabel>Company</FormLabel><FormControl><Input className="bg-secondary/50" placeholder="Acme Corp" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="bio" render={({ field }) => (
                    <FormItem><FormLabel>Bio (max 300 chars)</FormLabel><FormControl><Textarea className="h-24 bg-secondary/50 resize-none focus-visible:ring-indigo-500" placeholder="I help teams build..." {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <Button type="submit" size="lg" className="w-full gap-2 h-12 shadow-md hover:shadow-lg transition-all" disabled={isSubmitting || (!!customSlug && customSlug.length >= 3 && slugAvailable === false)}>
                    {isSubmitting ? "Publishing..." : "Publish MeetingMe Page"} <Send size={18} />
                  </Button>
                </form>
              </Form>
            )}
          </div>
          <div className="lg:sticky lg:top-12 no-print">
            <div className="space-y-4">
              <span className="text-2xs font-bold text-muted-foreground uppercase tracking-widest pl-1">Live Preview</span>
              <ProfileCard data={watchAll} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}