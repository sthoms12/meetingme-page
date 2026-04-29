import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  Save, ArrowLeft, Loader2, ShieldAlert, Copy, ExternalLink, Plus, Trash2, LayoutGrid, Target, Hash
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
import type { ProfileVariant, Profile, ApiResponse } from '@shared/types';
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
    topics: z.string().optional().or(z.literal('')), // String for input
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
      // Map back topics from string to array for storage
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
      views: 0
    };
    form.setValue('variants', [...current, newVariant]);
    setActiveVariantIndex(current.length);
  };
  if (!editToken) return (
    <div className="max-w-lg mx-auto py-24 text-center space-y-4">
      <ShieldAlert className="size-12 text-destructive mx-auto" />
      <h2 className="text-xl font-bold">Token Missing</h2>
      <p className="text-muted-foreground">Private dashboard restricted to the creator device.</p>
      <Button asChild><Link to="/">Go Home</Link></Button>
    </div>
  );
  if (isLoading) return <div className="max-w-4xl mx-auto py-24 flex justify-center"><Loader2 className="animate-spin text-primary" /></div>;
  const watchAll = form.watch();
  const currentVariant = watchAll.variants?.[activeVariantIndex];
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <ThemeToggle />
      <div className="flex items-center justify-between mb-10">
        <div className="space-y-1">
          <Link to={`/${slug}`} className="text-xs font-bold text-muted-foreground flex items-center gap-1 hover:text-indigo-600 transition-colors">
            <ArrowLeft size={14} /> PUBLIC VIEW
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        </div>
        <Button onClick={form.handleSubmit(onSubmit)} disabled={isUpdating} className="gap-2 font-bold px-6">
          {isUpdating ? <Loader2 className="size-4 animate-spin" /> : <Save size={18} />} Save All
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div className="space-y-8">
          <div className="flex items-center gap-4 overflow-x-auto pb-2 no-scrollbar">
            {watchAll.variants?.map((v, i) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setActiveVariantIndex(i)}
                className={cn(
                  "px-4 py-3 rounded-xl border text-sm font-bold transition-all shrink-0 flex items-center gap-2",
                  activeVariantIndex === i ? "bg-indigo-600 text-white border-indigo-600 shadow-lg" : "bg-card hover:border-indigo-200"
                )}
              >
                <LayoutGrid size={14} /> {v.name}
                <span className="text-[10px] opacity-60">({v.views})</span>
              </button>
            ))}
            {watchAll.variants?.length < 3 && (
              <Button variant="ghost" size="icon" type="button" onClick={addVariant} className="rounded-xl border border-dashed h-[46px] w-[46px]">
                <Plus size={18} />
              </Button>
            )}
          </div>
          <Form {...form}>
            <div className="space-y-6">
              <div className="bg-card p-6 rounded-2xl border space-y-5">
                <div className="flex items-center justify-between border-b pb-4">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.1em] text-indigo-600">Skim Header & Bio</h3>
                  {watchAll.variants.length > 1 && (
                    <Button variant="ghost" size="sm" type="button" onClick={() => {
                      const filtered = watchAll.variants.filter((_, i) => i !== activeVariantIndex);
                      form.setValue('variants', filtered);
                      setActiveVariantIndex(0);
                    }} className="h-8 text-destructive text-[10px] uppercase font-black">
                      <Trash2 size={12} className="mr-1" /> Remove
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`variants.${activeVariantIndex}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground">Version Name</FormLabel>
                        <FormControl><Input className="bg-secondary/30 h-10" {...field} /></FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`variants.${activeVariantIndex}.variantSlug`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground">Custom Path</FormLabel>
                        <FormControl><Input className="bg-secondary/30 h-10" {...field} /></FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`variants.${activeVariantIndex}.focus`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground">Main Focus</FormLabel>
                        <FormControl><Input className="bg-secondary/30 h-10" placeholder="e.g. Sales growth" {...field} /></FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`variants.${activeVariantIndex}.topics`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground">Topics (Comma separated)</FormLabel>
                        <FormControl><Input className="bg-secondary/30 h-10" placeholder="e.g. SaaS, Fintech" {...field} /></FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name={`variants.${activeVariantIndex}.bio`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground">Variant Specific Bio</FormLabel>
                      <FormControl><Textarea className="h-32 bg-secondary/30 resize-none text-sm" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-4 pt-6 border-t">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Shared Identity</h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="fullName" render={({ field }) => (
                    <FormItem><FormLabel className="text-sm font-bold">Full Name</FormLabel><FormControl><Input className="bg-secondary/30 h-10" {...field} /></FormControl></FormItem>
                  )} />
                  <FormField control={form.control} name="jobTitle" render={({ field }) => (
                    <FormItem><FormLabel className="text-sm font-bold">Role Title</FormLabel><FormControl><Input className="bg-secondary/30 h-10" {...field} /></FormControl></FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="company" render={({ field }) => (
                  <FormItem><FormLabel className="text-sm font-bold">Company</FormLabel><FormControl><Input className="bg-secondary/30 h-10" {...field} /></FormControl></FormItem>
                )} />
              </div>
            </div>
          </Form>
        </div>
        <div className="lg:sticky lg:top-12 space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Live Preview: {currentVariant?.name}</span>
            <a href={`/${slug}${currentVariant?.variantSlug === 'intro' ? '' : '/' + currentVariant?.variantSlug}`} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-indigo-600 flex items-center gap-1 hover:underline">
              <ExternalLink size={12} /> View Page
            </a>
          </div>
          <ProfileCard data={{ ...watchAll, bio: currentVariant?.bio, focus: currentVariant?.focus, topics: currentVariant?.topics }} />
          <CopyBlurbGroup
            fullName={watchAll.fullName}
            jobTitle={watchAll.jobTitle}
            company={watchAll.company}
            url={`${window.location.origin}/${slug}${currentVariant?.variantSlug === 'intro' ? '' : '/' + currentVariant?.variantSlug}`}
            className="bg-card p-6 rounded-2xl border shadow-sm"
          />
        </div>
      </div>
    </div>
  );
}