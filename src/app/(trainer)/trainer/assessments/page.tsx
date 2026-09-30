"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ClipboardList, Plus, Trash2, CheckCircle2 } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { coursesRepo, assessmentsRepo, questionsRepo } from "@/lib/db/repos";
import { Course, Assessment, Question } from "@/lib/types";

export default function TrainerAssessments() {
  const { currentUser } = useAuthStore();
  const [courses, setCourses] = useState<Course[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [isCreating, setIsCreating] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(30);
  
  // Questions State
  const [questions, setQuestions] = useState<Omit<Question, "id">[]>([
    { text: "", options: ["", "", "", ""], correctIndex: 0 }
  ]);

  useEffect(() => {
    async function loadData() {
      if (!currentUser) return;
      
      const allCourses = await coursesRepo.findAll();
      const myCourses = allCourses.filter(c => c.trainerId === currentUser.id);
      
      const allAssessments = await assessmentsRepo.findAll();
      const myCourseIds = new Set(myCourses.map(c => c.id));
      const myAssessments = allAssessments.filter(a => myCourseIds.has(a.courseId));
      
      setCourses(myCourses);
      setAssessments(myAssessments);
      if (myCourses.length > 0) {
        setSelectedCourseId(myCourses[0].id);
      }
      setLoading(false);
    }
    loadData();
  }, [currentUser]);

  const handleAddQuestion = () => {
    setQuestions([...questions, { text: "", options: ["", "", "", ""], correctIndex: 0 }]);
  };

  const handleQuestionChange = (index: number, field: string, value: string | number) => {
    const updated = [...questions];
    if (field === "text") {
      updated[index].text = value as string;
    } else if (field === "correctIndex") {
      updated[index].correctIndex = value as number;
    }
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const handleRemoveQuestion = (index: number) => {
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseId || !title || questions.length === 0) return;
    
    // Validate questions
    for (const q of questions) {
      if (!q.text.trim()) {
        alert("All questions must have text");
        return;
      }
      for (const opt of q.options) {
        if (!opt.trim()) {
          alert("All options must be filled out");
          return;
        }
      }
    }

    try {
      const course = courses.find(c => c.id === selectedCourseId);
      
      // Save questions first
      const savedQuestions: Question[] = [];
      for (const q of questions) {
        const newQ = await questionsRepo.create({
          id: crypto.randomUUID(),
          ...q
        });
        savedQuestions.push(newQ);
      }
      
      // Save assessment
      const newAssessment = await assessmentsRepo.create({
        id: crypto.randomUUID(),
        title,
        subject: course?.subject || "General",
        courseId: selectedCourseId,
        questions: savedQuestions,
        duration,
        createdAt: new Date().toISOString()
      });
      
      setAssessments(prev => [...prev, newAssessment]);
      setIsCreating(false);
      
      // Reset form
      setTitle("");
      setDuration(30);
      setQuestions([{ text: "", options: ["", "", "", ""], correctIndex: 0 }]);
      
    } catch (err) {
      console.error("Failed to create assessment", err);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading assessments...</div>;
  }

  return (
    <div className="flex flex-col gap-6 pb-12">
      <div className="flex items-center justify-between">
        <PageHeader title="Course Assessments" />
        <button 
          onClick={() => setIsCreating(!isCreating)}
          className="flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--color-primary)]/90"
        >
          {isCreating ? "Cancel" : (
            <>
              <Plus className="h-4 w-4" />
              Create Assessment
            </>
          )}
        </button>
      </div>

      {isCreating ? (
        <div className="rounded-2xl border bg-[var(--color-surface-card)] p-6 shadow-sm">
          <h3 className="mb-6 font-heading text-xl font-bold">New Assessment</h3>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-1.5 md:col-span-1">
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
              
              <div className="space-y-1.5 md:col-span-1">
                <label className="text-sm font-medium">Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Mid-term Quiz"
                  className="w-full rounded-xl border bg-transparent px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                  required
                />
              </div>

              <div className="space-y-1.5 md:col-span-1">
                <label className="text-sm font-medium">Duration (minutes)</label>
                <input 
                  type="number" 
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  min={1}
                  className="w-full rounded-xl border bg-transparent px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                  required
                />
              </div>
            </div>

            <div className="space-y-6 border-t pt-6">
              <div className="flex items-center justify-between">
                <h4 className="font-heading text-lg font-semibold">Questions</h4>
                <button 
                  type="button"
                  onClick={handleAddQuestion}
                  className="flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-[var(--color-surface-raised)]"
                >
                  <Plus className="h-4 w-4" /> Add Question
                </button>
              </div>
              
              <div className="space-y-6">
                {questions.map((q, qIndex) => (
                  <div key={qIndex} className="relative rounded-xl border bg-[var(--color-surface-raised)]/50 p-5">
                    <div className="absolute right-4 top-4">
                      {questions.length > 1 && (
                        <button 
                          type="button"
                          onClick={() => handleRemoveQuestion(qIndex)}
                          className="text-[var(--color-on-surface-muted)] hover:text-[var(--color-danger)]"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    
                    <div className="mb-4 space-y-1.5 pr-8">
                      <label className="text-sm font-medium">Question {qIndex + 1}</label>
                      <input 
                        type="text" 
                        value={q.text}
                        onChange={(e) => handleQuestionChange(qIndex, "text", e.target.value)}
                        placeholder="Enter the question text"
                        className="w-full rounded-xl border bg-transparent px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                        required
                      />
                    </div>
                    
                    <div className="grid gap-3 md:grid-cols-2">
                      {q.options.map((opt, oIndex) => (
                        <div key={oIndex} className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleQuestionChange(qIndex, "correctIndex", oIndex)}
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${q.correctIndex === oIndex ? 'border-[var(--color-success)] text-[var(--color-success)] bg-[var(--color-success)]/10' : 'border-gray-300 text-transparent'}`}
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </button>
                          <input 
                            type="text" 
                            value={opt}
                            onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                            placeholder={`Option ${oIndex + 1}`}
                            className={`w-full rounded-xl border bg-transparent px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] ${q.correctIndex === oIndex ? 'border-[var(--color-success)]/50 bg-[var(--color-success)]/5' : ''}`}
                            required
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end border-t pt-6">
              <button 
                type="submit" 
                className="rounded-xl bg-[var(--color-primary)] px-6 py-2.5 font-medium text-white transition-colors hover:bg-[var(--color-primary)]/90"
              >
                Save Assessment
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {assessments.length === 0 ? (
            <div className="col-span-full rounded-2xl border bg-[var(--color-surface-card)] p-8">
              <EmptyState 
                icon={<ClipboardList className="h-16 w-16" />}
                title="No assessments yet"
                description="Create quizzes and assignments for your students to test their knowledge."
              />
            </div>
          ) : (
            assessments.map(assessment => {
              const course = courses.find(c => c.id === assessment.courseId);
              return (
                <div key={assessment.id} className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-[var(--color-surface-card)] p-5 shadow-sm transition-all hover:shadow-md">
                  <div className="mb-4">
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                        <ClipboardList className="h-5 w-5" />
                      </div>
                      <span className="rounded-full bg-[var(--color-surface-raised)] px-2.5 py-1 text-xs font-medium">
                        {assessment.duration} mins
                      </span>
                    </div>
                    <h4 className="mb-1 font-heading text-lg font-bold line-clamp-1">{assessment.title}</h4>
                    <p className="text-sm font-medium text-[var(--color-primary)] line-clamp-1">{course?.title}</p>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between border-t pt-4 text-sm text-[var(--color-on-surface-muted)]">
                    <span>{assessment.questions.length} Questions</span>
                    <span>{new Date(assessment.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
