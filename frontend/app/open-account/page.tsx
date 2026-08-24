"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle, Copy, Download, Link as LinkIcon, ExternalLink } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useCreateOpenAccountMutation } from "@/state/api/ApiSlice";

const step1Schema = z.object({
  firstName: z.string().trim().min(2, "First name is required").max(255),
  lastName: z.string().trim().min(2, "Last name is required").max(255),
  phone: z
    .string()
    .trim()
    .min(9, "Phone must be at least 9 characters")
    .max(15, "Phone must be at most 15 characters")
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format (e.g. +251912345678 or 0912345678)"),
  idNumber: z
    .string()
    .trim()
    .length(16, "National ID (Fayda Number) must be exactly 16 digits")
    .regex(/^\d+$/, "Fayda Number must contain only digits"),
  dateOfBirth: z.coerce.date()
    .refine((date) => date < new Date(), "Date of birth must be in the past")
    .refine((date) => {
      const age = new Date().getFullYear() - date.getFullYear();
      return age >= 18;
    }, "Applicant must be at least 18 years old"),
  birthPlace: z.string().trim().min(2, "Place of birth is required").max(255),
  city: z.string().trim().min(2, "City is required").max(255),
  kebele: z.string().trim().min(1, "Kebele is required").max(255),
});

const inputClass =
  "border-gray-200 focus:border-[#22348A] focus:ring-[#22348A]/15 text-sm";
const labelClass =
  "text-xs font-semibold text-gray-500 uppercase tracking-wider";

const steps = ["Personal Details"];

