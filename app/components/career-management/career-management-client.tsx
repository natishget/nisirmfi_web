"use client";

import { useEffect, useMemo, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
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
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  CalendarDays,
  Clock3,
  MapPin,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

type CareerRecord = {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  purpose: string;
  responsibilities: string[];
  qualification: string[];
  salary: string;
  benefits: string[];
  postDate: string;
  endDate: string;
};
const managementFormSchema = z
  .object({
    title: z.string().trim().min(2, "Title is required").max(255),
    department: z.string().trim().min(2, "Department is required").max(120),
    location: z.string().trim().min(2, "Location is required").max(120),
    type: z.string().trim().min(2, "Type is required").max(120),
    purpose: z.string().trim().min(10, "Purpose is required").max(1000),
    responsibilities: z
      .string()
      .trim()
      .min(1, "At least one responsibility is required"),
    qualification: z
      .string()
      .trim()
      .min(1, "At least one qualification is required"),
    salary: z.string().trim().min(1, "Salary is required").max(120),
    benefits: z.string().trim().min(1, "At least one benefit is required"),
    postDate: z.string().min(1, "Post date is required"),
    endDate: z.string().min(1, "End date is required"),
  })
  .refine((value) => new Date(value.endDate) >= new Date(value.postDate), {
    path: ["endDate"],
    message: "End date must be on or after post date",
  });

type ManagementFormValues = z.infer<typeof managementFormSchema>;

const defaultFormValues: ManagementFormValues = {
  title: "",
  department: "Operations",
  location: "Addis Ababa",
  type: "Full-time",
  purpose: "",
  responsibilities: "",
  qualification: "",
  salary: "",
  benefits: "",
  postDate: new Date().toISOString().slice(0, 10),
  endDate: new Date().toISOString().slice(0, 10),
};

function splitLines(value: string) {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function toFormValues(career?: CareerRecord | null): ManagementFormValues {
  if (!career) {
    return defaultFormValues;
  }

  return {
    title: career.title,
    department: career.department,
    location: career.location,
    type: career.type,
    purpose: career.purpose,
    responsibilities: career.responsibilities.join("\n"),
    qualification: career.qualification.join("\n"),
    salary: career.salary,
    benefits: career.benefits.join("\n"),
    postDate: career.postDate.slice(0, 10),
    endDate: career.endDate.slice(0, 10),
  };
}

function toPayload(values: ManagementFormValues) {
  return {
    title: values.title.trim(),
    department: values.department.trim(),
    location: values.location.trim(),
    type: values.type.trim(),
    purpose: values.purpose.trim(),
    responsibilities: splitLines(values.responsibilities),
    qualification: splitLines(values.qualification),
    salary: values.salary.trim(),
    benefits: splitLines(values.benefits),
    postDate: values.postDate,
    endDate: values.endDate,
  };
}

function getStatus(career: CareerRecord) {
  const now = new Date();
  const start = new Date(career.postDate);
  const end = new Date(career.endDate);

  if (end < now) {
    return "Expired";
  }

  if (start > now) {
    return "Upcoming";
  }

  return "Active";
}

export default function CareerManagementClient({
  initialCareers,
}: {
  initialCareers: CareerRecord[];
}) {
  const router = useRouter();
  const [careers, setCareers] = useState(initialCareers);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingCareer, setEditingCareer] = useState<CareerRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CareerRecord | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ManagementFormValues>({
    resolver: zodResolver(managementFormSchema),
    defaultValues: defaultFormValues,
  });

  useEffect(() => {
    reset(toFormValues(editingCareer));
  }, [editingCareer, editorOpen, reset]);

  const departments = useMemo(() => {
    return ["All", ...new Set(careers.map((career) => career.department))];
  }, [careers]);

  function excerpt(text: string, length: number = 50) {
    return text.length > length ? text.substring(0, length) + "..." : text;
  }

  const filteredCareers = useMemo(() => {
    const term = search.trim().toLowerCase();

    return careers.filter((career) => {
      const matchesSearch =
        !term ||
        [
          career.title,
          career.department,
          career.location,
          career.type,
          career.purpose,
          career.salary,
        ]
          .join(" ")
          .toLowerCase()
          .includes(term);

      const matchesDepartment =
        departmentFilter === "All" || career.department === departmentFilter;

      return matchesSearch && matchesDepartment;
    });
  }, [careers, departmentFilter, search]);

  const stats = useMemo(() => {
    const now = new Date();

    return {
      total: careers.length,
      active: careers.filter((career) => new Date(career.endDate) >= now)
        .length,
      expired: careers.filter((career) => new Date(career.endDate) < now)
        .length,
    };
  }, [careers]);

  const openCreate = () => {
    setEditingCareer(null);
    setSubmitError(null);
    setEditorOpen(true);
    reset(defaultFormValues);
  };

  const openEdit = (career: CareerRecord) => {
    setEditingCareer(career);
    setSubmitError(null);
    setEditorOpen(true);
  };

  const closeEditor = () => {
    setEditorOpen(false);
    setEditingCareer(null);
    setSubmitError(null);
  };

  const submitCareer = async (values: ManagementFormValues) => {
    const payload = toPayload(values);
    const isEditing = Boolean(editingCareer);
    const response = await fetch(
      isEditing ? `/api/careers/${editingCareer?.id}` : "/api/careers",
      {
        method: isEditing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    const responseBody = (await response.json().catch(() => ({}))) as {
      data?: CareerRecord;
      error?: string;
    };

    if (!response.ok) {
      if (response.status === 401) {
        router.replace("/admin-l09in");
        return;
      }

      setSubmitError(responseBody.error ?? "Unable to save career posting");
      return;
    }

    const savedCareer = responseBody.data;

    if (savedCareer) {
      setCareers((current) =>
        isEditing
          ? current.map((career) =>
              career.id === savedCareer.id ? savedCareer : career,
            )
          : [savedCareer, ...current],
      );
    }

    closeEditor();
    reset(defaultFormValues);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    setDeleteError(null);
    const response = await fetch(`/api/careers/${deleteTarget.id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      if (response.status === 401) {
        router.replace("/admin-l09in");
        return;
      }

      const body = (await response.json().catch(() => ({}))) as {
        error?: string;
      };

      setDeleteError(body.error ?? "Unable to delete career posting");
      return;
    }

    setCareers((current) =>
      current.filter((career) => career.id !== deleteTarget.id),
    );
    setDeleteTarget(null);
  };

  return (
    <div className="bg-[#f4f7ff] min-h-screen">
      <section className="bg-[#22348A] text-white py-16">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <span className="block w-8 h-px bg-white/60 mb-5" />
          <h1 className="display-text text-3xl sm:text-4xl">
            Career Management
          </h1>
          <p className="mt-3 max-w-2xl text-white/70">
            Manage job postings, control publishing windows, and keep the public
            career board aligned with current hiring needs.
          </p>
        </div>
      </section>

      <section className="relative -mt-10 pb-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { label: "Total careers", value: stats.total },
              { label: "Active postings", value: stats.active },
              { label: "Expired postings", value: stats.expired },
            ].map((card) => (
              <div
                key={card.label}
                className="rounded-2xl border border-white/70 bg-white p-5 shadow-[0_16px_50px_rgba(34,52,138,0.08)]"
              >
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                  {card.label}
                </p>
                <p className="mt-2 text-3xl font-semibold text-[#22348A]">
                  {card.value}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-[28px] border border-white/70 bg-white shadow-[0_24px_80px_rgba(34,52,138,0.09)] overflow-hidden">
            <div className="border-b border-slate-100 p-5 sm:p-6">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <h2 className="display-text text-2xl text-[#22348A]">
                    Career board
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Create, edit, and remove job postings from one secure place.
                  </p>
                </div>

                <div className="flex flex-col gap-3 md:flex-row md:items-center">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search careers..."
                      className="h-11 w-full md:w-72 rounded-full pl-10"
                    />
                  </div>

                  <select
                    value={departmentFilter}
                    onChange={(event) =>
                      setDepartmentFilter(event.target.value)
                    }
                    className="h-11 rounded-full border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-[#22348A]/30 focus:ring-2 focus:ring-[#22348A]/10"
                  >
                    {departments.map((department) => (
                      <option key={department} value={department}>
                        {department}
                      </option>
                    ))}
                  </select>

                  <Button type="button" onClick={openCreate}>
                    <Plus className="h-4 w-4" />
                    Add career
                  </Button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
                    <TableHead className="pl-6">Role</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right pr-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCareers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="px-6 py-16 text-center">
                        <div className="mx-auto flex max-w-sm flex-col items-center gap-3 text-slate-500">
                          <div className="rounded-2xl bg-[#f0f3fc] p-4 text-[#22348A]">
                            <Search className="h-6 w-6" />
                          </div>
                          <p className="text-base font-medium text-slate-700">
                            No career postings match the current filters.
                          </p>
                          <p className="text-sm">
                            Clear the filters or create a new role to get
                            started.
                          </p>
                          <Button type="button" onClick={openCreate}>
                            <Plus className="h-4 w-4" />
                            Create career
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCareers.map((career) => {
                      const status = getStatus(career);

                      return (
                        <TableRow key={career.id}>
                          <TableCell className="pl-6 py-5 align-top">
                            <div className="min-w-0">
                              <p className="font-semibold text-[#22348A] leading-snug">
                                {career.title}
                              </p>
                              <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                                {excerpt(career.purpose)}
                              </p>
                              <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400">
                                <span className="inline-flex items-center gap-1.5">
                                  <Clock3 className="h-3.5 w-3.5" />
                                  {career.type}
                                </span>
                                <span className="inline-flex items-center gap-1.5">
                                  <MapPin className="h-3.5 w-3.5" />
                                  {career.salary}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{career.department}</TableCell>
                          <TableCell>{career.location}</TableCell>
                          <TableCell>
                            <div className="text-sm text-slate-600">
                              <div className="inline-flex items-center gap-1.5">
                                <CalendarDays className="h-3.5 w-3.5" />
                                {formatDate(career.postDate)}
                              </div>
                              <div className="mt-1 text-xs text-slate-400">
                                Ends {formatDate(career.endDate)}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                status === "Active"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : status === "Upcoming"
                                    ? "bg-sky-50 text-sky-700"
                                    : "bg-rose-50 text-rose-700"
                              }`}
                            >
                              {status}
                            </span>
                          </TableCell>
                          <TableCell className="pr-6 text-right">
                            <div className="inline-flex items-center gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => openEdit(career)}
                              >
                                <Pencil className="h-4 w-4" />
                                Edit
                              </Button>
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => setDeleteTarget(career)}
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </section>

      <Dialog
        open={editorOpen}
        onOpenChange={(open) => (open ? setEditorOpen(true) : closeEditor())}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {editingCareer ? "Edit Career" : "Create Career"}
            </DialogTitle>
            <DialogDescription>
              Fill in the job details below. Lists should be entered one item
              per line.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[70vh] pr-4">
            <form
              id="career-form"
              className="space-y-4"
              onSubmit={handleSubmit(submitCareer)}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" {...register("title")} />
                  {errors.title ? (
                    <p className="text-sm text-rose-600">
                      {errors.title.message}
                    </p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input id="department" {...register("department")} />
                  {errors.department ? (
                    <p className="text-sm text-rose-600">
                      {errors.department.message}
                    </p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" {...register("location")} />
                  {errors.location ? (
                    <p className="text-sm text-rose-600">
                      {errors.location.message}
                    </p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Input id="type" {...register("type")} />
                  {errors.type ? (
                    <p className="text-sm text-rose-600">
                      {errors.type.message}
                    </p>
                  ) : null}
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="salary">Salary</Label>
                  <Input id="salary" {...register("salary")} />
                  {errors.salary ? (
                    <p className="text-sm text-rose-600">
                      {errors.salary.message}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="purpose">Purpose</Label>
                <Textarea id="purpose" rows={4} {...register("purpose")} />
                {errors.purpose ? (
                  <p className="text-sm text-rose-600">
                    {errors.purpose.message}
                  </p>
                ) : null}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="postDate">Post Date</Label>
                  <Input id="postDate" type="date" {...register("postDate")} />
                  {errors.postDate ? (
                    <p className="text-sm text-rose-600">
                      {errors.postDate.message}
                    </p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input id="endDate" type="date" {...register("endDate")} />
                  {errors.endDate ? (
                    <p className="text-sm text-rose-600">
                      {errors.endDate.message}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="responsibilities">Responsibilities</Label>
                <Textarea
                  id="responsibilities"
                  rows={5}
                  placeholder="One item per line"
                  {...register("responsibilities")}
                />
                {errors.responsibilities ? (
                  <p className="text-sm text-rose-600">
                    {errors.responsibilities.message}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="qualification">Qualification</Label>
                <Textarea
                  id="qualification"
                  rows={5}
                  placeholder="One item per line"
                  {...register("qualification")}
                />
                {errors.qualification ? (
                  <p className="text-sm text-rose-600">
                    {errors.qualification.message}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="benefits">Benefits</Label>
                <Textarea
                  id="benefits"
                  rows={4}
                  placeholder="One item per line"
                  {...register("benefits")}
                />
                {errors.benefits ? (
                  <p className="text-sm text-rose-600">
                    {errors.benefits.message}
                  </p>
                ) : null}
              </div>

              {submitError ? (
                <p className="text-sm text-rose-600">{submitError}</p>
              ) : null}
            </form>
          </ScrollArea>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeEditor}>
              Cancel
            </Button>
            <Button type="submit" form="career-form" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : editingCareer
                  ? "Update Career"
                  : "Create Career"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete career posting?</AlertDialogTitle>
            <AlertDialogDescription>
              This action permanently removes the role from the database and the
              public board.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteError ? (
            <p className="text-sm text-rose-600">{deleteError}</p>
          ) : null}
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
