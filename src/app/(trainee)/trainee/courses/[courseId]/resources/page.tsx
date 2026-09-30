"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { getCourseById, getResourcesByCourse, markResourceViewed } from "@/lib/services";
import { courseService } from "@/lib/services/courseService";
import { Course, Resource } from "@/lib/types";
import { PageHeader } from "@/components/shared/page-header";
import { PlayCircle, FileText, Monitor, Download, X } from "lucide-react";
import { useToast } from "@/components/shared/toast";

export default function ResourcesPage({ params }: { params: { courseId: string } }) {
  const router = useRouter();
  const { currentUser } = useAuthStore();
  const { addToast } = useToast();

  const [course, setCourse] = useState<Course | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeResource, setActiveResource] = useState<Resource | null>(null);

  useEffect(() => {
    async function load() {
      if (!currentUser || currentUser.role !== 'trainee') {
        router.push('/trainee/dashboard');
        return;
      }

      try {
        const [cData, rData, enrollment] = await Promise.all([
          getCourseById(params.courseId),
          getResourcesByCourse(params.courseId),
          courseService.getEnrollment(currentUser.id, params.courseId)
        ]);

        if (!cData || !enrollment) {
          addToast({ title: "Access Denied", description: "You are not enrolled in this course.", type: "error" });
          router.push(`/trainee/courses/${params.courseId}`);
          return;
        }

        setCourse(cData);
        setResources(rData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.courseId, currentUser, router, addToast]);

  const handleOpenResource = async (resource: Resource) => {
    setActiveResource(resource);
    if (currentUser) {
      await markResourceViewed(params.courseId, currentUser.id, resource.id);
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video': return <PlayCircle className="h-5 w-5 text-blue-500" />;
      case 'pdf': return <FileText className="h-5 w-5 text-red-500" />;
      case 'slides': return <Monitor className="h-5 w-5 text-yellow-500" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  if (loading) return <div className="p-8 text-center">Loading resources...</div>;
  if (!course) return null;

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full relative">
      <PageHeader 
        title={`${course.title} - Resources`}
        breadcrumbs={[
          { label: "Courses", href: "/trainee/courses" },
          { label: course.title, href: `/trainee/courses/${course.id}` },
          { label: "Resources" }
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources.length === 0 ? (
          <div className="col-span-full py-12 text-center text-[var(--color-on-surface-muted)] border rounded-xl border-dashed">
            No resources found for this course.
          </div>
        ) : (
          resources.map(resource => (
            <div key={resource.id} className="group rounded-xl border bg-[var(--color-surface-card)] p-4 shadow-sm hover:shadow-md transition-all flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[var(--color-surface-raised)] shrink-0">
                  {getResourceIcon(resource.type)}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-[var(--color-on-surface)] line-clamp-1">{resource.title}</h4>
                  <p className="text-xs text-[var(--color-on-surface-muted)] uppercase tracking-wider">{resource.type} • {resource.size}</p>
                </div>
              </div>
              <p className="text-sm text-[var(--color-on-surface-muted)] line-clamp-2 mt-1">
                {resource.description}
              </p>
              <div className="mt-auto pt-4 flex gap-2">
                <button 
                  onClick={() => handleOpenResource(resource)}
                  className="flex-1 rounded-lg bg-[var(--color-primary)] py-2 text-sm font-semibold text-white transition-colors hover:opacity-90 focus-ring"
                >
                  View
                </button>
                <button className="flex items-center justify-center rounded-lg border border-[var(--color-outline)] p-2 text-[var(--color-on-surface-muted)] hover:bg-[var(--color-surface-raised)] focus-ring">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Resource Viewer Modal */}
      {activeResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 md:p-8">
          <div className="flex flex-col w-full max-w-4xl max-h-full bg-[var(--color-surface)] rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-[var(--color-outline)] bg-[var(--color-surface-card)]">
              <div className="flex items-center gap-3">
                {getResourceIcon(activeResource.type)}
                <div>
                  <h3 className="font-bold">{activeResource.title}</h3>
                  <p className="text-xs text-[var(--color-on-surface-muted)] uppercase">{activeResource.type}</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveResource(null)}
                className="p-2 rounded-full hover:bg-[var(--color-surface-raised)] focus-ring transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-auto bg-[var(--color-surface-raised)] p-6 md:p-12 flex items-center justify-center min-h-[50vh]">
              {activeResource.type === 'video' && (
                <div className="aspect-video w-full bg-black rounded-lg flex items-center justify-center shadow-inner relative overflow-hidden group">
                  <PlayCircle className="h-16 w-16 text-white/50 group-hover:text-white/80 transition-colors" />
                  <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                    <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden">
                      <div className="w-1/3 h-full bg-[var(--color-primary)]"></div>
                    </div>
                  </div>
                </div>
              )}
              {activeResource.type === 'pdf' && (
                <div className="w-full max-w-2xl bg-white shadow-lg flex flex-col gap-8 p-8 md:p-16 h-[60vh] overflow-y-auto">
                  <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="space-y-4">
                    <div className="h-4 w-full bg-gray-100 rounded"></div>
                    <div className="h-4 w-full bg-gray-100 rounded"></div>
                    <div className="h-4 w-5/6 bg-gray-100 rounded"></div>
                    <div className="h-4 w-full bg-gray-100 rounded"></div>
                  </div>
                  <div className="h-32 w-full bg-gray-100 rounded mt-8"></div>
                </div>
              )}
              {activeResource.type === 'slides' && (
                <div className="aspect-[4/3] w-full max-w-3xl bg-white rounded-lg shadow-lg flex flex-col p-8 items-center justify-center text-center">
                  <h1 className="text-3xl font-bold mb-4">{activeResource.title}</h1>
                  <p className="text-xl text-gray-500">IMD Training Program</p>
                  <div className="mt-12 flex gap-2">
                    <div className="h-2 w-8 rounded-full bg-[var(--color-primary)]"></div>
                    <div className="h-2 w-2 rounded-full bg-gray-200"></div>
                    <div className="h-2 w-2 rounded-full bg-gray-200"></div>
                    <div className="h-2 w-2 rounded-full bg-gray-200"></div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-[var(--color-outline)] bg-[var(--color-surface-card)] text-sm text-[var(--color-on-surface-muted)] text-center">
              Viewing this resource contributes to your course progress.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
