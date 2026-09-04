import { useState } from "react";
import { Loader2, Mail, X } from "lucide-react";
import { googleAuth } from "../api/auth";

interface GoogleSignInButtonProps {
  text?: string;
  onSuccess: (accessToken: string) => void;
  onVerificationRequired: (email: string, verifyLink?: string) => void;
  onError: (errorMsg: string) => void;
}

export function GoogleSignInButton({
  text = "Continue with Google",
  onSuccess,
  onVerificationRequired,
  onError,
}: GoogleSignInButtonProps) {
  const [loading, setLoading] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [googleEmail, setGoogleEmail] = useState("");
  const [googleName, setGoogleName] = useState("");

  async function handleGoogleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!googleEmail || !googleEmail.includes("@")) {
      onError("Please enter a valid Google email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await googleAuth({
        email: googleEmail,
        full_name: googleName || googleEmail.split("@")[0].replace(".", " ").replace(/\b\w/g, l => l.toUpperCase()),
      });

      setShowPrompt(false);

      if (!res.is_verified) {
        // As requested: even when signing up/in via Google, user must verify email!
        onVerificationRequired(googleEmail, res.verification_link);
      } else if (res.access_token) {
        onSuccess(res.access_token);
      }
    } catch (err: any) {
      onError(err?.response?.data?.detail || "Google authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        disabled={loading}
        onClick={() => setShowPrompt(true)}
        className="group relative flex w-full items-center justify-center gap-3 rounded-xl border border-[var(--color-border-soft)] bg-[var(--color-bg)] px-4 py-2.5 text-sm font-medium text-[var(--color-ink)] shadow-2xs transition-all hover:bg-[var(--color-surface-2)] hover:border-[var(--color-border)] active:scale-[0.99]"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin text-[var(--color-brand)]" />
        ) : (
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
        )}
        <span>{text}</span>
      </button>

      {/* Google Account Selector / Modal */}
      {showPrompt && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setShowPrompt(false)}
        >
          <div
            className="card w-full max-w-sm overflow-hidden p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <h3 className="font-semibold text-base">Sign in with Google</h3>
              </div>
              <button
                onClick={() => setShowPrompt(false)}
                className="grid h-7 w-7 place-items-center rounded-lg text-[var(--color-ink-dim)] hover:bg-[var(--color-surface-2)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-2 text-xs text-[var(--color-ink-dim)] leading-relaxed">
              Connect your Google Account to EduGuide AI. An email verification link will be sent to confirm your identity.
            </p>

            <form onSubmit={handleGoogleSubmit} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-[var(--color-ink-dim)] mb-1">
                  Google Email Address
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--color-ink-faint)]" />
                  <input
                    type="email"
                    required
                    value={googleEmail}
                    onChange={(e) => setGoogleEmail(e.target.value)}
                    placeholder="name@gmail.com"
                    className="input pl-9 text-xs"
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--color-ink-dim)] mb-1">
                  Full Name (optional)
                </label>
                <input
                  type="text"
                  value={googleName}
                  onChange={(e) => setGoogleName(e.target.value)}
                  placeholder="e.g. Hemanth Kumar"
                  className="input text-xs"
                />
              </div>

              <div className="rounded-xl bg-blue-500/10 p-2.5 text-[11px] text-blue-700 dark:text-blue-300">
                <span className="font-semibold">Note:</span> A verification link will be sent to this email to complete your registration.
              </div>

              <div className="pt-1 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowPrompt(false)}
                  className="btn-secondary flex-1 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex-1 text-xs inline-flex items-center justify-center gap-1.5"
                >
                  {loading && <Loader2 className="h-3 w-3 animate-spin" />}
                  <span>Continue</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
