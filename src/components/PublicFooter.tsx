import { Link } from "react-router-dom";
import { GraduationCap, ShieldCheck } from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="border-t border-[var(--color-border-soft)] bg-[var(--color-surface)] text-[var(--color-ink-dim)]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[var(--color-brand)] to-[var(--color-violet)] shadow-md shadow-[var(--color-brand)]/20">
                <GraduationCap className="h-5 w-5 text-white" />
              </span>
              <span className="font-display text-xl font-bold tracking-tight text-[var(--color-ink)]">
                EduGuide <span className="bg-gradient-to-r from-[var(--color-brand)] to-[var(--color-violet)] bg-clip-text text-transparent">AI</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-sm">
              India's first multi-agent autonomous admission counseling platform. Providing zero-bias, data-driven college & branch prediction backed by 10+ years of cutoff analytics.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-mono text-emerald-400">All 5 AI Counseling Agents Online</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-[var(--color-ink)]">
              Platform
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a href="#universities" className="hover:text-[var(--color-ink)] transition-colors">
                  University Explorer
                </a>
              </li>
              <li>
                <a href="#agents" className="hover:text-[var(--color-ink)] transition-colors">
                  Multi-Agent System
                </a>
              </li>
              <li>
                <a href="#programs" className="hover:text-[var(--color-ink)] transition-colors">
                  Streams & Specializations
                </a>
              </li>
              <li>
                <Link to="/about" className="hover:text-[var(--color-ink)] transition-colors">
                  About Our Mission
                </Link>
              </li>
              <li>
                <a href="#faq" className="hover:text-[var(--color-ink)] transition-colors">
                  Counseling FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Exams Supported */}
          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-[var(--color-ink)]">
              Exams Covered
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <span className="hover:text-[var(--color-ink)] transition-colors cursor-pointer">
                  JEE Main & Advanced
                </span>
              </li>
              <li>
                <span className="hover:text-[var(--color-ink)] transition-colors cursor-pointer">
                  TS & AP EAMCET / EAPCET
                </span>
              </li>
              <li>
                <span className="hover:text-[var(--color-ink)] transition-colors cursor-pointer">
                  NEET & Medical Counseling
                </span>
              </li>
              <li>
                <span className="hover:text-[var(--color-ink)] transition-colors cursor-pointer">
                  KCET & COMEDK
                </span>
              </li>
              <li>
                <span className="hover:text-[var(--color-ink)] transition-colors cursor-pointer">
                  BITSAT & Deemed Universities
                </span>
              </li>
            </ul>
          </div>

          {/* Institutional Trust */}
          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-[var(--color-ink)]">
              Trust & Data
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-[var(--color-brand)] shrink-0" />
                <span>Govt NIRF Data Verified</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-[var(--color-brand)] shrink-0" />
                <span>Zero Commercial Bias</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-[var(--color-brand)] shrink-0" />
                <span>Reserved Quotas Modeled</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-[var(--color-brand)] shrink-0" />
                <span>Encrypted Student Data</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-[var(--color-border-soft)] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--color-ink-faint)]">
          <p>© {new Date().getFullYear()} EduGuide AI. Built with autonomous multi-agent intelligence.</p>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-[var(--color-ink)] transition-colors">
              About
            </Link>
            <Link to="/login" className="hover:text-[var(--color-ink)] transition-colors">
              Sign In
            </Link>
            <Link to="/register" className="hover:text-[var(--color-ink)] transition-colors">
              Register
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
