"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, ArrowLeft, Clock, Eye, AlertCircle, CheckCircle2, XCircle, Info } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

type TrackingData = {
  applicationId: string;
  applicantName: string;
  status: "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "MORE_INFO_REQUIRED";
  statusNotes?: string | null;
  createdAt: string;
};

export default function TrackApplication() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TrackingData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const BASE_URL = (process.env.NEXT_PUBLIC_LOCAL_API || "http://localhost:3001/").trim().replace(/\/$/, "");
      const response = await fetch(`${BASE_URL}/open-account/track?applicationId=${encodeURIComponent(query.trim())}`);
      const body = await response.json();

      if (!response.ok) {
        throw new Error(body.error ?? "Application not found");
      }

      setResult(body.data);
    } catch (err: any) {
      setError(err.message ?? "Something went wrong.");
      toast({
        variant: "destructive",
        title: "Track failed",
        description: err.message ?? "No application matches that Reference ID.",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: TrackingData["status"]) => {
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
      MORE_INFO_REQUIRED: "Action Required",
    };

    return (
      <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border ${classes[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getStatusSteps = (status: TrackingData["status"]) => {
    const steps = [
      { key: "SUBMITTED", label: "Submitted", done: true },
      {
        key: "UNDER_REVIEW",
        label: "Under Review",
        done: ["UNDER_REVIEW", "APPROVED", "REJECTED", "MORE_INFO_REQUIRED"].includes(status),
      },
      {
        key: "DECISION",
        label: status === "REJECTED" ? "Rejected" : status === "APPROVED" ? "Approved" : "Decision",
        done: ["APPROVED", "REJECTED"].includes(status),
        error: status === "REJECTED",
        info: status === "MORE_INFO_REQUIRED",
        infoLabel: "More Info Needed",
      },
    ];

    return (
      <div className="flex items-center justify-between w-full mt-8 mb-6 relative">
        <div className="absolute left-4 right-4 top-1/2 h-0.5 bg-gray-100 -translate-y-1/2 z-0" />
        {steps.map((step, idx) => {
          const isLast = idx === steps.length - 1;
          const isInfo = isLast && step.info;
          const isErr = isLast && step.error;
          const isActive = step.done || isInfo;

          let icon = <Clock className="w-4 h-4 text-gray-300" />;
          if (step.done) {
            if (isErr) {
              icon = <XCircle className="w-4 h-4 text-rose-600" />;
            } else {
              icon = <CheckCircle2 className="w-4 h-4 text-[#22348A]" />;
            }
          } else if (isInfo) {
            icon = <AlertCircle className="w-4 h-4 text-purple-600" />;
          }

          return (
            <div key={step.key} className="flex flex-col items-center z-10 bg-[#f4f7ff] sm:bg-white px-2">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${
                  isActive
                    ? isErr
                      ? "bg-rose-50 border-rose-200 text-rose-600"
                      : isInfo
                        ? "bg-purple-50 border-purple-200 text-purple-600"
                        : "bg-[#f0f3fc] border-[#22348A]/20 text-[#22348A]"
                    : "bg-white border-gray-200 text-gray-300"
                }`}
              >
                {icon}
              </div>
              <span
                className={`text-xs font-semibold mt-2 ${
                  isActive
                    ? isErr
                      ? "text-rose-600"
                      : isInfo
                        ? "text-purple-600"
                        : "text-[#22348A]"
                    : "text-gray-400"
                }`}
              >
                {isInfo ? step.infoLabel : step.label}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="overflow-x-hidden min-h-screen bg-[#f0f3fc] pb-16">
      {/* Hero */}
      <section className="relative hero-gradient noise-overlay overflow-hidden py-16 md:py-20">
        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/8" />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <Link href="/open-account" className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-xs font-semibold uppercase tracking-wider mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Account Form
          </Link>
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="display-text text-white text-3xl sm:text-4xl font-bold tracking-tight">
              Track Application Status
            </h1>
            <p className="text-white/75 text-sm sm:text-base max-w-md mt-2">
              Check the status of your microfinance account opening application.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-10 -mt-8 relative z-10">
        <div className="max-w-xl mx-auto px-5">
          {/* Tracking Form */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-lg mb-6">
            <form onSubmit={handleSearch} className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter Reference ID (e.g., NISIR-2026-XXXXXX)"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-gray-200 focus:border-[#22348A] focus:ring-1 focus:ring-[#22348A] outline-none transition-all uppercase"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="bg-[#22348A] text-white px-5 py-3 rounded-xl hover:bg-[#162260] transition-colors text-sm font-semibold disabled:opacity-75 disabled:cursor-not-allowed flex items-center gap-1.5 shrink-0 shadow-md shadow-[#22348A]/10"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Track"}
              </button>
            </form>
          </div>

          {/* Results Area */}
          <AnimatePresence mode="wait">
            {result && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-white border border-gray-100 rounded-[28px] p-8 shadow-xl"
              >
                <div className="flex flex-col gap-4 border-b border-gray-100 pb-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                      Reference ID
                    </span>
                    {getStatusBadge(result.status)}
                  </div>
                  <div className="font-bold text-[#22348A] text-xl select-all tracking-wide">
                    {result.applicationId}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-y-4 gap-x-2 py-5 border-b border-gray-100 text-sm">
                  <div>
                    <span className="block text-xs text-gray-400 mb-0.5">Applicant</span>
                    <span className="font-semibold text-gray-800">{result.applicantName}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-gray-400 mb-0.5">Submitted On</span>
                    <span className="font-semibold text-gray-800">
                      {new Date(result.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                {getStatusSteps(result.status)}

                {/* Status Callouts / Remarks */}
                {result.status === "MORE_INFO_REQUIRED" && (
                  <div className="mt-6 rounded-2xl bg-purple-50 border border-purple-200/50 p-5 flex items-start gap-3">
                    <Info className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-purple-900">Information Required</h4>
                      <p className="text-xs text-purple-700 mt-1 leading-relaxed">
                        {result.statusNotes || "We require additional documents or clarifications to process your application. Please check your contact number or email for instructions."}
                      </p>
                    </div>
                  </div>
                )}

                {result.status === "APPROVED" && (
                  <div className="mt-6 rounded-2xl bg-green-50 border border-green-200/50 p-5 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-green-900">Application Approved!</h4>
                      <p className="text-xs text-green-700 mt-1 leading-relaxed">
                        {result.statusNotes || "Congratulations! Your account opening has been approved. A representative will contact you shortly with details to access your account."}
                      </p>
                    </div>
                  </div>
                )}

                {result.status === "REJECTED" && (
                  <div className="mt-6 rounded-2xl bg-rose-50 border border-rose-200/50 p-5 flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-rose-900">Application Rejected</h4>
                      <p className="text-xs text-rose-700 mt-1 leading-relaxed">
                        {result.statusNotes || "Unfortunately, your application does not meet our credit or account opening criteria. You can visit one of our branches for details."}
                      </p>
                    </div>
                  </div>
                )}

                {result.status === "UNDER_REVIEW" && result.statusNotes && (
                  <div className="mt-6 rounded-2xl bg-blue-50 border border-blue-200/50 p-5 flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-blue-900">Review Remarks</h4>
                      <p className="text-xs text-blue-700 mt-1 leading-relaxed">{result.statusNotes}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-white border border-rose-200 rounded-2xl p-6 text-center text-rose-600 flex flex-col items-center gap-2 shadow-lg"
              >
                <AlertCircle className="w-8 h-8 text-rose-500" />
                <h3 className="font-bold text-sm">Application Not Found</h3>
                <p className="text-xs text-gray-500 max-w-xs">
                  We couldn't find any application matching that Reference ID. Make sure it is entered exactly as shown on your receipt.
                </p>
              </motion.div>
            )}

            {!result && !error && !loading && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white border border-gray-150 border-dashed rounded-2xl p-10 text-center text-gray-400 flex flex-col items-center gap-3 shadow-inner"
              >
                <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-gray-700 text-sm">Waiting for Reference ID</h3>
                <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
                  Enter your 16-character Reference ID above and click Track to lookup your application timeline.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
