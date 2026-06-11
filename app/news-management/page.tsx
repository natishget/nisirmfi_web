"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock3,
  Eye,
  Image as ImageIcon,
  LayoutList,
  MoreHorizontal,
  Plus,
  Search,
  Tag,
  Trash2,
  Pencil,
  Save,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

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
  id: string | number;
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
  image: File | null;
  featured: boolean;
};

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
  image: null,
  featured: false,
};

function formatDisplayDate(dateValue: string) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(new Date(dateValue));
  } catch (e) {
    return dateValue;
  }
}

function fieldLabel(text: string) {
  return (
    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#22348A]/70">
      {text}
    </span>
  );
}

export default function NewsManagementPage() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<"All" | NewsStatus>("All");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<NewsItem | null>(null);
  const [formState, setFormState] = useState<NewsFormState>(defaultFormState);

  const router = useRouter();

  useEffect(() => {
    console.log("formState", formState);
  }, [formState]);

  useEffect(() => {
    async function loadNews() {
      try {
        const response = await fetch("/api/news?limit=100");
        if (!response.ok) {
          throw new Error("Failed to load news items from server");
        }
        const json = await response.json();
        const mapped: NewsItem[] = json.data.map((item: any) => ({
          id: item.id,
          title: item.title,
          category: item.category,
          status:
            item.status === "PUBLISHED" ? "Published" :
            item.status === "ARCHIVED" ? "Scheduled" : "Draft",
          summary: item.summary,
          author: "Admin Team",
          publishedAt: item.publishedDate ? item.publishedDate.slice(0, 10) : new Date().toISOString().slice(0, 10),
          readTime: `${item.readTime} min read`,
          image: item.imageUrl,
          featured: item.isFeatured,
        }));
        setNewsItems(mapped);
      } catch (err) {
        console.error("Failed to load news from server:", err);
      }
    }
    loadNews();
  }, []);

  const submitNewsItem = async (item: NewsFormState) => {
    const formData = new FormData();

    // 1. Append all text and boolean fields
    formData.append("title", item.title.trim());
    formData.append("category", item.category);
    formData.append("status", item.status);
    formData.append("summary", item.summary.trim());
    formData.append("author", item.author.trim());
    formData.append("publishedAt", item.publishedAt);
    formData.append("readTime", item.readTime.trim() || "3 min read");
    formData.append("featured", String(item.featured));

    // 2. Append the file if a new one was uploaded
    if (item.image) {
      formData.append("image", item.image); // This is the raw File object
    } else if (editingItem) {
      formData.append("existingImageUrl", editingItem.image);
    }

    const response = await fetch(
      `${editingItem ? `/api/news/${editingItem.id}` : `/api/news`}`,
      {
        method: editingItem ? "PUT" : "POST",
        body: formData,
      },
    );

    if (!response.ok) {
      throw new Error("Failed to save news item to server");
    }
    const json = await response.json();
    const serverItem = json.data;

    // Map backend server item to frontend NewsItem format
    const mappedItem: NewsItem = {
      id: serverItem.id,
      title: serverItem.title,
      category: serverItem.category,
      status:
        serverItem.status === "PUBLISHED" ? "Published" :
        serverItem.status === "ARCHIVED" ? "Scheduled" : "Draft",
      summary: serverItem.summary,
      author: "Admin Team",
      publishedAt: serverItem.publishedDate ? serverItem.publishedDate.slice(0, 10) : item.publishedAt,
      readTime: `${serverItem.readTime} min read`,
      image: serverItem.imageUrl,
      featured: serverItem.isFeatured,
    };

    return mappedItem;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // 1. Setup a temporary local image preview URL for an instant UI update
    let localPreviewUrl = "/placeholder.svg";
    if (formState.image) {
      localPreviewUrl = URL.createObjectURL(formState.image);
    } else if (editingItem) {
      localPreviewUrl = editingItem.image;
    }

    const targetId = editingItem?.id ?? Date.now();

    const optimisticItem: NewsItem = {
      id: targetId,
      title: formState.title.trim(),
      category: formState.category.trim(),
      status: formState.status,
      summary: formState.summary.trim(),
      author: formState.author.trim(),
      publishedAt: formState.publishedAt,
      readTime: formState.readTime.trim() || "3 min read",
      image: localPreviewUrl,
      featured: formState.featured,
    };

    setNewsItems((current) => {
      if (editingItem) {
        return current.map((item) =>
          item.id === editingItem.id ? optimisticItem : item,
        );
      }
      return [optimisticItem, ...current];
    });

    setEditorOpen(false);
    const backupEditingItem = editingItem; // Backup reference in case we need to roll back
    setEditingItem(null);
    setFormState(defaultFormState);

    try {
      const savedItemFromServer: NewsItem = await submitNewsItem(formState);

      setNewsItems((current) =>
        current.map((item) =>
          item.id === targetId ? savedItemFromServer : item,
        ),
      );
    } catch (error) {
      console.error("API Error:", error);
      alert("Could not save to server. Reverting your local changes.");

      setNewsItems((current) => {
        if (backupEditingItem) {
          return current.map((item) =>
            item.id === backupEditingItem.id ? backupEditingItem : item,
          );
        }
        return current.filter((item) => item.id !== targetId);
      });
    }
  };

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

    setFormState({
      title: item.title,
      category: item.category,
      status: item.status,
      summary: item.summary,
      author: item.author,
      publishedAt: item.publishedAt,
      readTime: item.readTime,
      image: null,
      featured: item.featured ?? false,
    });

    setEditorOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      const response = await fetch(`/api/news/${deleteTarget.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete news item from server");
      }

      setNewsItems((current) =>
        current.filter((item) => item.id !== deleteTarget.id),
      );
    } catch (error) {
      console.error("Delete Error:", error);
      alert("Could not delete news item from the server. Please try again.");
    } finally {
      setDeleteTarget(null);
    }
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
            Manage News postings, Edit and Delete existing news, and create
            featured news posts.
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
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
                            categoryClasses[item.category] ||
                            "bg-slate-100 text-slate-700"
                          }`}
                        >
                          <Tag className="mr-1 h-3.5 w-3.5" />
                          {item.category}
                        </span>
                      </TableCell>
                      <TableCell className="align-top">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
                            badgeClasses[item.status]
                          }`}
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
                {fieldLabel("Upload Image")}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0];

                    if (!file) return;

                    if (file.size > 1_000_000) {
                      alert("Please select an image up to 1MB");
                      return;
                    }

                    setFormState((current) => ({
                      ...current,
                      image: file,
                    }));
                  }}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm"
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
