"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Loader2,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Phone,
  Hash,
  MapPin,
  Calendar,
  Filter,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

type Application = {
  id: string;
  applicationId: string;
  firstName: string;
  lastName: string;
  phone: string;
  faydaNumber: string;
  dateOfBirth: string;
  birthPlace: string;
  city: string;
  kebele: string;
  status: "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "MORE_INFO_REQUIRED";
  statusNotes?: string | null;
  createdAt: string;
  updatedAt: string;
};

type Stats = {
  TOTAL: number;
  PENDING: number;
  UNDER_REVIEW: number;
  APPROVED: number;
  REJECTED: number;
  MORE_INFO_REQUIRED: number;
};

export default function ApplicationsManagement() {
  const router = useRouter();
  const { toast } = useToast();

  const [applications, setApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState<Stats>({
    TOTAL: 0,
    PENDING: 0,
    UNDER_REVIEW: 0,
    APPROVED: 0,
    REJECTED: 0,
    MORE_INFO_REQUIRED: 0,
  });

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);

  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState<Application["status"]>("PENDING");
  const [statusNotes, setStatusNotes] = useState("");

  const [deleteTarget, setDeleteTarget] = useState<Application | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (search.trim()) {
        queryParams.append("search", search.trim());
      }
      if (statusFilter) {
        queryParams.append("status", statusFilter);
      }

      const BASE_URL = (process.env.NEXT_PUBLIC_LOCAL_API || "http://localhost:3001/").trim().replace(/\/$/, "");
      const response = await fetch(`${BASE_URL}/open-account?${queryParams.toString()}`, {
        credentials: "include",
      });
      const body = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          router.replace("/admin-l09in");
          return;
        }
        throw new Error(body.error ?? "Failed to fetch applications");
      }

      setApplications(body.data);
      setTotalPages(body.meta.totalPages);
      setStats(body.stats);
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error fetching data",
        description: err.message ?? "Could not retrieve account applications.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [page, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchApplications();
  };

  const clearSearch = () => {
    setSearch("");
    setPage(1);
    // Use timeout to allow state update to take effect if we fetch synchronously
    setTimeout(() => {
      fetchApplications();
    }, 0);
  };

  const handleOpenReview = (app: Application) => {
    setSelectedApp(app);
    setNewStatus(app.status);
    setStatusNotes(app.statusNotes ?? "");
    setReviewOpen(true);
  };

  const handleSaveStatus = async () => {
    if (!selectedApp) return;
    setUpdatingStatus(true);

    try {
      const BASE_URL = (process.env.NEXT_PUBLIC_LOCAL_API || "http://localhost:3001/").trim().replace(/\/$/, "");
      const response = await fetch(`${BASE_URL}/open-account/${selectedApp.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          statusNotes: statusNotes.trim() || null,
        }),
        credentials: "include",
      });

      const body = await response.json();

      if (!response.ok) {
        throw new Error(body.error ?? "Failed to update status");
      }

      toast({
        title: "Application Updated",
        description: `Reference ${selectedApp.applicationId} is now ${newStatus}`,
      });

      setReviewOpen(false);
      setSelectedApp(null);
      fetchApplications();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: err.message ?? "Unable to update application status.",
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDeleteApp = async () => {
    if (!deleteTarget) return;
    setDeleting(true);

    try {
      const BASE_URL = (process.env.NEXT_PUBLIC_LOCAL_API || "http://localhost:3001/").trim().replace(/\/$/, "");
      const response = await fetch(`${BASE_URL}/open-account/${deleteTarget.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const body = await response.json();
        throw new Error(body.error ?? "Failed to delete application");
      }

      toast({
        title: "Application Deleted",
        description: `Reference ${deleteTarget.applicationId} was removed successfully.`,
      });

      setDeleteTarget(null);
      setReviewOpen(false);
      setSelectedApp(null);
      fetchApplications();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Deletion failed",
        description: err.message ?? "Unable to delete application.",
      });
    } finally {
      setDeleting(false);
    }
  };

  const getStatusBadge = (status: Application["status"]) => {
    const classes = {
      PENDING: "bg-amber-50 text-amber-700 border-amber-200/50",
      UNDER_REVIEW: "bg-blue-50 text-blue-700 border-blue-200/50",
      APPROVED: "bg-green-50 text-green-700 border-green-200/50",
      REJECTED: "bg-rose-50 text-rose-700 border-rose-200/50",
      MORE_INFO_REQUIRED: "bg-purple-50 text-purple-700 border-purple-200/50",
    };

    const labels = {
      PENDING: "Pending",
      UNDER_REVIEW: "Under Review",
      APPROVED: "Approved",
      REJECTED: "Rejected",
      MORE_INFO_REQUIRED: "More Info",
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full border ${classes[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#f4f7ff] pb-20">
      <section className="bg-[#22348A] py-16 text-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <span className="mb-5 block h-px w-8 bg-white/60" />
          <h1 className="display-text text-3xl sm:text-4xl font-bold">Applications Management</h1>
          <p className="mt-3 max-w-2xl text-white/70">
            Review and manage microfinance account opening requests. Search, filter, and change application statuses.
          </p>
        </div>
      </section>

      <section className="relative -mt-10 px-5 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {[
              { label: "Total Applications", value: stats.TOTAL, statusVal: "", color: "text-[#22348A] border-gray-150" },
              { label: "Pending", value: stats.PENDING, statusVal: "PENDING", color: "text-amber-600 border-amber-200/50 bg-amber-50/10" },
              { label: "Under Review", value: stats.UNDER_REVIEW, statusVal: "UNDER_REVIEW", color: "text-blue-600 border-blue-200/50 bg-blue-50/10" },
              { label: "Approved", value: stats.APPROVED, statusVal: "APPROVED", color: "text-green-600 border-green-200/50 bg-green-50/10" },
              { label: "Rejected", value: stats.REJECTED, statusVal: "REJECTED", color: "text-rose-600 border-rose-200/50 bg-rose-50/10" },
              { label: "Action Required", value: stats.MORE_INFO_REQUIRED, statusVal: "MORE_INFO_REQUIRED", color: "text-purple-600 border-purple-200/50 bg-purple-50/10" },
            ].map((card) => (
              <button
                key={card.label}
                onClick={() => {
                  setStatusFilter(card.statusVal);
                  setPage(1);
                }}
                className={`text-left rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition-all cursor-pointer ${card.color} ${statusFilter === card.statusVal ? "ring-2 ring-[#22348A]" : ""}`}
              >
                <p className="text-[10px] uppercase tracking-[0.1em] text-slate-400 font-bold">
                  {card.label}
                </p>
                <p className="mt-2 text-2xl font-bold">
                  {card.value}
                </p>
              </button>
            ))}
          </div>

          {/* Table Card */}
          <div className="overflow-hidden rounded-[24px] border border-white/80 bg-white shadow-xl">
            <div className="border-b border-slate-100 p-5 sm:p-6">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <h2 className="display-text text-xl font-bold text-[#22348A]">
                    Account Requests
                  </h2>
                  <p className="mt-1 text-xs text-slate-400 font-medium">
                    Review and authorize new registrations securely.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                  <form onSubmit={handleSearchSubmit} className="flex gap-2 relative-1">
                    <div className="relative w-full sm:w-64">
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search Name, Phone, ID..."
                        className="h-10 rounded-xl pl-9 w-full text-xs"
                      />
                    </div>
                    <Button type="submit" size="sm" className="h-10 px-4 rounded-xl text-xs">
                      Search
                    </Button>
                    {search && (
                      <Button type="button" variant="outline" size="sm" onClick={clearSearch} className="h-10 px-3 rounded-xl text-xs">
                        Clear
                      </Button>
                    )}
                  </form>

                  <div className="flex items-center gap-2">
                    <Filter className="w-3.5 h-3.5 text-slate-400" />
                    <select
                      value={statusFilter}
                      onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setPage(1);
                      }}
                      className="h-10 text-xs px-3 border border-gray-200 rounded-xl focus:border-[#22348A] outline-none bg-white text-gray-700"
                    >
                      <option value="">All Statuses</option>
                      <option value="PENDING">Pending</option>
                      <option value="UNDER_REVIEW">Under Review</option>
                      <option value="APPROVED">Approved</option>
                      <option value="REJECTED">Rejected</option>
                      <option value="MORE_INFO_REQUIRED">More Info Required</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Datatable */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/80 hover:bg-slate-50/80 border-b border-slate-100">
                    <TableHead className="pl-6 text-xs uppercase font-bold tracking-wider">Reference ID</TableHead>
                    <TableHead className="text-xs uppercase font-bold tracking-wider">Applicant</TableHead>
                    <TableHead className="text-xs uppercase font-bold tracking-wider">Phone</TableHead>
                    <TableHead className="text-xs uppercase font-bold tracking-wider">Submission Date</TableHead>
                    <TableHead className="text-xs uppercase font-bold tracking-wider">Status</TableHead>
                    <TableHead className="pr-6 text-right text-xs uppercase font-bold tracking-wider">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="px-6 py-20 text-center">
                        <div className="flex justify-center items-center gap-2 text-[#22348A] font-semibold text-sm">
                          <Loader2 className="w-5 h-5 animate-spin" /> Loading applications...
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : applications.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="px-6 py-20 text-center">
                        <div className="mx-auto flex max-w-sm flex-col items-center gap-3 text-slate-400">
                          <div className="rounded-2xl bg-[#f0f3fc] p-4 text-[#22348A]">
                            <FileText className="h-6 w-6" />
                          </div>
                          <p className="text-sm font-semibold text-slate-700">
                            No applications match the search or filter.
                          </p>
                          <p className="text-xs">
                            Adjust your filters to see account requests.
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    applications.map((app) => (
                      <TableRow key={app.id} className="hover:bg-slate-50/50 border-b border-slate-100/70">
                        <TableCell className="pl-6 py-4 font-semibold text-[#22348A] text-xs">
                          {app.applicationId}
                        </TableCell>
                        <TableCell className="py-4">
                          <span className="font-semibold text-gray-800 text-xs">
                            {app.firstName} {app.lastName}
                          </span>
                        </TableCell>
                        <TableCell className="py-4 text-xs text-slate-600 font-medium">
                          {app.phone}
                        </TableCell>
                        <TableCell className="py-4 text-xs text-slate-500 font-medium">
                          {new Date(app.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="py-4">
                          {getStatusBadge(app.status)}
                        </TableCell>
                        <TableCell className="pr-6 py-4 text-right">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenReview(app)}
                            className="rounded-xl h-8 text-xs font-semibold px-3"
                          >
                            Review
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="border-t border-slate-150 p-4 flex items-center justify-between bg-slate-50/50">
                <span className="text-xs text-slate-400 font-medium">
                  Page <strong className="text-slate-600">{page}</strong> of <strong className="text-slate-600">{totalPages}</strong>
                </span>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="h-8 w-8 p-0 rounded-lg"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="h-8 w-8 p-0 rounded-lg"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Review Dialog */}
      <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
        <DialogContent className="max-w-xl rounded-[24px] overflow-hidden max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-[#22348A] flex items-center gap-1.5">
              Review Application {selectedApp?.applicationId}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Verify customer details and update progress statuses.
            </DialogDescription>
          </DialogHeader>

          {selectedApp && (
            <div className="space-y-6 mt-2">
              {/* Applicant Details Grid */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-100 text-xs">
                <div className="flex gap-2.5 items-start">
                  <User className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-slate-400 font-bold uppercase tracking-wider mb-0.5">Full Name</span>
                    <span className="font-semibold text-gray-800 text-sm">
                      {selectedApp.firstName} {selectedApp.lastName}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2.5 items-start">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-slate-400 font-bold uppercase tracking-wider mb-0.5">Phone Number</span>
                    <span className="font-semibold text-gray-800 text-sm">{selectedApp.phone}</span>
                  </div>
                </div>

                <div className="flex gap-2.5 items-start">
                  <Hash className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-slate-400 font-bold uppercase tracking-wider mb-0.5">Fayda ID</span>
                    <span className="font-semibold text-gray-800 text-sm">{selectedApp.faydaNumber}</span>
                  </div>
                </div>

                <div className="flex gap-2.5 items-start">
                  <Calendar className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-slate-400 font-bold uppercase tracking-wider mb-0.5">Date of Birth</span>
                    <span className="font-semibold text-gray-800 text-sm">
                      {new Date(selectedApp.dateOfBirth).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2.5 items-start">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-slate-400 font-bold uppercase tracking-wider mb-0.5">Place of Birth</span>
                    <span className="font-semibold text-gray-800 text-sm">{selectedApp.birthPlace}</span>
                  </div>
                </div>

                <div className="flex gap-2.5 items-start">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-slate-400 font-bold uppercase tracking-wider mb-0.5">Address</span>
                    <span className="font-semibold text-gray-800 text-sm">
                      {selectedApp.city}, Kebele {selectedApp.kebele}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Update Form */}
              <div className="space-y-4 border-t border-slate-100 pt-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Application Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as Application["status"])}
                    className="w-full h-10 px-3 border border-gray-200 rounded-xl focus:border-[#22348A] outline-none text-xs bg-white text-gray-700"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="UNDER_REVIEW">Under Review</option>
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                    <option value="MORE_INFO_REQUIRED">More Information Required</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Review Remarks / Status Notes
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Write detailed remarks (required for Action Required/Rejections, visible to applicants)..."
                    value={statusNotes}
                    onChange={(e) => setStatusNotes(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:border-[#22348A] focus:ring-1 focus:ring-[#22348A] outline-none text-xs text-gray-700 resize-none font-medium"
                  />
                  <p className="text-[10px] text-slate-400">
                    Warning: These comments are public and visible to the applicant when they check their status tracking.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-5">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => setDeleteTarget(selectedApp)}
                  className="rounded-xl flex items-center gap-1.5 h-9"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </Button>

                <DialogFooter className="gap-2 sm:gap-0">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setReviewOpen(false)}
                    className="rounded-xl h-9 text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    disabled={updatingStatus}
                    onClick={handleSaveStatus}
                    className="rounded-xl h-9 text-xs bg-[#22348A] hover:bg-[#162260]"
                  >
                    {updatingStatus ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Save Changes"}
                  </Button>
                </DialogFooter>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Alert Dialog */}
      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-bold text-gray-800 text-lg">Permanently delete application?</AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-gray-500">
              This action cannot be undone. It will remove reference{" "}
              <strong className="text-gray-700">{deleteTarget?.applicationId}</strong> for{" "}
              <strong className="text-gray-700">
                {deleteTarget?.firstName} {deleteTarget?.lastName}
              </strong>{" "}
              from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl text-xs h-9">Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleting}
              onClick={(e) => {
                e.preventDefault();
                handleDeleteApp();
              }}
              className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs h-9"
            >
              {deleting ? "Deleting..." : "Delete Application"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
