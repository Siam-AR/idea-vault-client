"use client";

import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/lib/toast-context';
import { Button, Card, Description, FieldError, Form, Input, Label, TextField } from '@heroui/react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { sanitizeRedirectPath } from '@/lib/auth-redirect';

function RegisterPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register } = useAuth();
  const { showToast } = useToast();
  const redirectTo = sanitizeRedirectPath(searchParams.get('redirectTo'));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const form = e.currentTarget as HTMLFormElement & {
        name: { value: string };
        email: { value: string };
        password: { value: string };
      };
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const password = form.password.value;

      if (!name || !email || !password) {
        throw new Error('Please fill in all required fields.');
      }

      await register({ name, email, password });
      setSuccess('Account created successfully! Redirecting...');
      showToast('Account created successfully!', 'success', 2000);

      window.setTimeout(() => {
        router.replace(redirectTo);
      }, 1500);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      setError(errorMsg);
      showToast(errorMsg, 'error', 4000);
      setIsLoading(false);
    }
  };

  return (
    <Card className="border max-w-2xl mx-auto py-8 md:py-10 mt-5 px-4 md:px-8">
      <div>
        <h1 className="text-center text-2xl md:text-3xl font-bold mb-2">Join Community Spark</h1>
        <p className="text-center text-gray-600 mb-6">Create an account to share your community projects</p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700">{success}</p>
          </div>
        )}

        <Form className="flex w-full mx-auto flex-col gap-4" onSubmit={onSubmit}>
          <TextField isRequired name="name" type="text">
            <Label>Full Name</Label>
            <Input placeholder="John Doe" disabled={isLoading} className="w-full" />
            <FieldError />
          </TextField>

          <TextField isRequired name="email" type="email" validate={(value: string) => {
            if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
              return 'Please enter a valid email address';
            }
            return null;
          }}>
            <Label>Email Address</Label>
            <Input placeholder="john@example.com" disabled={isLoading} className="w-full" />
            <FieldError />
          </TextField>

          <TextField isRequired minLength={6} name="password" type="password" validate={(value: string) => {
            if (value.length < 6) {
              return 'Password must be at least 6 characters';
            }
            if (!/[A-Z]/.test(value)) {
              return 'Password must contain at least one uppercase letter';
            }
            if (!/[a-z]/.test(value)) {
              return 'Password must contain at least one lowercase letter';
            }
            return null;
          }}>
            <Label>Password</Label>
            <Input placeholder="Create a strong password" disabled={isLoading} className="w-full" />
            <Description>Use at least 6 characters with uppercase and lowercase letters</Description>
            <FieldError />
          </TextField>

          <Button type="submit" className="w-full bg-linear-to-r from-purple-500 to-pink-500 text-white" isDisabled={isLoading}>
            {isLoading ? 'CREATING ACCOUNT...' : 'SIGN UP'}
          </Button>
        </Form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?
            <Link href={`/login${redirectTo !== '/' ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`} className="text-purple-600 hover:text-purple-700 font-semibold ml-1">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </Card>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="mx-auto mt-8 max-w-2xl px-4 text-center text-sm text-slate-600">Loading sign up page...</div>}>
      <RegisterPageContent />
    </Suspense>
  );
}