export default function Apply() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [applicationId, setApplicationId] = useState("");
  const [applicantName, setApplicantName] = useState("");
  const { toast } = useToast();

  const defaultDob = new Date();
  defaultDob.setFullYear(defaultDob.getFullYear() - 18);

  const f1 = useForm({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      idNumber: "",
      dateOfBirth: defaultDob,
      birthPlace: "",
      city: "",
      kebele: "",
    },
  });

  const [createOpenAccount] = useCreateOpenAccountMutation();

  const onSubmit = async (data: z.infer<typeof step1Schema>) => {
    setLoading(true);
    try {
      const payload = {
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        phone: data.phone.trim(),
        faydaNumber: data.idNumber.trim(),
        dateOfBirth: data.dateOfBirth.toISOString(),
        birthPlace: data.birthPlace.trim(),
        city: data.city.trim(),
        kebele: data.kebele.trim(),
      };

      const result = await createOpenAccount(payload).unwrap();

      setApplicationId(result.data.applicationId);
      setApplicantName(`${data.firstName} ${data.lastName}`);
      setSubmitted(true);
      toast({
        title: "Application submitted successfully!",
        description: `Your Reference ID is ${result.data.applicationId}`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: error?.data?.message || error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(applicationId);
    toast({
      title: "Copied to clipboard",
      description: "Application Reference ID copied.",
    });
  };

  const downloadReferenceFile = () => {
    const element = document.createElement("a");
    const fileContent = `NISIR MICROFINANCE INSTITUTION S.C.
--------------------------------------------
ACCOUNT OPENING APPLICATION RECEIPT

Applicant Name: ${applicantName}
Application Reference ID: ${applicationId}
Date Submitted: ${new Date().toLocaleDateString()}

Please keep this Reference ID safe. You can check the status of your application
anytime at: ${window.location.origin}/open-account/track

Thank you for choosing Nisir Microfinance.
`;
    const file = new Blob([fileContent], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `nisir_application_${applicationId}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Receipt Saved",
      description: "Text file downloaded successfully.",
    });
  };

  if (submitted) {
    return (
      <div className="pt-16 min-h-screen bg-[#f0f3fc] flex items-center justify-center px-5">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-[28px] p-10 max-w-lg w-full text-center shadow-xl border border-gray-100"
        >
          <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="display-text text-[#22348A] text-3xl font-bold mb-3">
            Application Received
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Thank you, <strong className="text-gray-800">{applicantName}</strong>. Your account opening application has been successfully submitted and is under review.
          </p>

          <div className="bg-[#f0f3fc] rounded-2xl p-6 border border-[#22348A]/10 mb-8 relative group">
            <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">
              Application Reference ID
            </div>
            <div className="font-bold text-[#22348A] text-xl select-all tracking-wide">
              {applicationId}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={copyToClipboard}
              className="flex items-center justify-center gap-2 border border-gray-200 hover:border-[#22348A]/30 text-gray-700 hover:text-[#22348A] hover:bg-[#f0f3fc]/50 text-sm font-semibold py-3 px-4 rounded-xl transition-all"
            >
              <Copy className="w-4 h-4" /> Copy ID
            </button>
            <button
              onClick={downloadReferenceFile}
              className="flex items-center justify-center gap-2 border border-gray-200 hover:border-[#22348A]/30 text-gray-700 hover:text-[#22348A] hover:bg-[#f0f3fc]/50 text-sm font-semibold py-3 px-4 rounded-xl transition-all"
            >
              <Download className="w-4 h-4" /> Save Receipt
            </button>
          </div>

          <div className="flex flex-col gap-3">
            <Link
              href="/open-account/track"
              className="w-full bg-[#22348A] text-white text-sm font-semibold py-3.5 rounded-xl hover:bg-[#162260] transition-colors shadow-lg shadow-[#22348A]/20 flex items-center justify-center gap-2"
            >
              Track Status <ExternalLink className="w-4 h-4" />
            </Link>
            
            <button
              onClick={() => {
                setSubmitted(false);
                setApplicationId("");
                setApplicantName("");
                f1.reset();
              }}
              className="text-xs font-semibold text-gray-400 hover:text-[#22348A] transition-colors py-2"
            >
              Submit Another Application
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="overflow-x-hidden min-h-screen bg-[#f0f3fc] pb-16">
      {/* Hero */}
      <section className="relative hero-gradient noise-overlay overflow-hidden py-20 md:py-24">
        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/8" />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="block w-8 h-px bg-[#BCBDC1] mb-6" />
            <h1 className="display-text text-white text-4xl sm:text-5xl mb-4 font-bold tracking-tight">
              Open a New Account
            </h1>
            <p className="text-white/75 text-base sm:text-lg max-w-lg">
              Start your microfinance journey with Nisir. Fill in your details below to apply.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 -mt-10 relative z-10">
        <div className="max-w-2xl mx-auto px-5">
          {/* Step indicator */}
          <div className="flex items-center mb-6">
            {steps.map((label, i) => {
              const n = i + 1;
              return (
                <div key={label} className="flex items-center flex-1 last:flex-none">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#22348A] text-white flex items-center justify-center text-xs font-bold shadow-md shadow-[#22348A]/20">
                      {n}
                    </div>
                    <div>
                      <span className="block text-xs font-semibold text-[#22348A] uppercase tracking-wider">
                        {label}
                      </span>
                      <div className="text-[10px] text-gray-500 font-medium">
                        Your account request will be processed within 24 hours
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            
            <div className="ml-auto text-xs font-semibold text-[#22348A]/80 hover:text-[#22348A] flex items-center gap-1">
              <Link href="/open-account/track" className="flex items-center gap-1 bg-white px-3.5 py-1.5 rounded-lg border border-gray-100 shadow-sm hover:shadow transition-all">
                Track Status <LinkIcon className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Form card */}
          <div className="bg-white border border-gray-100 rounded-[28px] p-8 shadow-xl">
            <Form {...f1}>
              <form
                onSubmit={f1.handleSubmit(onSubmit)}
                className="flex flex-col gap-6"
              >
                <div className="border-b border-gray-100 pb-4 mb-2">
                  <h2 className="display-text text-[#22348A] text-xl font-bold">
                    Personal Details
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">Please provide accurate details as they appear on your official IDs.</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <FormField
                    control={f1.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelClass}>First Name</FormLabel>
                        <FormControl>
                          <Input
                            data-testid="input-first-name"
                            placeholder="Tigist"
                            className={inputClass}
                            disabled={loading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={f1.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelClass}>Last Name</FormLabel>
                        <FormControl>
                          <Input
                            data-testid="input-last-name"
                            placeholder="Haile"
                            className={inputClass}
                            disabled={loading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid sm:grid-cols-2 gap-5">
                  <FormField
                    control={f1.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelClass}>Phone</FormLabel>
                        <FormControl>
                          <Input
                            data-testid="input-phone"
                            placeholder="+251912345678"
                            className={inputClass}
                            disabled={loading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={f1.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelClass}>Date of Birth</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            data-testid="input-dob"
                            className={inputClass}
                            disabled={loading}
                            value={
                              field.value instanceof Date && !isNaN(field.value.getTime())
                                ? field.value.toISOString().split("T")[0]
                                : ""
                            }
                            onChange={(e) => {
                              const dateVal = e.target.value ? new Date(e.target.value) : null;
                              field.onChange(dateVal);
                            }}
                            onBlur={field.onBlur}
                            ref={field.ref}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <FormField
                    control={f1.control}
                    name="birthPlace"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelClass}>Place of Birth</FormLabel>
                        <FormControl>
                          <Input
                            data-testid="input-birth-place"
                            placeholder="Addis Ababa"
                            className={inputClass}
                            disabled={loading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={f1.control}
                    name="idNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelClass}>National ID (Fayda Number)</FormLabel>
                        <FormControl>
                          <Input
                            data-testid="input-id-number"
                            placeholder="Enter 16-digit Fayda ID"
                            maxLength={16}
                            className={inputClass}
                            disabled={loading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <FormField
                    control={f1.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelClass}>City</FormLabel>
                        <FormControl>
                          <Input
                            data-testid="input-city"
                            placeholder="Addis Ababa"
                            className={inputClass}
                            disabled={loading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={f1.control}
                    name="kebele"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelClass}>Kebele</FormLabel>
                        <FormControl>
                          <Input
                            data-testid="input-kebele"
                            placeholder="03"
                            className={inputClass}
                            disabled={loading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <button
                  data-testid="button-next-step1"
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#22348A] text-white text-sm font-semibold py-4 rounded-xl hover:bg-[#162260] transition-colors shadow-lg shadow-[#22348A]/10 disabled:opacity-75 disabled:cursor-not-allowed mt-4"
                >
                  {loading ? "Submitting Application..." : "Submit Application"} <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </Form>
          </div>
        </div>
      </section>
    </div>
  );
}
