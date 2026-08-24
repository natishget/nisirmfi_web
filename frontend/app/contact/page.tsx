"use client";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional().or(z.literal("")),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactForm = z.infer<typeof schema>;

const info = [
  {
    icon: MapPin,
    label: "Head Office",
    lines: ["Bole Rwanda to Atlas Road Nisir bldg", "Addis Ababa,Ethiopia"],
  },
  {
    icon: Phone,
    label: "Telephone",
    lines: ["9404", "+251 115 622 225", "+251 115 622 371"],
  },
  {
    icon: Mail,
    label: "Email",
    lines: ["info@nisirmfi.com", "  "],
  },
  {
    icon: Clock,
    label: "Office Hours",
    lines: ["Mon–Sat: 8:00 AM – 5:00 PM"],
  },
];

const easeOut = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: easeOut },
  }),
};

export default function Contact() {
  const { toast } = useToast();
  const form = useForm<ContactForm>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", phone: "", subject: "", message: "" },
  });

  function onSubmit(_data: ContactForm) {
    toast({
      title: "Message sent",
      description: "We will get back to you within 24 hours.",
    });
    form.reset();
  }

  return (
    <div className="overflow-x-hidden ">
      {/* Hero */}
      <section className="relative hero-gradient noise-overlay overflow-hidden py-28 md:py-36">
        <div className="absolute -right-64 top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/5 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/8" />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="block w-8 h-px bg-[#BCBDC1] mb-6" />
            <h1 className="display-text text-white text-4xl sm:text-5xl lg:text-[3.5rem] leading-[1.12] mb-6">
              Get in Touch
            </h1>
            <p className="text-white/55 text-lg max-w-lg leading-relaxed">
              Have a question about our services or want to speak with a
              financial advisor? Our team is ready to help.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          {/* Contact info row */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-100 border border-gray-100 rounded overflow-hidden mb-16">
            {info.map((item, i) => (
              <motion.div
                key={item.label}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
                data-testid={`contact-info-${i}`}
                className="bg-white p-7 hover:bg-[#f8f9fe] transition-colors"
              >
                <div className="w-9 h-9 rounded bg-[#f0f3fc] flex items-center justify-center mb-4">
                  <item.icon className="w-4 h-4 text-[#22348A]" />
                </div>
                <div className="font-bold text-[#22348A] text-sm mb-2">
                  {item.label}
                </div>
                {item.lines.map((line) => (
                  <p key={line} className="text-gray-500 text-xs">
                    {line}
                  </p>
                ))}
              </motion.div>
            ))}
          </div>

          {/* Form + sidebar */}
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <span className="divider-accent mb-5 block" />
              <h2 className="display-text text-[#22348A] text-2xl mb-8">
                Send us a message
              </h2>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col gap-5"
                >
                  <div className="grid sm:grid-cols-2 gap-5">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Full Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              data-testid="input-contact-name"
                              placeholder="Tigist Haile"
                              className="border-gray-200 focus:border-[#22348A] focus:ring-[#22348A]/15"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Email Address
                          </FormLabel>
                          <FormControl>
                            <Input
                              data-testid="input-contact-email"
                              type="email"
                              placeholder="you@example.com"
                              className="border-gray-200 focus:border-[#22348A] focus:ring-[#22348A]/15"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Phone (Optional)
                        </FormLabel>
                        <FormControl>
                          <Input
                            data-testid="input-contact-phone"
                            placeholder="+251 91 234 5678"
                            className="border-gray-200 focus:border-[#22348A] focus:ring-[#22348A]/15"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Subject
                        </FormLabel>
                        <FormControl>
                          <Input
                            data-testid="input-contact-subject"
                            placeholder="Loan inquiry, savings account opening…"
                            className="border-gray-200 focus:border-[#22348A] focus:ring-[#22348A]/15"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Message
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            data-testid="input-contact-message"
                            placeholder="How can we help you today?"
                            rows={5}
                            className="resize-none border-gray-200 focus:border-[#22348A] focus:ring-[#22348A]/15"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div>
                    <button
                      data-testid="button-contact-submit"
                      type="submit"
                      className="inline-flex items-center gap-2 bg-[#22348A] text-white text-sm font-semibold px-6 py-3 rounded hover:bg-[#162260] transition-colors"
                    >
                      Send Message <Send className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </Form>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col gap-5"
            >
              <div className="bg-[#22348A] rounded p-7 text-white">
                <h3 className="font-bold mb-4 text-sm">Walk-in welcome</h3>
                <p className="text-white/60 text-sm leading-relaxed mb-5">
                  No appointment needed. Visit any of our 20+ branches with your
                  ID and a financial advisor will assist you on the spot.
                </p>
                <div className="border-t border-white/10 pt-4 text-white/40 text-xs">
                  Mon–Fri: 8:30 AM – 5:30 PM
                  <br />
                  Saturday: 9:00 AM – 1:00 PM
                </div>
              </div>
              <div className="border border-gray-100 rounded p-7">
                <h3 className="font-bold text-[#22348A] mb-4 text-sm">
                  Common enquiries
                </h3>
                <div className="flex flex-col gap-3">
                  {[
                    "Loan application status",
                    "Account opening requirements",
                    "Interest rates & terms",
                    "Branch locations",
                    "Repayment schedules",
                  ].map((q) => (
                    <div
                      key={q}
                      className="text-xs text-gray-500 flex items-center gap-2"
                    >
                      <div className="w-1 h-1 rounded-full bg-[#BCBDC1] shrink-0" />
                      {q}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
