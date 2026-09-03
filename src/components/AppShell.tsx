import { type ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  MessageCircle,
  FileText,
  Bell,
  ShieldCheck,
  LogOut,
  GraduationCap,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { AgentRail } from "./AgentRail";
import { ThemeToggle } from "./ThemeToggle";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/colleges", label: "Colleges", icon: Building2 },
  { to: "/chat", label: "Chat", icon: MessageCircle },
  { to: "/reports", label: "Reports", icon: FileText },
  { to: "/notifications", label: "Notifications", icon: Bell },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex">
      <aside className="hidden md:flex md:w-60 lg:w-64 shrink-0 flex-col border-r border-[var(--color-border-soft)] bg-[var(--color-bg-raised)]/60 backdrop-blur-sm">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 px-5 py-5 text-left"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[var(--color-brand)] to-[var(--color-violet)]">
            <GraduationCap className="h-5 w-5 text-white" />
          </span>
          <span className="flex-1 font-display text-lg font-semibold tracking-tight">EduGuide AI</span>
        </button>
        <div className="-mt-2 mb-2 flex justify-end px-5">
          <ThemeToggle />
        </div>

        <nav className="flex-1 space-y-1 px-3 py-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[var(--color-brand)]/15 text-[var(--color-ink)] ring-1 ring-inset ring-[var(--color-brand)]/40"
                    : "text-[var(--color-ink-dim)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)]"
                }`
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
          {user?.role === "admin" && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[var(--color-agent-purple)]/15 text-[var(--color-ink)] ring-1 ring-inset ring-[var(--color-agent-purple)]/40"
                    : "text-[var(--color-ink-dim)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)]"
                }`
              }
            >
              <ShieldCheck className="h-4 w-4" />
              Admin
            </NavLink>
          )}
        </nav>

        <div className="border-t border-[var(--color-border-soft)] px-3 py-3">
          <AgentRail orientation="vertical" />
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-[var(--color-border-soft)] px-4 py-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{user?.full_name}</p>
            <p className="truncate text-xs text-[var(--color-ink-faint)]">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            aria-label="Log out"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[var(--color-ink-dim)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-agent-red)]"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-[var(--color-border-soft)] bg-[var(--color-bg)]/80 px-4 py-3 backdrop-blur-sm md:hidden">
          <span className="font-display text-base font-semibold">EduGuide AI</span>
          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `grid h-8 w-8 place-items-center rounded-lg ${
                    isActive ? "bg-[var(--color-brand)]/20 text-[var(--color-ink)]" : "text-[var(--color-ink-faint)]"
                  }`
                }
              >
                <item.icon className="h-4 w-4" />
              </NavLink>
            ))}
            <ThemeToggle />
          </nav>
        </header>
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}
