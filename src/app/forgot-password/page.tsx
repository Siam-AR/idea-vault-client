"use client";

import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/lib/toast-context';
import { Button, Card, FieldError, Form, Input, Label, TextField } from '@heroui/react';
import { useState } from 'react';

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      const form = e.currentTarget as HTMLFormElement & {
        email: { value: string };
      };
      const email = form.email.value.trim();
      await forgotPassword(email);
      setMessage('If an account exists for that email, password reset instructions have been sent.');
      showToast('Password reset email sent.', 'success', 2500);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unable to send password reset email.';
      setError(errorMsg);
      showToast(errorMsg, 'error', 3500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mx-auto mt-8 max-w-xl border px-4 py-8 md:px-8">
      <div className="space-y-3 text-center">
        <h1 className="text-2xl font-bold">Forgot your password?</h1>
        <p className="text-sm text-slate-600">Enter your email address and we&apos;ll send reset instructions.</p>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      {message && (
        <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">{message}</div>
      )}

      <Form className="mt-6 flex flex-col gap-4" onSubmit={onSubmit}>
        <TextField isRequired name="email" type="email" validate={(value: string) => {
          if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
            return 'Please enter a valid email address';
          }
          return null;
        }}>
          <Label>Email Address</Label>
          <Input placeholder="you@example.com" disabled={isLoading} className="w-full" />
          <FieldError />
        </TextField>

        <Button type="submit" className="w-full" isDisabled={isLoading}>
          Send Reset Instructions
        </Button>
      </Form>
    </Card>
  );
}
