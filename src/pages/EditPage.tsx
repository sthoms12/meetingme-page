import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  Save, ArrowLeft, Loader2, ShieldAlert, Plus, Trash2, LayoutGrid, ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ProfileCard } from '@/components/ProfileCard';
import { ThemeToggle } from '@/components/ThemeToggle';
import { CopyBlurbGroup } from '@/components/CopyBlurbGroup';
import { nanoid } from 'nanoid';
import { cn } from '@/lib/utils';
import type { Profile, ApiResponse } from '@shared/types';
const formSchema = z.object({
  fullName: z.string().min(2),
  jobTitle: z.string().min(2),
  company: z.string().min(2),
  profilePhoto: z.string().optional().or(z.literal('')),
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
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeVariantIndex, setActiveVariantIndex] = useState(0);
  const editToken = useMemo(() => slug ? localStorage.getItem(`profile_${slug}_token`) : null, [slug]);
  const { data: profile, isLoading } = useQuery<Profile>({
    queryKey: ['profile-manage', slug, editToken],
    queryFn: async () => {
      const res = await fetch(`/api/profiles/${slug}?editToken=${editToken}`);
      const json = await res.json() as ApiResponse<Profile>;
      if (!json.success || !json.data) throw new Error(json.error || 'Failed to fetch profile');
      return json.data;
    },
    enabled: !!slug && !!editToken,
  });
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '', jobTitle: '', company: '', profilePhoto: '', variants: [], primaryVariantId: ''
    }
  });
  useEffect(() => {
    if (profile) {
      form.reset({
        fullName: profile.fullName,
        jobTitle: profile.jobTitle,
        company: profile.company,
        profilePhoto: profile.profilePhoto || '',
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
  const onSubmit = async (values: FormValues) => {
    if (!editToken || !slug) return;
    setIsUpdating(true);
    try {
      const payload = {
        ...values,
        editToken,
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
        toast.success('Settings updated successfully');
        queryClient.invalidateQueries({ queryKey: ['profile', slug] });
        navigate(`/${slug}`);
      } else {
        toast.error(result.error || 'Update failed');
      }
    } catch {
      toast.error('Save failed');
    } finally {
      setIsUpdating(false);
    }
  };
  const addVariant = () => {
    const current = form.getValues('variants');
    if (current.length >= 3) return;
    const newVariant = {
      id: nanoid(),
      name: 'New Audience',
      variantSlug: `ver-${current.length + 1}`,
      bio: 'Brief intro for this group...',
      focus: '',
      topics: '',
      meetingNote: '',
      views: 0
    };
    form.setValue('variants', [...current, newVariant]);
    setActiveVariantIndex(current.length);
  };
  if (!editToken) return (
    <div className="max-w-md mx-auto py-24 text-center space-y-4 px-6">
      <ShieldAlert className="size-12 text-destructive mx-auto" />
      <h2 className="text-xl font-bold">Token Missing</h2>
      <p className="text-muted-foreground">This private dashboard is restricted to the creator's device.</p>
      <Button asChild><Link to="/">Go Home</Link></Button>
    </div>
  );
  if (isLoading) return (
    <div className="max-w-7xl mx-auto px-4 py-24 flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-primary size-8" />
      <p className="text-sm font-medium text-muted-foreground">Loading your dashboard...</p>
    </div>
  );
  const watchAll = form.watch();
  const currentVariant = watchAll.variants?.[activeVariantIndex];
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12">
        <ThemeToggle />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4">
          <div className="space-y-1">
            <Link to={`/${slug}`} className="text-xs font-bold text-muted-foreground flex items-center gap-1 hover:text-indigo-600 transition-colors uppercase tracking-widest">
              <ArrowLeft size={14} /> Back to Live Page
            </Link>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Manage Intro Versions</h1>
          </div>
          <Button 
            onClick={form.handleSubmit(onSubmit)} 
            disabled={isUpdating} 
            className="gap-2 font-bold px-8 h-11 transition-all shadow-indigo-500/10 active:scale-95"
            aria-label="Save all changes to profile"
          >
            {isUpdating ? <Loader2 className="size-4 animate-spin" /> : <Save size={18} />}
            <span className="min-w-[4rem] text-center">
              {isUpdating ? "Saving..." : "Save All"}
            </span>
          </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
            <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar -mx-1 px-1">
              {watchAll.variants?.map((v, i) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setActiveVariantIndex(i)}
                  className={cn(
                    "px-5 py-3.5 rounded-2xl border text-sm font-bold transition-all shrink-0 flex items-center gap-3 relative group",
                    activeVariantIndex === i 
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/20 z-10" 
                      : "bg-card text-muted-foreground border-border hover:border-indigo-300 hover:text-indigo-600 hover:shadow-md dark:hover:bg-indigo-950/20"
                  )}
                >
                  <LayoutGrid size={15} className={activeVariantIndex === i ? "text-white" : "text-muted-foreground/50 group-hover:text-indigo-500"} />
                  {v.name}
                  <span className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded-full font-black",
                    activeVariantIndex === i 
                      ? "bg-white/20 text-white" 
                      : "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
                  )}>
                    {v.views}
                  </span>
                </button>
              ))}
              {watchAll.variants?.length < 3 && (
                <Button 
                  variant="outline" 
                  size="icon" 
                  type="button" 
                  onClick={addVariant} 
                  className="rounded-2xl border-dashed h-[50px] w-[50px] shrink-0 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 dark:hover:bg-indigo-950/20 transition-all active:scale-95"
                  title="Add new audience version"
                >
                  <Plus size={20} />
                </Button>
              )}
            </div>
            <Form {...form}>
              <div className="space-y-6">
                <div className="bg-card p-6 md:p-8 rounded-3xl border shadow-sm space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex items-center justify-between border-b border-dashed pb-4">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40">
                        <LayoutGrid size={14} />
                      </div>
                      <h3 className="text-xs font-black uppercase tracking-widest text-indigo-600">Variant Context</h3>
                    </div>
                    {watchAll.variants.length > 1 && (
                      <Button variant="ghost" size="sm" type="button" onClick={() => {
                        const filtered = watchAll.variants.filter((_, i) => i !== activeVariantIndex);
                        form.setValue('variants', filtered);
                        setActiveVariantIndex(0);
                      }} className="h-8 text-destructive text-[10px] uppercase font-black hover:bg-destructive/10">
                        <Trash2 size={14} className="mr-1.5" /> Remove Version
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FormField control={form.control} name={`variants.${activeVariantIndex}.name`} render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Version Display Name</FormLabel>
                        <FormControl><Input className="bg-secondary/40 h-11 border-none focus-visible:ring-1" placeholder="e.g. For Recruiters" {...field} /></FormControl>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name={`variants.${activeVariantIndex}.variantSlug`} render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">URL Sub-Path</FormLabel>
                        <FormControl><Input className="bg-secondary/40 h-11 border-none focus-visible:ring-1" placeholder="e.g. recruiter" {...field} /></FormControl>
                      </FormItem>
                    )} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FormField control={form.control} name={`variants.${activeVariantIndex}.focus`} render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Meeting Focus</FormLabel>
                        <FormControl><Input className="bg-secondary/40 h-11 border-none focus-visible:ring-1" placeholder="Scale, Product, etc." {...field} /></FormControl>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name={`variants.${activeVariantIndex}.topics`} render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Topics (CSV)</FormLabel>
                        <FormControl><Input className="bg-secondary/40 h-11 border-none focus-visible:ring-1" placeholder="React, Node, GCP" {...field} /></FormControl>
                      </FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name={`variants.${activeVariantIndex}.meetingNote`} render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Pre-Meeting Note</FormLabel>
                      <FormControl><Textarea className="min-h-[100px] bg-secondary/40 border-none resize-none text-sm focus-visible:ring-1" placeholder="Add custom context for this specific audience..." {...field} /></FormControl>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name={`variants.${activeVariantIndex}.bio`} render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Custom Bio</FormLabel>
                      <FormControl><Textarea className="min-h-[120px] bg-secondary/40 border-none resize-none text-sm focus-visible:ring-1" placeholder="Write a targeted bio for this meeting type..." {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <div className="space-y-6 pt-8 border-t border-dashed">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Global Settings</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FormField control={form.control} name="fullName" render={({ field }) => (
                      <FormItem><FormLabel className="text-sm font-bold text-foreground">Full Name</FormLabel><FormControl><Input className="bg-secondary/40 h-11 border-none focus-visible:ring-1" {...field} /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name="jobTitle" render={({ field }) => (
                      <FormItem><FormLabel className="text-sm font-bold text-foreground">Role / Title</FormLabel><FormControl><Input className="bg-secondary/40 h-11 border-none focus-visible:ring-1" {...field} /></FormControl></FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="company" render={({ field }) => (
                    <FormItem><FormLabel className="text-sm font-bold text-foreground">Company</FormLabel><FormControl><Input className="bg-secondary/40 h-11 border-none focus-visible:ring-1" {...field} /></FormControl></FormItem>
                  )} />
                </div>
              </div>
            </Form>
          </div>
          <div className="lg:sticky lg:top-12 space-y-6">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Live Preview: {currentVariant?.name}</span>
              <a 
                href={`/${slug}${currentVariant?.variantSlug === 'intro' ? '' : '/' + currentVariant?.variantSlug}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[10px] font-bold text-indigo-600 flex items-center gap-1.5 hover:underline transition-all group"
              >
                <ExternalLink size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" /> 
                Open Live Page
              </a>
            </div>
            <ProfileCard 
              data={{ 
                ...watchAll, 
                bio: currentVariant?.bio, 
                focus: currentVariant?.focus, 
                topics: currentVariant?.topics, 
                meetingNote: currentVariant?.meetingNote 
              }} 
            />
            <CopyBlurbGroup
              fullName={watchAll.fullName}
              jobTitle={watchAll.jobTitle}
              company={watchAll.company}
              url={`${window.location.origin}/${slug}${currentVariant?.variantSlug === 'intro' ? '' : '/' + currentVariant?.variantSlug}`}
              className="bg-card/50 p-6 rounded-3xl border shadow-sm border-dashed"
            />
          </div>
        </div>
      </div>
    </div>
  );
}