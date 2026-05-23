"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock3,
  Eye,
  Filter,
  Image as ImageIcon,
  LayoutList,
  Megaphone,
  MoreHorizontal,
  Plus,
  Search,
  Tag,
  Trash2,
  Pencil,
  Save,
} from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type NewsStatus = "Published" | "Draft" | "Scheduled";

type NewsItem = {
  id: number;
  title: string;
  category: string;
  status: NewsStatus;
  summary: string;
  author: string;
  publishedAt: string;
  readTime: string;
  image: string;
  featured?: boolean;
};

type NewsFormState = {
  title: string;
  category: string;
  status: NewsStatus;
  summary: string;
  author: string;
  publishedAt: string;
  readTime: string;
  image: string;
  featured: boolean;
};

const initialNews: NewsItem[] = [
  {
    id: 1,
    title: "Nisir MFI Crosses 20,000 Active Customer Milestone",
    category: "Institutional",
    status: "Published",
    summary:
      "A milestone update highlighting customer growth, financial inclusion progress, and service expansion across Ethiopia.",
    author: "Corporate Communications",
    publishedAt: "2024-03-14",
    readTime: "4 min read",
    image:
      "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80",
    featured: true,
  },
  {
    id: 2,
    title: "New Branch Opening in Wolaita Sodo",
    category: "Expansion",
    status: "Published",
    summary:
      "The branch network continues to expand with a new location serving customers in Southern Ethiopia.",
    author: "Branch Operations",
    publishedAt: "2024-01-22",
    readTime: "2 min read",
    image:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 3,
    title: "Digital Account Opening Now Available at Selected Branches",
    category: "Digital",
    status: "Scheduled",
    summary:
      "A product update for the next rollout wave of digital onboarding at high-traffic branches.",
    author: "Product Team",
    publishedAt: "2024-04-05",
    readTime: "3 min read",
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 4,
    title: "Women Entrepreneurs Program Surpasses ETB 12 Million Disbursed",
    category: "Community",
    status: "Draft",
    summary:
      "A community impact story about group lending and support for women-led businesses.",
    author: "Impact Desk",
    publishedAt: "2024-02-18",
    readTime: "5 min read",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 5,
    title: "Understanding the Micro-Enterprise Loan: A Borrower’s Guide",
    category: "Financial Education",
    status: "Published",
    summary:
      "An educational article that explains eligibility, documents, and common questions from borrowers.",
    author: "Education Desk",
    publishedAt: "2023-10-18",
    readTime: "5 min read",
    image:
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 6,
    title: "Q3 2023 Performance: Growth in Deposits and Disbursements",
    category: "Institutional",
    status: "Published",
    summary:
      "A quarterly performance report capturing deposits, lending momentum, and repayment strength.",
    author: "Finance Team",
    publishedAt: "2023-09-28",
    readTime: "3 min read",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80",
  },
];

const categories = [
  "All",
  "Institutional",
  "Expansion",
  "Digital",
  "Community",
  "Financial Education",
];

const statuses: Array<"All" | NewsStatus> = [
  "All",
  "Published",
  "Draft",
  "Scheduled",
];

const easeOut = [0.22, 1, 0.36, 1] as const;

const badgeClasses: Record<NewsStatus, string> = {
  Published: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Draft: "bg-amber-50 text-amber-700 border-amber-200",
  Scheduled: "bg-sky-50 text-sky-700 border-sky-200",
};

const categoryClasses: Record<string, string> = {
  Institutional: "bg-[#f0f3fc] text-[#22348A]",
  Expansion: "bg-teal-50 text-teal-700",
  Digital: "bg-violet-50 text-violet-700",
  Community: "bg-rose-50 text-rose-700",
  "Financial Education": "bg-emerald-50 text-emerald-700",
};

const defaultFormState: NewsFormState = {
  title: "",
  category: "Institutional",
  status: "Draft",
  summary: "",
  author: "Admin Team",
  publishedAt: new Date().toISOString().slice(0, 10),
  readTime: "3 min read",
  image:
    "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80",
  featured: false,
};

function formatDisplayDate(dateValue: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateValue));
}

