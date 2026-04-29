import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import QRCode from 'qrcode';
import {
  Copy, Check, ExternalLink, Sparkles, Send, Lock, ShieldCheck, HelpCircle, LayoutGrid
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProfileCard } from '@/components/ProfileCard';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
const formSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  jobTitle: z.string().min(2, 'Title is required'),
  company: z.string().min(2, 'Company is required'),
  bio: z.string().min(10, 'Bio must be 10+ chars').max(300, 'Max 300 chars'),
  profilePhoto: z.string().optional().or(z.literal('')),
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
      fullName: '', jobTitle: '', company: '', bio: '', profilePhoto: '',
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
      <div className="py-8 md:py-10 lg:py-12">
        <ThemeToggle />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-10">
            <header className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold dark:bg-indigo-950 dark:text-indigo-300">
                <Sparkles size={14} /> <span>Professional Variants v2.0</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight">Introduce yourself <span className="text-indigo-600">beautifully</span>.</h1>
              <p className="text-muted-foreground text-lg">Create tailored intros for clients, investors, or hiring managers.</p>
            </header>
            {publishedData ? (
              <div className="bg-card border rounded-2xl p-8 shadow-soft space-y-6 animate-scale-in">
                <div className="flex flex-col md:flex-row gap-8 items-center text-center md:text-left">
                  <div className="flex-1 space-y-4">
                    <div className="size-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto md:mx-0"><ShieldCheck size={24} /></div>
                    <h3 className="text-xl font-bold">You are live!</h3>
                    <code className="block p-3 bg-muted rounded-lg text-xs">meetingme.page/{publishedData.slug}</code>
                    <div className="grid gap-2">
                      <Button asChild><Link to={`/${publishedData.slug}`}>View Public Profile</Link></Button>
                      <Button variant="outline" asChild><Link to={`/${publishedData.slug}/edit`}>Manage Versions</Link></Button>
                    </div>
                  </div>
                  <img src={qrCodeData} alt="QR" className="size-32 bg-white p-2 rounded-xl border" />
                </div>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-card/50 p-6 md:p-8 rounded-3xl border shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="customSlug" render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">URL Handle</FormLabel>
                        <FormControl><Input className="h-11" placeholder="jane-doe" {...field} /></FormControl>
                        {customSlug && <FormDescription className={cn("text-[10px] font-bold", slugAvailable ? "text-green-600" : "text-destructive")}>{isCheckingSlug ? "Checking..." : slugAvailable ? "Available" : "Taken"}</FormDescription>}
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="fullName" render={({ field }) => (
                      <FormItem><FormLabel className="text-sm font-bold">Full Name</FormLabel><FormControl><Input className="h-11" {...field} /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name="jobTitle" render={({ field }) => (
                      <FormItem><FormLabel className="text-sm font-bold">Job Title</FormLabel><FormControl><Input className="h-11" {...field} /></FormControl></FormItem>
                    )} />
                  </div>
                  <div className="p-4 bg-secondary/30 rounded-2xl border border-dashed border-indigo-500/20 space-y-4">
                    <div className="flex items-center gap-2 text-indigo-600"><LayoutGrid size={16} /><span className="text-xs font-bold uppercase tracking-widest">Version: {watchAll.variantName}</span></div>
                    <FormField control={form.control} name="variantName" render={({ field }) => (
                      <FormItem>
                        <Select onValueChange={(val) => { field.onChange(val); form.setValue('variantSlug', val.toLowerCase().replace(/\s+/g, '-')) }} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select purpose" /></SelectTrigger></FormControl>
                          <SelectContent><SelectItem value="Default">Default Intro</SelectItem><SelectItem value="Client Meeting">Client Facing</SelectItem><SelectItem value="Interview">Job Interview</SelectItem><SelectItem value="Investor">Investor Pitch</SelectItem></SelectContent>
                        </Select>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="bio" render={({ field }) => (
                      <FormItem><FormControl><Textarea className="h-24 resize-none bg-background" placeholder="Write an intro specific to this version..." {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  <Button type="submit" size="lg" className="w-full h-12 shadow-indigo-500/10" disabled={isSubmitting || slugAvailable === false}>
                    {isSubmitting ? "Publishing..." : "Publish My Page"} <Send size={18} className="ml-2" />
                  </Button>
                </form>
              </Form>
            )}
          </div>
          <div className="lg:sticky lg:top-12">
            <div className="flex items-center justify-between px-1 mb-4">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Live Preview</span>
              <div className="flex gap-1"><div className="size-1.5 rounded-full bg-green-500 animate-pulse" /><span className="text-[10px] text-muted-foreground font-medium">Active: {watchAll.variantName}</span></div>
            </div>
            <ProfileCard data={watchAll} />
          </div>
        </div>
      </div>
    </div>
  );
}