"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Trash2, Plus, Upload, Download, FileText } from "lucide-react";
import { profileService } from "@/lib/services/profile";
import { useAuthStore } from "@/store/auth-store";
import { Profile } from "@/lib/types";
import { saveFile, getFile, deleteFile } from "@/lib/db/files";

const qualificationSchema = z.object({
  id: z.string(),
  degree: z.string().min(1, "Required"),
  institution: z.string().min(1, "Required"),
  year: z.coerce.number().min(1900).max(new Date().getFullYear()),
  field: z.string().min(1, "Required"),
});

const workExperienceSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Required"),
  organization: z.string().min(1, "Required"),
  startDate: z.string().min(1, "Required"),
  endDate: z.string(),
  description: z.string(),
});

const certificateSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Required"),
  file: z.string(),
  uploadedAt: z.string(),
});

const profileFormSchema = z.object({
  qualifications: z.array(qualificationSchema),
  workExperience: z.array(workExperienceSchema),
  interests: z.array(z.string()),
  skills: z.array(z.string()),
  certificates: z.array(certificateSchema),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileForm({ onProgressUpdate }: { onProgressUpdate: (progress: number) => void }) {
  const { currentUser } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newInterest, setNewInterest] = useState("");
  const [newSkill, setNewSkill] = useState("");

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema) as any,
    defaultValues: {
      qualifications: [],
      workExperience: [],
      interests: [],
      skills: [],
      certificates: [],
    },
  });

  const { fields: qualFields, append: appendQual, remove: removeQual } = useFieldArray({
    control: form.control,
    name: "qualifications",
  });

  const { fields: expFields, append: appendExp, remove: removeExp } = useFieldArray({
    control: form.control,
    name: "workExperience",
  });

  const { fields: certFields, append: appendCert, remove: removeCert } = useFieldArray({
    control: form.control,
    name: "certificates",
  });

  useEffect(() => {
    async function loadData() {
      if (!currentUser) return;
      const profile = await profileService.getProfile(currentUser.id);
      form.reset({
        qualifications: profile.qualifications || [],
        workExperience: profile.workExperience || [],
        interests: profile.interests || [],
        skills: profile.skills || [],
        certificates: profile.certificates || [],
      });
      onProgressUpdate(profile.completionPercent || 0);
      setLoading(false);
    }
    loadData();
  }, [currentUser, form, onProgressUpdate]);

  const onSubmit = async (data: ProfileFormValues) => {
    if (!currentUser) return;
    setSaving(true);
    const updated = await profileService.updateProfile(currentUser.id, data);
    if (updated) {
      onProgressUpdate(updated.completionPercent);
    }
    setSaving(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileId = crypto.randomUUID();
    await saveFile('certificates', fileId, file);
    
    appendCert({
      id: crypto.randomUUID(),
      name: file.name,
      file: fileId,
      uploadedAt: new Date().toISOString(),
    });
    
    // Auto-save form to trigger percentage update
    form.handleSubmit(onSubmit as any)();
  };

  const handleDownload = async (fileId: string, fileName: string) => {
    const file = await getFile('certificates', fileId);
    if (!file) return;

    let url: string;
    if (file instanceof Blob) {
      url = URL.createObjectURL(file);
    } else {
      url = file as string; // Data URL or text
    }

    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    if (file instanceof Blob) {
      URL.revokeObjectURL(url);
    }
  };

  const addInterest = () => {
    if (newInterest.trim()) {
      const interests = form.getValues("interests");
      form.setValue("interests", [...interests, newInterest.trim()]);
      setNewInterest("");
    }
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      const skills = form.getValues("skills");
      form.setValue("skills", [...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  if (loading) return <div>Loading profile...</div>;

  return (
    <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-8">
      
      {/* QUALIFICATIONS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-heading text-lg font-semibold">Qualifications</h4>
          <button
            type="button"
            onClick={() => appendQual({ id: crypto.randomUUID(), degree: "", institution: "", year: new Date().getFullYear(), field: "" })}
            className="flex items-center gap-1 rounded bg-[var(--color-primary)] px-3 py-1 text-sm text-white hover:bg-[var(--color-primary-dark)]"
          >
            <Plus size={16} /> Add
          </button>
        </div>
        {qualFields.map((field, index) => (
          <div key={field.id} className="grid gap-4 rounded-lg border p-4 sm:grid-cols-2 md:grid-cols-4 relative">
            <button type="button" onClick={() => removeQual(index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">
              <Trash2 size={16} />
            </button>
            <div className="space-y-1">
              <label className="text-xs font-medium">Degree</label>
              <input {...form.register(`qualifications.${index}.degree`)} className="w-full rounded border p-2 text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Institution</label>
              <input {...form.register(`qualifications.${index}.institution`)} className="w-full rounded border p-2 text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Year</label>
              <input type="number" {...form.register(`qualifications.${index}.year`)} className="w-full rounded border p-2 text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Field</label>
              <input {...form.register(`qualifications.${index}.field`)} className="w-full rounded border p-2 text-sm" />
            </div>
          </div>
        ))}
      </div>

      {/* WORK EXPERIENCE */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-heading text-lg font-semibold">Work Experience</h4>
          <button
            type="button"
            onClick={() => appendExp({ id: crypto.randomUUID(), title: "", organization: "", startDate: "", endDate: "", description: "" })}
            className="flex items-center gap-1 rounded bg-[var(--color-primary)] px-3 py-1 text-sm text-white hover:bg-[var(--color-primary-dark)]"
          >
            <Plus size={16} /> Add
          </button>
        </div>
        {expFields.map((field, index) => (
          <div key={field.id} className="grid gap-4 rounded-lg border p-4 sm:grid-cols-2 md:grid-cols-2 relative">
            <button type="button" onClick={() => removeExp(index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">
              <Trash2 size={16} />
            </button>
            <div className="space-y-1">
              <label className="text-xs font-medium">Title</label>
              <input {...form.register(`workExperience.${index}.title`)} className="w-full rounded border p-2 text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Organization</label>
              <input {...form.register(`workExperience.${index}.organization`)} className="w-full rounded border p-2 text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Start Date</label>
              <input type="date" {...form.register(`workExperience.${index}.startDate`)} className="w-full rounded border p-2 text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">End Date</label>
              <input type="date" {...form.register(`workExperience.${index}.endDate`)} className="w-full rounded border p-2 text-sm" />
            </div>
            <div className="space-y-1 col-span-1 md:col-span-2">
              <label className="text-xs font-medium">Description</label>
              <textarea {...form.register(`workExperience.${index}.description`)} className="w-full rounded border p-2 text-sm" rows={2} />
            </div>
          </div>
        ))}
      </div>

      {/* INTERESTS & SKILLS */}
      <div className="grid gap-8 sm:grid-cols-2">
        <div className="space-y-4">
          <h4 className="font-heading text-lg font-semibold">Interests</h4>
          <div className="flex gap-2">
            <input 
              value={newInterest} 
              onChange={e => setNewInterest(e.target.value)} 
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addInterest())}
              placeholder="Add an interest..." 
              className="flex-1 rounded border p-2 text-sm" 
            />
            <button type="button" onClick={addInterest} className="rounded bg-gray-200 px-3 py-2 text-sm hover:bg-gray-300">Add</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.watch("interests").map((interest, idx) => (
              <span key={idx} className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">
                {interest}
                <button type="button" onClick={() => {
                  const items = form.getValues("interests");
                  form.setValue("interests", items.filter((_, i) => i !== idx));
                }}><Trash2 size={14} /></button>
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-heading text-lg font-semibold">Skills</h4>
          <div className="flex gap-2">
            <input 
              value={newSkill} 
              onChange={e => setNewSkill(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())} 
              placeholder="Add a skill..." 
              className="flex-1 rounded border p-2 text-sm" 
            />
            <button type="button" onClick={addSkill} className="rounded bg-gray-200 px-3 py-2 text-sm hover:bg-gray-300">Add</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.watch("skills").map((skill, idx) => (
              <span key={idx} className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm text-green-800">
                {skill}
                <button type="button" onClick={() => {
                  const items = form.getValues("skills");
                  form.setValue("skills", items.filter((_, i) => i !== idx));
                }}><Trash2 size={14} /></button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* CERTIFICATES */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-heading text-lg font-semibold">Certificates</h4>
          <label className="flex cursor-pointer items-center gap-1 rounded bg-[var(--color-primary)] px-3 py-1 text-sm text-white hover:bg-[var(--color-primary-dark)]">
            <Upload size={16} /> Upload
            <input type="file" className="hidden" onChange={handleFileUpload} accept=".pdf,image/*" />
          </label>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {certFields.map((field, index) => (
            <div key={field.id} className="flex flex-col items-start gap-2 rounded-lg border p-4 relative pr-8">
              <button 
                type="button" 
                onClick={async () => {
                  await deleteFile('certificates', field.file);
                  removeCert(index);
                  form.handleSubmit(onSubmit as any)();
                }} 
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              >
                <Trash2 size={16} />
              </button>
              <div className="flex items-center gap-2 font-medium text-sm">
                <FileText size={18} className="text-gray-500" />
                <span className="truncate max-w-[150px]">{field.name}</span>
              </div>
              <div className="text-xs text-gray-400">{new Date(field.uploadedAt).toLocaleDateString()}</div>
              <button 
                type="button" 
                onClick={() => handleDownload(field.file, field.name)}
                className="mt-2 flex items-center gap-1 text-xs text-blue-600 hover:underline"
              >
                <Download size={14} /> Download/View
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end border-t pt-4">
        <button 
          type="submit" 
          disabled={saving}
          className="rounded bg-[var(--color-primary)] px-6 py-2 font-medium text-white hover:bg-[var(--color-primary-dark)] disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </div>

    </form>
  );
}
