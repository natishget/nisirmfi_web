"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  useGetBranchesQuery,
  useCreateBranchMutation,
  useUpdateBranchMutation,
  useDeleteBranchMutation,
} from "@/state/api/ApiSlice";
import {
  Building2,
  MapPin,
  LayoutList,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  Pencil,
  Save,
} from "lucide-react";
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

type BranchItem = {
  id: string;
  name: string;
  city: string;
  area: string;
  phone: string;
  hours: string;
  type: string;
};

type BranchFormState = {
  name: string;
  city: string;
  area: string;
  phone: string;
  hours: string;
  type: string;
};

const branchTypes = ["Branch", "Head Office"];

const defaultFormState: BranchFormState = {
  name: "",
  city: "",
  area: "",
  phone: "",
  hours: "Mon–Sat 8:30–17:00",
  type: "Branch",
};

const easeOut = [0.22, 1, 0.36, 1] as const;

function fieldLabel(text: string) {
  return (
    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#22348A]/70">
      {text}
    </span>
  );
}

export default function BranchesManagement() {
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BranchItem | null>(null);
  const [formState, setFormState] = useState<BranchFormState>(defaultFormState);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<BranchItem | null>(null);

  const { data: branchesData = [], isLoading } = useGetBranchesQuery();
  const [createBranchMutation] = useCreateBranchMutation();
  const [updateBranchMutation] = useUpdateBranchMutation();
  const [deleteBranchMutation] = useDeleteBranchMutation();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isEditing = Boolean(editingItem);

    try {
      if (isEditing && editingItem) {
        await updateBranchMutation({
          id: editingItem.id,
          body: formState,
        }).unwrap();
      } else {
        await createBranchMutation(formState).unwrap();
      }

      toast.success(`Branch ${isEditing ? 'updated' : 'created'} successfully!`);
      setEditorOpen(false);
      setEditingItem(null);
      setFormState(defaultFormState);
    } catch (error) {
      console.error("API Error saving branch:", error);
      toast.error("Could not save branch to server.");
    }
  };

  const filteredItems = useMemo(() => {
    const term = search.trim().toLowerCase();
    return branchesData.filter((item) => {
      return (
        !term ||
        [item.name, item.city, item.area].join(" ").toLowerCase().includes(term)
      );
    });
  }, [branchesData, search]);

  const stats = useMemo(() => {
    return {
      total: branchesData.length,
      headOffices: branchesData.filter((b) => b.type === "Head Office").length,
      branches: branchesData.filter((b) => b.type === "Branch").length,
    };
  }, [branchesData]);

  const openCreate = () => {
    setEditingItem(null);
    setFormState(defaultFormState);
    setEditorOpen(true);
  };

  const openEdit = (item: BranchItem) => {
    setEditingItem(item);
    setFormState({
      name: item.name,
      city: item.city,
      area: item.area,
      phone: item.phone,
      hours: item.hours,
      type: item.type,
    });
    setEditorOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteBranchMutation(deleteTarget.id).unwrap();
      toast.success("Branch deleted successfully!");
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error("Could not delete branch from the server.");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="overflow-x-hidden bg-[#f0f3fc] min-h-screen">
      <section className="py-26 bg-[#22348A] pb-24 pt-16">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <span className="block w-8 h-px bg-white/60 mb-5" />
          <h1 className="display-text text-3xl sm:text-4xl text-white">
            Branch Management
          </h1>
          <p className="mt-3 max-w-2xl text-white/70">
            Manage branches, Head Offices, locations, and contact details.
          </p>
        </div>
      </section>

      <section className="relative -mt-10 pb-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { label: "Total Branches", value: stats.total, icon: LayoutList },
              { label: "Head Offices", value: stats.headOffices, icon: Building2 },
              { label: "Standard Branches", value: stats.branches, icon: MapPin },
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
                    Branch Library
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Search, edit, delete, or add branches to the network.
                  </p>
                </div>

                <div className="flex flex-col gap-3 md:flex-row md:items-center">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search branches..."
                      className="h-11 w-full md:w-72 rounded-full border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-[#22348A]/30 focus:ring-2 focus:ring-[#22348A]/10"
                    />
                  </div>

                  <Button type="button" onClick={openCreate}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add branch
                  </Button>
                </div>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
                  <TableHead className="pl-6">Branch Name</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Area / Location</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="px-6 py-16 text-center">
                      <div className="mx-auto flex max-w-sm flex-col items-center gap-3 text-slate-500">
                        <div className="rounded-2xl bg-[#f0f3fc] p-4 text-[#22348A]">
                          <Building2 className="h-6 w-6" />
                        </div>
                        <p className="text-base font-medium text-slate-700">
                          No branches match the search.
                        </p>
                        <Button type="button" onClick={openCreate}>
                          <Plus className="h-4 w-4 mr-2" />
                          Create branch
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredItems.map((item, index) => (
                    <TableRow key={item.id} className="group hover:bg-slate-50/50">
                      <TableCell className="pl-6 py-4 font-semibold text-[#22348A]">
                        {item.name}
                      </TableCell>
                      <TableCell>{item.city}</TableCell>
                      <TableCell className="max-w-[200px] truncate" title={item.area}>
                        {item.area}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{item.phone || "-"}</div>
                          <div className="text-xs text-gray-500">{item.hours}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
                            item.type === "Head Office"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-blue-50 text-blue-700 border-blue-200"
                          }`}
                        >
                          {item.type}
                        </span>
                      </TableCell>
                      <TableCell className="pr-6 text-right">
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
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit Branch
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setDeleteTarget(item)}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Branch
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="display-text text-2xl text-[#22348A]">
              {editingItem ? "Edit Branch" : "Add Branch"}
            </DialogTitle>
            <DialogDescription>
              Provide the details for the branch location.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="space-y-2">
                {fieldLabel("Branch Name")}
                <input
                  required
                  value={formState.name}
                  onChange={(e) =>
                    setFormState((curr) => ({ ...curr, name: e.target.value }))
                  }
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-[#22348A]/30 focus:ring-2 focus:ring-[#22348A]/10"
                  placeholder="e.g. Premium Branch"
                />
              </label>

              <label className="space-y-2">
                {fieldLabel("City")}
                <input
                  required
                  value={formState.city}
                  onChange={(e) =>
                    setFormState((curr) => ({ ...curr, city: e.target.value }))
                  }
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-[#22348A]/30 focus:ring-2 focus:ring-[#22348A]/10"
                  placeholder="e.g. Addis Ababa"
                />
              </label>

              <label className="space-y-2 md:col-span-2">
                {fieldLabel("Area / Specific Location")}
                <textarea
                  required
                  value={formState.area}
                  onChange={(e) =>
                    setFormState((curr) => ({ ...curr, area: e.target.value }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#22348A]/30 focus:ring-2 focus:ring-[#22348A]/10"
                  placeholder="e.g. Dembel City Center"
                />
              </label>

              <label className="space-y-2">
                {fieldLabel("Phone Number")}
                <input
                  value={formState.phone}
                  onChange={(e) =>
                    setFormState((curr) => ({ ...curr, phone: e.target.value }))
                  }
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-[#22348A]/30 focus:ring-2 focus:ring-[#22348A]/10"
                  placeholder="e.g. +251 115 500 700"
                />
              </label>

              <label className="space-y-2">
                {fieldLabel("Operating Hours")}
                <input
                  required
                  value={formState.hours}
                  onChange={(e) =>
                    setFormState((curr) => ({ ...curr, hours: e.target.value }))
                  }
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-[#22348A]/30 focus:ring-2 focus:ring-[#22348A]/10"
                  placeholder="e.g. Mon–Sat 8:30–17:00"
                />
              </label>

              <label className="space-y-2 md:col-span-2">
                {fieldLabel("Branch Type")}
                <select
                  value={formState.type}
                  onChange={(e) =>
                    setFormState((curr) => ({ ...curr, type: e.target.value }))
                  }
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-[#22348A]/30 focus:ring-2 focus:ring-[#22348A]/10"
                >
                  {branchTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
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
                <Save className="h-4 w-4 mr-2" />
                {editingItem ? "Save changes" : "Create Branch"}
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
            <AlertDialogTitle>Delete Branch?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the branch "
              {deleteTarget?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
              onClick={handleDelete}
            >
              Delete Branch
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
