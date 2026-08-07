'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Megaphone, Loader2, AlertCircle, RefreshCw, Users, User, PowerOff } from 'lucide-react';
import { adsService } from '@/admin/services/ads-service';
import { useToast } from '@/hooks/use-toast';
import { useAdminAuth } from '@/admin/hooks/use-auth';
import type { Advertisement } from '@/admin/types/ads';
import { AdCard } from '@/admin/components/ads/ad-card';
import { CreateAdForm } from '@/admin/components/ads/create-ad-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

type DeleteTarget = string | null;

export function AdvertisementsContent() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading: authLoading } = useAdminAuth();

  const [runningCallerAds, setRunningCallerAds] = useState<Advertisement[]>([]);
  const [runningHostAds, setRunningHostAds] = useState<Advertisement[]>([]);
  const [inactiveAds, setInactiveAds] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [running, inactive] = await Promise.all([
        adsService.getRunningAds(),
        adsService.getInactiveAds(),
      ]);
      setRunningCallerAds(running.caller_ads ?? []);
      setRunningHostAds(running.host_ads ?? []);
      setInactiveAds(inactive.data ?? []);
    } catch (err) {
      setError(
        err && typeof err === 'object' && 'message' in err
          ? (err as { message: string }).message
          : 'Failed to load advertisements.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading || !isAuthenticated) return;
    fetchAll();
  }, [authLoading, isAuthenticated, fetchAll]);

  const handleToggle = async (id: string) => {
    try {
      await adsService.toggleAd(id);
      toast({ title: 'Advertisement status updated.' });
      await fetchAll();
    } catch (err) {
      toast({
        title: 'Failed to toggle advertisement',
        description:
          err && typeof err === 'object' && 'message' in err
            ? (err as { message: string }).message
            : undefined,
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adsService.deleteAd(deleteTarget);
      toast({ title: 'Advertisement deleted.' });
      setDeleteTarget(null);
      await fetchAll();
    } catch (err) {
      toast({
        title: 'Failed to delete advertisement',
        description:
          err && typeof err === 'object' && 'message' in err
            ? (err as { message: string }).message
            : undefined,
        variant: 'destructive',
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleCreateSuccess = () => {
    setCreateOpen(false);
    toast({ title: 'Advertisement created successfully.' });
    fetchAll();
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
            <Megaphone className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Advertisement Management</h2>
            <p className="text-sm text-slate-500">Manage caller and host advertisements</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchAll}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => setCreateOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4" />
            Create Advertisement
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 rounded-lg bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <div>
            <p>{error}</p>
            <button
              onClick={fetchAll}
              className="mt-1 text-xs font-medium text-red-600 underline hover:text-red-700"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      )}

      {/* Content */}
      {!loading && !error && (
        <>
          {/* Running Ads */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-4">
              <h3 className="flex items-center gap-2 text-base font-semibold text-slate-900">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                Currently Running
              </h3>
              <p className="mt-0.5 text-xs text-slate-500">
                Advertisements actively shown to users
              </p>
            </div>
            <div className="p-5">
              <Tabs defaultValue="caller">
                <TabsList className="mb-4">
                  <TabsTrigger value="caller" className="gap-1.5">
                    <User className="h-3.5 w-3.5" />
                    Caller Ads
                    {runningCallerAds.length > 0 && (
                      <span className="ml-1 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[0.65rem] font-medium text-emerald-700">
                        {runningCallerAds.length}
                      </span>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="host" className="gap-1.5">
                    <Users className="h-3.5 w-3.5" />
                    Host Ads
                    {runningHostAds.length > 0 && (
                      <span className="ml-1 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[0.65rem] font-medium text-emerald-700">
                        {runningHostAds.length}
                      </span>
                    )}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="caller">
                  {runningCallerAds.length === 0 ? (
                    <EmptyState
                      icon={User}
                      title="No running caller ads"
                      description="There are no advertisements currently running for callers."
                    />
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {runningCallerAds.map((ad) => (
                        <AdCard
                          key={ad.id}
                          ad={ad}
                          onToggle={handleToggle}
                          onDelete={(id) => setDeleteTarget(id)}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="host">
                  {runningHostAds.length === 0 ? (
                    <EmptyState
                      icon={Users}
                      title="No running host ads"
                      description="There are no advertisements currently running for hosts."
                    />
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {runningHostAds.map((ad) => (
                        <AdCard
                          key={ad.id}
                          ad={ad}
                          onToggle={handleToggle}
                          onDelete={(id) => setDeleteTarget(id)}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Inactive Ads */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-4">
              <h3 className="flex items-center gap-2 text-base font-semibold text-slate-900">
                <PowerOff className="h-4 w-4 text-slate-400" />
                Inactive Advertisements
              </h3>
              <p className="mt-0.5 text-xs text-slate-500">
                Disabled advertisements that can be re-enabled
              </p>
            </div>
            <div className="p-5">
              {inactiveAds.length === 0 ? (
                <EmptyState
                  icon={PowerOff}
                  title="No inactive ads"
                  description="There are no disabled advertisements."
                />
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {inactiveAds.map((ad) => (
                    <AdCard
                      key={ad.id}
                      ad={ad}
                      onToggle={handleToggle}
                      onDelete={(id) => setDeleteTarget(id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Advertisement</DialogTitle>
          </DialogHeader>
          <CreateAdForm
            onSuccess={handleCreateSuccess}
            onCancel={() => setCreateOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete advertisement?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will remove the advertisement. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-1 h-4 w-4 animate-spin" /> Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Megaphone;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        <Icon className="h-6 w-6" />
      </div>
      <h4 className="text-sm font-semibold text-slate-700">{title}</h4>
      <p className="mt-1 max-w-sm text-xs text-slate-400">{description}</p>
    </div>
  );
}
