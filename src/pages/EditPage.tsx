import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Save, ArrowLeft, Loader2, ShieldAlert, Printer, QrCode } from 'lucide-react';
import QRCode from 'qrcode';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Skeleton } from '@/components/ui/skeleton';
import { ProfileCard } from '@/components/ProfileCard';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
  const [qrCode, setQrCode] = useState<string>('');
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
    if (slug) {
      QRCode.toDataURL(`${window.location.origin}/${slug}`, { margin: 2 }).then(setQrCode);
    }
  }, [slug]);
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
    } finally {
      setIsUpdating(false);
    }
  }, [editToken, slug, navigate, queryClient]);
  if (isLoading) return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Skeleton className="h-[500px] w-full max-w-4xl mx-auto rounded-2xl" />
    </div>
  );
  if (!editToken) return (
    <div className="py-24 text-center space-y-4">
      <ShieldAlert className="mx-auto size-12 text-muted-foreground" />
      <h2 className="text-xl font-bold">Access Denied</h2>
      <p className="text-muted-foreground">You don't have permission to edit this profile or your session expired.</p>
      <Button asChild><Link to="/">Go Home</Link></Button>
    </div>
  );
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <ThemeToggle />
      <div className="flex items-center justify-between mb-8 no-print">
        <Link to={`/${slug}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft size={16} /> Public View
        </Link>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => window.print()} className="gap-2">
            <Printer size={16} /> Print
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2"><QrCode size={16} /> QR</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xs text-center">
              <DialogHeader><DialogTitle>Your Sharing QR</DialogTitle></DialogHeader>
              <div className="p-4 bg-white rounded-xl inline-block mx-auto border my-4">
                <img src={qrCode} className="size-48 mx-auto" alt="QR" />
              </div>
              <Button className="w-full" asChild>
                <a href={qrCode} download={`meetingme-${slug}.png`}>Download PNG</a>
              </Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold tracking-tight">Edit Your Page</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="fullName" render={({ field }) => (
                  <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input className="bg-secondary" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="profilePhoto" render={({ field }) => (
                  <FormItem><FormLabel>Avatar URL</FormLabel><FormControl><Input className="bg-secondary" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="jobTitle" render={({ field }) => (
                  <FormItem><FormLabel>Job Title</FormLabel><FormControl><Input className="bg-secondary" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="company" render={({ field }) => (
                  <FormItem><FormLabel>Company</FormLabel><FormControl><Input className="bg-secondary" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <FormField control={form.control} name="bio" render={({ field }) => (
                <FormItem><FormLabel>Bio</FormLabel><FormControl><Textarea className="h-24 bg-secondary resize-none" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <Button type="submit" size="lg" className="w-full gap-2 h-12" disabled={isUpdating}>
                {isUpdating ? <Loader2 className="animate-spin" /> : <Save size={18} />} Save Changes
              </Button>
            </form>
          </Form>
        </div>
        <div className="lg:sticky lg:top-12 no-print">
          <ProfileCard data={watchAll} />
        </div>
      </div>
    </div>
  );
}