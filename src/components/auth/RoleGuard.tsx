"use client";

import { useAuth } from "@/lib/auth-context";
import type { UserRole } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  redirectTo?: string;
  unauthorizedPath?: string;
}

export default function RoleGuard({
  children,
  allowedRoles,
  redirectTo = "/login",
  unauthorizedPath = "/unauthorized",
}: RoleGuardProps) {
  const router = useRouter();
  const { user, loading, isAuthenticated, hasRole } = useAuth();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!isAuthenticated) {
      router.replace(redirectTo);
      return;
    }

    if (!allowedRoles.some((role) => hasRole(role))) {
      router.replace(unauthorizedPath);
    }
  }, [
    loading,
    isAuthenticated,
    allowedRoles,
    hasRole,
    redirectTo,
    router,
    unauthorizedPath,
  ]);

  if (loading) {
    return (
      <div className="flex min-h-50 items-center justify-center px-4 py-10 text-sm text-slate-600">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  if (!allowedRoles.some((role) => hasRole(role))) {
    return null;
  }

  return <>{children}</>;
}
