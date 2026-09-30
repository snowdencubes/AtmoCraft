"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { FileUp, File, Video, FileText, Trash2, Link as LinkIcon, Plus } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { coursesRepo, resourcesRepo } from "@/lib/db/repos";
import { Course, Resource, ResourceType } from "@/lib/types";
import { saveFile, deleteFile } from "@/lib/db/files";

export default function TrainerResources() {
  const { currentUser } = useAuthStore();
  const [courses, setCourses] = useState<Course[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [isUploading, setIsUploading] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [resourceTitle, setResourceTitle] = useState("");
  const [resourceDesc, setResourceDesc] = useState("");
  const [resourceType, setResourceType] = useState<ResourceType>("pdf");
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!currentUser) return;
      
      const allCourses = await coursesRepo.findAll();
      const myCourses = allCourses.filter(c => c.trainerId === currentUser.id);
      
      const allResources = await resourcesRepo.findAll();
      const myCourseIds = new Set(myCourses.map(c => c.id));
      const myResources = allResources.filter(r => myCourseIds.has(r.courseId));
      
      setCourses(myCourses);
      setResources(myResources);
      if (myCourses.length > 0) {
        setSelectedCourseId(myCourses[0].id);
      }
      setLoading(false);
    }
    loadData();
  }, [currentUser]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileToUpload(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileToUpload || !selectedCourseId || !resourceTitle) return;
    
    setIsUploading(true);
    
    try {
      const fileId = crypto.randomUUID();
      // Save the actual file data to IDB
      await saveFile(fileId, fileToUpload);
      
      const newResource: Resource = {
        id: crypto.randomUUID(),
        courseId: selectedCourseId,
        title: resourceTitle,
        type: resourceType,
        url: fileId, // Using the IDB key as the URL
        size: (fileToUpload.size / (1024 * 1024)).toFixed(2) + " MB",
        uploadedAt: new Date().toISOString(),
        description: resourceDesc
      };
      
      const saved = await resourcesRepo.create(newResource);
      setResources(prev => [...prev, saved]);
      
      // Reset form
      setFileToUpload(null);
      setResourceTitle("");
      setResourceDesc("");
      (document.getElementById("file-upload") as HTMLInputElement).value = "";
      
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (resourceId: string, fileKey: string) => {
    await resourcesRepo.delete(resourceId);
    await deleteFile(fileKey);
    setResources(prev => prev.filter(r => r.id !== resourceId));
  };

  const getIcon = (type: ResourceType) => {
    switch (type) {
      case 'video': return <Video className="h-6 w-6 text-blue-500" />;
      case 'pdf': return <FileText className="h-6 w-6 text-red-500" />;
      case 'slides': return <File className="h-6 w-6 text-yellow-500" />;
      default: return <LinkIcon className="h-6 w-6 text-gray-500" />;
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading resources...</div>;
  }

  return (
    <div className="flex flex-col gap-6 pb-12">
      <PageHeader title="Resource Library" />
      
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Upload Form */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-2xl border bg-[var(--color-surface-card)] p-6 shadow-sm">
            <h3 className="mb-4 font-heading text-lg font-bold">Upload Resource</h3>
            
            {courses.length === 0 ? (
              <p className="text-sm text-[var(--color-on-surface-muted)]">You must create a course first.</p>
            ) : (
              <form onSubmit={handleUpload} className="space-y-4 flex flex-col">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Course</label>
                  <select 
                    value={selectedCourseId}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                    className="w-full rounded-xl border bg-transparent px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                    required
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Title</label>
                  <input 
                    type="text" 
                    value={resourceTitle}
                    onChange={(e) => setResourceTitle(e.target.value)}
                    placeholder="E.g., Introduction to Python"
                    className="w-full rounded-xl border bg-transparent px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                    required
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Type</label>
                  <select 
                    value={resourceType}
                    onChange={(e) => setResourceType(e.target.value as ResourceType)}
                    className="w-full rounded-xl border bg-transparent px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                  >
                    <option value="pdf">PDF Document</option>
                    <option value="video">Video</option>
                    <option value="slides">Presentation Slides</option>
                  </select>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Description</label>
                  <textarea 
                    value={resourceDesc}
                    onChange={(e) => setResourceDesc(e.target.value)}
                    placeholder="Brief description..."
                    rows={3}
                    className="w-full rounded-xl border bg-transparent px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">File</label>
                  <input 
                    id="file-upload"
                    type="file" 
                    onChange={handleFileChange}
                    className="w-full text-sm file:mr-4 file:rounded-full file:border-0 file:bg-[var(--color-primary)]/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[var(--color-primary)] hover:file:bg-[var(--color-primary)]/20"
                    required
                  />
                </div>
                
                <button 
                  type="submit" 
                  disabled={isUploading || !fileToUpload}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--color-primary)]/90 disabled:opacity-50"
                >
                  {isUploading ? "Uploading..." : (
                    <>
                      <FileUp className="h-4 w-4" />
                      Upload Resource
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
        
        {/* Resource List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border bg-[var(--color-surface-card)] p-6 shadow-sm min-h-[500px]">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-heading text-lg font-bold">Your Resources</h3>
              <span className="rounded-full bg-[var(--color-surface-raised)] px-3 py-1 text-xs font-medium">
                {resources.length} Total
              </span>
            </div>
            
            {resources.length === 0 ? (
              <EmptyState 
                icon={<FileUp className="h-16 w-16" />}
                title="No resources found"
                description="Upload files to share them with your students."
              />
            ) : (
              <div className="space-y-3">
                {resources.map(resource => {
                  const course = courses.find(c => c.id === resource.courseId);
                  
                  return (
                    <div key={resource.id} className="flex items-center justify-between rounded-xl border bg-[var(--color-surface-raised)] p-4 transition-colors hover:bg-[var(--color-surface-raised)]/80">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-surface-card)] shadow-sm">
                          {getIcon(resource.type)}
                        </div>
                        <div>
                          <h4 className="font-medium">{resource.title}</h4>
                          <div className="flex items-center gap-2 text-xs text-[var(--color-on-surface-muted)]">
                            <span className="font-semibold text-[var(--color-primary)]">{course?.title || 'Unknown Course'}</span>
                            <span>•</span>
                            <span>{resource.size}</span>
                            <span>•</span>
                            <span>{new Date(resource.uploadedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => handleDelete(resource.id, resource.url)}
                        className="rounded-lg p-2 text-[var(--color-on-surface-muted)] transition-colors hover:bg-[var(--color-danger)]/10 hover:text-[var(--color-danger)]"
                        title="Delete Resource"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
