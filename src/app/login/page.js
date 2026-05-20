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
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const email = e.target.email.value;
      const password = e.target.password.value;

      await login({ email, password });
      setSuccess("Sign in successful! Redirecting...");
      showToast("Login successful!", "success", 2000);

      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (err) {
      const errorMsg = err.message || "Sign in failed. Please check your credentials and try again.";
      setError(errorMsg);
      showToast(errorMsg, "error", 4000);
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    showToast("Google sign in coming soon!", "info", 3000);
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
              placeholder="Enter your password"
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
              {isLoading ? "LOGGING IN..." : "LOG IN"}
            </Button>
          </div>
        </Form>

        <div className="text-center my-4 text-gray-600">Or continue with</div>

        <Button
          onClick={handleGoogleSignIn}
          variant="outline"
          className="w-full"
          isDisabled={isLoading}
        >
          <FcGoogle /> Sign In With Google
        </Button>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?
            <Link
              as={NextLink}
              href="/register"
              className="text-purple-600 hover:text-purple-700 font-semibold ml-1"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </Card>
  );
}