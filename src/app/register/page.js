"use client";

import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/lib/toast-context";
import {
  Button,
  Card,
  Description,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
  Link,
} from "@heroui/react";
import { FcGoogle } from "react-icons/fc";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const { register, googleLogin } = useAuth();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleGoogleResponse = useCallback(async (response) => {
    try {
      setError("");
      setIsLoading(true);

      // Decode JWT token to get user info
      const base64Url = response.credential.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );

      const userData = JSON.parse(jsonPayload);

      // Call backend with Google OAuth data
      await googleLogin({
        name: userData.name,
        email: userData.email,
        image: userData.picture,
        googleId: userData.sub,
      });

      setSuccess("Google sign up successful! Redirecting...");
      showToast("Registration successful!", "success", 2000);

      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (err) {
      const errorMsg = err.message || "Google sign up failed. Please try again.";
      setError(errorMsg);
      showToast(errorMsg, "error", 4000);
      setIsLoading(false);
    }
  }, [googleLogin, showToast, router]);

  // Initialize Google Sign-In
  useEffect(() => {
    // Load Google Sign-In script
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.google && window.google.accounts) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID",
          callback: handleGoogleResponse,
        });
      }
    };

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [handleGoogleResponse]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const name = e.target.name.value;
      const email = e.target.email.value;
      const password = e.target.password.value;
      const image = e.target.image.value;

      await register({ name, email, password, image });
      setSuccess("Sign up successful! Redirecting...");
      showToast("Registration successful!", "success", 2000);

      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (err) {
      const errorMsg = err.message || "Registration failed. Please try again.";
      setError(errorMsg);
      showToast(errorMsg, "error", 4000);
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    if (window.google && window.google.accounts) {
      // Trigger the One Tap UI or sign-in prompt
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // Fallback to One Tap if prompt not displayed
          window.google.accounts.id.renderButton(
            document.getElementById("google-signup-btn"),
            {
              type: "standard",
              size: "large",
              theme: "outline",
              text: "signup_with",
            }
          );
        }
      });
    } else {
      showToast("Google Sign-Up not ready. Please refresh the page.", "error", 3000);
    }
  };

  return (
    <Card className="border max-w-2xl mx-auto py-8 md:py-10 mt-5 px-4 md:px-8">
      <div>
        <h1 className="text-center text-2xl md:text-3xl font-bold mb-2">Join IdeaVault</h1>
        <p className="text-center text-gray-600 mb-6">Create an account to start sharing ideas</p>

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
            name="name"
            type="text"
            validate={(value) => {
              if (value.length < 2) {
                return "Name must be at least 2 characters";
              }
              return null;
            }}
          >
            <Label>Full Name</Label>
            <Input
              placeholder="John Doe"
              disabled={isLoading}
              className="w-full"
            />
            <FieldError />
          </TextField>

          <TextField
            name="image"
            type="url"
          >
            <Label>Photo URL (Optional)</Label>
            <Input
              placeholder="https://example.com/photo.jpg"
              disabled={isLoading}
              className="w-full"
            />
            <FieldError />
          </TextField>

          <TextField
            isRequired
            name="email"
            type="email"
            validate={(value) => {
              if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                return "Please enter a valid email address";
              }
              return null;
            }}
          >
            <Label>Email Address</Label>
            <Input
              placeholder="john@example.com"
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
            validate={(value) => {
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
              placeholder="Create a password"
              disabled={isLoading}
              className="w-full"
            />
            <Description>
              Must be at least 6 characters with uppercase and lowercase letters
            </Description>
            <FieldError />
          </TextField>

          <div className="flex gap-2">
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white"
              isDisabled={isLoading}
              isLoading={isLoading}
            >
              {isLoading ? "SIGNING UP..." : "CREATE ACCOUNT"}
            </Button>
          </div>
        </Form>

        <div className="text-center my-4 text-gray-600">Or sign up with</div>

        <Button
          onClick={handleGoogleSignUp}
          variant="outline"
          className="w-full"
          isDisabled={isLoading}
        >
          <FcGoogle /> Sign Up With Google
        </Button>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?
            <Link
              as={NextLink}
              href="/login"
              className="text-purple-600 hover:text-purple-700 font-semibold ml-1"
            >
              Log In
            </Link>
          </p>
        </div>
      </div>
    </Card>
  );
}