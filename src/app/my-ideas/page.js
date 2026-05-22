"use client";

import Loader from "@/components/Loader";
import { ideasAPI } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/lib/toast-context";
import {
    Button,
    Card,
    Input,
    Modal,
    ModalBackdrop,
    ModalBody,
    ModalContainer,
    ModalDialog,
    ModalFooter,
    ModalHeader,
    ModalCloseTrigger,
    ModalHeading,
    Label,
    Surface,
    TextArea,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FaCalendarAlt, FaEdit, FaEye, FaMoneyBillWave, FaTag, FaTrash, FaUser } from "react-icons/fa";

const CATEGORY_OPTIONS = ["Tech", "Health", "AI", "Education", "Finance", "SaaS", "Environment"];

const createFormState = (idea = {}) => ({
    title: idea.title || "",
    shortDescription: idea.shortDescription || "",
    detailedDescription: idea.detailedDescription || "",
    category: idea.category || "Tech",
    tags: Array.isArray(idea.tags) ? idea.tags.join(", ") : idea.tags || "",
    imageURL: idea.imageURL || "",
    estimatedBudget: idea.estimatedBudget || "",
    targetAudience: idea.targetAudience || "",
    problemStatement: idea.problemStatement || "",
    proposedSolution: idea.proposedSolution || "",
});

