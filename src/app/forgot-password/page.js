"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
  Link,
} from "@heroui/react";
import NextLink from "next/link";
import { useToast } from "@/lib/toast-context";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const email = e.target.email.value;

      // UI-only: simulate success message
      setSuccess("If an account exists for that email, you'll receive reset instructions shortly.");
      showToast("Password reset link sent (UI-only)", "success", 3000);

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      setError("Unable to process request. Please try again later.");
      showToast("Failed to request password reset", "error", 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border max-w-2xl mx-auto py-8 md:py-10 mt-5 px-4 md:px-8">
      <div>
        <h1 className="text-center text-2xl md:text-3xl font-bold mb-2">Forgot Password</h1>
        <p className="text-center text-gray-600 mb-6">Enter your email to receive reset instructions</p>

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
            <Input placeholder="john@example.com" disabled={isLoading} className="w-full" />
            <FieldError />
          </TextField>

          <div className="flex gap-2">
            <Button
              type="submit"
              className="w-full bg-linear-to-r from-purple-500 to-pink-500 text-white"
              isDisabled={isLoading}
              isLoading={isLoading}
            >
              {isLoading ? "SENDING..." : "SEND RESET LINK"}
            </Button>
          </div>
        </Form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Remembered your password?
            <Link as={NextLink} href="/login" className="text-purple-600 hover:text-purple-700 font-semibold ml-1">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </Card>
  );
}
