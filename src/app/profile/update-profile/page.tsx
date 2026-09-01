"use client";

import "@uploadthing/react/styles.css";

import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/lib/toast-context';
import { Button, Card, Input, Label, TextField } from '@heroui/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { UploadButton } from '@/utils/uploadthing';

export default function UpdateProfilePage() {
  const router = useRouter();
  const { user, updateProfile, isAuthenticated, loading } = useAuth();
  const { showToast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [imageMode, setImageMode] = useState<'url' | 'upload'>('url');
  const [image, setImage] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(user.name || '');
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setImage(user.image || '');
    }
  }, [loading, isAuthenticated, user, router]);

  const validateImageUrl = (url: string) => {
    if (!url.trim()) {
      return true;
    }

    if (url.startsWith('data:image')) {
      return true;
    }

    try {
      const parsed = new URL(url);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  };

  // Removed handleFileChange, upload logic handled by UploadThing

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const trimmedName = name.trim();
    let finalImage = '';

    if (imageMode === 'url') {
      finalImage = image.trim();
    } else if (imageMode === 'upload') {
      finalImage = imagePreview.trim();
    }

    if (trimmedName.length < 2) {
      setError('Name must be at least 2 characters.');
      showToast('Name must be at least 2 characters.', 'error', 3000);
      return;
    }

    if (finalImage && !validateImageUrl(finalImage)) {
      setError('Please provide a valid image.');
      showToast('Please provide a valid image.', 'error', 3000);
      return;
    }

    setIsSubmitting(true);

    try {
      await updateProfile({
        name: trimmedName,
        image: finalImage,
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

          <div className="flex flex-col gap-2">
            <Label>Profile Photo</Label>
            <div className="flex gap-2 mb-2">
              <Button 
                type="button" 
                size="sm" 
                variant={imageMode === 'url' ? 'primary' : 'outline'} 
                onPress={() => setImageMode('url')}
              >
                Image URL
              </Button>
              <Button 
                type="button" 
                size="sm" 
                variant={imageMode === 'upload' ? 'primary' : 'outline'} 
                onPress={() => setImageMode('upload')}
              >
                Upload Photo
              </Button>
            </div>
            
            {imageMode === 'url' ? (
              <Input 
                value={image} 
                onChange={(event) => setImage(event.target.value)} 
                placeholder="https://example.com/image.jpg" 
              />
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 p-6">
                {!imagePreview ? (
                  <UploadButton
                    endpoint="imageUploader"
                    onUploadBegin={() => {
                      setIsUploading(true);
                    }}
                    onClientUploadComplete={(res) => {
                      setIsUploading(false);
                      if (res && res.length > 0) {
                        setImagePreview(res[0].url);
                        showToast("Upload completed!", "success");
                      }
                    }}
                    onUploadError={(error: Error) => {
                      setIsUploading(false);
                      showToast(`Upload failed: ${error.message}`, "error");
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <img src={imagePreview} alt="Preview" className="h-24 w-24 rounded-full object-cover border border-slate-200" />
                    <Button 
                      type="button" 
                      size="sm" 
                      variant="ghost" 
                      className="text-red-500"
                      onPress={() => setImagePreview('')}
                    >
                      Remove image
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" variant="primary" isDisabled={isSubmitting || isUploading}>
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
