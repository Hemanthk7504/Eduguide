import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { GraduationCap, Loader2 } from "lucide-react";
import { login } from "../api/auth";
import { useAuth } from "../hooks/useAuth";
import { ThemeToggle } from "../components/ThemeToggle";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});
type FormValues = z.infer<typeof schema>;

export default function Login() {
  const { setToken } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register: field,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    setServerError(null);
    try {
      const { access_token } = await login(values.email, values.password);
      setToken(access_token);
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      setServerError(err?.response?.data?.detail ?? "Couldn't sign in. Check your credentials.");
    }
  }

  return (
    <AuthLayout>
      <div className="mb-8 flex items-center gap-2">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[var(--color-brand)] to-[var(--color-violet)]">
          <GraduationCap className="h-5 w-5 text-white" />
        </span>
        <span className="font-display text-xl font-semibold">EduGuide AI</span>
      </div>
      <h1 className="font-display text-2xl font-semibold">Welcome back</h1>
      <p className="mt-1 text-sm text-[var(--color-ink-dim)]">
        Sign in to see your personalized admission plan.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
        <Field label="Email" error={errors.email?.message}>
          <input
            type="email"
            className="input"
            placeholder="you@example.com"
            {...field("email")}
          />
        </Field>
        <Field label="Password" error={errors.password?.message}>
          <input type="password" className="input" placeholder="••••••••" {...field("password")} />
        </Field>

        {serverError && (
          <p className="rounded-lg bg-[var(--color-agent-red)]/10 px-3 py-2 text-sm text-[var(--color-agent-red)]">
            {serverError}
          </p>
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
        <div className="card p-8">{children}</div>
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
