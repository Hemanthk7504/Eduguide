import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { GraduationCap, Loader2 } from "lucide-react";
import { register as registerUser } from "../api/auth";
import { login } from "../api/auth";
import { useAuth } from "../hooks/useAuth";
import { AuthLayout, Field } from "./Login";

const schema = z.object({
  full_name: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "At least 8 characters"),
});
type FormValues = z.infer<typeof schema>;

export default function Register() {
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
      await registerUser(values);
      const { access_token } = await login(values.email, values.password);
      setToken(access_token);
      navigate("/onboarding");
    } catch (err: any) {
      setServerError(err?.response?.data?.detail ?? "Couldn't create your account. Try again.");
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
      <h1 className="font-display text-2xl font-semibold">Create your account</h1>
      <p className="mt-1 text-sm text-[var(--color-ink-dim)]">
        A few details, then we'll build your admission plan.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
        <Field label="Full name" error={errors.full_name?.message}>
          <input className="input" placeholder="Sai Priya Reddy" {...field("full_name")} />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <input type="email" className="input" placeholder="you@example.com" {...field("email")} />
        </Field>
        <Field label="Password" error={errors.password?.message}>
          <input type="password" className="input" placeholder="At least 8 characters" {...field("password")} />
        </Field>

        {serverError && (
          <p className="rounded-lg bg-[var(--color-agent-red)]/10 px-3 py-2 text-sm text-[var(--color-agent-red)]">
            {serverError}
          </p>
        )}

        <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          Create account
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--color-ink-dim)]">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-[var(--color-brand)] hover:text-[var(--color-brand-hover)]">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
