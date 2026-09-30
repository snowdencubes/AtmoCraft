'use client';

import { useTransition } from 'react';
import { approveUser, rejectUser, deactivateUser } from '@/app/actions/admin';
import { Check, X, Ban, Loader2 } from 'lucide-react';
import { useToast } from '@/components/shared/toast';

export function UserActionButtons({ userId, status }: { userId: string, status: string }) {
  const [isPending, startTransition] = useTransition();
  const { addToast } = useToast();

  const handleAction = (action: 'approve' | 'reject' | 'deactivate') => {
    startTransition(async () => {
      let result;
      if (action === 'approve') result = await approveUser(userId);
      if (action === 'reject') result = await rejectUser(userId);
      if (action === 'deactivate') result = await deactivateUser(userId);
      
      if (result?.error) {
        addToast({ title: 'Error', description: result.error, type: 'error' });
      } else {
        addToast({ title: 'Success', description: `User ${action}d successfully.`, type: 'success' });
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      {status === 'pending' && (
        <>
          <button
            onClick={() => handleAction('approve')}
            disabled={isPending}
            className="rounded-lg bg-[var(--color-success)]/10 p-2 text-[var(--color-success)] transition-colors hover:bg-[var(--color-success)]/20 disabled:opacity-50"
            title="Approve User"
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
          </button>
          <button
            onClick={() => handleAction('reject')}
            disabled={isPending}
            className="rounded-lg bg-[var(--color-danger)]/10 p-2 text-[var(--color-danger)] transition-colors hover:bg-[var(--color-danger)]/20 disabled:opacity-50"
            title="Reject User"
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
          </button>
        </>
      )}
      
      {status === 'approved' && (
        <button
          onClick={() => handleAction('deactivate')}
          disabled={isPending}
          className="rounded-lg bg-[var(--color-warning)]/10 p-2 text-[var(--color-warning)] transition-colors hover:bg-[var(--color-warning)]/20 disabled:opacity-50"
          title="Deactivate User"
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Ban className="h-4 w-4" />}
        </button>
      )}
    </div>
  );
}
