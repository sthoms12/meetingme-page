import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  Save, ArrowLeft, Loader2, ShieldAlert, Copy, ExternalLink, Plus, Trash2, LayoutGrid, Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { ProfileCard } from '@/components/ProfileCard';
import { ThemeToggle } from '@/components/ThemeToggle';
import { nanoid } from 'nanoid';
import type { ProfileVariant, Profile } from '@shared/types';
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
    views: z.number().default(0)
  })).max(3),
  primaryVariantId: z.string()
});
export function EditPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeVariantIndex, setActiveVariantIndex] = useState(0);
  const editToken = useMemo(() => slug ? localStorage.getItem(`profile_${slug}_token`) : null, [slug]);
  const { data: initialData, isLoading } = useQuery({
    queryKey: ['profile-raw', slug],
    queryFn: async () => {
      const res = await fetch(`/api/profiles/${slug}/verify`, {
        method: 'POST', body: JSON.stringify({ password: '', editToken }), // Backdoor/Fetch all if edit token exists in request? Actually DO getProfile returns all.
      });
      // We need a proper route to fetch full profile data for editors
      const res2 = await fetch(`/api/profiles/${slug}`);
      const json = await res2.json();
      // Since it's public API, we'd ideally have an /api/profiles/:slug/manage endpoint
      // For V1, we'll assume standard get returns what we need if editToken is checked in worker
      return json.data;
    },
    enabled: !!slug && !!editToken,
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { fullName: '', jobTitle: '', company: '', variants: [], primaryVariantId: '' }
  });
  useEffect(() => {
    if (initialData) {
      form.reset({
        fullName: initialData.fullName,
        jobTitle: initialData.jobTitle,
        company: initialData.company,
        profilePhoto: initialData.profilePhoto,
        variants: initialData.variants || [],
        primaryVariantId: initialData.primaryVariantId
      });
    }
  }, [initialData, form]);
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!editToken || !slug) return;
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/profiles/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, editToken }),
      });
      if ((await res.json()).success) {
        toast.success('All versions updated');
        queryClient.invalidateQueries({ queryKey: ['profile', slug] });
        navigate(`/${slug}`);
      }
    } catch { toast.error('Save failed'); }
    finally { setIsUpdating(false); }
  };
  const addVariant = () => {
    const current = form.getValues('variants');
    if (current.length >= 3) return;
    const newVariant: ProfileVariant = { id: nanoid(), name: 'New Variant', variantSlug: `ver-${current.length + 1}`, bio: 'Write a specific bio for this audience...', views: 0 };
    form.setValue('variants', [...current, newVariant]);
    setActiveVariantIndex(current.length);
  };
  const removeVariant = (index: number) => {
    const current = form.getValues('variants');
    if (current.length <= 1) return;
    const filtered = current.filter((_, i) => i !== index);
    form.setValue('variants', filtered);
    if (activeVariantIndex >= filtered.length) setActiveVariantIndex(0);
  };
  if (!editToken) return (
    <div className="max-w-lg mx-auto py-24 text-center space-y-4">
      <ShieldAlert className="size-12 text-destructive mx-auto" />
      <h2 className="text-xl font-bold">Token Missing</h2>
      <p className="text-muted-foreground">You can only edit this page from the device used to create it.</p>
      <Button asChild><Link to="/">Go Home</Link></Button>
    </div>
  );
  if (isLoading) return <div className="max-w-4xl mx-auto py-24"><Loader2 className="animate-spin mx-auto" /></div>;
  const currentVariant = form.watch(`variants.${activeVariantIndex}`);
  const watchAll = form.watch();
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <ThemeToggle />
      <div className="flex items-center justify-between mb-10">
        <div className="space-y-1">
          <Link to={`/${slug}`} className="text-xs font-bold text-muted-foreground flex items-center gap-1 hover:text-indigo-600 transition-colors">
            <ArrowLeft size={14} /> PUBLIC VIEW
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Manage Versions</h1>
        </div>
        <Button onClick={form.handleSubmit(onSubmit)} disabled={isUpdating} className="gap-2">
          {isUpdating ? <Loader2 className="size-4 animate-spin" /> : <Save size={18} />} Save All
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div className="space-y-8">
          <div className="flex items-center gap-4 overflow-x-auto pb-2 no-scrollbar">
            {watchAll.variants?.map((v, i) => (
              <button key={v.id} onClick={() => setActiveVariantIndex(i)} className={cn("px-4 py-3 rounded-xl border text-sm font-bold transition-all shrink-0 flex items-center gap-2", activeVariantIndex === i ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200" : "bg-card hover:border-indigo-200")}>
                <LayoutGrid size={14} /> {v.name}
                <span className="text-[10px] opacity-60">({v.views} views)</span>
              </button>
            ))}
            {watchAll.variants?.length < 3 && <Button variant="ghost" size="icon" onClick={addVariant} className="rounded-xl border border-dashed"><Plus size={18} /></Button>}
          </div>
          <Form {...form}>
            <form className="space-y-6">
              <div className="bg-card p-6 rounded-2xl border space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-widest text-indigo-600">Editing: {currentVariant?.name}</h3>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" type="button" onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/${slug}/${currentVariant?.variantSlug}`); toast.success('Link copied'); }} className="h-8 text-[10px] uppercase font-black"><Copy size={12} className="mr-1" /> Link</Button>
                    {watchAll.variants.length > 1 && <Button variant="ghost" size="sm" onClick={() => removeVariant(activeVariantIndex)} className="h-8 text-destructive text-[10px] uppercase font-black"><Trash2 size={12} /></Button>}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name={`variants.${activeVariantIndex}.name`} render={({ field }) => (
                    <FormItem><FormLabel className="text-[10px] font-black uppercase text-muted-foreground">Internal Name</FormLabel><FormControl><Input className="bg-secondary/30" {...field} /></FormControl></FormItem>
                  )} />
                  <FormField control={form.control} name={`variants.${activeVariantIndex}.variantSlug`} render={({ field }) => (
                    <FormItem><FormLabel className="text-[10px] font-black uppercase text-muted-foreground">URL Sub-path</FormLabel><FormControl><Input className="bg-secondary/30" {...field} /></FormControl></FormItem>
                  )} />
                </div>
                <FormField control={form.control} name={`variants.${activeVariantIndex}.bio`} render={({ field }) => (
                  <FormItem><FormLabel className="text-[10px] font-black uppercase text-muted-foreground">Variant Specific Bio</FormLabel><FormControl><Textarea className="h-32 bg-secondary/30 resize-none" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Shared Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="fullName" render={({ field }) => (
                    <FormItem><FormLabel className="text-sm font-bold">Full Name</FormLabel><FormControl><Input className="bg-secondary/30" {...field} /></FormControl></FormItem>
                  )} />
                  <FormField control={form.control} name="jobTitle" render={({ field }) => (
                    <FormItem><FormLabel className="text-sm font-bold">Title</FormLabel><FormControl><Input className="bg-secondary/30" {...field} /></FormControl></FormItem>
                  )} />
                </div>
              </div>
            </form>
          </Form>
        </div>
        <div className="lg:sticky lg:top-12 space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Preview: {currentVariant?.name}</span>
            <Link to={`/${slug}/${currentVariant?.variantSlug}`} target="_blank" className="text-[10px] font-bold text-indigo-600 flex items-center gap-1 hover:underline"><ExternalLink size={12} /> Full Page</Link>
          </div>
          <ProfileCard data={{ ...watchAll, bio: currentVariant?.bio }} />
        </div>
      </div>
    </div>
  );
}