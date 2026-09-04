import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Loader2,
  Eye,
  EyeOff,
  AlertCircle,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { login } from "../api/auth";
import { useAuth } from "../hooks/useAuth";
import { GoogleSignInButton } from "../components/GoogleSignInButton";
import { AuthLayout } from "../components/AuthLayout";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});
type FormValues = z.infer<typeof schema>;

export default function Login() {
  const { setToken } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);

  const {
    register: field,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    setServerError(null);
    setUnverifiedEmail(null);
    try {
      const { access_token } = await login(values.email, values.password);
      setToken(access_token);
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      const detail = err?.response?.data?.detail ?? "Couldn't sign in. Please verify your credentials.";
      setServerError(detail);
      if (err?.response?.status === 403 || detail.toLowerCase().includes("verify")) {
        setUnverifiedEmail(values.email);
      }
    }
  }

  return (
    <AuthLayout>
      <div className="space-y-6">
        
        {/* Title Header */}
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-brand)]/10 px-2.5 py-1 text-xs font-semibold text-[var(--color-brand)] dark:text-indigo-300">
            <Sparkles className="h-3 w-3" />
            <span>Welcome Back</span>
          </div>
          <h1 className="mt-2.5 font-display text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-ink)]">
            Sign in to EduGuide
          </h1>
          <p className="mt-1.5 text-sm text-[var(--color-ink-dim)]">
            Access your personalized cutoffs, college matches, and scholarship reports.
          </p>
        </div>

        {/* Google One-Tap Action */}
        <div>
          <GoogleSignInButton
            text="Continue with Google"
            onSuccess={(token) => {
              setToken(token);
              navigate("/dashboard", { replace: true });
            }}
            onVerificationRequired={(email) => {
              navigate("/register", { state: { email } });
            }}
            onError={(msg) => setServerError(msg)}
          />
        </div>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--color-border-soft)]" />
          </div>
          <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
            <span className="bg-[var(--color-surface)] px-3 text-[var(--color-ink-faint)] font-medium">
              Or sign in with email
            </span>
          </div>
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          {/* Email Field */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[var(--color-ink-dim)]">
              Email Address
            </label>
            <div className={`input-group ${errors.email ? "has-error" : ""}`}>
              <Mail className="h-4 w-4 shrink-0 text-[var(--color-ink-faint)]" />
              <input
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                {...field("email")}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs font-medium text-[var(--color-agent-red)] flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="block text-xs font-semibold text-[var(--color-ink-dim)]">
                Password
              </label>
            </div>
            <div className={`input-group ${errors.password ? "has-error" : ""}`}>
              <Lock className="h-4 w-4 shrink-0 text-[var(--color-ink-faint)]" />
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                {...field("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="shrink-0 rounded-md p-0.5 text-[var(--color-ink-faint)] hover:text-[var(--color-ink)] transition-colors"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs font-medium text-[var(--color-agent-red)] flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Error Message Box */}
          {serverError && (
            <div className="rounded-xl border border-[var(--color-agent-red)]/20 bg-[var(--color-agent-red)]/10 p-3.5 text-xs text-[var(--color-agent-red)] space-y-2 animate-in fade-in duration-150">
              <div className="flex items-start gap-2 font-medium">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{serverError}</span>
              </div>
              {unverifiedEmail && (
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => navigate("/register", { state: { email: unverifiedEmail } })}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-agent-red)]/15 px-2.5 py-1 font-semibold text-[var(--color-agent-red)] hover:bg-[var(--color-agent-red)]/25 transition-colors"
                  >
                    <span>Open Email Verification Screen →</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-[var(--color-brand)] to-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all duration-200 hover:from-indigo-500 hover:to-violet-500 hover:shadow-indigo-600/35 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Signing in securely...</span>
              </>
            ) : (
              <>
                <span>Sign in to Account</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </form>

        {/* Switch to Register */}
        <div className="pt-2 text-center">
          <p className="text-xs sm:text-sm text-[var(--color-ink-dim)]">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-[var(--color-brand)] hover:text-[var(--color-brand-hover)] transition-colors underline-offset-4 hover:underline"
            >
              Create an account for free
            </Link>
          </p>
        </div>

      </div>
    </AuthLayout>
  );
}

// Re-export Field and AuthLayout if any legacy component imports them
export { AuthLayout };
export function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-[var(--color-ink-dim)]">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs font-medium text-[var(--color-agent-red)]">{error}</p>}
    </div>
  );
}
