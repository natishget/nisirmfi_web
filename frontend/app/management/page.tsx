"use client";

import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  FileText,
  LayoutGrid,
  Megaphone,
  ShieldCheck,
  UsersRound,
  MapPin,
} from "lucide-react";

const managementModules = [
  {
    title: "News & Announcements",
    description: "Publish and manage company updates, news articles, and featured stories.",
    href: "/news-management",
    icon: Megaphone,
    color: "bg-blue-50 text-blue-700",
  },
  {
    title: "Career & Recruiting",
    description: "Manage open job positions, review application windows, and hiring content.",
    href: "/career-management",
    icon: BriefcaseBusiness,
    color: "bg-emerald-50 text-emerald-700",
  },
  {
    title: "User Administration",
    description: "Control user access, roles, account details, and system permissions.",
    href: "/user-management",
    icon: UsersRound,
    color: "bg-purple-50 text-purple-700",
  },
  {
    title: "Applications Processing",
    description: "Review customer account applications, verify submitted documents, and update statuses.",
    href: "/applications-management",
    icon: FileText,
    color: "bg-orange-50 text-orange-700",
  },
  {
    title: "Branch Management",
    description: "Add, update, or remove branch locations, operating hours, and contact details.",
    href: "/branches-management",
    icon: MapPin,
    color: "bg-indigo-50 text-indigo-700",
  },
];

export default function ManagementDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Administration Dashboard
          </h1>
          <p className="mt-2 text-sm text-gray-600 sm:text-base">
            Select a management module below to configure system data and operations.
          </p>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {managementModules.map((module) => {
            const Icon = module.icon;
            return (
              <Link
                key={module.href}
                href={module.href}
                className="group relative flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-[#22348A] hover:shadow-md"
              >
                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg ${module.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h2 className="mb-2 text-lg font-semibold text-gray-900 group-hover:text-[#22348A] transition-colors">
                  {module.title}
                </h2>
                <p className="mb-6 flex-1 text-sm text-gray-500 leading-relaxed">
                  {module.description}
                </p>
                <div className="mt-auto flex items-center text-sm font-medium text-[#22348A]">
                  Manage Module
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick Stats or Info Footer */}
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3 border-t border-gray-200 pt-8">
           <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Secure Environment</p>
                <p className="text-xs text-gray-500">Access is logged and monitored.</p>
              </div>
           </div>
           <div className="flex items-center gap-3">
              <LayoutGrid className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Centralized Control</p>
                <p className="text-xs text-gray-500">All modules in one unified interface.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
