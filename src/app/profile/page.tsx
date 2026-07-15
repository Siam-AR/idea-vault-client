"use client";

import Loader from '@/components/Loader';
import { useAuth } from '@/lib/auth-context';
import { buildLoginRedirectUrl } from '@/lib/auth-redirect';
import { useToast } from '@/lib/toast-context';
import { Button, Card } from '@heroui/react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { FaEdit, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';

export default function ProfilePage() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, loading, logout } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace(buildLoginRedirectUrl(pathname));
    }
  }, [loading, isAuthenticated, pathname, router]);

  const handleLogout = async () => {
    try {
      await logout();
      showToast('Logged out successfully.', 'success', 2000);
      router.push('/');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to log out right now.';
      showToast(message, 'error', 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen px-4 py-10">
        <Loader message="Loading your profile..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen px-4 py-10 text-slate-900">
      <div className="mx-auto max-w-5xl space-y-6">
        <Card className="overflow-hidden border border-slate-200 shadow-sm">
          <div className="bg-linear-to-r from-cyan-500 to-blue-600 p-8 text-white">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-3xl">
                  {user?.image ? (
                    <img src={user.image} alt={user.name || 'Profile'} className="h-16 w-16 rounded-full object-cover" />
                  ) : (
                    <FaUserCircle />
                  )}
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-cyan-100">Profile</p>
                  <h1 className="mt-1 text-3xl font-bold">{user?.name || 'Anonymous User'}</h1>
                  <p className="mt-1 text-sm text-cyan-100">{user?.email}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="secondary" className="text-white" onPress={() => router.push('/profile/update-profile')}>
                  Update Profile
                </Button>
                <Button variant="danger" className="border-white/30 text-white" onPress={handleLogout}>
                  Logout
                </Button>
              </div>
            </div>
          </div>

          <div className="grid gap-6 p-8 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-lg font-semibold">Account Overview</h2>
              <div className="mt-4 space-y-3 text-sm text-slate-700">
                <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  <span>Name</span>
                  <span className="font-medium">{user?.name || 'Not provided'}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  <span>Email</span>
                  <span className="font-medium">{user?.email}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  <span>Avatar</span>
                  <span className="font-medium">{user?.image ? 'Configured' : 'Not set'}</span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-lg font-semibold">Quick Actions</h2>
              <div className="mt-4 flex flex-col gap-3">
                <Button variant="primary" className="justify-start" onPress={() => router.push('/my-ideas')}>
                  View My Projects
                </Button>
                <Button variant="outline" className="justify-start" onPress={() => router.push('/my-interactions')}>
                  View My Interactions
                </Button>
                <Button variant="outline" className="justify-start" onPress={() => router.push('/add-idea')}>
                  Add a New Project
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
