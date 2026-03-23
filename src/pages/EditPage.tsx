import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Save, ArrowLeft, Loader2, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Skeleton } from '@/components/ui/skeleton';
import { ProfileCard } from '@/components/ProfileCard';
import { ThemeToggle } from '@/components/ThemeToggle';
const formSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  jobTitle: z.string().min(2, 'Title is required'),
  company: z.string().min(2, 'Company is required'),
  bio: z.string().min(10, 'Bio must be at least 10 characters').max(300, 'Keep it punchy'),
  profilePhoto: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  linkedinUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  websiteUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  videoUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});
type FormValues = z.infer<typeof formSchema>;
export function EditPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);
  // Use useMemo to ensure editToken is always synced with the current slug
  const editToken = useMemo(() => {
    if (!slug) return null;
    return localStorage.getItem(`profile_${slug}_token`);
  }, [slug]);
  const { data: initialData, isLoading, error } = useQuery({
    queryKey: ['profile-edit', slug],
    queryFn: async () => {
      const response = await fetch(`/api/profiles/${slug}`);
      if (!response.ok) throw new Error('Could not load profile');
      const result = await response.json();
      return result.data;
    },
    enabled: !!slug,
  });
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '', jobTitle: '', company: '', bio: '', profilePhoto: '', linkedinUrl: '', websiteUrl: '', videoUrl: ''
    },
  });
  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);
  const onSubmit = useCallback(async (values: FormValues) => {
    if (!editToken || !slug) {
      toast.error("Editing session expired or invalid. Cannot update.");
      return;
    }
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/profiles/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, editToken }),
      });
      const result = await response.json();
      if (result.success) {
        await queryClient.invalidateQueries({ queryKey: ['profile', slug] });
        toast.success('Profile updated successfully!');
        navigate(`/${slug}`);
      } else {
        toast.error('Update failed: ' + (result.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Update error:', err);
      toast.error('Something went wrong.');
    } finally {
      setIsUpdating(false);
    }
  }, [editToken, slug, navigate, queryClient]);
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <Skeleton className="h-10 w-48" />
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
          <div className="hidden lg:block">
            <Skeleton className="h-[500px] w-full max-w-md mx-auto rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-xl font-bold text-destructive">Error loading profile.</h2>
        <Button asChild variant="outline"><Link to="/">Go Home</Link></Button>
      </div>
    );
  }
  if (!editToken) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center max-w-7xl mx-auto px-4 text-center space-y-6">
        <div className="bg-muted p-4 rounded-full">
          <ShieldAlert size={48} className="text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Edit Access Denied</h2>
          <p className="text-muted-foreground max-w-sm">
            The secret key to edit this profile wasn't found in your browser's storage.
          </p>
        </div>
        <Button asChild size="lg"><Link to="/">Create a New Page</Link></Button>
      </div>
    );
  }
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12">
        <ThemeToggle />
        <Link to={`/${slug}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to Public Page
        </Link>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-foreground tracking-tight">Edit Your Page</h1>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="fullName" render={({ field }) => (
                    <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="profilePhoto" render={({ field }) => (
                    <FormItem><FormLabel>Avatar URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="jobTitle" render={({ field }) => (
                    <FormItem><FormLabel>Job Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="company" render={({ field }) => (
                    <FormItem><FormLabel>Company</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="bio" render={({ field }) => (
                  <FormItem><FormLabel>Bio (max 300 chars)</FormLabel><FormControl><Textarea className="h-24 resize-none" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-foreground">Links</h3>
                  <div className="space-y-4">
                    <FormField control={form.control} name="linkedinUrl" render={({ field }) => (
                      <FormItem><FormControl><Input placeholder="LinkedIn URL" {...field} /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name="websiteUrl" render={({ field }) => (
                      <FormItem><FormControl><Input placeholder="Website/Portfolio URL" {...field} /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name="videoUrl" render={({ field }) => (
                      <FormItem><FormControl><Input placeholder="Video Intro URL (Loom, YouTube)" {...field} /></FormControl></FormItem>
                    )} />
                  </div>
                </div>
                <Button type="submit" size="lg" className="w-full gap-2 h-12" disabled={isUpdating}>
                  {isUpdating ? <Loader2 className="size-4 animate-spin" /> : <Save size={18} />}
                  {isUpdating ? "Saving Changes..." : "Save Changes"}
                </Button>
              </form>
            </Form>
          </div>
          <div className="lg:sticky lg:top-12">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Live Preview</span>
                <span className="text-xs text-green-500 font-medium animate-pulse">Unsaved Changes</span>
              </div>
              <ProfileCard data={form.watch()} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}