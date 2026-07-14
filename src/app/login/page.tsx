"use client";

import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/lib/toast-context';
import {
  Button,
  Card,
  Description,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from '@heroui/react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState, useEffect, useCallback, useRef } from 'react';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: { client_id: string; callback: (response: { credential: string }) => void }) => void;
          renderButton: (element: HTMLElement, options: { type: string; theme: string; size: string; text: string }) => void;
          prompt: (callback: (notification?: { isNotDisplayed?: () => boolean; isSkippedMoment?: () => boolean; getNotDisplayedReason?: () => string; getSkippedReason?: () => string }) => void) => void;
        };
      };
    };
  }
}

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, googleLogin } = useAuth();
  const { showToast } = useToast();
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [googleError, setGoogleError] = useState('');
  const googleButtonRef = useRef<HTMLDivElement | null>(null);
  const initializedRef = useRef(false);
  const redirectTo = searchParams.get('redirectTo') || '/';
  const getOriginLabel = () => (typeof window !== 'undefined' ? window.location.origin : 'this site');

  const handleGoogleResponse = useCallback(
    async (response: { credential: string }) => {
      try {
        setError('');
        setIsLoading(true);

        const base64Url = response.credential.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
            .join(''),
        );

        const userData = JSON.parse(jsonPayload) as {
          name?: string;
          email?: string;
          picture?: string;
          sub?: string;
        };

        await googleLogin({
          name: userData.name,
          email: userData.email,
          image: userData.picture,
          googleId: userData.sub,
        });

        setSuccess('Google sign in successful! Redirecting...');
        showToast('Google login successful!', 'success', 2000);

        window.setTimeout(() => {
          router.push(redirectTo);
        }, 1500);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Google sign in failed. Please try again.';
        setError(errorMsg);
        showToast(errorMsg, 'error', 4000);
        setIsLoading(false);
      }
    },
    [googleLogin, showToast, router, redirectTo],
  );

  useEffect(() => {
    if (!googleClientId || initializedRef.current) return;

    initializedRef.current = true;

    const initializeGoogle = () => {
      try {
        if (window.google && window.google.accounts) {
          setGoogleError('');
          window.google.accounts.id.initialize({
            client_id: googleClientId,
            callback: handleGoogleResponse,
          });

          try {
            const container = googleButtonRef.current;
            if (container) {
              window.google.accounts.id.renderButton(container, {
                type: 'standard',
                theme: 'outline',
                size: 'large',
                text: 'signin_with',
              });
            }
          } catch (err) {
            console.warn('Google renderButton failed', err);
            setGoogleError('Google sign-in button could not be rendered.');
          }
        }
      } catch (err) {
        setGoogleError('Google sign-in failed to initialize. Check the client ID and authorized origins.');
        console.warn('Google Sign-In initialization error', err);
      }
    };

    const existingScript = document.querySelector<HTMLScriptElement>('script[src="https://accounts.google.com/gsi/client"]');
    if (existingScript) {
      existingScript.addEventListener('load', initializeGoogle, { once: true });
      if (existingScript.dataset.loaded === 'true') {
        initializeGoogle();
      }
      return () => {
        existingScript.removeEventListener('load', initializeGoogle);
      };
    }

    const script = document.createElement('script');
    script.id = 'google-gsi-script';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.addEventListener('load', () => {
      script.dataset.loaded = 'true';
      initializeGoogle();
    }, { once: true });
    document.body.appendChild(script);

    return () => {
      script.removeEventListener('load', initializeGoogle);
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [handleGoogleResponse, googleClientId]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const form = e.currentTarget as HTMLFormElement & {
        email: { value: string };
        password: { value: string };
      };
      const email = form.email.value;
      const password = form.password.value;

      await login({ email, password });
      setSuccess('Sign in successful! Redirecting...');
      showToast('Login successful!', 'success', 2000);

      window.setTimeout(() => {
        router.push(redirectTo);
      }, 1500);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Sign in failed. Please check your credentials and try again.';
      setError(errorMsg);
      showToast(errorMsg, 'error', 4000);
      setIsLoading(false);
    }
  };

  return (
    <Card className="border max-w-2xl mx-auto py-8 md:py-10 mt-5 px-4 md:px-8">
      <div>
        <h1 className="text-center text-2xl md:text-3xl font-bold mb-2">Sign In to IdeaVault</h1>
        <p className="text-center text-gray-600 mb-6">Share and explore innovative startup ideas</p>

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
          <TextField
            isRequired
            name="email"
            type="email"
            validate={(value: string) => {
              if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                return 'Please enter a valid email address';
              }
              return null;
            }}
          >
            <Label>Email Address</Label>
            <Input placeholder="john@example.com" disabled={isLoading} className="w-full" suppressHydrationWarning />
            <FieldError />
          </TextField>

          <TextField
            isRequired
            minLength={6}
            name="password"
            type="password"
            validate={(value: string) => {
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
            }}
          >
            <Label>Password</Label>
            <Input placeholder="Enter your password" disabled={isLoading} className="w-full" suppressHydrationWarning />
            <Description>Must be at least 6 characters with uppercase and lowercase letters</Description>
            <FieldError />
          </TextField>

          <div className="text-right">
            <Link href="/forgot-password" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
              Forgot Password?
            </Link>
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="w-full bg-linear-to-r from-purple-500 to-pink-500 text-white" isDisabled={isLoading}>
              {isLoading ? 'LOGGING IN...' : 'LOG IN'}
            </Button>
          </div>
        </Form>

        <div className="text-center my-4 text-gray-600">Or continue with</div>
        <div ref={googleButtonRef} id="google-signin-btn" className="mt-3" />

        {googleError && (
          <p className="mt-3 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
            {googleError}
          </p>
        )}

        {!googleClientId && !googleError && (
          <p className="mt-3 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
            Google sign-in is not configured. Add NEXT_PUBLIC_GOOGLE_CLIENT_ID to enable it.
          </p>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {"Don't have an account?"}
            <Link href={`/register${redirectTo !== '/' ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`} className="text-purple-600 hover:text-purple-700 font-semibold ml-1">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="mx-auto mt-8 max-w-2xl px-4 text-center text-sm text-slate-600">Loading sign in page...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}
