"use client";

import { ideasAPI } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/lib/toast-context";
import { Button, Card } from "@heroui/react";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import type { User } from "@/types";

const CATEGORIES = ["Education", "Environment", "Health", "Community Welfare", "Technology", "Culture"];

interface AddIdeaForm {
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  tags: string;
  imageURL: string;
  location: string;
  supportNeeded: string;
  priority: string;
}

const initialState: AddIdeaForm = {
  title: "",
  shortDescription: "",
  fullDescription: "",
  category: "Education",
  tags: "",
  imageURL: "",
  location: "",
  supportNeeded: "",
  priority: "Medium",
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
      "fullDescription",
      "category",
      "imageURL",
      "location",
      "supportNeeded",
      "priority",
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
      fullDescription: form.fullDescription.trim(),
      detailedDescription: form.fullDescription.trim(),
      category: form.category,
      tags,
      imageURL: form.imageURL.trim(),
      location: form.location.trim(),
      supportNeeded: form.supportNeeded.trim(),
      priority: form.priority,
      targetAudience: form.location.trim(),
      problemStatement: form.supportNeeded.trim(),
      proposedSolution: form.priority,
      userName: (user as User | null)?.name || "Anonymous",
      userEmail: (user as User | null)?.email || "",
    };

    try {
      setSubmitting(true);
      await ideasAPI.create(payload);

      showToast("Project submitted successfully!", "success", 2500);
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
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Add A Community Project</h1>
          <p className="text-sm text-slate-600">Share a local initiative and invite your community to collaborate.</p>
        </div>

        {formError && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm font-medium text-slate-700">Project Title *</span>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter your community project title"
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
            <span className="mb-2 block text-sm font-medium text-slate-700">Full Description *</span>
            <textarea
              name="fullDescription"
              value={form.fullDescription}
              onChange={handleChange}
              rows={5}
              placeholder="Describe the project scope, beneficiaries, and expected impact"
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
              placeholder="volunteer, neighborhood, cleanup"
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
            <span className="mb-2 block text-sm font-medium text-slate-700">Location *</span>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Ward 12, Chittagong"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-500"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Priority *</span>
            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-500"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </label>

          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm font-medium text-slate-700">Support Needed *</span>
            <textarea
              name="supportNeeded"
              value={form.supportNeeded}
              onChange={handleChange}
              rows={4}
              placeholder="List volunteers, materials, expertise, or funding needed"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-500"
            />
          </label>

          <div className="md:col-span-2 flex flex-wrap gap-3 pt-2">
            <Button type="submit" variant="primary" isDisabled={submitting}>
              {submitting ? "Submitting..." : "Submit Project"}
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
