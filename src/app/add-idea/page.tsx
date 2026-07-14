"use client";

import { ideasAPI } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/lib/toast-context";
import { Button, Card } from "@heroui/react";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import type { User } from "@/types";

const CATEGORIES = ["Tech", "Health", "AI", "Education", "Finance", "SaaS", "Environment"];

interface AddIdeaForm {
  title: string;
  shortDescription: string;
  detailedDescription: string;
  category: string;
  tags: string;
  imageURL: string;
  estimatedBudget: string;
  targetAudience: string;
  problemStatement: string;
  proposedSolution: string;
}

const initialState: AddIdeaForm = {
  title: "",
  shortDescription: "",
  detailedDescription: "",
  category: "Tech",
  tags: "",
  imageURL: "",
  estimatedBudget: "",
  targetAudience: "",
  problemStatement: "",
  proposedSolution: "",
};

const isValidHttpUrl = (value: string): boolean => {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

export default function AddIdeaPage() {
  const router = useRouter();
  const { user, loading, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [form, setForm] = useState<AddIdeaForm>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  const requiredMissing = useMemo(() => {
    const requiredFields: Array<keyof AddIdeaForm> = [
      "title",
      "shortDescription",
      "detailedDescription",
      "category",
      "imageURL",
      "targetAudience",
      "problemStatement",
      "proposedSolution",
    ];

    return requiredFields.some((key) => !String(form[key] || "").trim());
  }, [form]);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    const key = name as keyof AddIdeaForm;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");

    if (requiredMissing) {
      const message = "Please fill in all required fields.";
      setFormError(message);
      showToast(message, "error", 3000);
      return;
    }

    if (!isValidHttpUrl(form.imageURL.trim())) {
      const message = "Please provide a valid Image URL (http/https).";
      setFormError(message);
      showToast(message, "error", 3000);
      return;
    }

    const tags = form.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    const payload = {
      title: form.title.trim(),
      shortDescription: form.shortDescription.trim(),
      detailedDescription: form.detailedDescription.trim(),
      category: form.category,
      tags,
      imageURL: form.imageURL.trim(),
      estimatedBudget: form.estimatedBudget.trim(),
      targetAudience: form.targetAudience.trim(),
      problemStatement: form.problemStatement.trim(),
      proposedSolution: form.proposedSolution.trim(),
      userName: (user as User | null)?.name || "Anonymous",
      userEmail: (user as User | null)?.email || "",
    };

    try {
      setSubmitting(true);
      await ideasAPI.create(payload);

      showToast("Idea submitted successfully!", "success", 2500);
      setForm(initialState);
      router.push("/ideas");
      router.refresh();
    } catch (error) {
      const message = (error as Error)?.message || "Unable to submit idea right now.";
      setFormError(message);
      showToast(message, "error", 3500);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="px-4 py-10 min-h-screen flex items-center justify-center">
        <p className="text-sm text-slate-600">Loading add idea form...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="px-4 py-8 md:py-10">
      <Card className="mx-auto max-w-4xl border border-slate-200 p-6 md:p-8 shadow-sm">
        <div className="mb-6 space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Add A Startup Idea</h1>
          <p className="text-sm text-slate-600">Share your concept with the community and get real feedback.</p>
        </div>

        {formError && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm font-medium text-slate-700">Idea Title *</span>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter your startup idea title"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-500"
            />
          </label>

          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm font-medium text-slate-700">Short Description *</span>
            <textarea
              name="shortDescription"
              value={form.shortDescription}
              onChange={handleChange}
              rows={3}
              placeholder="A short summary of your idea"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-500"
            />
          </label>

          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm font-medium text-slate-700">Detailed Description *</span>
            <textarea
              name="detailedDescription"
              value={form.detailedDescription}
              onChange={handleChange}
              rows={5}
              placeholder="Describe your idea in depth"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-500"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Category *</span>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-500"
            >
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Tags (optional)</span>
            <input
              name="tags"
              value={form.tags}
              onChange={handleChange}
              placeholder="AI, Startup, SaaS"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-500"
            />
          </label>

          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm font-medium text-slate-700">Image URL *</span>
            <input
              name="imageURL"
              value={form.imageURL}
              onChange={handleChange}
              placeholder="https://example.com/idea-image.jpg"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-500"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Estimated Budget (optional)</span>
            <input
              name="estimatedBudget"
              value={form.estimatedBudget}
              onChange={handleChange}
              placeholder="$15,000"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-500"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Target Audience *</span>
            <input
              name="targetAudience"
              value={form.targetAudience}
              onChange={handleChange}
              placeholder="Who will use this idea?"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-500"
            />
          </label>

          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm font-medium text-slate-700">Problem Statement *</span>
            <textarea
              name="problemStatement"
              value={form.problemStatement}
              onChange={handleChange}
              rows={4}
              placeholder="What problem does this idea solve?"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-500"
            />
          </label>

          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm font-medium text-slate-700">Proposed Solution *</span>
            <textarea
              name="proposedSolution"
              value={form.proposedSolution}
              onChange={handleChange}
              rows={4}
              placeholder="How does your idea solve the problem?"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-500"
            />
          </label>

          <div className="md:col-span-2 flex flex-wrap gap-3 pt-2">
            <Button type="submit" variant="primary" isDisabled={submitting}>
              {submitting ? "Submitting..." : "Submit Idea"}
            </Button>
            <Button type="button" variant="outline" onPress={() => router.push("/ideas")} isDisabled={submitting}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