function createFormState(item?: NewsItem | null): NewsFormState {
  if (!item) {
    return defaultFormState;
  }

  return {
    title: item.title,
    category: item.category,
    status: item.status,
    summary: item.summary,
    author: item.author,
    publishedAt: item.publishedAt,
    readTime: item.readTime,
    image: item.image,
    featured: Boolean(item.featured),
  };
}

function fieldLabel(text: string) {
  return (
    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#22348A]/70">
      {text}
    </span>
  );
}

export default function NewsManagementPage() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>(initialNews);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<"All" | NewsStatus>("All");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<NewsItem | null>(null);
  const [formState, setFormState] = useState<NewsFormState>(defaultFormState);

  const filteredItems = useMemo(() => {
    const term = search.trim().toLowerCase();

    return newsItems.filter((item) => {
      const matchesSearch =
        !term ||
        [item.title, item.summary, item.author, item.category]
          .join(" ")
          .toLowerCase()
          .includes(term);

      const matchesCategory =
        categoryFilter === "All" || item.category === categoryFilter;
      const matchesStatus =
        statusFilter === "All" || item.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [categoryFilter, newsItems, search, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: newsItems.length,
      published: newsItems.filter((item) => item.status === "Published").length,
      drafts: newsItems.filter((item) => item.status === "Draft").length,
      scheduled: newsItems.filter((item) => item.status === "Scheduled").length,
    };
  }, [newsItems]);

  const openCreate = () => {
    setEditingItem(null);
    setFormState(defaultFormState);
    setEditorOpen(true);
  };

  const openEdit = (item: NewsItem) => {
    setEditingItem(item);
    setFormState(createFormState(item));
    setEditorOpen(true);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextItem: NewsItem = {
      id: editingItem?.id ?? Date.now(),
      title: formState.title.trim(),
      category: formState.category.trim(),
      status: formState.status,
      summary: formState.summary.trim(),
      author: formState.author.trim(),
      publishedAt: formState.publishedAt,
      readTime: formState.readTime.trim() || "3 min read",
      image: formState.image.trim(),
      featured: formState.featured,
    };

    setNewsItems((current) => {
      if (editingItem) {
        return current.map((item) =>
          item.id === editingItem.id ? nextItem : item,
        );
      }

      return [nextItem, ...current];
    });

    setEditorOpen(false);
    setEditingItem(null);
  };

  const handleDelete = () => {
    if (!deleteTarget) {
      return;
    }

    setNewsItems((current) =>
      current.filter((item) => item.id !== deleteTarget.id),
    );
    setDeleteTarget(null);
  };

  return (
    <div className="overflow-x-hidden bg-[#f0f3fc]">
      <section className="py-26 bg-[#22348A]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <span className="block w-8 h-px bg-white/60 mb-5" />
          <h1 className="display-text text-3xl sm:text-4xl text-white">
            News Management
          </h1>
          <p className="mt-3 max-w-2xl text-white/70">
            Manage News postings, Edit and Delete existing news, and create a
            featured news posts.pnpm dev --host
          </p>
        </div>
      </section>
      <section className="relative -mt-10 pb-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            {[
              { label: "Total news", value: stats.total, icon: LayoutList },
              { label: "Published", value: stats.published, icon: Eye },
              { label: "Drafts", value: stats.drafts, icon: Pencil },
              { label: "Scheduled", value: stats.scheduled, icon: Clock3 },
            ].map((card) => {
              const Icon = card.icon;

              return (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: easeOut }}
                  className="rounded-2xl border border-white/70 bg-white p-5 shadow-[0_16px_50px_rgba(34,52,138,0.08)]"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                        {card.label}
                      </p>
                      <p className="mt-2 text-3xl font-semibold text-[#22348A]">
                        {card.value}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-[#f0f3fc] p-3 text-[#22348A]">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="rounded-[28px] border border-white/70 bg-white shadow-[0_24px_80px_rgba(34,52,138,0.09)] overflow-hidden">
            <div className="border-b border-slate-100 p-5 sm:p-6">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <h2 className="display-text text-2xl text-[#22348A]">
                    News library
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Search, edit, delete, or add news stories using demo data.
                  </p>
                </div>

                <div className="flex flex-col gap-3 md:flex-row md:items-center">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search news..."
                      className="h-11 w-full md:w-72 rounded-full border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-[#22348A]/30 focus:ring-2 focus:ring-[#22348A]/10"
                    />
                  </div>

                  <select
                    value={categoryFilter}
                    onChange={(event) => setCategoryFilter(event.target.value)}
                    className="h-11 rounded-full border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-[#22348A]/30 focus:ring-2 focus:ring-[#22348A]/10"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>

                  <select
                    value={statusFilter}
                    onChange={(event) =>
                      setStatusFilter(event.target.value as "All" | NewsStatus)
                    }
                    className="h-11 rounded-full border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-[#22348A]/30 focus:ring-2 focus:ring-[#22348A]/10"
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>

                  <Button type="button" onClick={openCreate}>
                    <Plus className="h-4 w-4" />
                    Add news
                  </Button>
                </div>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
                  <TableHead className="w-[34%] pl-6">Story</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Published</TableHead>
                  <TableHead>Read time</TableHead>
                  <TableHead className="text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="px-6 py-16 text-center">
                      <div className="mx-auto flex max-w-sm flex-col items-center gap-3 text-slate-500">
                        <div className="rounded-2xl bg-[#f0f3fc] p-4 text-[#22348A]">
                          <Search className="h-6 w-6" />
                        </div>
                        <p className="text-base font-medium text-slate-700">
                          No news matches the current filters.
                        </p>
                        <p className="text-sm">
                          Clear the search or create a new demo article to get
                          started.
                        </p>
                        <Button type="button" onClick={openCreate}>
                          <Plus className="h-4 w-4" />
                          Create news
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredItems.map((item, index) => (
                    <TableRow key={item.id} className="group">
                      <TableCell className="pl-6 py-5 align-top">
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: index * 0.05,
                            duration: 0.4,
                            ease: easeOut,
                          }}
                          className="flex gap-4"
                        >
                          <div className="relative h-18 w-20 shrink-0 overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-200">
                            <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              sizes="80px"
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-semibold text-[#22348A] leading-snug">
                                {item.title}
                              </p>
                              {item.featured ? (
                                <span className="rounded-full border border-[#22348A]/15 bg-[#f0f3fc] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#22348A]">
                                  Featured
                                </span>
                              ) : null}
                            </div>
                            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                              {item.summary}
                            </p>
                            <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400">
                              <span className="inline-flex items-center gap-1.5">
                                <ImageIcon className="h-3.5 w-3.5" />
                                {item.author}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      </TableCell>
                      <TableCell className="align-top">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${categoryClasses[item.category] || "bg-slate-100 text-slate-700"}`}
                        >
                          <Tag className="mr-1 h-3.5 w-3.5" />
                          {item.category}
                        </span>
                      </TableCell>
                      <TableCell className="align-top">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${badgeClasses[item.status]}`}
                        >
                          {item.status}
                        </span>
                      </TableCell>
                      <TableCell className="align-top text-sm text-slate-600">
                        <div className="inline-flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-[#22348A]" />
                          {formatDisplayDate(item.publishedAt)}
                        </div>
                      </TableCell>
                      <TableCell className="align-top text-sm text-slate-600">
                        <div className="inline-flex items-center gap-2">
                          <Clock3 className="h-4 w-4 text-[#22348A]" />
                          {item.readTime}
                        </div>
                      </TableCell>
                      <TableCell className="pr-6 align-top text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="text-slate-500 hover:bg-[#f0f3fc] hover:text-[#22348A]"
                            >
                              <MoreHorizontal className="h-5 w-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem onClick={() => openEdit(item)}>
                              <Pencil className="h-4 w-4" />
                              Edit news
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setDeleteTarget(item)}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete news
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </section>

      <Dialog
        open={editorOpen}
        onOpenChange={(open) => {
          setEditorOpen(open);
          if (!open) {
            setEditingItem(null);
          }
        }}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="display-text text-2xl text-[#22348A]">
              {editingItem ? "Edit news item" : "Create news item"}
            </DialogTitle>
            <DialogDescription>
              Update the demo content, publish state, and imagery for a news
              post.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="space-y-2">
                {fieldLabel("Title")}
                <input
                  required
                  value={formState.title}
                  onChange={(event) =>
                    setFormState((current) => ({
                      ...current,
                      title: event.target.value,
                    }))
                  }
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-[#22348A]/30 focus:ring-2 focus:ring-[#22348A]/10"
                  placeholder="Enter a compelling headline"
                />
              </label>

              <label className="space-y-2">
                {fieldLabel("Author")}
                <input
                  required
                  value={formState.author}
                  onChange={(event) =>
                    setFormState((current) => ({
                      ...current,
                      author: event.target.value,
                    }))
                  }
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-[#22348A]/30 focus:ring-2 focus:ring-[#22348A]/10"
                  placeholder="Admin team"
                />
              </label>

              <label className="space-y-2">
                {fieldLabel("Category")}
                <select
                  value={formState.category}
                  onChange={(event) =>
                    setFormState((current) => ({
                      ...current,
                      category: event.target.value,
                    }))
                  }
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-[#22348A]/30 focus:ring-2 focus:ring-[#22348A]/10"
                >
                  {categories
                    .filter((category) => category !== "All")
                    .map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                </select>
              </label>

              <label className="space-y-2">
                {fieldLabel("Status")}
                <select
                  value={formState.status}
                  onChange={(event) =>
                    setFormState((current) => ({
                      ...current,
                      status: event.target.value as NewsStatus,
                    }))
                  }
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-[#22348A]/30 focus:ring-2 focus:ring-[#22348A]/10"
                >
                  {statuses
                    .filter((status) => status !== "All")
                    .map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                </select>
              </label>

              <label className="space-y-2 md:col-span-2">
                {fieldLabel("Summary")}
                <textarea
                  required
                  value={formState.summary}
                  onChange={(event) =>
                    setFormState((current) => ({
                      ...current,
                      summary: event.target.value,
                    }))
                  }
                  rows={4}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#22348A]/30 focus:ring-2 focus:ring-[#22348A]/10"
                  placeholder="Short description that appears in the list"
                />
              </label>

              <label className="space-y-2">
                {fieldLabel("Published date")}
                <input
                  type="date"
                  value={formState.publishedAt}
                  onChange={(event) =>
                    setFormState((current) => ({
                      ...current,
                      publishedAt: event.target.value,
                    }))
                  }
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-[#22348A]/30 focus:ring-2 focus:ring-[#22348A]/10"
                />
              </label>

              <label className="space-y-2">
                {fieldLabel("Read time")}
                <input
                  value={formState.readTime}
                  onChange={(event) =>
                    setFormState((current) => ({
                      ...current,
                      readTime: event.target.value,
                    }))
                  }
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-[#22348A]/30 focus:ring-2 focus:ring-[#22348A]/10"
                  placeholder="3 min read"
                />
              </label>

              <label className="space-y-2 md:col-span-2">
                {fieldLabel("Image URL")}
                <input
                  required
                  value={formState.image}
                  onChange={(event) =>
                    setFormState((current) => ({
                      ...current,
                      image: event.target.value,
                    }))
                  }
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-[#22348A]/30 focus:ring-2 focus:ring-[#22348A]/10"
                  placeholder="https://..."
                />
              </label>

              <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 md:col-span-2">
                <input
                  type="checkbox"
                  checked={formState.featured}
                  onChange={(event) =>
                    setFormState((current) => ({
                      ...current,
                      featured: event.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded border-slate-300 text-[#22348A] focus:ring-[#22348A]"
                />
                <div>
                  <p className="text-sm font-semibold text-[#22348A]">
                    Mark as featured
                  </p>
                  <p className="text-xs text-slate-500">
                    Featured items are highlighted in the management list.
                  </p>
                </div>
              </label>
            </div>

            <DialogFooter className="gap-3 sm:gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditorOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                <Save className="h-4 w-4" />
                {editingItem ? "Save changes" : "Create news"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this news item?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the demo article from the management list. The action
              can be reversed only by re-adding the item.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteTarget(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
