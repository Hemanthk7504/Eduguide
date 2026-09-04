import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { GraduationCap, Menu, X, LayoutDashboard, Sparkles } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { ThemeToggle } from "./ThemeToggle";

export function PublicNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  const isHome = location.pathname === "/";

  const navLinks = [
    { label: "Home", href: "/", isInternal: true },
    { label: "Universities", href: isHome ? "#universities" : "/#universities", isInternal: false },
    { label: "AI Agents", href: isHome ? "#agents" : "/#agents", isInternal: false },
    { label: "Programs", href: isHome ? "#programs" : "/#programs", isInternal: false },
    { label: "About Us", href: "/about", isInternal: true },
    { label: "FAQ", href: isHome ? "#faq" : "/#faq", isInternal: false },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--color-border-soft)] bg-[var(--color-bg-raised)]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[var(--color-brand)] to-[var(--color-violet)] shadow-md shadow-[var(--color-brand)]/20">
            <GraduationCap className="h-5 w-5 text-white" />
          </span>
          <div className="flex flex-col">
            <span className="font-display text-lg font-bold tracking-tight text-[var(--color-ink)]">
              EduGuide <span className="bg-gradient-to-r from-[var(--color-brand)] to-[var(--color-violet)] bg-clip-text text-transparent">AI</span>
            </span>
            <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--color-ink-faint)]">
              University Admissions
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) =>
            link.isInternal ? (
              <Link
                key={link.label}
                to={link.href}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  location.pathname === link.href
                    ? "text-[var(--color-brand)] font-semibold bg-[var(--color-brand)]/10"
                    : "text-[var(--color-ink-dim)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-2)]"
                }`}
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href}
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-[var(--color-ink-dim)] transition-colors hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-2)]"
              >
                {link.label}
              </a>
            )
          )}
        </nav>

        {/* Right Action Controls */}
        <div className="hidden sm:flex items-center gap-3">
          <ThemeToggle />

          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="btn-primary py-2 px-4 shadow-sm text-sm inline-flex items-center gap-2"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
              {user?.full_name && (
                <span className="text-xs opacity-80 border-l border-white/20 pl-2">
                  {user.full_name.split(" ")[0]}
                </span>
              )}
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="btn-secondary py-2 px-3.5 text-sm font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="btn-primary py-2 px-4 text-sm font-semibold shadow-md shadow-[var(--color-brand)]/20 inline-flex items-center gap-1.5"
              >
                <Sparkles className="h-4 w-4" />
                <span>Get Started Free</span>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex sm:hidden items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-[var(--color-ink-dim)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)] focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6 text-[var(--color-ink)]" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="sm:hidden border-t border-[var(--color-border-soft)] bg-[var(--color-bg-raised)] px-4 py-4 shadow-xl">
          <div className="space-y-1 pb-3">
            {navLinks.map((link) =>
              link.isInternal ? (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block rounded-lg px-3 py-2 text-base font-medium ${
                    location.pathname === link.href
                      ? "bg-[var(--color-brand)]/10 text-[var(--color-brand)] font-semibold"
                      : "text-[var(--color-ink-dim)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)]"
                  }`}
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-3 py-2 text-base font-medium text-[var(--color-ink-dim)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)]"
                >
                  {link.label}
                </a>
              )
            )}
          </div>

          <div className="pt-3 border-t border-[var(--color-border-soft)] flex flex-col gap-2">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="btn-primary w-full justify-center text-sm py-2.5"
              >
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="btn-secondary w-full justify-center text-sm py-2.5"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="btn-primary w-full justify-center text-sm py-2.5"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
