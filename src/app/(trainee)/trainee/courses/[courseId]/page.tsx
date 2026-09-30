"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Clock, Users, Star, BookOpen, User, CheckCircle, List } from "lucide-react";
import { Course } from "@/lib/types";
import { courseService } from "@/lib/services/courseService";
import { useAuthStore } from "@/store/auth-store";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/shared/toast";
import { getFeedback, saveFeedback } from "@/lib/services";
import Link from "next/link";
import { MessageSquare } from "lucide-react";

export default function CourseDetailsPage({ params }: { params: { courseId: string } }) {
  const router = useRouter();
  const { currentUser } = useAuthStore();
  const { addToast } = useToast();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  // Feedback State
  const [feedbackText, setFeedbackText] = useState("");
  const [rating, setRating] = useState(5);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [hasSubmittedFeedback, setHasSubmittedFeedback] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await courseService.getCourseById(params.courseId);
        if (data) {
          setCourse(data);
          
          if (currentUser && currentUser.role === 'trainee') {
            const enrollment = await courseService.getEnrollment(currentUser.id, params.courseId);
            setIsEnrolled(!!enrollment);
            
            // Load existing feedback
            const existingFeedback = await getFeedback(params.courseId);
            const userFeedback = existingFeedback.find(f => f.userId === currentUser.id);
            if (userFeedback) {
              setFeedbackText(userFeedback.comment);
              setRating(userFeedback.rating);
              setHasSubmittedFeedback(true);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load course details:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.courseId, currentUser]);

  const handleEnrollment = async () => {
    if (!currentUser || currentUser.role !== 'trainee') return;
    
    setEnrolling(true);
    try {
      if (isEnrolled) {
        await courseService.unenroll(currentUser.id, params.courseId);
        setIsEnrolled(false);
        addToast({ title: "Unenrolled", description: `You have successfully unenrolled from ${course?.title}`, type: "success" });
        if (course) setCourse({ ...course, enrolled: Math.max(0, course.enrolled - 1) });
      } else {
        await courseService.enroll(currentUser.id, params.courseId);
        setIsEnrolled(true);
        addToast({ title: "Enrolled", description: `You have successfully enrolled in ${course?.title}`, type: "success" });
        if (course) setCourse({ ...course, enrolled: course.enrolled + 1 });
      }
    } catch (err: any) {
      addToast({ title: "Error", description: err.message || "Failed to update enrollment.", type: "error" });
    } finally {
      setEnrolling(false);
    }
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setSubmittingFeedback(true);
    try {
      await saveFeedback({
        courseId: params.courseId,
        userId: currentUser.id,
        rating,
        comment: feedbackText
      });
      setHasSubmittedFeedback(true);
      addToast({ title: "Feedback Saved", description: "Thank you for your feedback!", type: "success" });
    } catch (err) {
      addToast({ title: "Error", description: "Could not save feedback", type: "error" });
    } finally {
      setSubmittingFeedback(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="h-24 w-full bg-[var(--color-surface-card)] animate-pulse rounded-lg"></div>
        <div className="h-64 w-full bg-[var(--color-surface-card)] animate-pulse rounded-lg"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col gap-6 py-12 text-center text-[var(--color-on-surface-muted)]">
        <h2>Course not found.</h2>
        <button onClick={() => router.back()} className="text-[var(--color-primary)] hover:underline mt-4">Go Back</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      <PageHeader 
        title={course.title} 
        subtitle={course.subject}
        breadcrumbs={[
          { label: "Dashboard", href: "/trainee/dashboard" }, 
          { label: "Courses", href: "/trainee/courses" },
          { label: course.title }
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="rounded-xl border bg-[var(--color-surface-card)] p-6 shadow-sm">
            <h3 className="font-heading text-lg font-bold mb-4 text-[var(--color-on-surface)] flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-[var(--color-primary)]" />
              About This Course
            </h3>
            <p className="text-[var(--color-on-surface-muted)] leading-relaxed">
              {course.description}
            </p>
          </div>

          <div className="rounded-xl border bg-[var(--color-surface-card)] p-6 shadow-sm">
            <h3 className="font-heading text-lg font-bold mb-4 text-[var(--color-on-surface)] flex items-center gap-2">
              <List className="h-5 w-5 text-[var(--color-primary)]" />
              Syllabus
            </h3>
            {course.syllabus && course.syllabus.length > 0 ? (
              <ul className="space-y-3 text-[var(--color-on-surface-muted)]">
                {course.syllabus.map((item: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-[var(--color-primary)] shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-[var(--color-on-surface-muted)] italic">Syllabus not available.</p>
            )}
          </div>

          {isEnrolled && (
            <div className="rounded-xl border bg-[var(--color-surface-card)] p-6 shadow-sm">
              <h3 className="font-heading text-lg font-bold mb-4 text-[var(--color-on-surface)] flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-[var(--color-primary)]" />
                Course Feedback
              </h3>
              <form onSubmit={handleFeedbackSubmit} className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Rating:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={cn("focus-ring rounded", rating >= star ? "text-yellow-500" : "text-gray-300")}
                      >
                        <Star className="h-6 w-6 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  className="w-full rounded-lg border bg-[var(--color-surface)] p-3 outline-none focus-ring text-sm resize-none"
                  rows={4}
                  placeholder="Share your thoughts about this course..."
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  disabled={submittingFeedback}
                  className="self-end rounded-lg bg-[var(--color-primary)] px-6 py-2 text-sm font-bold text-white transition-colors hover:bg-[var(--color-primary-dark)] focus-ring disabled:opacity-50"
                >
                  {submittingFeedback ? "Saving..." : hasSubmittedFeedback ? "Update Feedback" : "Submit Feedback"}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-6">
          <div className="rounded-xl border bg-[var(--color-surface-card)] p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-4 border-b border-[var(--color-outline)] pb-4">
              <div className="h-12 w-12 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center shrink-0">
                <User className="h-6 w-6 text-[var(--color-primary)]" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-on-surface-muted)]">Trainer</p>
                <p className="font-bold text-[var(--color-on-surface)]">{course.trainerName}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 py-2">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-[var(--color-on-surface-muted)] flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> Duration
                </span>
                <span className="text-sm font-semibold">{course.duration}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-[var(--color-on-surface-muted)] flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" /> Enrolled
                </span>
                <span className="text-sm font-semibold">{course.enrolled}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-[var(--color-on-surface-muted)] flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 text-yellow-500" /> Rating
                </span>
                <span className="text-sm font-semibold">{course.rating} / 5.0</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-[var(--color-on-surface-muted)] flex items-center gap-1">
                  <BookOpen className="h-3.5 w-3.5" /> Level
                </span>
                <span className="text-sm font-semibold capitalize">{course.level}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[var(--color-outline)]">
              {currentUser?.role === 'trainee' ? (
                <div className="flex flex-col gap-3 mt-2">
                  {isEnrolled && (
                    <Link 
                      href={`/trainee/courses/${course.id}/resources`}
                      className="flex items-center justify-center gap-2 w-full rounded-lg py-3 text-sm font-bold bg-[var(--color-secondary)] text-white hover:opacity-90 transition-colors focus-ring"
                    >
                      <BookOpen className="h-4 w-4" /> Open Resources
                    </Link>
                  )}
                  <button 
                    onClick={handleEnrollment}
                    disabled={enrolling}
                    className={cn(
                      "w-full rounded-lg py-3 text-sm font-bold transition-colors focus-ring",
                      isEnrolled 
                        ? "bg-[var(--color-error)]/10 text-[var(--color-error)] hover:bg-[var(--color-error)]/20"
                        : "bg-[var(--color-primary)] text-white hover:opacity-90",
                      enrolling && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {enrolling ? "Processing..." : isEnrolled ? "Unenroll" : "Enroll Now"}
                  </button>
                </div>
              ) : (
                <div className="bg-[var(--color-surface-raised)] p-3 rounded text-sm text-center text-[var(--color-on-surface-muted)]">
                  Only trainees can enroll.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
