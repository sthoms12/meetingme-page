import React, { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Copy, Check, ExternalLink, Sparkles, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { ProfileCard } from '@/components/ProfileCard';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Link } from 'react-router-dom';
const formSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  jobTitle: z.string().min(2, 'Title is required'),
  company: z.string().min(2, 'Company is required'),
  bio: z.string().min(10, 'Bio must be at least 10 characters').max(300, 'Keep it punchy (max 300 chars)'),
  profilePhoto: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  linkedinUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  websiteUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  videoUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});
type FormValues = z.infer<typeof formSchema>;
export function HomePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [publishedData, setPublishedData] = useState<{ slug: string; editToken: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      jobTitle: '',
      company: '',
      bio: '',
      profilePhoto: '',
      linkedinUrl: '',
      websiteUrl: '',
      videoUrl: '',
    },
  });
  const watchAll = form.watch();
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
        toast.success('Your MeetingMe page is live!');
      } else {
        toast.error('Failed to publish: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Submission error:', error);
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
    toast.success('Link copied to clipboard');
  }, [publishedData]);
  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [copied]);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12">
        <ThemeToggle />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
            <header className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold dark:bg-indigo-950 dark:text-indigo-300">
                <Sparkles size={14} />
                <span>Beta Access</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground tracking-tight">
                Share who you are <br />
                <span className="text-indigo-600 dark:text-indigo-400">before</span> the meeting.
              </h1>
              <p className="text-lg text-muted-foreground max-w-md">
                Create a minimal, professional intro page in seconds. No logins, no clutter.
              </p>
            </header>
            {publishedData ? (
              <div className="bg-card border border-border rounded-2xl p-8 shadow-soft space-y-6 animate-scale-in dark:bg-slate-900/60">
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">It's ready!</h3>
                  <p className="text-muted-foreground text-sm">
                    Your public intro page is live. Share this link with your meeting participants.
                  </p>
                </div>
                <div className="flex items-center gap-2 p-3 bg-muted border border-border rounded-lg group">
                  <code className="flex-1 text-sm text-indigo-600 dark:text-indigo-400 truncate">
                    {window.location.origin}/{publishedData.slug}
                  </code>
                  <Button size="sm" variant="ghost" onClick={copyLink} className="hover:bg-background">
                    {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
                  <Button asChild className="w-full gap-2">
                    <Link to={`/${publishedData.slug}`}>
                      View Public Page <ExternalLink size={16} />
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full">
                    <Link to={`/${publishedData.slug}/edit`}>Edit Page</Link>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground text-center italic">
                  Note: The edit link is saved in your browser. Bookmark it to keep access!
                </p>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground">Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="profilePhoto"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground">Avatar URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://..." {...field} />
                          </FormControl>
                          <FormDescription className="text-2xs">Image URL (Square preferred)</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="jobTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground">Job Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Product Designer" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground">Company</FormLabel>
                          <FormControl>
                            <Input placeholder="Acme Inc." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">Bio (max 300 chars)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Briefly share your role, focus, or what you're excited about for this meeting..."
                            className="resize-none h-24"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-foreground">Optional Links</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="linkedinUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input placeholder="LinkedIn URL" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="websiteUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input placeholder="Website/Portfolio" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="videoUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Intro Video URL (Loom, YouTube, etc.)" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button type="submit" size="lg" className="w-full gap-2 h-12 text-base shadow-indigo-200 dark:shadow-indigo-900/20 shadow-lg" disabled={isSubmitting}>
                    {isSubmitting ? "Publishing..." : "Publish Page"} <Send size={18} />
                  </Button>
                </form>
              </Form>
            )}
          </div>
          <div className="lg:sticky lg:top-12">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Live Preview</span>
                <span className="text-xs text-muted-foreground/60">Updated in real-time</span>
              </div>
              <ProfileCard data={watchAll} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}