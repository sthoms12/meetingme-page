import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Save, ArrowLeft, Loader2, ShieldAlert, Plus, Trash2, LayoutGrid, ExternalLink, Image as ImageIcon, BarChart3, History, Code, Calendar as CalendarIcon, Clock, Linkedin, Globe, Video, Link as LinkIcon, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ProfileCard } from '@/components/ProfileCard';
import { ThemeToggle } from '@/components/ThemeToggle';
import { CopyBlurbGroup } from '@/components/CopyBlurbGroup';
import { SecurityFAQ } from '@/components/SecurityFAQ';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { nanoid } from 'nanoid';
import { cn } from '@/lib/utils';
import type { Profile, ApiResponse } from '@shared/types';
const formSchema = z.object({
  fullName: z.string().min(2),
  jobTitle: z.string().min(2),
  company: z.string().min(2),
  profilePhoto: z.string().optional().or(z.literal('')),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  websiteUrl: z.string().url().optional().or(z.literal('')),
  videoUrl: z.string().url().optional().or(z.literal('')),
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
      fullName: '', jobTitle: '', company: '', profilePhoto: '',
      linkedinUrl: '', websiteUrl: '', videoUrl: '',
      variants: [{
        id: 'initial',
        name: 'Default',
        variantSlug: 'intro',
        bio: 'Loading your introduction...',
        focus: '',
        topics: '',
        meetingNote: '',
        views: 0
      }],
      primaryVariantId: 'initial'
    }
  });
  useEffect(() => {
    if (profile) {
      form.reset({
        fullName: profile.fullName,
        jobTitle: profile.jobTitle,
        company: profile.company,
        profilePhoto: profile.profilePhoto || '',
        linkedinUrl: profile.linkedinUrl || '',
        websiteUrl: profile.websiteUrl || '',
        videoUrl: profile.videoUrl || '',
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
  const handleRestore = async (timestamp: string) => {
    if (!confirm('Restore this version history? Current variant details will be moved to history.')) return;
    try {
      const res = await fetch(`/api/profiles/${slug}/history/restore`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ editToken, timestamp })
      });
      if (res.ok) {
        toast.success('Version restored successfully');
        queryClient.invalidateQueries({ queryKey: ['profile-manage', slug] });
      }
    } catch { toast.error('Restore failed'); }
  };
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        toast.error("Image too large (max 1MB)");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue('profilePhoto', reader.result as string);
        toast.success("Identity photo updated");
      };
      reader.readAsDataURL(file);
    }
  };
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
        queryClient.invalidateQueries({ queryKey: ['profile-manage', slug] });
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
  const deleteVariant = (index: number) => {
    const current = form.getValues('variants');
    if (current.length <= 1) return;
    const variantToDelete = current[index];
    const filtered = current.filter((_, i) => i !== index);
    if (form.getValues('primaryVariantId') === variantToDelete.id) {
      form.setValue('primaryVariantId', filtered[0].id);
    }
    form.setValue('variants', filtered);
    setActiveVariantIndex(0);
  };
  const setPrimary = (id: string) => {
    form.setValue('primaryVariantId', id);
    toast.success('Primary variant updated (don\'t forget to save)');
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
  const embedCode = `<iframe src="${window.location.origin}/${slug}?embed=1" style="width:100%; max-width:480px; height:680px; border:none; border-radius:2.5rem; box-shadow: 0 4px 20px rgba(0,0,0,0.1);" title="MeetingMe Card"></iframe>`;
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-12 md:py-20">
        <ThemeToggle />
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-8">
          <div className="space-y-4">
            <Link to={`/${slug}`} className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2 hover:text-primary transition-colors">
              <ArrowLeft size={14} /> Back to Live Page
            </Link>
            <h1 className="text-4xl font-bold tracking-tight">Professional Dashboard</h1>
          </div>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={isUpdating} size="lg" className="h-14 px-10 text-lg font-bold rounded-2xl shadow-lg shadow-primary/20 active:scale-95 transition-all">
            {isUpdating ? <Loader2 className="size-5 animate-spin mr-3" /> : <Save size={20} className="mr-3" />}
            Save All Changes
          </Button>
        </div>
        <Tabs defaultValue="builder" className="space-y-12">
          <TabsList className="bg-muted p-1 rounded-2xl h-auto flex flex-wrap gap-1">
            <TabsTrigger value="builder" className="rounded-xl px-6 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <LayoutGrid size={16} className="mr-2" /> Builder
            </TabsTrigger>
            <TabsTrigger value="analytics" className="rounded-xl px-6 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <BarChart3 size={16} className="mr-2" /> Analytics
            </TabsTrigger>
            <TabsTrigger value="embed" className="rounded-xl px-6 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Code size={16} className="mr-2" /> Embed
            </TabsTrigger>
            <TabsTrigger value="history" className="rounded-xl px-6 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <History size={16} className="mr-2" /> Version History
            </TabsTrigger>
          </TabsList>
          <TabsContent value="builder" className="m-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              <div className="space-y-12">
                <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar -mx-1 px-1">
                  {watchAll.variants?.map((v, i) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setActiveVariantIndex(i)}
                      className={cn(
                        "px-6 py-4 rounded-2xl border-2 text-sm font-bold transition-all shrink-0 flex items-center gap-4 relative",
                        activeVariantIndex === i
                          ? "bg-slate-900 text-white border-slate-900 shadow-lg dark:bg-white dark:text-slate-950 dark:border-white"
                          : "bg-card text-muted-foreground border-slate-100 hover:border-slate-300 dark:border-slate-800"
                      )}
                    >
                      <div className="flex flex-col items-start gap-1">
                        <span className="flex items-center gap-2">
                          {v.name}
                          {watchAll.primaryVariantId === v.id && (
                            <CheckCircle2 size={14} className="text-primary-foreground dark:text-primary" />
                          )}
                        </span>
                        <Badge className={activeVariantIndex === i ? "bg-primary text-white border-primary" : "bg-muted text-muted-foreground"}>
                          {v.views} views
                        </Badge>
                      </div>
                    </button>
                  ))}
                  {watchAll.variants?.length < 3 && (
                    <Button variant="outline" size="icon" type="button" onClick={addVariant} className="rounded-2xl border-2 border-dashed h-[4.5rem] w-14 shrink-0">
                      <Plus size={24} />
                    </Button>
                  )}
                </div>
                <Form {...form}>
                  <div className="space-y-12">
                    {currentVariant && (
                      <div className="bg-card p-8 md:p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-soft space-y-8">
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col gap-1">
                            <h3 className="text-sm font-black uppercase tracking-widest text-primary">Variant Details: {currentVariant.name}</h3>
                            {watchAll.primaryVariantId === currentVariant.id ? (
                              <span className="text-[10px] text-green-600 font-bold uppercase tracking-widest flex items-center gap-1">
                                <CheckCircle2 size={10} /> Currently Primary
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setPrimary(currentVariant.id)}
                                className="text-[10px] text-muted-foreground hover:text-primary font-bold uppercase tracking-widest text-left transition-colors"
                              >
                                Set as Primary Variant
                              </button>
                            )}
                          </div>
                          {watchAll.variants.length > 1 && (
                            <Button variant="ghost" size="sm" type="button" onClick={() => deleteVariant(activeVariantIndex)} className="text-destructive hover:bg-destructive/5 uppercase font-black text-[10px] tracking-widest">
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
                        <FormField control={form.control} name={`variants.${activeVariantIndex}.bio`} render={({ field }) => (
                          <FormItem><FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Professional Bio</FormLabel><FormControl><Textarea className="min-h-[140px] bg-secondary/40 rounded-2xl border-none p-4" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField control={form.control} name={`variants.${activeVariantIndex}.focus`} render={({ field }) => (
                            <FormItem><FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Context Focus</FormLabel><FormControl><Input className="bg-secondary/40 h-14 rounded-2xl border-none" {...field} /></FormControl></FormItem>
                          )} />
                          <FormField control={form.control} name={`variants.${activeVariantIndex}.topics`} render={({ field }) => (
                            <FormItem><FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Topics (CSV)</FormLabel><FormControl><Input className="bg-secondary/40 h-14 rounded-2xl border-none" {...field} /></FormControl></FormItem>
                          )} />
                        </div>
                        <FormField control={form.control} name={`variants.${activeVariantIndex}.meetingNote`} render={({ field }) => (
                          <FormItem><FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Meeting Context Note</FormLabel><FormControl><Textarea className="min-h-[100px] bg-secondary/40 rounded-2xl border-none p-4" {...field} /></FormControl></FormItem>
                        )} />
                      </div>
                    )}
                    <div className="space-y-10 pt-10 border-t border-dashed">
                       <div className="flex items-center gap-3">
                        <LinkIcon className="text-primary size-5" />
                        <span className="text-sm font-black uppercase tracking-[0.2em]">Global Identity & Links</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField control={form.control} name="fullName" render={({ field }) => (
                          <FormItem><FormLabel className="text-sm font-bold">Global Name</FormLabel><FormControl><Input className="bg-secondary/40 h-14 rounded-2xl border-none" {...field} /></FormControl></FormItem>
                        )} />
                        <FormField control={form.control} name="jobTitle" render={({ field }) => (
                          <FormItem><FormLabel className="text-sm font-bold">Professional Title</FormLabel><FormControl><Input className="bg-secondary/40 h-14 rounded-2xl border-none" {...field} /></FormControl></FormItem>
                        )} />
                      </div>
                      <div className="flex items-center gap-4">
                        <Button type="button" variant="outline" className="h-14 px-6 rounded-2xl border-dashed border-2 relative overflow-hidden">
                          <input type="file" accept="image/*" onChange={handlePhotoUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                          <ImageIcon size={18} className="mr-2 text-primary" /> Update Photo
                        </Button>
                        {watchAll.profilePhoto && <div className="size-14 rounded-2xl border bg-muted overflow-hidden"><img src={watchAll.profilePhoto} className="w-full h-full object-cover" alt="Preview" /></div>}
                      </div>
                      <div className="grid grid-cols-1 gap-6 pt-4">
                        <FormField control={form.control} name="linkedinUrl" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">LinkedIn URL</FormLabel>
                            <div className="relative">
                              <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                              <FormControl><Input className="bg-secondary/40 h-12 pl-10 rounded-xl border-none" {...field} /></FormControl>
                            </div>
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="websiteUrl" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Website URL</FormLabel>
                            <div className="relative">
                              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                              <FormControl><Input className="bg-secondary/40 h-12 pl-10 rounded-xl border-none" {...field} /></FormControl>
                            </div>
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="videoUrl" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Video Intro URL</FormLabel>
                            <div className="relative">
                              <Video className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                              <FormControl><Input className="bg-secondary/40 h-12 pl-10 rounded-xl border-none" {...field} /></FormControl>
                            </div>
                          </FormItem>
                        )} />
                      </div>
                    </div>
                    <div className="pt-20 border-t border-dashed">
                      <SecurityFAQ className="max-w-none" />
                    </div>
                  </div>
                </Form>
              </div>
              <div className="lg:sticky lg:top-12 space-y-8">
                <div className="flex items-center justify-between px-2">
                  <span className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.3em]">Live Preview: {currentVariant?.name}</span>
                  <a href={`/${slug}`} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-primary flex items-center gap-2 hover:underline">
                    <ExternalLink size={14} /> Open Live
                  </a>
                </div>
                <ProfileCard data={{ ...watchAll, bio: currentVariant?.bio, focus: currentVariant?.focus, topics: currentVariant?.topics, meetingNote: currentVariant?.meetingNote }} slug={slug} />
                <CopyBlurbGroup fullName={watchAll.fullName} jobTitle={watchAll.jobTitle} company={watchAll.company} url={`${window.location.origin}/${slug}`} className="bg-card p-8 rounded-[2.5rem] border border-dashed border-slate-200" />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="analytics" className="m-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="rounded-[2rem] border-none shadow-soft">
                <CardHeader><CardTitle className="text-sm uppercase tracking-widest text-muted-foreground">Total Views</CardTitle></CardHeader>
                <CardContent><div className="text-5xl font-black text-primary">{profile?.variants.reduce((acc, v) => acc + (v.views || 0), 0)}</div></CardContent>
              </Card>
              <Card className="rounded-[2rem] border-none shadow-soft md:col-span-2">
                <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {profile?.analytics?.length ? profile.analytics.map((log, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-muted/40 rounded-2xl border border-muted">
                        <div className="flex items-center gap-4">
                          <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center"><Clock size={18} /></div>
                          <div>
                            <div className="text-sm font-bold">New View via {log.source}</div>
                            <div className="text-xs text-muted-foreground">{new Date(log.timestamp).toLocaleString()}</div>
                          </div>
                        </div>
                        <Badge variant="secondary">{profile.variants.find(v => v.id === log.variantId)?.name || 'Unknown'}</Badge>
                      </div>
                    )) : <p className="text-muted-foreground py-8 text-center italic">No view history yet. Share your link to start tracking.</p>}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="embed" className="m-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold">Professional Widget</h2>
                  <p className="text-muted-foreground">Embed your intro card directly on your website. Responsive and lightweight.</p>
                </div>
                <div className="bg-slate-900 text-slate-100 p-8 rounded-3xl relative group font-mono text-sm border-4 border-slate-800">
                  <div className="break-all whitespace-pre-wrap">{embedCode}</div>
                  <Button variant="secondary" size="sm" className="absolute top-4 right-4 rounded-xl font-bold" onClick={() => { navigator.clipboard.writeText(embedCode); toast.success('Embed code copied'); }}>
                    Copy Code
                  </Button>
                </div>
              </div>
              <div className="flex justify-center bg-slate-100 dark:bg-slate-900/40 p-12 rounded-[3rem] border border-dashed">
                <div className="bg-white dark:bg-black rounded-[2.5rem] shadow-glass p-1 border overflow-hidden scale-90">
                   <iframe src={`${window.location.origin}/${slug}?embed=1`} style={{ width: '380px', height: '600px', border: 'none' }} title="Preview" />
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="history" className="m-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Card className="rounded-[2.5rem] border-none shadow-soft overflow-hidden">
              <CardHeader>
                <CardTitle>Variant Snapshots</CardTitle>
                <CardDescription>We auto-save a snapshot before every global update. Restore previous versions anytime.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y border-t">
                  {profile?.history?.length ? profile.history.map((h, i) => (
                    <div key={i} className="p-6 flex items-center justify-between hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-6">
                        <div className="size-12 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground"><History size={24} /></div>
                        <div>
                          <div className="font-bold text-lg">{h.label}</div>
                          <div className="text-sm text-muted-foreground">{new Date(h.timestamp).toLocaleString()}</div>
                        </div>
                      </div>
                      <Button variant="outline" className="rounded-xl px-6" onClick={() => handleRestore(h.timestamp)}>Restore</Button>
                    </div>
                  )) : <div className="p-20 text-center text-muted-foreground italic">No historical snapshots yet.</div>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}