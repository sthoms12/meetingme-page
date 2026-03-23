import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Save, ArrowLeft, Loader2, ShieldAlert, Printer, QrCode, Mail, Eye, Upload, X } from 'lucide-react';
import QRCode from 'qrcode';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Skeleton } from '@/components/ui/skeleton';
import { ProfileCard } from '@/components/ProfileCard';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
const formSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  jobTitle: z.string().min(2, 'Title is required'),
  company: z.string().min(2, 'Company is required'),
  bio: z.string().min(10, 'Bio must be at least 10 characters').max(300, 'Keep it punchy'),
  profilePhoto: z.string().optional().or(z.literal('')),
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
    defaultValues: { fullName: '', jobTitle: '', company: '', bio: '', profilePhoto: '', linkedinUrl: '', websiteUrl: '', videoUrl: '' },
  });
  const watchAll = form.watch();
  useEffect(() => {
    if (initialData) form.reset(initialData);
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
        toast.success('Changes saved');
        navigate(`/${slug}`);
      } else {
        toast.error(result.error || 'Failed to update');
      }
    } catch (err) {
      toast.error('Something went wrong');
    } finally { setIsUpdating(false); }
  }, [editToken, slug, navigate, queryClient]);
  const shareViaEmail = () => {
    if (!slug) return;
    const url = `${window.location.origin}/${slug}`;
    const subject = encodeURIComponent(`Meet ${watchAll.fullName}`);
    const body = encodeURIComponent(`Hi,\n\nI'm looking forward to our meeting. Here's my profile:\n\n${url}\n\nSee you soon!`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };
  if (isLoading) return <div className="max-w-7xl mx-auto px-4 py-12"><Skeleton className="h-[500px] w-full max-w-4xl mx-auto rounded-2xl" /></div>;
  if (!editToken) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md bg-card border rounded-2xl p-10 shadow-soft">
          <div className="mx-auto size-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <ShieldAlert className="size-8 text-destructive" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">Access Denied</h2>
            <p className="text-muted-foreground">
              You don't have permission to edit this profile. This could happen if you're on a different browser or cleared your local storage.
            </p>
          </div>
          <div className="flex flex-col gap-2 pt-2">
            <Button asChild size="lg" className="w-full">
              <Link to="/">Create Your Own Page</Link>
            </Button>
            <Button asChild variant="ghost" className="w-full">
              <Link to={`/${slug}`}>View Public Profile</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <ThemeToggle />
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 no-print">
        <div className="space-y-2">
          <Link to={`/${slug}`} className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-indigo-600 transition-colors">
            <ArrowLeft size={16} /> Public View
          </Link>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold tracking-tight">Edit Page</h1>
            <Badge variant="secondary" className="h-6 px-2.5 gap-1.5 font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">
              <Eye size={14} className="opacity-70" /> {initialData?.views || 0} views
            </Badge>
          </div>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Button variant="outline" size="sm" type="button" onClick={shareViaEmail} className="gap-2 h-9 px-4 hover:bg-secondary">
            <Mail size={16} /> Email
          </Button>
          <Button variant="outline" size="sm" type="button" onClick={() => window.print()} className="gap-2 h-9 px-4 hover:bg-secondary">
            <Printer size={16} /> Print
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" type="button" className="gap-2 h-9 px-4 hover:bg-secondary">
                <QrCode size={16} /> QR Code
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xs text-center p-8">
              <DialogHeader>
                <DialogTitle className="text-center">Share Profile QR</DialogTitle>
              </DialogHeader>
              <div className="p-4 bg-white rounded-xl inline-block mx-auto border shadow-sm my-6">
                <img src={qrCode} className="size-48 mx-auto" alt="QR" />
              </div>
              <Button className="w-full h-11" asChild>
                <a href={qrCode} download={`meetingme-${slug}.png`}>Download PNG</a>
              </Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div className="space-y-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-3">
                <FormLabel className="text-sm font-semibold">Profile Photo</FormLabel>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => fileInputRef.current?.click()}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click(); }}
                  className="group relative border-2 border-dashed border-muted-foreground/20 rounded-2xl p-5 flex items-center gap-5 cursor-pointer hover:bg-muted/30 hover:border-indigo-500/30 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  <div className="relative shrink-0">
                    {watchAll.profilePhoto ? (
                      <img src={watchAll.profilePhoto} className="w-16 h-16 rounded-full object-cover border-2 border-background shadow-md group-hover:scale-105 transition-transform" alt="Profile" />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-muted-foreground group-hover:text-indigo-500 transition-colors">
                        <Upload size={24} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-bold group-hover:text-indigo-600 transition-colors">Change photo</p>
                    <p className="text-xs text-muted-foreground">JPG, PNG or GIF. Max 2MB.</p>
                  </div>
                  <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField control={form.control} name="fullName" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">Full Name</FormLabel>
                    <FormControl>
                      <Input className="h-11 bg-secondary/50 focus:bg-background transition-all" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="jobTitle" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">Job Title</FormLabel>
                    <FormControl>
                      <Input className="h-11 bg-secondary/50 focus:bg-background transition-all" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <FormField control={form.control} name="company" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">Company</FormLabel>
                  <FormControl>
                    <Input className="h-11 bg-secondary/50 focus:bg-background transition-all" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="bio" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">Bio</FormLabel>
                  <FormControl>
                    <Textarea className="min-h-[120px] bg-secondary/50 focus:bg-background transition-all resize-none leading-relaxed" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <Button type="submit" size="lg" className="w-full gap-2 h-12 text-base font-semibold shadow-lg shadow-indigo-500/20" disabled={isUpdating}>
                {isUpdating ? <Loader2 className="animate-spin" /> : <Save size={18} />} Save Changes
              </Button>
            </form>
          </Form>
        </div>
        <div className="lg:sticky lg:top-12 no-print space-y-4">
          <span className="text-2xs font-bold text-muted-foreground uppercase tracking-widest pl-1">Live Preview</span>
          <ProfileCard data={watchAll} />
        </div>
      </div>
    </div>
  );
}