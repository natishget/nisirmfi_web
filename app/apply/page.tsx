"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const step1Schema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(9),
  idNumber: z.string().min(5),
  city: z.string().min(2),
  kebele: z.string().min(1),
});

const step2Schema = z.object({
  loanType: z.string().min(1),
  amount: z.string().min(1),
  term: z.string().min(1),
  purpose: z.string().min(10),
});

const step3Schema = z.object({
  employmentStatus: z.string().min(1),
  monthlyIncome: z.string().min(1),
  businessName: z.string().optional().or(z.literal("")),
  businessType: z.string().optional().or(z.literal("")),
  collateral: z.string().optional().or(z.literal("")),
  declaration: z.boolean().refine((value) => value === true, {
    message: "You must agree to the declaration",
  }),
});

const inputClass =
  "border-gray-200 focus:border-[#22348A] focus:ring-[#22348A]/15 text-sm";
const labelClass =
  "text-xs font-semibold text-gray-500 uppercase tracking-wider";

const steps = ["Personal Details", "Loan Requirements", "Financial Profile"];

export default function Apply() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [ref] = useState(
    () =>
      `NISIR-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
  );
  const [collected, setCollected] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const f1 = useForm({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      idNumber: "",
      city: "",
      kebele: "",
    },
  });
  const f2 = useForm({
    resolver: zodResolver(step2Schema),
    defaultValues: { loanType: "", amount: "", term: "", purpose: "" },
  });
  const f3 = useForm({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      employmentStatus: "",
      monthlyIncome: "",
      businessName: "",
      businessType: "",
      collateral: "",
      declaration: false as unknown as true,
    },
  });

  const s1 = (d: z.infer<typeof step1Schema>) => {
    setCollected((p) => ({ ...p, ...d }));
    setStep(2);
  };
  const s2 = (d: z.infer<typeof step2Schema>) => {
    setCollected((p) => ({ ...p, ...d }));
    setStep(3);
  };
  const s3 = (_d: z.infer<typeof step3Schema>) => {
    setSubmitted(true);
    toast({
      title: "Application submitted",
      description: "We will be in touch within 48 business hours.",
    });
  };

  if (submitted) {
    return (
      <div className="pt-16 min-h-screen hero-gradient flex items-center justify-center px-5">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded p-12 max-w-lg w-full text-center shadow-xl"
        >
          <div className="w-16 h-16 rounded bg-[#f0f3fc] flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-[#22348A]" />
          </div>
          <h2 className="display-text text-[#22348A] text-2xl mb-3">
            Application Received
          </h2>
          <p className="text-gray-500 text-sm mb-2">
            Thank you, <strong>{collected.firstName}</strong>. Your application
            has been submitted.
          </p>
          <p className="text-gray-400 text-sm mb-7">
            Our team will contact you at <strong>{collected.email}</strong>{" "}
            within 24–48 business hours.
          </p>
          <div className="bg-[#f0f3fc] rounded p-4 border border-[#22348A]/10 mb-8">
            <div className="text-xs text-gray-400 mb-1">
              Application Reference
            </div>
            <div className="font-bold text-[#22348A] text-sm">{ref}</div>
          </div>
          <button
            onClick={() => {
              setSubmitted(false);
              setStep(1);
              f1.reset();
              f2.reset();
              f3.reset();
              setCollected({});
            }}
            className="w-full bg-[#22348A] text-white text-sm font-semibold py-3 rounded hover:bg-[#162260] transition-colors"
          >
            Submit Another Application
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="overflow-x-hidden ">
      {/* Hero */}
      <section className="relative hero-gradient noise-overlay overflow-hidden py-20 md:py-28">
        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/8" />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="block w-8 h-px bg-[#BCBDC1] mb-6" />
            <h1 className="display-text text-white text-4xl sm:text-5xl mb-4">
              Loan Application
            </h1>
            <p className="text-white/55 text-lg max-w-lg">
              Complete the three-step form below and our credit team will
              respond within 48 business hours.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-[#f0f3fc]">
        <div className="max-w-2xl mx-auto px-5">
          {/* Step indicator */}
          <div className="flex items-center mb-10">
            {steps.map((label, i) => {
              const n = i + 1;
              const done = step > n;
              const active = step === n;
              return (
                <div
                  key={label}
                  className="flex items-center flex-1 last:flex-none"
                >
                  <div
                    data-testid={`step-indicator-${n}`}
                    onClick={() => done && setStep(n)}
                    className={`flex items-center gap-2 ${done ? "cursor-pointer" : ""}`}
                  >
                    <div
                      className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold transition-colors ${
                        done
                          ? "bg-[#22348A] text-white"
                          : active
                            ? "bg-[#22348A] text-white"
                            : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      {done ? <CheckCircle className="w-4 h-4" /> : n}
                    </div>
                    <span
                      className={`hidden sm:block text-xs font-medium ${active ? "text-[#22348A]" : "text-gray-400"}`}
                    >
                      {label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div
                      className={`flex-1 h-px mx-3 transition-colors ${done ? "bg-[#22348A]" : "bg-gray-200"}`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Form card */}
          <div className="bg-white border border-gray-100 rounded p-8">
            <AnimatePresence mode="wait">
              {/* Step 1 */}
              {step === 1 && (
                <motion.div
                  key="s1"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                >
                  <h2 className="display-text text-[#22348A] text-xl mb-6">
                    Personal Details
                  </h2>
                  <Form {...f1}>
                    <form
                      onSubmit={f1.handleSubmit(s1)}
                      className="flex flex-col gap-5"
                    >
                      <div className="grid sm:grid-cols-2 gap-5">
                        <FormField
                          control={f1.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className={labelClass}>
                                First Name
                              </FormLabel>
                              <FormControl>
                                <Input
                                  data-testid="input-first-name"
                                  placeholder="Tigist"
                                  className={inputClass}
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
                              <FormLabel className={labelClass}>
                                Last Name
                              </FormLabel>
                              <FormControl>
                                <Input
                                  data-testid="input-last-name"
                                  placeholder="Haile"
                                  className={inputClass}
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
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className={labelClass}>
                                Email
                              </FormLabel>
                              <FormControl>
                                <Input
                                  data-testid="input-email"
                                  type="email"
                                  placeholder="you@example.com"
                                  className={inputClass}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={f1.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className={labelClass}>
                                Phone
                              </FormLabel>
                              <FormControl>
                                <Input
                                  data-testid="input-phone"
                                  placeholder="+251 91 234 5678"
                                  className={inputClass}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={f1.control}
                        name="idNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={labelClass}>
                              National ID Number
                            </FormLabel>
                            <FormControl>
                              <Input
                                data-testid="input-id-number"
                                placeholder="Your ID number"
                                className={inputClass}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
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
                              <FormLabel className={labelClass}>
                                Kebele
                              </FormLabel>
                              <FormControl>
                                <Input
                                  data-testid="input-kebele"
                                  placeholder="Kebele number"
                                  className={inputClass}
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
                        className="inline-flex items-center gap-2 bg-[#22348A] text-white text-sm font-semibold px-6 py-3 rounded hover:bg-[#162260] transition-colors w-fit"
                      >
                        Continue <ArrowRight className="w-4 h-4" />
                      </button>
                    </form>
                  </Form>
                </motion.div>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <motion.div
                  key="s2"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                >
                  <h2 className="display-text text-[#22348A] text-xl mb-6">
                    Loan Requirements
                  </h2>
                  <Form {...f2}>
                    <form
                      onSubmit={f2.handleSubmit(s2)}
                      className="flex flex-col gap-5"
                    >
                      <FormField
                        control={f2.control}
                        name="loanType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={labelClass}>
                              Loan Type
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger
                                  data-testid="select-loan-type"
                                  className={inputClass}
                                >
                                  <SelectValue placeholder="Select loan type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="business">
                                  Business Loan
                                </SelectItem>
                                <SelectItem value="agriculture">
                                  Agriculture Loan
                                </SelectItem>
                                <SelectItem value="micro-enterprise">
                                  Micro-Enterprise Loan
                                </SelectItem>
                                <SelectItem value="emergency">
                                  Emergency Loan
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={f2.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={labelClass}>
                              Requested Amount (ETB)
                            </FormLabel>
                            <FormControl>
                              <Input
                                data-testid="input-loan-amount"
                                type="number"
                                placeholder="e.g. 50000"
                                className={inputClass}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={f2.control}
                        name="term"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={labelClass}>
                              Loan Term
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger
                                  data-testid="select-loan-term"
                                  className={inputClass}
                                >
                                  <SelectValue placeholder="Select term" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {["3", "6", "12", "18", "24", "36"].map((t) => (
                                  <SelectItem key={t} value={t}>
                                    {t} months
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={f2.control}
                        name="purpose"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={labelClass}>
                              Purpose of Loan
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                data-testid="input-loan-purpose"
                                placeholder="Describe how you plan to use the funds…"
                                rows={4}
                                className={`resize-none ${inputClass}`}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex gap-3">
                        <button
                          data-testid="button-back-step2"
                          type="button"
                          onClick={() => setStep(1)}
                          className="inline-flex items-center gap-2 border border-gray-200 text-gray-600 text-sm font-medium px-5 py-3 rounded hover:bg-gray-50 transition-colors"
                        >
                          <ArrowLeft className="w-4 h-4" /> Back
                        </button>
                        <button
                          data-testid="button-next-step2"
                          type="submit"
                          className="inline-flex items-center gap-2 bg-[#22348A] text-white text-sm font-semibold px-6 py-3 rounded hover:bg-[#162260] transition-colors"
                        >
                          Continue <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </form>
                  </Form>
                </motion.div>
              )}

              {/* Step 3 */}
              {step === 3 && (
                <motion.div
                  key="s3"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                >
                  <h2 className="display-text text-[#22348A] text-xl mb-6">
                    Financial Profile
                  </h2>
                  <Form {...f3}>
                    <form
                      onSubmit={f3.handleSubmit(s3)}
                      className="flex flex-col gap-5"
                    >
                      <FormField
                        control={f3.control}
                        name="employmentStatus"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={labelClass}>
                              Employment Status
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger
                                  data-testid="select-employment"
                                  className={inputClass}
                                >
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="self-employed">
                                  Self-Employed / Business Owner
                                </SelectItem>
                                <SelectItem value="employed">
                                  Salaried Employee
                                </SelectItem>
                                <SelectItem value="farmer">
                                  Farmer / Agricultural
                                </SelectItem>
                                <SelectItem value="trader">
                                  Trader / Vendor
                                </SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={f3.control}
                        name="monthlyIncome"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={labelClass}>
                              Monthly Income (ETB)
                            </FormLabel>
                            <FormControl>
                              <Input
                                data-testid="input-monthly-income"
                                type="number"
                                placeholder="e.g. 15000"
                                className={inputClass}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid sm:grid-cols-2 gap-5">
                        <FormField
                          control={f3.control}
                          name="businessName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className={labelClass}>
                                Business Name (optional)
                              </FormLabel>
                              <FormControl>
                                <Input
                                  data-testid="input-business-name"
                                  placeholder="Your business name"
                                  className={inputClass}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={f3.control}
                          name="businessType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className={labelClass}>
                                Business Type
                              </FormLabel>
                              <FormControl>
                                <Input
                                  data-testid="input-business-type"
                                  placeholder="e.g. Retail, Agriculture"
                                  className={inputClass}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={f3.control}
                        name="collateral"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={labelClass}>
                              Collateral (if any)
                            </FormLabel>
                            <FormControl>
                              <Input
                                data-testid="input-collateral"
                                placeholder="e.g. land, vehicle, equipment"
                                className={inputClass}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={f3.control}
                        name="declaration"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-start gap-3 bg-[#f0f3fc] rounded p-4 border border-[#22348A]/10">
                              <input
                                data-testid="checkbox-declaration"
                                type="checkbox"
                                checked={field.value}
                                onChange={(e) =>
                                  field.onChange(e.target.checked)
                                }
                                className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-[#22348A]"
                              />
                              <label className="text-xs text-gray-600 leading-relaxed">
                                I declare that all information provided is
                                accurate and complete. I consent to Nisir
                                Microfinance Institution S.C. processing my
                                personal data for the purpose of this loan
                                application.
                              </label>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex gap-3">
                        <button
                          data-testid="button-back-step3"
                          type="button"
                          onClick={() => setStep(2)}
                          className="inline-flex items-center gap-2 border border-gray-200 text-gray-600 text-sm font-medium px-5 py-3 rounded hover:bg-gray-50 transition-colors"
                        >
                          <ArrowLeft className="w-4 h-4" /> Back
                        </button>
                        <button
                          data-testid="button-submit-application"
                          type="submit"
                          className="inline-flex items-center gap-2 bg-[#22348A] text-white text-sm font-semibold px-6 py-3 rounded hover:bg-[#162260] transition-colors"
                        >
                          Submit Application <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </form>
                  </Form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
}
