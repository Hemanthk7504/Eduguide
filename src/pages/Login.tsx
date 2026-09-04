import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { GraduationCap, Loader2, Eye, EyeOff, AlertCircle } from "lucide-react";
import { login } from "../api/auth";
import { useAuth } from "../hooks/useAuth";
import { ThemeToggle } from "../components/ThemeToggle";
import { GoogleSignInButton } from "../components/GoogleSignInButton";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
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
      const detail = err?.response?.data?.detail ?? "Couldn't sign in. Check your credentials.";
      setServerError(detail);
      if (err?.response?.status === 403 || detail.toLowerCase().includes("verify")) {
        setUnverifiedEmail(values.email);
      }
    }
  }

  return (
    <AuthLayout>
      <div className="mb-6 flex items-center gap-2">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[var(--color-brand)] to-[var(--color-violet)]">
          <GraduationCap className="h-5 w-5 text-white" />
        </span>
        <span className="font-display text-xl font-semibold">EduGuide AI</span>
      </div>
      <h1 className="font-display text-2xl font-semibold">Welcome back</h1>
      <p className="mt-1 text-sm text-[var(--color-ink-dim)]">
        Sign in to see your personalized admission plan.
      </p>

      {/* Google Sign-in Button */}
      <div className="mt-6">
        <GoogleSignInButton
          text="Sign in with Google"
          onSuccess={(token) => {
            setToken(token);
            navigate("/dashboard", { replace: true });
          }}
          onVerificationRequired={(email, verifyLink) => {
            navigate("/register", { state: { email, verifyLink } });
          }}
          onError={(msg) => setServerError(msg)}
        />
      </div>

      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[var(--color-border-soft)]" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-[var(--color-bg-raised)] px-2 text-[var(--color-ink-faint)]">
            Or sign in with email
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Field label="Email" error={errors.email?.message}>
          <input
            type="email"
            className="input"
            placeholder="you@example.com"
            {...field("email")}
          />
        </Field>

        <Field label="Password" error={errors.password?.message}>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="input pr-10"
              placeholder="••••••••"
              {...field("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-faint)] hover:text-[var(--color-ink)] transition-colors"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </Field>

        {serverError && (
          <div className="rounded-xl bg-[var(--color-agent-red)]/10 p-3 text-xs text-[var(--color-agent-red)] space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{serverError}</span>
            </div>
            {unverifiedEmail && (
              <button
                type="button"
                onClick={() => navigate("/register", { state: { email: unverifiedEmail } })}
                className="font-medium underline hover:text-[var(--color-brand)] block"
              >
                Go to Verification Screen & Resend Email →
              </button>
            )}
          </div>
        )}

        <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          Sign in
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--color-ink-dim)]">
        New to EduGuide?{" "}
        <Link to="/register" className="font-medium text-[var(--color-brand)] hover:text-[var(--color-brand-hover)]">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative grid min-h-screen place-items-center px-4 py-10">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md">
        <div className="card p-8 shadow-xl">{children}</div>
      </div>
    </div>
  );
}

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
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-[var(--color-ink-dim)]">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-[var(--color-agent-red)]">{error}</span>}
    </label>
  );
}
