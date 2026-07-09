import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { startRegistration } from '@simplewebauthn/browser';
import { KeyRound, Fingerprint, RefreshCw, Download, FileJson, FileText, Copy, ShieldCheck, Loader2, Smartphone, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { AccessInfo, ApiResponse, ProfileCreateResponse } from '@shared/types';

interface AccessPanelProps {
  slug: string;
}

const ACCESS_METHOD_LABELS: Record<string, string> = {
  initial: 'Initial setup',
  'edit-token': 'Management link',
  passkey: 'Passkey',
  'recovery-code': 'Backup code',
};

export function AccessPanel({ slug }: AccessPanelProps) {
  const queryClient = useQueryClient();
  const [isAddingPasskey, setIsAddingPasskey] = useState(false);
  const [isRevealingCode, setIsRevealingCode] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [revealedCode, setRevealedCode] = useState<string | null>(null);
  const [newManagementLink, setNewManagementLink] = useState<string | null>(null);

  const { data: access, isLoading } = useQuery<AccessInfo>({
    queryKey: ['profile-access', slug],
    queryFn: async () => {
      const res = await fetch(`/api/profiles/${slug}/manage/access`);
      const json = await res.json() as ApiResponse<AccessInfo>;
      if (!json.success || !json.data) throw new Error(json.error || 'Failed to load access info');
      return json.data;
    },
  });

  const addPasskey = async () => {
    setIsAddingPasskey(true);
    try {
      const startRes = await fetch(`/api/profiles/${slug}/passkey/register/start`, { method: 'POST' });
      const startJson = await startRes.json();
      if (!startJson.success) throw new Error(startJson.error || 'Could not start passkey registration');

      const attestation = await startRegistration({ optionsJSON: startJson.data });
      const deviceLabel = typeof navigator !== 'undefined' ? navigator.userAgent.split(' ').slice(-2).join(' ') : undefined;

      const completeRes = await fetch(`/api/profiles/${slug}/passkey/register/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ response: attestation, deviceLabel }),
      });
      const completeJson = await completeRes.json();
      if (!completeJson.success) throw new Error(completeJson.error || 'Could not save passkey');

      toast.success('Passkey added');
      queryClient.invalidateQueries({ queryKey: ['profile-access', slug] });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not add passkey');
    } finally {
      setIsAddingPasskey(false);
    }
  };

  const revealRecoveryCode = async () => {
    setIsRevealingCode(true);
    try {
      const res = await fetch(`/api/profiles/${slug}/recovery-code/reveal`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Could not reveal backup code');
      setRevealedCode(json.data.code);
      queryClient.invalidateQueries({ queryKey: ['profile-access', slug] });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not reveal backup code');
    } finally {
      setIsRevealingCode(false);
    }
  };

  const regenerateManagementLink = async () => {
    if (!confirm('This invalidates your current management link. Continue?')) return;
    setIsRegenerating(true);
    try {
      const res = await fetch(`/api/profiles/${slug}/manage/regenerate`, { method: 'POST' });
      const json = await res.json() as ApiResponse<ProfileCreateResponse>;
      if (!json.success || !json.data) throw new Error(json.error || 'Could not regenerate management link');
      setNewManagementLink(`${window.location.origin}/${slug}/edit?token=${json.data.editToken}`);
      queryClient.invalidateQueries({ queryKey: ['profile-access', slug] });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not regenerate management link');
    } finally {
      setIsRegenerating(false);
    }
  };

  const copyToClipboard = (value: string, label: string) => {
    navigator.clipboard.writeText(value);
    toast.success(`${label} copied`);
  };

  if (isLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary size-8" /></div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="rounded-[2rem] border-none shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Fingerprint size={20} className="text-primary" /> Passkeys</CardTitle>
          <CardDescription>Sign back in with Face ID, Touch ID, or a security key, even if you lose your management link.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {access?.passkeys.length ? (
            <div className="space-y-2">
              {access.passkeys.map((passkey) => (
                <div key={passkey.id} className="flex items-center justify-between p-4 bg-muted/40 rounded-2xl border border-muted">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center"><Smartphone size={16} /></div>
                    <div>
                      <div className="text-sm font-bold">{passkey.deviceLabel || 'Passkey'}</div>
                      <div className="text-xs text-muted-foreground">Added {new Date(passkey.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">No passkey added yet. This is the fastest way to recover access.</p>
          )}
          <Button onClick={addPasskey} disabled={isAddingPasskey} className="rounded-2xl w-full font-bold">
            {isAddingPasskey ? <Loader2 className="size-4 animate-spin mr-2" /> : <Fingerprint size={16} className="mr-2" />}
            Add a passkey
          </Button>
        </CardContent>
      </Card>

      <Card className="rounded-[2rem] border-none shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><ShieldCheck size={20} className="text-primary" /> Backup Code</CardTitle>
          <CardDescription>A one-time code that recovers access if you lose your management link and don't have a passkey set up.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {revealedCode ? (
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl space-y-3">
              <div className="flex items-center justify-between gap-3">
                <code className="text-lg font-mono font-bold tracking-wider">{revealedCode}</code>
                <Button variant="ghost" size="icon" onClick={() => copyToClipboard(revealedCode, 'Backup code')}><Copy size={16} /></Button>
              </div>
              <div className="flex items-start gap-2 text-xs text-muted-foreground">
                <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                <span>Save this somewhere safe. Revealing it again will generate a new code and invalidate this one.</span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              {access?.recoveryCodeLastRotatedAt
                ? `Last viewed ${new Date(access.recoveryCodeLastRotatedAt).toLocaleDateString()}. Reveal it again if you need a fresh copy.`
                : 'A backup code was generated automatically when this page was created.'}
            </p>
          )}
          <Button onClick={revealRecoveryCode} disabled={isRevealingCode} variant="outline" className="rounded-2xl w-full font-bold">
            {isRevealingCode ? <Loader2 className="size-4 animate-spin mr-2" /> : <ShieldCheck size={16} className="mr-2" />}
            Reveal backup code
          </Button>
        </CardContent>
      </Card>

      <Card className="rounded-[2rem] border-none shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><KeyRound size={20} className="text-primary" /> Management Link</CardTitle>
          <CardDescription>Your original management link. Regenerate it if you think it's been shared or exposed.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {newManagementLink ? (
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl space-y-3">
              <div className="flex items-center gap-2">
                <Input readOnly value={newManagementLink} className="bg-background rounded-xl border-none text-xs font-mono" />
                <Button variant="ghost" size="icon" onClick={() => copyToClipboard(newManagementLink, 'Management link')}><Copy size={16} /></Button>
              </div>
              <div className="flex items-start gap-2 text-xs text-muted-foreground">
                <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                <span>Save this now. Your previous management link no longer works.</span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              {access?.editTokenRotatedAt
                ? `Last regenerated ${new Date(access.editTokenRotatedAt).toLocaleDateString()}.`
                : 'Still using the original link from setup.'}
            </p>
          )}
          <Button onClick={regenerateManagementLink} disabled={isRegenerating} variant="outline" className="rounded-2xl w-full font-bold">
            {isRegenerating ? <Loader2 className="size-4 animate-spin mr-2" /> : <RefreshCw size={16} className="mr-2" />}
            Regenerate management link
          </Button>
        </CardContent>
      </Card>

      <Card className="rounded-[2rem] border-none shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Download size={20} className="text-primary" /> Export Your Data</CardTitle>
          <CardDescription>Download a copy of your profile in case you ever want to move it elsewhere.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button asChild variant="outline" className="rounded-2xl w-full font-bold justify-start">
            <a href={`/api/profiles/${slug}/export.json`} download><FileJson size={16} className="mr-2" /> Download JSON</a>
          </Button>
          <Button asChild variant="outline" className="rounded-2xl w-full font-bold justify-start">
            <a href={`/api/profiles/${slug}/export.md`} download><FileText size={16} className="mr-2" /> Download Markdown</a>
          </Button>
          {access?.lastManagementAccessMethod && (
            <p className="text-xs text-muted-foreground pt-2">
              Last signed in via {ACCESS_METHOD_LABELS[access.lastManagementAccessMethod] || access.lastManagementAccessMethod}.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
