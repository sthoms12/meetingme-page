import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
  Save, ArrowLeft, Loader2, ShieldAlert, Printer, QrCode, Mail, Eye, Upload, X, 
  Lock, ShieldCheck, HelpCircle, KeyRound, Trash2 
} from 'lucide-react';
import QRCode from 'qrcode';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from '@/components/ui/skeleton';
import { ProfileCard } from '@/components/ProfileCard';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
const formSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  jobTitle: z.string().min(2, 'Title is required'),
  company: z.string().min(2, 'Company is required'),
  bio: z.string().min(10, 'Bio must be at least 10 characters').max(300, 'Keep it punchy'),
  profilePhoto: z.string().optional().or(z.literal('')),
  linkedinUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  websiteUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  videoUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  password: z.string().min(4, 'Password must be 4+ chars').optional().or(z.literal('')),
});
type FormValues = z.infer<typeof formSchema>;
export function EditPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);
  const [qrCode, setQrCode] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editToken = useMemo(() => slug ? localStorage.getItem(`profile_${slug}_token`) : null, [slug]);
  const { data: initialData, isLoading } = useQuery({
    queryKey: ['profile-edit', slug],
    queryFn: async () => {
      const res = await fetch(`/api/profiles/${slug}`);
      if (!res.ok) throw new Error('Failed to load');
      const json = await res.json();
      return json.data;
    },
    enabled: !!slug,
  });
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { fullName: '', jobTitle: '', company: '', bio: '', profilePhoto: '', linkedinUrl: '', websiteUrl: '', videoUrl: '', password: '' },
  });
  const watchAll = form.watch();
  useEffect(() => {
    if (initialData) {
      const { passwordHash: _, ...rest } = initialData;
      form.reset({ ...rest, password: '' });
    }
  }, [initialData, form]);
  useEffect(() => {
    if (slug) QRCode.toDataURL(`${window.location.origin}/${slug}`, { margin: 2 }).then(setQrCode);
  }, [slug]);
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.src = reader.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 400;
        canvas.width = MAX_WIDTH;
        canvas.height = (img.height * MAX_WIDTH) / img.width;
        canvas.getContext('2d')?.drawImage(img, 0, 0, canvas.width, canvas.height);
        form.setValue('profilePhoto', canvas.toDataURL('image/jpeg', 0.8));
      };
    };
    reader.readAsDataURL(file);
  };
  const onSubmit = useCallback(async (values: FormValues) => {
    if (!editToken || !slug) return;
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/profiles/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, editToken }),
      });
      const result = await res.json();
      if (result.success) {
        await queryClient.invalidateQueries({ queryKey: ['profile', slug] });
        toast.success('Settings updated');
        navigate(`/${slug}`);
      } else { toast.error(result.error || 'Failed to update'); }
    } catch { toast.error('Something went wrong'); }
    finally { setIsUpdating(false); }
  }, [editToken, slug, navigate, queryClient]);
  const removePassword = async () => {
    if (!editToken || !slug) return;
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/profiles/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ editToken, removePassword: true }),
      });
      const result = await res.json();
      if (result.success) {
        toast.success('Password protection removed');
        queryClient.invalidateQueries({ queryKey: ['profile-edit', slug] });
      }
    } catch { toast.error('Failed to remove password'); }
    finally { setIsUpdating(false); }
  };
  if (isLoading) return <div className="max-w-7xl mx-auto px-4 py-12"><Skeleton className="h-[500px] w-full max-w-4xl mx-auto rounded-2xl" /></div>;
  if (!editToken) return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex items-center justify-center">
      <div className="text-center space-y-6 max-w-md bg-card border rounded-3xl p-10 shadow-soft">
        <div className="mx-auto size-16 rounded-full bg-destructive/10 flex items-center justify-center"><ShieldAlert className="size-8 text-destructive" /></div>
        <h2 className="text-2xl font-bold tracking-tight">Access Restricted</h2>
        <p className="text-muted-foreground text-sm">You are on a device or browser that doesn't have the edit token for this profile.</p>
        <div className="flex flex-col gap-2"><Button asChild className="w-full h-11"><Link to="/">Create My Own</Link></Button><Button asChild variant="ghost" className="w-full h-11"><Link to={`/${slug}`}>View Profile</Link></Button></div>
      </div>
    </div>
  );
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <ThemeToggle />
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div className="space-y-2">
          <Link to={`/${slug}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-indigo-600 transition-colors">
            <ArrowLeft size={16} /> Public View
          </Link>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold tracking-tight">Edit Profile</h1>
            <Badge variant="secondary" className="h-6 px-2.5 gap-1.5 font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40">
              <Eye size={14} /> {initialData?.views || 0} views
            </Badge>
          </div>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Button variant="outline" size="sm" type="button" onClick={() => window.print()} className="gap-2 h-9 px-4"><Printer size={16} /> Print</Button>
          <Dialog>
            <DialogTrigger asChild><Button variant="outline" size="sm" className="gap-2 h-9 px-4"><QrCode size={16} /> QR Code</Button></DialogTrigger>
            <DialogContent className="sm:max-w-xs text-center p-8"><DialogHeader><DialogTitle className="text-center">Share QR Code</DialogTitle></DialogHeader><div className="p-4 bg-white rounded-2xl border shadow-sm my-6"><img src={qrCode} className="size-48 mx-auto" alt="QR" /></div><Button className="w-full h-11" asChild><a href={qrCode} download={`meetingme-${slug}.png`}>Download PNG</a></Button></DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div className="space-y-12">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-3">
                <FormLabel className="text-sm font-bold">Profile Image</FormLabel>
                <div role="button" tabIndex={0} onClick={() => fileInputRef.current?.click()} className="group border-2 border-dashed border-muted-foreground/20 rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:bg-muted/30 hover:border-indigo-500/30 transition-all">
                  <div className="relative shrink-0">
                    {watchAll.profilePhoto ? <img src={watchAll.profilePhoto} className="w-16 h-16 rounded-full object-cover border-2 border-background shadow-md" alt="Profile" /> : <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-muted-foreground"><Upload size={24} /></div>}
                  </div>
                  <div className="flex-1 text-left"><p className="text-sm font-bold group-hover:text-indigo-600 transition-colors">Change photo</p><p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Max 2MB</p></div>
                  <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="fullName" render={({ field }) => (
                  <FormItem><FormLabel className="text-sm font-bold">Full Name</FormLabel><FormControl><Input className="h-11 bg-secondary/30" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="jobTitle" render={({ field }) => (
                  <FormItem><FormLabel className="text-sm font-bold">Job Title</FormLabel><FormControl><Input className="h-11 bg-secondary/30" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <FormField control={form.control} name="company" render={({ field }) => (
                <FormItem><FormLabel className="text-sm font-bold">Company</FormLabel><FormControl><Input className="h-11 bg-secondary/30" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="bio" render={({ field }) => (
                <FormItem><FormLabel className="text-sm font-bold">Bio</FormLabel><FormControl><Textarea className="min-h-[120px] bg-secondary/30 resize-none" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <div className="pt-6 border-t border-border space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><Lock size={16} className="text-muted-foreground" /><h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Privacy Controls</h4></div>
                  {initialData?.isLocked && <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Password Active</Badge>}
                </div>
                <div className="flex gap-2">
                  <FormField control={form.control} name="password" render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input type="password" placeholder="New page password..." className="h-11 bg-secondary/30" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  {initialData?.isLocked && (
                    <Button variant="ghost" type="button" size="icon" className="h-11 w-11 text-destructive hover:bg-destructive/10" onClick={removePassword}><Trash2 size={18} /></Button>
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground">Setting a password will hide your bio and links until verified.</p>
              </div>
              <Button type="submit" size="lg" className="w-full gap-2 h-12 font-bold shadow-lg shadow-indigo-500/20" disabled={isUpdating}>
                {isUpdating ? <Loader2 className="animate-spin" /> : <Save size={18} />} Save Changes
              </Button>
            </form>
          </Form>
          <div className="space-y-6">
            <div className="flex items-center gap-2 font-bold"><HelpCircle size={20} className="text-indigo-500" /><h3>Help & Optimization</h3></div>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="privacy" className="border-b-0 bg-secondary/30 rounded-xl px-4 mb-2">
                <AccordionTrigger className="hover:no-underline text-sm font-semibold">How does password protection work?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm leading-relaxed">Protected profiles only show your name to visitors. They must enter the password to see your photo, bio, and links. Your edit access is independent of this password.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="views" className="border-b-0 bg-secondary/30 rounded-xl px-4 mb-2">
                <AccordionTrigger className="hover:no-underline text-sm font-semibold">What counts as a view?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm leading-relaxed">We count every unique visit to your public page. If your page is password protected, a view is only recorded after a successful password entry.</AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
        <div className="lg:sticky lg:top-12 space-y-4">
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] pl-1">Preview Changes</span>
          <ProfileCard data={watchAll} />
        </div>
      </div>
    </div>
  );
}