const formatDate = (value) => {
    if (!value) return "Recently";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Recently";

    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

const formatBudget = (budget) => {
    if (!budget) return "Budget not listed";
    return budget;
};

const fetchUserIdeas = async () => {
    const data = await ideasAPI.getUserIdeas();
    return Array.isArray(data) ? data : [];
};

export default function MyIdeaPage() {
    const router = useRouter();
    const { loading, isAuthenticated } = useAuth();
    const { showToast } = useToast();

    const [ideas, setIdeas] = useState([]);
    const [pageLoading, setPageLoading] = useState(true);
    const [error, setError] = useState("");
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedIdea, setSelectedIdea] = useState(null);
    const [editForm, setEditForm] = useState(createFormState());
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push("/login");
        }
    }, [loading, isAuthenticated, router]);

    useEffect(() => {
        let active = true;

        const fetchIdeas = async () => {
            try {
                setPageLoading(true);
                const data = await fetchUserIdeas();

                if (!active) return;

                setIdeas(Array.isArray(data) ? data : []);
                setError("");
            } catch (fetchError) {
                if (!active) return;

                const message = fetchError?.message || "Unable to load your ideas right now.";
                setIdeas([]);
                setError(message);
                showToast(message, "error", 3500);
            } finally {
                if (active) {
                    setPageLoading(false);
                }
            }
        };

        if (!loading && isAuthenticated) {
            fetchIdeas();
        }

        return () => {
            active = false;
        };
    }, [loading, isAuthenticated, showToast]);

    const selectedIdeaPreview = useMemo(
        () => ideas.find((idea) => idea._id === selectedIdea?._id) || selectedIdea,
        [ideas, selectedIdea],
    );

    const openEditModal = (idea) => {
        setSelectedIdea(idea);
        setEditForm(createFormState(idea));
        setIsEditOpen(true);
    };

    const openDeleteModal = (idea) => {
        setSelectedIdea(idea);
        setIsDeleteOpen(true);
    };

    const openIdeaDetails = (ideaId) => {
        router.push(`/ideas/${ideaId}`);
    };

    const handleEditChange = (event) => {
        const { name, value } = event.target;
        setEditForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async (event) => {
        event.preventDefault();
        if (!selectedIdea) return;

        const trimmedTitle = editForm.title.trim();
        const trimmedShortDescription = editForm.shortDescription.trim();
        const trimmedDetailedDescription = editForm.detailedDescription.trim();
        const trimmedImageURL = editForm.imageURL.trim();
        const trimmedTargetAudience = editForm.targetAudience.trim();
        const trimmedProblemStatement = editForm.problemStatement.trim();
        const trimmedProposedSolution = editForm.proposedSolution.trim();

        if (
            !trimmedTitle ||
            !trimmedShortDescription ||
            !trimmedDetailedDescription ||
            !trimmedImageURL ||
            !trimmedTargetAudience ||
            !trimmedProblemStatement ||
            !trimmedProposedSolution
        ) {
            showToast("Please fill in all required fields.", "error", 3000);
            return;
        }

        setSubmitting(true);

        try {
            const payload = {
                title: trimmedTitle,
                shortDescription: trimmedShortDescription,
                detailedDescription: trimmedDetailedDescription,
                category: editForm.category,
                tags: editForm.tags
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter(Boolean),
                imageURL: trimmedImageURL,
                estimatedBudget: editForm.estimatedBudget.trim(),
                targetAudience: trimmedTargetAudience,
                problemStatement: trimmedProblemStatement,
                proposedSolution: trimmedProposedSolution,
            };

            await ideasAPI.update(selectedIdea._id, payload);
            showToast("Idea updated successfully.", "success", 2500);
            setIsEditOpen(false);
            setSelectedIdea(null);
            setIdeas((prev) =>
                prev.map((idea) =>
                    idea._id === selectedIdea._id
                        ? {
                              ...idea,
                              ...payload,
                              tags: payload.tags,
                          }
                        : idea,
                ),
            );
        } catch (updateError) {
            const message = updateError?.message || "Unable to update idea right now.";
            showToast(message, "error", 3500);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedIdea) return;

        setSubmitting(true);

        try {
            await ideasAPI.delete(selectedIdea._id);
            showToast("Idea deleted successfully.", "success", 2500);
            setIsDeleteOpen(false);
            setSelectedIdea(null);
            setIdeas((prev) => prev.filter((idea) => idea._id !== selectedIdea._id));
        } catch (deleteError) {
            const message = deleteError?.message || "Unable to delete idea right now.";
            showToast(message, "error", 3500);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading || pageLoading) {
        return (
            <div className="px-4 py-10 min-h-screen">
                <Loader message="Loading your ideas..." />
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="px-4 py-8 md:py-10 text-slate-900">
            <div className="mx-auto max-w-7xl space-y-8">
                <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white px-6 py-8 shadow-[0_20px_70px_rgba(15,23,42,0.08)] md:px-8 md:py-10">
                    <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
                        <div>
                            <p className="inline-flex items-center gap-2 rounded-full border border-cyan-500/15 bg-cyan-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-700">
                                <FaEdit className="text-[0.7rem]" />
                                My Ideas
                            </p>
                            <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900 md:text-5xl">
                                Your submitted startup ideas
                            </h1>
                            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
                                Review, update, or delete the ideas you created for the community.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center shadow-sm">
                                <p className="text-2xl font-bold text-slate-900">{ideas.length}</p>
                                <p className="text-sm text-slate-600">Total ideas</p>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center shadow-sm">
                                <p className="text-2xl font-bold text-slate-900">{ideas.length}</p>
                                <p className="text-sm text-slate-600">Owned by you</p>
                            </div>
                        </div>
                    </div>
                </section>

                {error && (
                    <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-700 shadow-sm">
                        {error}
                    </div>
                )}

                {ideas.length === 0 ? (
                    <Card className="border border-slate-200 p-8 text-center shadow-sm">
                        <h2 className="text-2xl font-bold text-slate-900">No ideas yet</h2>
                        <p className="mt-2 text-sm text-slate-600">
                            Add your first startup idea to start managing it here.
                        </p>
                        <div className="mt-6 flex justify-center">
                            <Button color="primary" onPress={() => router.push("/add-idea")}>
                                Add Idea
                            </Button>
                        </div>
                    </Card>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {ideas.map((idea) => (
                            <article
                                key={idea._id}
                                className="flex h-full flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                            >
                                <div
                                    className="h-52 bg-cover bg-center"
                                    style={{
                                        backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.08), rgba(15,23,42,0.16)), url(${idea.imageURL || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop"})`,
                                    }}
                                />

                                <div className="flex flex-1 flex-col p-5">
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700">
                                            {idea.category || "Uncategorized"}
                                        </span>
                                        <span className="text-xs text-slate-500">{formatDate(idea.createdAt)}</span>
                                    </div>

                                    <h2 className="mt-3 min-h-16 text-2xl font-bold tracking-tight text-slate-900">
                                        {idea.title}
                                    </h2>

                                    <p className="mt-3 min-h-20 text-sm leading-7 text-slate-600">
                                        {idea.shortDescription}
                                    </p>

                                    <div className="mt-4 grid gap-3 text-sm text-slate-700">
                                        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                                            <FaMoneyBillWave className="text-cyan-600" />
                                            <span>{formatBudget(idea.estimatedBudget)}</span>
                                        </div>
                                        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                                            <FaUser className="text-cyan-600" />
                                            <span>{idea.userName || idea.userEmail || "Anonymous"}</span>
                                        </div>
                                        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                                            <FaCalendarAlt className="text-cyan-600" />
                                            <span>{idea.commentCount ?? 0} comments</span>
                                        </div>
                                    </div>

                                    <div className="mt-auto pt-5 flex gap-3">
                                        <Button
                                            className="flex-1 border border-slate-200 bg-white text-slate-700 shadow-sm"
                                            variant="bordered"
                                            startContent={<FaEye />}
                                            onPress={() => openIdeaDetails(idea._id)}
                                        >
                                            View Details
                                        </Button>
                                        <Button
                                            className="flex-1 bg-linear-to-r from-cyan-500 to-blue-600 text-white"
                                            startContent={<FaEdit />}
                                            onPress={() => openEditModal(idea)}
                                        >
                                            Update
                                        </Button>
                                        <Button
                                            className="flex-1"
                                            color="danger"
                                            variant="bordered"
                                            startContent={<FaTrash />}
                                            onPress={() => openDeleteModal(idea)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>

            <Modal isOpen={isEditOpen} onOpenChange={setIsEditOpen}>
                <ModalBackdrop>
                    <ModalContainer placement="center" size="5xl" scroll="inside">
                        {(onClose) => (
                            <ModalDialog className="overflow-hidden border border-slate-200 bg-white shadow-[0_30px_100px_rgba(15,23,42,0.18)] sm:max-w-5xl">
                                <ModalCloseTrigger className="right-4 top-4 text-slate-500 transition hover:text-slate-900" />
                                <ModalHeader className="border-b border-slate-100 bg-linear-to-br from-slate-50 via-white to-cyan-50/40 px-6 py-6 md:px-8 md:py-7">
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25">
                                            <FaEdit className="text-lg" />
                                        </div>
                                        <div className="min-w-0">
                                            <ModalHeading className="text-3xl font-black tracking-tight text-slate-900">Update Idea</ModalHeading>
                                            <p className="mt-1.5 text-sm leading-6 text-slate-600">
                                                Refine the details below so your idea reads clearly and professionally.
                                            </p>
                                        </div>
                                    </div>
                                </ModalHeader>
                                <ModalBody className="px-4 py-4 md:px-6 md:py-6">
                                    <form onSubmit={handleUpdate} className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                                        <div className="grid gap-5 md:grid-cols-2">
                                            <div className="md:col-span-2">
                                                <Label className="mb-2 block text-sm font-semibold text-slate-700">Idea Title *</Label>
                                                <Input
                                                    name="title"
                                                    value={editForm.title}
                                                    onChange={handleEditChange}
                                                    placeholder="Enter a clear, concise title"
                                                    className="w-full"
                                                />
                                            </div>

                                            <div className="md:col-span-2">
                                                <Label className="mb-2 block text-sm font-semibold text-slate-700">Short Description *</Label>
                                                <TextArea
                                                    name="shortDescription"
                                                    value={editForm.shortDescription}
                                                    onChange={handleEditChange}
                                                    minRows={3}
                                                    placeholder="One or two lines that summarize the idea"
                                                    className="w-full"
                                                />
                                            </div>

                                            <div className="md:col-span-2">
                                                <Label className="mb-2 block text-sm font-semibold text-slate-700">Detailed Description *</Label>
                                                <TextArea
                                                    name="detailedDescription"
                                                    value={editForm.detailedDescription}
                                                    onChange={handleEditChange}
                                                    minRows={5}
                                                    placeholder="Explain the problem, the solution, and the value"
                                                    className="w-full"
                                                />
                                            </div>

                                            <div>
                                                <Label className="mb-2 block text-sm font-semibold text-slate-700">Category *</Label>
                                                <select
                                                    name="category"
                                                    value={editForm.category}
                                                    onChange={handleEditChange}
                                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
                                                >
                                                    {CATEGORY_OPTIONS.map((category) => (
                                                        <option key={category} value={category}>
                                                            {category}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <Label className="mb-2 block text-sm font-semibold text-slate-700">Tags (optional)</Label>
                                                <Input
                                                    name="tags"
                                                    value={editForm.tags}
                                                    onChange={handleEditChange}
                                                    placeholder="AI, SaaS, productivity"
                                                    className="w-full"
                                                />
                                            </div>

                                            <div className="md:col-span-2">
                                                <Label className="mb-2 block text-sm font-semibold text-slate-700">Image URL *</Label>
                                                <Input
                                                    name="imageURL"
                                                    value={editForm.imageURL}
                                                    onChange={handleEditChange}
                                                    placeholder="https://..."
                                                    className="w-full"
                                                />
                                            </div>

                                            <div>
                                                <Label className="mb-2 block text-sm font-semibold text-slate-700">Estimated Budget</Label>
                                                <Input
                                                    name="estimatedBudget"
                                                    value={editForm.estimatedBudget}
                                                    onChange={handleEditChange}
                                                    placeholder="$10,000"
                                                    className="w-full"
                                                />
                                            </div>

                                            <div>
                                                <Label className="mb-2 block text-sm font-semibold text-slate-700">Target Audience *</Label>
                                                <Input
                                                    name="targetAudience"
                                                    value={editForm.targetAudience}
                                                    onChange={handleEditChange}
                                                    placeholder="Students, founders, teams..."
                                                    className="w-full"
                                                />
                                            </div>

                                            <div className="md:col-span-2">
                                                <Label className="mb-2 block text-sm font-semibold text-slate-700">Problem Statement *</Label>
                                                <TextArea
                                                    name="problemStatement"
                                                    value={editForm.problemStatement}
                                                    onChange={handleEditChange}
                                                    minRows={4}
                                                    placeholder="What pain point does this solve?"
                                                    className="w-full"
                                                />
                                            </div>

                                            <div className="md:col-span-2">
                                                <Label className="mb-2 block text-sm font-semibold text-slate-700">Proposed Solution *</Label>
                                                <TextArea
                                                    name="proposedSolution"
                                                    value={editForm.proposedSolution}
                                                    onChange={handleEditChange}
                                                    minRows={4}
                                                    placeholder="Describe the idea or approach"
                                                    className="w-full"
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-6 flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 pt-5">
                                            <Button type="button" variant="bordered" onPress={onClose} isDisabled={submitting} className="border-slate-300 text-slate-700">
                                                Cancel
                                            </Button>
                                            <Button type="submit" color="primary" isLoading={submitting} isDisabled={submitting} className="bg-linear-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20">
                                                Save Changes
                                            </Button>
                                        </div>
                                    </form>
                                </ModalBody>
                            </ModalDialog>
                        )}
                    </ModalContainer>
                </ModalBackdrop>
            </Modal>

            <Modal isOpen={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <ModalBackdrop>
                    <ModalContainer placement="center" size="md">
                        {(onClose) => (
                            <ModalDialog className="overflow-hidden border border-slate-200 bg-white shadow-[0_30px_100px_rgba(15,23,42,0.18)]">
                                <ModalCloseTrigger className="right-4 top-4 text-slate-500 transition hover:text-slate-900" />
                                <ModalHeader className="border-b border-slate-100 bg-linear-to-br from-rose-50 to-white px-6 py-6">
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500 text-white shadow-lg shadow-rose-500/20">
                                            <FaTrash />
                                        </div>
                                        <div>
                                            <ModalHeading className="text-2xl font-black tracking-tight text-slate-900">Delete Idea</ModalHeading>
                                            <p className="mt-1 text-sm leading-6 text-slate-600">
                                                This action permanently removes the idea from your dashboard.
                                            </p>
                                        </div>
                                    </div>
                                </ModalHeader>
                                <ModalBody className="px-6 py-5">
                                    <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-4 text-sm leading-6 text-rose-800">
                                        Are you sure you want to delete <span className="font-semibold text-rose-950">{selectedIdeaPreview?.title || "this idea"}</span>? This action cannot be undone.
                                    </p>
                                </ModalBody>
                                <ModalFooter className="border-t border-slate-100 bg-slate-50 px-6 py-4">
                                    <Button variant="bordered" onPress={onClose} isDisabled={submitting} className="border-slate-300 text-slate-700">
                                        Cancel
                                    </Button>
                                    <Button color="danger" onPress={handleDelete} isLoading={submitting} isDisabled={submitting} className="bg-rose-600 text-white shadow-lg shadow-rose-500/20">
                                        Delete
                                    </Button>
                                </ModalFooter>
                            </ModalDialog>
                        )}
                    </ModalContainer>
                </ModalBackdrop>
            </Modal>
        </div>
    );
}