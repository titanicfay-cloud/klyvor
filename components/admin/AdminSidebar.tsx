
"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Shield,
  Users,
  LifeBuoy,
  ArrowLeft,
  Bell,
  LayoutDashboard,
} from "lucide-react";

interface AdminSidebarProps {
  roleName: string;
  onNavigate?: () => void;
}

export default function AdminSidebar({
  roleName,
  onNavigate,
}: AdminSidebarProps) {
  const isOwner = roleName === "OWNER";
  const isAdmin = roleName === "ADMIN";
  const isSupport = roleName === "SUPPORT";

  const homeHref = isOwner
    ? "/admin"
    : isAdmin
      ? "/admin/admin-workspace"
      : "/admin/support-workspace";

  const navigation = isOwner
    ? [
        {
          label: "Owner Command Centre",
          href: "/admin",
          icon: Shield,
        },
        {
          label: "Notifications",
          href: "/admin/notifications",
          icon: Bell,
        },
        {
          label: "Support Oversight",
          href: "/admin/support",
          icon: LifeBuoy,
        },
      ]
    : isAdmin
      ? [
          {
            label: "Admin Workspace",
            href: "/admin/admin-workspace",
            icon: LayoutDashboard,
          },
        ]
      : isSupport
        ? [
            {
              label: "Support Workspace",
              href: "/admin/support-workspace",
              icon: LayoutDashboard,
            },
            {
              label: "Support Inbox",
              href: "/admin/support",
              icon: LifeBuoy,
            },
          ]
        : [];

  const roleColor = isOwner
    ? "bg-[#7C5CFC]"
    : isAdmin
      ? "bg-[#EF4444]"
      : "bg-[#F59E0B]";

  return (
    <div className="flex h-full w-full flex-col bg-[#0B1020]">
      <div className="flex h-20 shrink-0 items-center border-b border-[#27344B] px-6">
        <Link
          href={homeHref}
          onClick={onNavigate}
          className="flex items-center gap-3"
        >
          <Image
            src="/klyvor-symbol.png"
            alt="KLYVOR"
            width={48}
            height={48}
            className="h-10 w-10 object-contain"
            priority
          />

          <span
            className={`rounded px-2 py-0.5 text-[10px] font-bold text-white ${roleColor}`}
          >
            {roleName}
          </span>
        </Link>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto px-4 py-6">
        <p className="mb-4 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#64748B]">
          {isOwner
            ? "Platform Authority"
            : isAdmin
              ? "Administration"
              : "Customer Care"}
        </p>

        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-[#C7D0E0] transition-colors hover:bg-[#111A2E] hover:text-white"
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}

        {isOwner && (
          <div className="mt-8 border-t border-[#27344B] pt-5">
            <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#64748B]">
              Platform Management
            </p>

            <div className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-[#64748B]">
              <Users size={18} />
              Staff Management
              <span className="ml-auto text-[9px] uppercase tracking-wider">
                Coming soon
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-[#27344B] p-4">
        <Link
          href="/dashboard"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-[#64748B] transition-colors hover:bg-[#111A2E] hover:text-white"
        >
          <ArrowLeft size={18} />
          Exit to App
        </Link>
      </div>
    </div>
  );
              }
