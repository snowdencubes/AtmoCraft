import { PageHeader } from "@/components/shared/page-header";
import { createClient } from "@/lib/supabase/server";
import { UserActionButtons } from "./components/user-action-buttons";
import Link from "next/link";
import { Search } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string, q?: string }>;
}) {
  const { filter, q } = await searchParams;
  const currentFilter = filter || 'all';
  const searchQuery = q || '';

  const supabase = await createClient();
  
  let query = supabase.from('users').select('*').order('createdAt', { ascending: false });
  
  if (currentFilter !== 'all') {
    query = query.eq('status', currentFilter);
  }
  
  if (searchQuery) {
    query = query.or(`name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,department.ilike.%${searchQuery}%`);
  }

  const { data: users, error } = await query;

  return (
    <div className="space-y-6">
      <PageHeader 
        title="User Management" 
        subtitle="Approve, reject, or manage platform access."
      />
      
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between rounded-2xl border bg-[var(--color-surface-card)] p-4 shadow-sm glass">
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
          <Link 
            href="/admin/users?filter=all"
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${currentFilter === 'all' ? 'bg-[var(--color-primary)] text-white' : 'hover:bg-[var(--color-surface-raised)]'}`}
          >
            All Users
          </Link>
          <Link 
            href="/admin/users?filter=pending"
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${currentFilter === 'pending' ? 'bg-[var(--color-warning)] text-white' : 'hover:bg-[var(--color-surface-raised)]'}`}
          >
            Pending
          </Link>
          <Link 
            href="/admin/users?filter=approved"
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${currentFilter === 'approved' ? 'bg-[var(--color-success)] text-white' : 'hover:bg-[var(--color-surface-raised)]'}`}
          >
            Approved
          </Link>
        </div>
        
        <form className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-on-surface-muted)]" />
          <input 
            type="text" 
            name="q"
            defaultValue={searchQuery}
            placeholder="Search users..." 
            className="w-full rounded-xl border border-[var(--color-outline)] bg-transparent py-2 pl-9 pr-4 text-sm focus:border-[var(--color-secondary)] focus:ring-1 focus:ring-[var(--color-secondary)] outline-none"
          />
          {currentFilter !== 'all' && <input type="hidden" name="filter" value={currentFilter} />}
        </form>
      </div>

      <div className="rounded-2xl border bg-[var(--color-surface-card)] shadow-sm glass overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-[var(--color-surface-raised)]/50">
              <tr>
                <th className="p-4 font-medium text-[var(--color-on-surface-muted)]">User</th>
                <th className="p-4 font-medium text-[var(--color-on-surface-muted)]">Role</th>
                <th className="p-4 font-medium text-[var(--color-on-surface-muted)]">Department</th>
                <th className="p-4 font-medium text-[var(--color-on-surface-muted)]">Status</th>
                <th className="p-4 font-medium text-[var(--color-on-surface-muted)]">Joined</th>
                <th className="p-4 font-medium text-[var(--color-on-surface-muted)] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-outline)]">
              {users?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[var(--color-on-surface-muted)]">
                    No users found matching your criteria.
                  </td>
                </tr>
              ) : (
                users?.map((user) => (
                  <tr key={user.id} className="transition-colors hover:bg-[var(--color-surface-raised)]/30">
                    <td className="p-4">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-xs text-[var(--color-on-surface-muted)]">{user.email}</div>
                    </td>
                    <td className="p-4 capitalize">{user.role}</td>
                    <td className="p-4 capitalize">{user.department}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium
                        ${user.status === 'approved' ? 'bg-[var(--color-success)]/10 text-[var(--color-success)]' : 
                          user.status === 'pending' ? 'bg-[var(--color-warning)]/10 text-[var(--color-warning-dark)]' : 
                          'bg-[var(--color-danger)]/10 text-[var(--color-danger)]'}
                      `}>
                        {user.status}
                      </span>
                    </td>
                    <td className="p-4 text-[var(--color-on-surface-muted)]">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end">
                        <UserActionButtons userId={user.id} status={user.status} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
