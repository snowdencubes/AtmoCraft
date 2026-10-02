import { getResources } from "@/lib/services/resourceService";
import Link from "next/link";
import { Search, BookOpen, ExternalLink, ShieldCheck, Download, FileText, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const revalidate = 60; // Revalidate every minute

export default async function ResourceLibraryPage() {
  const resources = await getResources();

  return (
    <main className="min-h-screen bg-[var(--background)] pt-24 pb-20 px-4 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Section */}
        <section className="space-y-6 text-center sm:text-left">
          <div className="inline-flex items-center rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/10 px-4 py-1.5 text-sm font-bold text-[var(--primary)]">
            <BookOpen className="mr-2 h-4 w-4" /> Open Knowledge
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight text-[var(--on-surface)]">
            Resource Library
          </h1>
          <p className="text-lg text-[var(--on-surface-muted)] max-w-2xl font-medium sm:mx-0 mx-auto">
            Explore verified educational materials, tools, and courses from leading meteorological organizations like NOAA, WMO, and IMD.
          </p>
        </section>

        {/* Search & Filter Bar */}
        <div className="relative group max-w-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)]/20 to-[var(--secondary)]/20 rounded-3xl blur-xl transition-all duration-500 group-hover:blur-2xl opacity-50" />
          <div className="relative flex items-center bg-[var(--surface-card)] border border-[var(--outline)] rounded-3xl p-3 shadow-lg transition-all focus-within:border-[var(--primary)]/50 focus-within:shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)]">
            <Search className="h-6 w-6 text-[var(--on-surface-muted)] ml-4 mr-3" />
            <input 
              type="text" 
              placeholder="Search resources, topics, or providers..." 
              className="flex-1 bg-transparent border-none text-[var(--on-surface)] font-medium placeholder:text-[var(--on-surface-muted)]/70 focus:ring-0 outline-none px-2 py-3 text-base"
            />
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {resources.map((res: any) => (
            <Link key={res.id} href={`/resources/${res.slug}`} className="group relative h-full flex flex-col overflow-hidden rounded-3xl border border-[var(--outline)] bg-[var(--surface-card)] shadow-sm transition-all duration-500 hover:shadow-2xl hover:border-[var(--primary)]/40 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              
              <div className="h-40 w-full bg-gradient-to-br from-[var(--primary)]/10 to-[var(--secondary)]/10 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[var(--surface-raised)]/50 mix-blend-overlay"></div>
                {res.type === 'video' ? (
                  <Video className="h-16 w-16 text-[var(--primary)]/40 transition-transform duration-700 group-hover:scale-110" />
                ) : res.type === 'pdf' ? (
                  <FileText className="h-16 w-16 text-[var(--primary)]/40 transition-transform duration-700 group-hover:scale-110" />
                ) : (
                  <BookOpen className="h-16 w-16 text-[var(--primary)]/40 transition-transform duration-700 group-hover:scale-110" />
                )}
                <div className="absolute left-4 top-4">
                  <Badge variant="outline" className="bg-[var(--glass-bg)] backdrop-blur-md text-[var(--primary)] border-[var(--primary)]/30 uppercase tracking-wider text-[10px] font-bold shadow-sm">
                    {res.type.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
              
              <div className="flex-1 p-6 flex flex-col z-10">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-[var(--secondary)]">
                    {res.resource_providers?.name || res.provider_id || 'IMD Official'}
                  </span>
                  {res.link_status === 'working' && (
                    <ShieldCheck className="h-5 w-5 text-[var(--success)] drop-shadow-sm" />
                  )}
                </div>
                
                <h3 className="text-xl font-heading font-bold leading-tight text-[var(--on-surface)] group-hover:text-[var(--primary)] transition-colors mb-3">
                  {res.title}
                </h3>
                
                <p className="text-sm font-medium text-[var(--on-surface-muted)] line-clamp-3 mb-6 flex-1">
                  {res.summary}
                </p>
                
                <div className="mt-auto pt-5 border-t border-[var(--outline)]/50 flex items-center justify-between">
                  <span className="text-sm font-bold text-[var(--primary)] flex items-center gap-1 group-hover:underline">
                    Access Resource
                  </span>
                  <div className="h-8 w-8 rounded-full bg-[var(--surface-raised)] flex items-center justify-center group-hover:bg-[var(--primary)] group-hover:text-white transition-colors text-[var(--on-surface-muted)]">
                    {res.type === 'download' ? <Download className="h-4 w-4" /> : <ExternalLink className="h-4 w-4" />}
                  </div>
                </div>
              </div>
            </Link>
          ))}
          
          {resources.length === 0 && (
            <div className="col-span-full py-24 text-center rounded-3xl border border-dashed border-[var(--outline)] bg-[var(--surface-raised)]/50">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[var(--primary)]/10 text-[var(--primary)] mb-6">
                <BookOpen className="h-12 w-12" />
              </div>
              <h3 className="text-2xl font-bold text-[var(--on-surface)] mb-2">Library is empty</h3>
              <p className="text-[var(--on-surface-muted)] font-medium max-w-sm mx-auto">
                No resources found. Please run the import script or add resources via the admin dashboard.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
