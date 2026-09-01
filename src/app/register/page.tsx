"use client";

import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/lib/toast-context";
import type { UserRole } from "@/types";
import {
  Button,
  Card,
  Description,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from "@heroui/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect, useCallback, useRef } from "react";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (
            element: HTMLElement,
            options: {
              type: string;
              theme: string;
              size: string;
              text: string;
            },
          ) => void;
          prompt: (
            callback: (notification?: {
              isNotDisplayed?: () => boolean;
              isSkippedMoment?: () => boolean;
              getNotDisplayedReason?: () => string;
              getSkippedReason?: () => string;
            }) => void,
          ) => void;
        };
      };
    };
  }
}

function RegisterPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register, googleLogin } = useAuth();
  const { showToast } = useToast();
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const redirectTo = searchParams.get("redirectTo") || "/";
  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("FOUNDER");
  const roleRef = useRef<UserRole>(role);
  const [googleError, setGoogleError] = useState("");
  const googleButtonRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    roleRef.current = role;
  }, [role]);
  const initializedRef = useRef(false);

  const handleGoogleResponse = useCallback(
    async (response: { credential: string }) => {
      try {
        setError("");
        setIsLoading(true);

        const base64Url = response.credential.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
            .join(""),
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
          role: roleRef.current,
        });

        setSuccess("Google sign up successful! Redirecting...");
        showToast("Google sign up successful!", "success", 2000);

        window.setTimeout(() => {
          router.push(redirectTo);
        }, 1500);
      } catch (err) {
        const errorMsg =
          err instanceof Error
            ? err.message
            : "Google sign in failed. Please try again.";
        setError(errorMsg);
        showToast(errorMsg, "error", 4000);
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
          setGoogleError("");
          window.google.accounts.id.initialize({
            client_id: googleClientId,
            callback: handleGoogleResponse,
          });

          try {
            const container = googleButtonRef.current;
            if (container) {
              window.google.accounts.id.renderButton(container, {
                type: "standard",
                theme: "outline",
                size: "large",
                text: "signup_with",
              });
            }
          } catch (err) {
            console.warn("Google renderButton failed", err);
            setGoogleError("Google sign-up button could not be rendered.");
          }
        }
      } catch (err) {
        setGoogleError(
          "Google sign-up failed to initialize. Check the client ID and authorized origins.",
        );
        console.warn("Google Sign-In initialization error", err);
      }
    };

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://accounts.google.com/gsi/client"]',
    );
    if (existingScript) {
      existingScript.addEventListener("load", initializeGoogle, { once: true });
      if (existingScript.dataset.loaded === "true") {
        initializeGoogle();
      }
      return () => {
        existingScript.removeEventListener("load", initializeGoogle);
      };
    }

    const script = document.createElement("script");
    script.id = "google-gsi-script";
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.addEventListener(
      "load",
      () => {
        script.dataset.loaded = "true";
        initializeGoogle();
      },
      { once: true },
    );
    document.body.appendChild(script);

    return () => {
      script.removeEventListener("load", initializeGoogle);
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [handleGoogleResponse, googleClientId]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const trimmedName = name.trim();
      const trimmedEmail = email.trim();

      if (!trimmedName || !trimmedEmail || !password) {
        throw new Error("Please fill in all required fields.");
      }

      await register({
        name: trimmedName,
        email: trimmedEmail,
        password,
        role,
      });
      setSuccess("Account created successfully! Redirecting...");
      showToast("Account created successfully!", "success", 2000);

      window.setTimeout(() => {
        router.push(redirectTo);
      }, 1500);
    } catch (err) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again.";
      setError(errorMsg);
      showToast(errorMsg, "error", 4000);
      setIsLoading(false);
    }
  };

  return (
    <Card className="border max-w-2xl mx-auto py-8 md:py-10 mt-5 px-4 md:px-8">
      <div className={`fade-in ${step === 1 ? "block" : "hidden"}`}>
          <h1 className="text-center text-2xl md:text-3xl font-bold mb-2">
            Choose Your Role
          </h1>
          <p className="text-center text-gray-600 mb-8">
            How would you like to use IdeaVault?
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={() => {
                setRole("FOUNDER");
                setStep(2);
              }}
              className="p-6 border-2 border-slate-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
            >
              <h3 className="text-xl font-bold mb-2 text-slate-800 group-hover:text-blue-700">Founder</h3>
              <p className="text-sm text-slate-600">I want to share my startup ideas, get feedback, and connect with potential investors.</p>
            </button>
            <button
              onClick={() => {
                setRole("INVESTOR");
                setStep(2);
              }}
              className="p-6 border-2 border-slate-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
            >
              <h3 className="text-xl font-bold mb-2 text-slate-800 group-hover:text-blue-700">Investor</h3>
              <p className="text-sm text-slate-600">I am looking to discover, evaluate, and invest in promising new startup ideas.</p>
            </button>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?
              <Link
                href={`/login${redirectTo !== "/" ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""}`}
                className="text-blue-600 hover:text-blue-700 font-semibold ml-1"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>

      <div className={`fade-in ${step === 2 ? "block" : "hidden"}`}>
        <h1 className="text-center text-2xl md:text-3xl font-bold mb-2">
          Join IdeaVault
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Create an account to share your startup ideas
        </p>

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

        <Form
          className="flex w-full mx-auto flex-col gap-4"
          onSubmit={onSubmit}
        >
          <TextField
            isRequired
            name="name"
            type="text"
            validate={(value: string) => {
              if (!/^[a-zA-Z\s]*$/.test(value)) {
                return "Name can only contain letters and spaces";
              }
              return null;
            }}
          >
            <Label>Full Name</Label>
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              disabled={isLoading}
              className="w-full"
            />
            <FieldError />
          </TextField>

          <TextField
            isRequired
            name="email"
            type="email"
            validate={(value: string) => {
              if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                return "Please enter a valid email address";
              }
              return null;
            }}
          >
            <Label>Email Address</Label>
            <Input
              suppressHydrationWarning
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={isLoading}
              className="w-full"
            />
            <FieldError />
          </TextField>

          <TextField
            isRequired
            minLength={6}
            name="password"
            type="password"
            validate={(value: string) => {
              if (value.length < 6) {
                return "Password must be at least 6 characters";
              }
              if (!/[A-Z]/.test(value)) {
                return "Password must contain at least one uppercase letter";
              }
              if (!/[a-z]/.test(value)) {
                return "Password must contain at least one lowercase letter";
              }
              return null;
            }}
          >
            <Label>Password</Label>
            <Input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={isLoading}
              className="w-full"
              type="password"
            />
            <Description>
              Use at least 6 characters with uppercase and lowercase letters
            </Description>
            <FieldError />
          </TextField>



          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            isDisabled={isLoading}
          >
            {isLoading ? "CREATING ACCOUNT..." : "SIGN UP"}
          </Button>
        </Form>

        <div className="text-center my-4 text-gray-600">Or continue with</div>
        <div ref={googleButtonRef} id="google-signin-btn" className="mt-3 flex justify-center" />

        {googleError && (
          <p className="mt-3 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
            {googleError}
          </p>
        )}

        {!googleClientId && !googleError && (
          <p className="mt-3 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
            Google sign-up is not configured. Add NEXT_PUBLIC_GOOGLE_CLIENT_ID
            to enable it.
          </p>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-2">
            Wrong role selected?{" "}
            <button
              onClick={() => setStep(1)}
              className="text-blue-600 hover:text-blue-700 font-semibold"
              type="button"
            >
              Go back
            </button>
          </p>
          <p className="text-sm text-gray-600">
            Already have an account?
            <Link
              href={`/login${redirectTo !== "/" ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""}`}
              className="text-blue-600 hover:text-blue-700 font-semibold ml-1"
            >
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
    <Suspense
      fallback={
        <div className="mx-auto mt-8 max-w-2xl px-4 text-center text-sm text-slate-600">
          Loading sign up page...
        </div>
      }
    >
      <RegisterPageContent />
    </Suspense>
  );
}
