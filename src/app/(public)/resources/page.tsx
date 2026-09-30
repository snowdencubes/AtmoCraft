import { getResources } from "@/lib/services/resourceService";
import Link from "next/link";
import { Search, BookOpen, ExternalLink, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const revalidate = 60; // Revalidate every minute

export default async function ResourceLibraryPage() {
  const resources = await getResources();

  return (
    <main className="min-h-screen bg-black text-white selection:bg-cyan-500/30 pt-24 pb-12 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Section */}
        <section className="space-y-6">
          <div className="inline-flex items-center rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-sm font-medium text-cyan-400">
            <BookOpen className="mr-2 h-4 w-4" /> Open Knowledge
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
            Resource Library
          </h1>
          <p className="text-lg text-white/60 max-w-2xl">
            Explore verified educational materials, tools, and courses from leading meteorological organizations like NOAA, WMO, and IMD.
          </p>
        </section>

        {/* Search & Filter Bar (Static Demo for now) */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur-xl transition-all duration-500 group-hover:blur-2xl opacity-50" />
          <div className="relative flex items-center bg-zinc-900/80 border border-white/10 rounded-2xl p-2 backdrop-blur-xl">
            <Search className="h-5 w-5 text-white/40 ml-3 mr-2" />
            <input 
              type="text" 
              placeholder="Search resources, topics, or providers..." 
              className="flex-1 bg-transparent border-none text-white placeholder:text-white/40 focus:ring-0 outline-none px-2 py-3"
            />
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((res: any) => (
            <Link key={res.id} href={`/resources/${res.slug}`}>
              <div className="group relative h-full rounded-3xl border border-white/10 bg-zinc-950 p-6 transition-all hover:border-cyan-500/50 hover:bg-zinc-900 overflow-hidden flex flex-col">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative flex-1 space-y-4">
                  <div className="flex justify-between items-start">
                    <Badge variant="outline" className="text-cyan-400 border-cyan-500/30 uppercase tracking-wider text-[10px]">
                      {res.type.replace('_', ' ')}
                    </Badge>
                    {res.link_status === 'working' && (
                      <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    )}
                  </div>
                  
                  <h3 className="text-xl font-semibold leading-tight group-hover:text-cyan-400 transition-colors">
                    {res.title}
                  </h3>
                  
                  <p className="text-sm text-white/50 line-clamp-3">
                    {res.summary}
                  </p>
                </div>
                
                <div className="relative mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-sm text-white/40">
                  <span>{res.resource_providers?.name || res.provider_id}</span>
                  <ExternalLink className="h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </Link>
          ))}
          {resources.length === 0 && (
            <div className="col-span-full py-20 text-center text-white/40 border border-white/10 rounded-3xl border-dashed">
              No resources found. Please run the import script to populate the library.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
