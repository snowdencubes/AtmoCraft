"use client";

import { ShieldAlert } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";

export default function ForbiddenPage() {
  const { role } = useAuthStore();
  const router = useRouter();

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <EmptyState
        icon={<ShieldAlert className="h-16 w-16 text-[var(--color-danger)]" />}
        title="Access Denied"
        description="You don't have permission to view this page with your current role."
        action={{
          label: "Return to Dashboard",
          onClick: () => {
            if (role) {
              router.push(`/${role}/dashboard`);
            } else {
              router.push("/");
            }
          },
        }}
        className="max-w-md bg-[var(--color-surface-card)] shadow-sm"
      />
    </div>
  );
}
