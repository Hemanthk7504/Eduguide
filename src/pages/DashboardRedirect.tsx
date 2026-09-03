import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { listProfiles } from "../api/profiles";

export default function DashboardRedirect() {
  const [target, setTarget] = useState<string | null>(null);

  useEffect(() => {
    listProfiles()
      .then((profiles) => {
        setTarget(profiles.length ? `/dashboard/${profiles[profiles.length - 1].id}` : "/onboarding");
      })
      .catch(() => setTarget("/onboarding"));
  }, []);

  if (!target) {
    return (
      <div className="grid min-h-screen place-items-center bg-[var(--color-bg)]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-brand)] border-t-transparent" />
      </div>
    );
  }
  return <Navigate to={target} replace />;
}
