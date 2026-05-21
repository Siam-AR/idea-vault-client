"use client";

import Loader from "@/components/Loader";
import { ideasAPI } from "@/lib/api";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FaCalendarAlt, FaFilter, FaMoneyBillWave, FaSearch, FaUser } from "react-icons/fa";

const CATEGORY_OPTIONS = ["All Categories", "Tech", "AI", "Health", "Education", "Finance", "SaaS"];
const DATE_OPTIONS = [
    { label: "All Time", value: "all" },
    { label: "Last 7 Days", value: "7d" },
    { label: "Last 30 Days", value: "30d" },
];
const REFERENCE_TIME = Date.now();

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
    if (!budget) return "Budget not shared";

    if (typeof budget === "number") {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
        }).format(budget);
    }

    return budget;
};

export default function IdeaPage() {
    const router = useRouter();
    const [ideas, setIdeas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [category, setCategory] = useState("All Categories");
    const [dateRange, setDateRange] = useState("all");
    const [sortBy, setSortBy] = useState("newest");

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchValue.trim());
        }, 350);

        return () => clearTimeout(timer);
    }, [searchValue]);

    useEffect(() => {
        let active = true;

        const loadIdeas = async () => {
            try {
                setLoading(true);

                const filters = {};
                if (debouncedSearch) {
                    filters.search = debouncedSearch;
                }

                if (category !== "All Categories") {
                    filters.category = category;
                }

                const data = await ideasAPI.getAll(filters);

                if (!active) return;

                setIdeas(Array.isArray(data) ? data : []);
                setError("");
            } catch (fetchError) {
                if (!active) return;

                setIdeas([]);
                setError(fetchError?.message || "Unable to load ideas right now.");
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        loadIdeas();

        return () => {
            active = false;
        };
    }, [debouncedSearch, category]);

    const visibleIdeas = useMemo(() => {
        const filteredByDate = ideas.filter((idea) => {
            if (dateRange === "all" || !idea?.createdAt) return true;

            const createdAt = new Date(idea.createdAt).getTime();
            if (Number.isNaN(createdAt)) return true;

            const days = dateRange === "7d" ? 7 : 30;
            const windowStart = REFERENCE_TIME - days * 24 * 60 * 60 * 1000;

            return createdAt >= windowStart;
        });

        return [...filteredByDate].sort((left, right) => {
            const leftTime = new Date(left.createdAt || 0).getTime();
            const rightTime = new Date(right.createdAt || 0).getTime();

            if (sortBy === "oldest") {
                return leftTime - rightTime;
            }

            return rightTime - leftTime;
        });
    }, [dateRange, ideas, sortBy]);

    const resetFilters = () => {
        setSearchValue("");
        setDebouncedSearch("");
        setCategory("All Categories");
        setDateRange("all");
        setSortBy("newest");
    };

    const openIdeaDetails = (ideaId) => {
        router.push(`/ideas/${ideaId}`);
    };

    const handleCardKeyDown = (event, ideaId) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openIdeaDetails(ideaId);
        }
    };

    return (
        <div className="px-4 py-6 md:py-10 text-slate-100">
            <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950 px-5 py-7 shadow-2xl shadow-slate-950/40 md:px-8 md:py-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.28),transparent_34%),radial-gradient(circle_at_top_right,rgba(6,182,212,0.22),transparent_30%),linear-gradient(135deg,rgba(15,23,42,0.98),rgba(15,23,42,0.86))]" />
                <div className="relative z-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
                    <div className="space-y-5">
                        <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
                            <FaFilter className="text-[0.7rem]" />
                            Browse Ideas
                        </span>

                        <div className="space-y-3">
                            <h1 className="max-w-3xl text-3xl font-black tracking-tight text-white md:text-5xl">
                                Discover startup ideas built for validation, feedback, and momentum.
                            </h1>
                            <p className="max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                                Search by title, filter by category, and sort by publish date to find the most relevant startup concepts in the community.
                            </p>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-3">
                            {[
                                { value: ideas.length, label: "Ideas available", icon: FaFilter },
                                { value: visibleIdeas.length, label: "Showing now", icon: FaSearch },
                                { value: "3x", label: "Responsive grid", icon: FaCalendarAlt },
                            ].map((stat) => (
                                <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                                    <stat.icon className="text-cyan-300" />
                                    <p className="mt-3 text-2xl font-bold text-white">{stat.value}</p>
                                    <p className="text-sm text-slate-300">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm md:p-6">
                        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">
                            Filters
                        </p>
                        <div className="mt-4 space-y-4">
                            <label className="block">
                                <span className="mb-2 block text-sm font-medium text-slate-200">Search by title</span>
                                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-slate-300">
                                    <FaSearch className="shrink-0 text-slate-400" />
                                    <input
                                        value={searchValue}
                                        onChange={(event) => setSearchValue(event.target.value)}
                                        type="search"
                                        placeholder="Search startup ideas..."
                                        className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
                                    />
                                </div>
                            </label>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <label className="block">
                                    <span className="mb-2 block text-sm font-medium text-slate-200">Category</span>
                                    <select
                                        value={category}
                                        onChange={(event) => setCategory(event.target.value)}
                                        className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400/60"
                                    >
                                        {CATEGORY_OPTIONS.map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                </label>

                                <label className="block">
                                    <span className="mb-2 block text-sm font-medium text-slate-200">Date range</span>
                                    <select
                                        value={dateRange}
                                        onChange={(event) => setDateRange(event.target.value)}
                                        className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400/60"
                                    >
                                        {DATE_OPTIONS.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <label className="block">
                                    <span className="mb-2 block text-sm font-medium text-slate-200">Sort by</span>
                                    <select
                                        value={sortBy}
                                        onChange={(event) => setSortBy(event.target.value)}
                                        className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400/60"
                                    >
                                        <option value="newest">Newest first</option>
                                        <option value="oldest">Oldest first</option>
                                    </select>
                                </label>

                                <div className="flex items-end">
                                    <Button
                                        onPress={resetFilters}
                                        className="h-12.5 w-full border border-white/10 bg-white/5 text-white"
                                        variant="bordered"
                                    >
                                        Reset Filters
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mt-8">
                {loading ? (
                    <div className="h-[55vh] rounded-[2rem] border border-white/10 bg-slate-950/70">
                        <Loader message="Loading fresh ideas..." />
                    </div>
                ) : error ? (
                    <div className="rounded-[2rem] border border-rose-500/20 bg-rose-500/10 p-6 text-rose-100">
                        <p className="text-lg font-semibold">Unable to load ideas</p>
                        <p className="mt-2 text-sm text-rose-100/80">{error}</p>
                    </div>
                ) : visibleIdeas.length === 0 ? (
                    <div className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-8 text-center text-slate-200">
                        <p className="text-2xl font-bold text-white">No ideas found</p>
                        <p className="mt-3 text-sm text-slate-300">
                            Try a different search term, category, or date range.
                        </p>
                        <div className="mt-6 flex justify-center">
                            <Button onPress={resetFilters} color="primary">
                                Clear Filters
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {visibleIdeas.map((idea) => (
                            <article
                                key={idea._id}
                                role="button"
                                tabIndex={0}
                                onClick={() => openIdeaDetails(idea._id)}
                                onKeyDown={(event) => handleCardKeyDown(event, idea._id)}
                                className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/80 shadow-xl shadow-slate-950/20 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:shadow-cyan-500/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                            >
                                <div className="relative h-56 overflow-hidden bg-slate-800">
                                    <div
                                        className="h-full w-full bg-cover bg-center transition duration-500 group-hover:scale-105"
                                        style={{
                                            backgroundImage: `linear-gradient(180deg, rgba(2,6,23,0.08), rgba(2,6,23,0.64)), url(${idea.imageURL || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop"})`,
                                        }}
                                    />
                                    <div className="absolute left-4 top-4 rounded-full bg-slate-950/70 px-3 py-1 text-xs font-semibold text-cyan-300 backdrop-blur-sm">
                                        {idea.category || "Uncategorized"}
                                    </div>
                                </div>

                                <div className="flex flex-1 flex-col p-5 text-slate-100">
                                    <div className="flex items-center justify-between gap-3 text-xs text-slate-400">
                                        <span>{formatDate(idea.createdAt)}</span>
                                        <span>{idea.commentCount ?? 0} comments</span>
                                    </div>

                                    <h2 className="mt-3 min-h-16 text-2xl font-bold tracking-tight text-white">
                                        {idea.title || "Untitled idea"}
                                    </h2>

                                    <p className="mt-3 min-h-20 text-sm leading-7 text-slate-300">
                                        {idea.shortDescription || "No short description was provided for this idea."}
                                    </p>

                                    <div className="mt-4 grid gap-3 text-sm text-slate-200">
                                        <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                                            <FaMoneyBillWave className="text-cyan-300" />
                                            <span>{formatBudget(idea.estimatedBudget)}</span>
                                        </div>
                                        <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                                            <FaUser className="text-cyan-300" />
                                            <span>{idea.userName || idea.userEmail || "Anonymous builder"}</span>
                                        </div>
                                    </div>

                                    <div className="mt-auto pt-5">
                                        <Button
                                            onPress={() => openIdeaDetails(idea._id)}
                                            className="w-full bg-linear-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20"
                                        >
                                            View Details
                                        </Button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}