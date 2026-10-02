import { getResourceBySlug, getResources } from "@/lib/services/resourceService";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink, ShieldCheck, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export async function generateStaticParams() {
  const resources = await getResources();
  return resources.map((r: any) => ({ slug: r.slug }));
}

export default async function ResourceDetailPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const resource = await getResourceBySlug(params.slug);

  if (!resource) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-black text-white selection:bg-cyan-500/30 pt-24 pb-20 px-6 lg:px-12">
      <div className="max-w-4xl mx-auto space-y-12">
        
        <Link href="/resources" className="inline-flex items-center text-sm text-white/50 hover:text-cyan-400 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Library
        </Link>

        <div className="space-y-6">
          <div className="flex flex-wrap gap-3 items-center">
            <Badge variant="outline" className="text-cyan-400 border-cyan-500/30 uppercase tracking-wider">
              {resource.type.replace('_', ' ')}
            </Badge>
            {resource.link_status === 'working' ? (
              <Badge variant="outline" className="text-emerald-400 border-emerald-500/30">
                <ShieldCheck className="mr-1 h-3 w-3" /> Verified Link
              </Badge>
            ) : (
              <Badge variant="outline" className="text-amber-400 border-amber-500/30">
                <AlertTriangle className="mr-1 h-3 w-3" /> Link Issues Detected
              </Badge>
            )}
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
            {resource.title}
          </h1>

          <div className="flex flex-wrap gap-6 text-sm text-white/60 border-y border-white/10 py-4">
            <div>
              <span className="block text-white/40 mb-1">Provider</span>
              <span className="text-white">{resource.resource_providers?.name || 'Unknown'}</span>
            </div>
            <div>
              <span className="block text-white/40 mb-1">Subject</span>
              <span className="text-white">{resource.subject}</span>
            </div>
            {resource.format && (
              <div>
                <span className="block text-white/40 mb-1">Format</span>
                <span className="text-white uppercase">{resource.format}</span>
              </div>
            )}
          </div>
        </div>

        <div className="prose prose-invert prose-cyan max-w-none">
          <p className="text-lg leading-relaxed text-white/80">
            {resource.summary}
          </p>
        </div>

        <div className="bg-zinc-900/50 border border-white/10 rounded-3xl p-8 space-y-6">
          <h3 className="text-xl font-semibold">Access Resource</h3>
          <p className="text-white/60 text-sm">
            This resource is hosted externally. By clicking the link below, you will leave Capacity Connect. 
            {resource.access === 'login_required' && " Note: This resource may require a free account with the provider."}
          </p>
          
          <Button asChild size="lg" className="bg-cyan-500 hover:bg-cyan-400 text-black rounded-full px-8 font-semibold w-full sm:w-auto">
            <a href={resource.url} target="_blank" rel="noopener noreferrer">
              Open Resource <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {resource.license_name && (
            <div className="bg-zinc-950 border border-white/5 rounded-2xl p-4">
              <span className="text-white/40 block mb-1">License</span>
              {resource.license_name}
            </div>
          )}
          {resource.redistribution_allowed && (
            <div className="bg-zinc-950 border border-white/5 rounded-2xl p-4">
              <span className="text-white/40 block mb-1">Redistribution</span>
              {resource.redistribution_allowed.toUpperCase()}
            </div>
          )}
          {resource.cost && (
            <div className="bg-zinc-950 border border-white/5 rounded-2xl p-4">
              <span className="text-white/40 block mb-1">Cost</span>
              {resource.cost.toUpperCase()}
            </div>
          )}
          {resource.languages && resource.languages.length > 0 && (
            <div className="bg-zinc-950 border border-white/5 rounded-2xl p-4">
              <span className="text-white/40 block mb-1">Language</span>
              {resource.languages.join(', ')}
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
