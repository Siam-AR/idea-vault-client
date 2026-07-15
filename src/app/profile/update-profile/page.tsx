"use client";

import { useAuth } from '@/lib/auth-context';
import { buildLoginRedirectUrl } from '@/lib/auth-redirect';
import { useToast } from '@/lib/toast-context';
import { Button, Card, Input, Label, TextField } from '@heroui/react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function UpdateProfilePage() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, updateProfile, isAuthenticated, loading } = useAuth();
  const { showToast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace(buildLoginRedirectUrl(pathname));
      return;
    }

    if (user) {
      setName(user.name || '');
      setImage(user.image || '');
    }
  }, [loading, isAuthenticated, pathname, user, router]);

  const validateImageUrl = (url: string) => {
    if (!url.trim()) {
      return true;
    }

    try {
      const parsed = new URL(url);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const trimmedName = name.trim();
    const trimmedImage = image.trim();

    if (trimmedName.length < 2) {
      setError('Name must be at least 2 characters.');
      showToast('Name must be at least 2 characters.', 'error', 3000);
      return;
    }

    if (!validateImageUrl(trimmedImage)) {
      setError('Please provide a valid image URL.');
      showToast('Please provide a valid image URL.', 'error', 3000);
      return;
    }

    setIsSubmitting(true);

    try {
      await updateProfile({
        name: trimmedName,
        image: trimmedImage,
      });

      showToast('Profile updated successfully.', 'success', 2500);
      router.push('/profile');
      router.refresh();
    } catch (updateError) {
      const message = updateError instanceof Error ? updateError.message : 'Unable to update user information.';
      setError(message);
      showToast(message, 'error', 3500);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="px-4 py-10 min-h-screen flex items-center justify-center">
        <p className="text-sm text-slate-600">Loading profile editor...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="px-4 py-10 min-h-screen">
      <Card className="mx-auto max-w-lg border p-8 shadow-sm">
        <div className="space-y-2 mb-6">
          <h1 className="text-2xl font-bold">Update Information</h1>
          <p className="text-sm text-slate-500">Update your name and image URL.</p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <TextField className="w-full" name="name" type="text" isRequired>
            <Label>Name</Label>
            <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Enter your name" />
          </TextField>

          <TextField className="w-full" name="image" type="url">
            <Label>Image URL</Label>
            <Input value={image} onChange={(event) => setImage(event.target.value)} placeholder="https://example.com/image.jpg" />
          </TextField>

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" variant="primary" isDisabled={isSubmitting}>
              Update Information
            </Button>
            <Button type="button" variant="outline" onPress={() => router.push('/profile')}>
              Back to profile
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
