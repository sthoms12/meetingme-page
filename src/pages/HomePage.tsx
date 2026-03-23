import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import QRCode from 'qrcode';
import { 
  Copy, Check, ExternalLink, Sparkles, Send, Download, Mail, Upload, X, 
  Link as LinkIcon, Lock, ShieldCheck, HelpCircle, ChevronRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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
  password: z.string().min(4, 'Password must be at least 4 characters').optional().or(z.literal('')),
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
      fullName: '', jobTitle: '', company: '', bio: '', profilePhoto: '', 
      linkedinUrl: '', websiteUrl: '', videoUrl: '', customSlug: '', password: '',
    },
  });
  const watchAll = form.watch();
  const customSlug = watchAll.customSlug;
  const profilePhoto = watchAll.profilePhoto;
  useEffect(() => {
    if (prefixRef.current) setPrefixWidth(prefixRef.current.offsetWidth);
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
        form.setValue('profilePhoto', canvas.toDataURL('image/jpeg', 0.8));
      };
    };
    reader.readAsDataURL(file);
  };
  useEffect(() => {
    if (!customSlug || customSlug.length < 3) {
      setSlugAvailable(null);
      return;
    }
    setIsCheckingSlug(true);
    const handler = setTimeout(async () => {
      try {
        const res = await fetch(`/api/profiles/availability/${customSlug}`);
        const result = await res.json();
        setSlugAvailable(result.success ? result.data.available : null);
      } catch { setSlugAvailable(null); }
      finally { setIsCheckingSlug(false); }
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
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally { setIsSubmitting(false); }
  }, []);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12">
        <ThemeToggle />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-12">
            <header className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold dark:bg-indigo-950 dark:text-indigo-300">
                <Sparkles size={14} /> <span>Professional Network Tool</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground tracking-tight leading-tight">
                Introduce yourself <br />
                <span className="text-indigo-600 dark:text-indigo-400">beautifully</span>.
              </h1>
              <p className="text-muted-foreground text-lg max-w-md">
                Create a high-impact intro page to share with anyone before your next meeting. No login required.
              </p>
            </header>
            {publishedData ? (
              <div className="bg-card border border-border rounded-2xl p-8 shadow-soft space-y-6 animate-scale-in dark:bg-slate-900/60">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="flex-1 space-y-4 w-full text-center md:text-left">
                    <div className="inline-flex items-center justify-center size-12 rounded-full bg-green-50 text-green-600 dark:bg-green-950/30 mb-2">
                      <ShieldCheck size={24} />
                    </div>
                    <h3 className="text-xl font-bold">Your page is live!</h3>
                    <div className="flex items-center gap-2 p-3 bg-muted border rounded-lg">
                      <code className="flex-1 text-xs truncate">meetingme.page/{publishedData.slug}</code>
                      <Button size="sm" variant="ghost" type="button" onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/${publishedData.slug}`); setCopied(true); setTimeout(()=>setCopied(false), 2000); }}>
                        {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 gap-2 pt-2">
                      <Button asChild className="w-full h-11"><Link to={`/${publishedData.slug}`}>View Public Profile <ExternalLink size={16} className="ml-2" /></Link></Button>
                      <Button variant="outline" asChild className="w-full h-11"><Link to={`/${publishedData.slug}/edit`}>Manage & Settings</Link></Button>
                    </div>
                  </div>
                  <div className="shrink-0 p-2 bg-white rounded-2xl border shadow-sm">
                    <img src={qrCodeData} alt="QR" className="size-36" />
                  </div>
                </div>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-card/50 p-6 md:p-8 rounded-3xl border border-border shadow-sm">
                  <FormField control={form.control} name="customSlug" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-bold">Custom Handle</FormLabel>
                      <FormControl>
                        <div className="relative flex items-center group">
                          <span ref={prefixRef} className="absolute left-3 text-sm text-muted-foreground/60 select-none pointer-events-none">meetingme.page/</span>
                          <Input className="h-11 shadow-none focus-visible:ring-1 focus-visible:ring-indigo-500 transition-all bg-secondary/50 border-input" placeholder="jane-doe" style={{ paddingLeft: `${prefixWidth + 14}px` }} {...field} />
                        </div>
                      </FormControl>
                      <FormDescription className="flex justify-between items-center px-1 pt-1">
                        <span className="text-[10px]">Lowercase & hyphens only.</span>
                        {customSlug && customSlug.length >= 3 && (
                          <span className={cn("text-[10px] font-bold uppercase tracking-wider", isCheckingSlug ? "text-muted-foreground" : slugAvailable ? "text-green-600" : "text-destructive")}>
                            {isCheckingSlug ? "Checking..." : slugAvailable ? "Available" : "Taken"}
                          </span>
                        )}
                      </FormDescription>
                    </FormItem>
                  )} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="fullName" render={({ field }) => (
                      <FormItem><FormLabel className="text-sm font-bold">Full Name</FormLabel><FormControl><Input className="h-11 bg-secondary/30" placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="jobTitle" render={({ field }) => (
                      <FormItem><FormLabel className="text-sm font-bold">Job Title</FormLabel><FormControl><Input className="h-11 bg-secondary/30" placeholder="Product Lead" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="company" render={({ field }) => (
                    <FormItem><FormLabel className="text-sm font-bold">Company</FormLabel><FormControl><Input className="h-11 bg-secondary/30" placeholder="Acme Corp" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="bio" render={({ field }) => (
                    <FormItem><FormLabel className="text-sm font-bold">Bio (300 characters)</FormLabel><FormControl><Textarea className="h-28 bg-secondary/30 resize-none" placeholder="I help teams build products that users love..." {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <div className="pt-4 border-t border-border">
                    <div className="flex items-center gap-2 mb-4">
                      <Lock size={16} className="text-muted-foreground" />
                      <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Privacy (Optional)</h4>
                    </div>
                    <FormField control={form.control} name="password" render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input type="password" placeholder="Set a page password" className="h-11 bg-secondary/30" {...field} />
                        </FormControl>
                        <FormDescription className="text-[10px]">Visitors will need this password to view your full profile.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <Button type="submit" size="lg" className="w-full gap-2 h-12 shadow-lg shadow-indigo-500/20" disabled={isSubmitting || (!!customSlug && customSlug.length >= 3 && slugAvailable === false)}>
                    {isSubmitting ? "Publishing..." : "Create My Page"} <Send size={18} />
                  </Button>
                </form>
              </Form>
            )}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-foreground font-bold">
                <HelpCircle size={20} className="text-indigo-500" />
                <h3>Pro Tips & FAQ</h3>
              </div>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="edit" className="border-b-0 bg-secondary/30 rounded-xl px-4 mb-2">
                  <AccordionTrigger className="hover:no-underline text-sm font-semibold">How do I edit my page later?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
                    MeetingMe uses "Magic Links." When you create a page, we save a secure token to your browser's local storage. Simply visit your URL on the same device and look for the "Manage" button, or go to <code className="text-xs bg-muted p-0.5 rounded">/your-slug/edit</code>.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="privacy" className="border-b-0 bg-secondary/30 rounded-xl px-4 mb-2">
                  <AccordionTrigger className="hover:no-underline text-sm font-semibold">Is my data secure?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
                    Yes. If you set a password, we hash it using SHA-256 before storing it on Cloudflare's edge network. We never store your raw password. Public visitors only see your name until they enter the correct password.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="sharing" className="border-b-0 bg-secondary/30 rounded-xl px-4 mb-2">
                  <AccordionTrigger className="hover:no-underline text-sm font-semibold">Best ways to share?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
                    We recommend adding your link to your calendar invite description or email signature. The QR code is perfect for the first slide of a presentation or as your phone wallpaper at networking events.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
          <div className="lg:sticky lg:top-12 space-y-4">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Live Preview</span>
              <div className="flex gap-1">
                <div className="size-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] text-muted-foreground font-medium">Real-time</span>
              </div>
            </div>
            <ProfileCard data={watchAll} />
          </div>
        </div>
      </div>
    </div>
  );
}