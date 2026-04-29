import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Save, ArrowLeft, Loader2, ShieldAlert, Plus, Trash2, LayoutGrid, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
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
        toast.success('Settings updated');
        queryClient.invalidateQueries({ queryKey: ['profile', slug] });
        navigate(`/${slug}`);
      } else { toast.error(result.error || 'Update failed'); }
    } catch { toast.error('Save failed'); }
    finally { setIsUpdating(false); }
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
    <div className="max-w-md mx-auto py-32 text-center space-y-8 px-6">
      <div className="size-20 rounded-3xl bg-destructive/10 text-destructive flex items-center justify-center mx-auto"><ShieldAlert size={40} /></div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Access Restricted</h2>
        <p className="text-muted-foreground">The private edit token is required to manage this page.</p>
      </div>
      <Button asChild size="lg" className="rounded-2xl h-14 w-full"><Link to="/">Back to Home</Link></Button>
    </div>
  );
  if (isLoading) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6">
      <Loader2 className="animate-spin text-primary size-10" />
      <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Initializing Dashboard...</p>
    </div>
  );
  const watchAll = form.watch();
  const currentVariant = watchAll.variants?.[activeVariantIndex];
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-12 md:py-20">
        <ThemeToggle />
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-8">
          <div className="space-y-4">
            <Link to={`/${slug}`} className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2 hover:text-primary transition-colors">
              <ArrowLeft size={14} /> Back to Live Page
            </Link>
            <h1 className="text-4xl font-bold tracking-tight">Introduction Dashboard</h1>
          </div>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={isUpdating} size="lg" className="h-14 px-10 text-lg font-bold rounded-2xl shadow-lg shadow-primary/20 active:scale-95 transition-all">
            {isUpdating ? <Loader2 className="size-5 animate-spin mr-3" /> : <Save size={20} className="mr-3" />}
            Save All Changes
          </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-12">
            <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar -mx-1 px-1">
              {watchAll.variants?.map((v, i) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setActiveVariantIndex(i)}
                  className={cn(
                    "px-6 py-4 rounded-2xl border-2 text-sm font-bold transition-all shrink-0 flex items-center gap-4 relative group",
                    activeVariantIndex === i
                      ? "bg-slate-900 text-white border-slate-900 shadow-lg dark:bg-white dark:text-slate-950 dark:border-white"
                      : "bg-card text-muted-foreground border-slate-100 hover:border-slate-300 dark:border-slate-800"
                  )}
                >
                  <LayoutGrid size={16} />
                  {v.name}
                  <span className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full font-black",
                    activeVariantIndex === i ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                  )}>
                    {v.views} views
                  </span>
                </button>
              ))}
              {watchAll.variants?.length < 3 && (
                <Button variant="outline" size="icon" type="button" onClick={addVariant} className="rounded-2xl border-2 border-dashed h-14 w-14 shrink-0 hover:bg-primary/5 hover:border-primary/40">
                  <Plus size={24} />
                </Button>
              )}
            </div>
            <Form {...form}>
              <div className="space-y-12">
                <div className="bg-card p-8 md:p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-soft space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-400">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-primary/10 text-primary"><LayoutGrid size={18} /></div>
                      <h3 className="text-sm font-black uppercase tracking-widest">Version: {currentVariant?.name}</h3>
                    </div>
                    {watchAll.variants.length > 1 && (
                      <Button variant="ghost" size="sm" type="button" onClick={() => {
                        const filtered = watchAll.variants.filter((_, i) => i !== activeVariantIndex);
                        form.setValue('variants', filtered);
                        setActiveVariantIndex(0);
                      }} className="text-destructive font-black text-[10px] uppercase tracking-widest hover:bg-destructive/5">
                        <Trash2 size={16} className="mr-2" /> Delete
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name={`variants.${activeVariantIndex}.name`} render={({ field }) => (
                      <FormItem><FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Display Name</FormLabel><FormControl><Input className="bg-secondary/40 h-14 rounded-2xl border-none text-base" {...field} /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name={`variants.${activeVariantIndex}.variantSlug`} render={({ field }) => (
                      <FormItem><FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Slug Path</FormLabel><FormControl><Input className="bg-secondary/40 h-14 rounded-2xl border-none text-base" {...field} /></FormControl></FormItem>
                    )} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name={`variants.${activeVariantIndex}.focus`} render={({ field }) => (
                      <FormItem><FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Primary Focus</FormLabel><FormControl><Input className="bg-secondary/40 h-14 rounded-2xl border-none text-base" {...field} /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name={`variants.${activeVariantIndex}.topics`} render={({ field }) => (
                      <FormItem><FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Skills / Topics</FormLabel><FormControl><Input className="bg-secondary/40 h-14 rounded-2xl border-none text-base" {...field} /></FormControl></FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name={`variants.${activeVariantIndex}.meetingNote`} render={({ field }) => (
                    <FormItem><FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Before We Meet Note</FormLabel><FormControl><Textarea className="min-h-[120px] bg-secondary/40 rounded-2xl border-none resize-none text-base p-4" {...field} /></FormControl></FormItem>
                  )} />
                  <FormField control={form.control} name={`variants.${activeVariantIndex}.bio`} render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Custom Biography</FormLabel>
                      <FormControl><Textarea className="min-h-[140px] bg-secondary/40 rounded-2xl border-none resize-none text-base p-4" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <div className="space-y-10 pt-10 border-t border-dashed">
                  <div className="relative flex justify-center">
                    <span className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200 dark:border-slate-800"></span></span>
                    <span className="relative bg-background px-6 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/50">Global Identity</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="fullName" render={({ field }) => (
                      <FormItem><FormLabel className="text-sm font-bold">Full Name</FormLabel><FormControl><Input className="bg-secondary/40 h-14 rounded-2xl border-none text-base" {...field} /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name="jobTitle" render={({ field }) => (
                      <FormItem><FormLabel className="text-sm font-bold">Professional Title</FormLabel><FormControl><Input className="bg-secondary/40 h-14 rounded-2xl border-none text-base" {...field} /></FormControl></FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="company" render={({ field }) => (
                    <FormItem><FormLabel className="text-sm font-bold">Current Company</FormLabel><FormControl><Input className="bg-secondary/40 h-14 rounded-2xl border-none text-base" {...field} /></FormControl></FormItem>
                  )} />
                </div>
              </div>
            </Form>
          </div>
          <div className="lg:sticky lg:top-12 space-y-8">
            <div className="flex items-center justify-between px-2">
              <span className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.3em]">Audience Preview: {currentVariant?.name}</span>
              <a href={`/${slug}${currentVariant?.variantSlug === 'intro' ? '' : '/' + currentVariant?.variantSlug}`} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-primary flex items-center gap-2 hover:underline group">
                <ExternalLink size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                Live View
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
              className="scale-[1.02] origin-top"
            />
            <CopyBlurbGroup
              fullName={watchAll.fullName}
              jobTitle={watchAll.jobTitle}
              company={watchAll.company}
              url={`${window.location.origin}/${slug}${currentVariant?.variantSlug === 'intro' ? '' : '/' + currentVariant?.variantSlug}`}
              className="bg-card p-8 rounded-[2.5rem] border border-dashed border-slate-200"
            />
          </div>
        </div>
      </div>
    </div>
  );
}