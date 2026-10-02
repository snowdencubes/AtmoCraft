"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { assessmentService } from "@/lib/services/assessmentService";
import { Assessment, Attempt, CertificationRecord, Question } from "@/lib/types";
import { CheckCircle2, XCircle, Award, ArrowLeft, ArrowRight, Download, Check } from "lucide-react";
import { cn } from "@/lib/utils";

function ResultView({
  result,
  onReturn,
  onDashboard
}: {
  result: { attempt: Attempt; passed: boolean; certificate?: CertificationRecord };
  onReturn: () => void;
  onDashboard: () => void;
}) {
  const { attempt, passed, certificate } = result;
  const percentage = Math.round((attempt.score / attempt.total) * 100);

  return (
    <div className="mx-auto max-w-2xl py-12">
      <div className="rounded-3xl border border-[var(--outline)] bg-[var(--surface-card)] shadow-xl overflow-hidden text-center relative group hover:border-[var(--primary)]/30 transition-all duration-300">
        <div className={cn("absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/2 rounded-full blur-3xl opacity-20", passed ? "bg-[var(--success)]" : "bg-[var(--danger)]")} />
        
        <div className="p-8 border-b border-[var(--outline)]/50 bg-[var(--surface-raised)]/30 relative z-10">
          <div className={cn(
            "mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border-4 shadow-lg",
            passed ? "bg-[var(--success)]/10 border-[var(--success)]/30 text-[var(--success)]" : "bg-[var(--danger)]/10 border-[var(--danger)]/30 text-[var(--danger)]"
          )}>
            {passed ? (
              <CheckCircle2 className="h-12 w-12" />
            ) : (
              <XCircle className="h-12 w-12" />
            )}
          </div>
          <h3 className="font-heading text-3xl font-extrabold text-[var(--on-surface)] tracking-tight">
            {passed ? "Congratulations!" : "Assessment Completed"}
          </h3>
        </div>
        
        <div className="p-10 space-y-8 relative z-10">
          <div>
            <p className="text-lg font-bold text-[var(--on-surface-muted)] uppercase tracking-widest mb-2">Your Score</p>
            <p className={cn(
              "text-6xl font-extrabold drop-shadow-sm",
              passed ? "text-[var(--success)]" : "text-[var(--danger)]"
            )}>
              {percentage}%
            </p>
            <p className="mt-4 text-base font-medium text-[var(--on-surface-muted)] max-w-md mx-auto">
              You scored <strong className="text-[var(--on-surface)]">{attempt.score}</strong> out of <strong className="text-[var(--on-surface)]">{attempt.total}</strong> points.
              {passed ? " You have successfully passed this assessment." : " You did not meet the passing criteria of 50%."}
            </p>
          </div>

          {passed && certificate && (
            <div className="rounded-2xl border border-[var(--primary)]/30 bg-[var(--primary)]/5 p-8 relative overflow-hidden group-hover:border-[var(--primary)]/50 transition-colors">
              <Award className="mx-auto mb-3 h-16 w-16 text-[var(--primary)]" />
              <h3 className="mb-2 font-heading text-xl font-bold text-[var(--on-surface)]">Certificate Earned</h3>
              <p className="mb-6 text-sm font-medium text-[var(--on-surface-muted)]">
                You have earned a certificate for completing {certificate.courseName}.
              </p>
              <button 
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-6 py-3 font-bold text-white shadow-lg shadow-[var(--primary)]/20 transition-all hover:bg-[var(--primary-dark)] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--primary)]/30"
                onClick={() => alert("Downloading certificate...")}
              >
                <Download className="h-5 w-5" /> Download Certificate
              </button>
            </div>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 p-8 border-t border-[var(--outline)]/50 bg-[var(--surface-raised)]/30 relative z-10">
          <button 
            className="rounded-xl border-2 border-[var(--outline)] bg-transparent px-6 py-3 font-bold text-[var(--on-surface)] transition-all hover:border-[var(--primary)]/50 hover:bg-[var(--surface-raised)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
            onClick={onReturn}
          >
            Return to Assessments
          </button>
          <button 
            className="rounded-xl bg-[var(--surface-raised)] border-2 border-transparent px-6 py-3 font-bold text-[var(--on-surface)] transition-all hover:border-[var(--primary)]/50 hover:bg-[var(--primary)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
            onClick={onDashboard}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AssessmentPage() {
  const params = useParams();
  const router = useRouter();
  const assessmentId = params.assessmentId as string;

  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [markedForReview, setMarkedForReview] = useState<boolean[]>([]);
  
  const [result, setResult] = useState<{ attempt: Attempt; passed: boolean; certificate?: CertificationRecord } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadAssessment() {
      try {
        const data = await assessmentService.getAssessment(assessmentId);
        if (data) {
          setAssessment(data);
          setAnswers(new Array(data.questions.length).fill(-1));
          setMarkedForReview(new Array(data.questions.length).fill(false));
        }
      } catch (error) {
        console.error("Failed to load assessment:", error);
      } finally {
        setLoading(false);
      }
    }
    loadAssessment();
  }, [assessmentId]);

  const handleOptionSelect = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (assessment && currentQuestionIndex < assessment.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleFinish = async () => {
    if (!assessment) return;
    setSubmitting(true);
    try {
      // Assuming duration taken is 5 mins (300 seconds) for demo
      const res = await assessmentService.submitAttempt(assessmentId, answers, markedForReview, 300);
      setResult(res);
    } catch (error) {
      console.error("Failed to submit assessment:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Loading assessment...</div>;
  }

  if (!assessment) {
    return (
      <div className="p-8 text-center text-[var(--on-surface-muted)]">
        Assessment not found.
        <div className="mt-4">
          <button 
            onClick={() => router.push("/trainee/assessments")} 
            className="rounded-xl border border-[var(--outline)] px-6 py-2.5 font-bold text-[var(--on-surface)] transition-all hover:bg-[var(--surface-raised)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <ResultView 
        result={result} 
        onReturn={() => router.push("/trainee/assessments")} 
        onDashboard={() => router.push("/trainee/dashboard")} 
      />
    );
  }

  const currentQuestion = assessment.questions[currentQuestionIndex];
  const isAnswered = answers[currentQuestionIndex] !== -1;
  const isLastQuestion = currentQuestionIndex === assessment.questions.length - 1;

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto">
      <PageHeader 
        title={assessment.title} 
        subtitle={`Subject: ${assessment.subject} • Pass Mark: 50%`}
        breadcrumbs={[
          { label: "Dashboard", href: "/trainee/dashboard" }, 
          { label: "Assessments", href: "/trainee/assessments" },
          { label: "In Progress" }
        ]}
      />

      <div className="grid gap-8 lg:grid-cols-[1fr_320px] items-start">
        {/* Main Question Area */}
        <div className="flex flex-col gap-6">
          <div className="rounded-3xl border border-[var(--outline)] bg-[var(--surface-card)] shadow-lg overflow-hidden relative">
            {/* Top progress indicator */}
            <div className="absolute top-0 left-0 h-1 bg-[var(--primary)] transition-all duration-300" style={{ width: `${((currentQuestionIndex + 1) / assessment.questions.length) * 100}%` }} />
            
            <div className="p-8 border-b border-[var(--outline)]/50 bg-[var(--surface-raised)]/30">
              <h3 className="font-heading text-lg font-bold text-[var(--primary)] tracking-wide uppercase">
                Question {currentQuestionIndex + 1} <span className="text-[var(--on-surface-muted)]">of {assessment.questions.length}</span>
              </h3>
            </div>
            
            <div className="p-8">
              <p className="mb-10 text-xl font-medium text-[var(--on-surface)] leading-relaxed">{currentQuestion.text}</p>
              
              <div className="flex flex-col gap-4">
                {currentQuestion.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleOptionSelect(idx)}
                    className={cn(
                      "group flex items-center rounded-2xl border-2 p-5 text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--primary)]/20",
                      answers[currentQuestionIndex] === idx
                        ? "border-[var(--primary)] bg-[var(--primary)]/5 shadow-md -translate-y-0.5"
                        : "border-[var(--outline)] hover:border-[var(--primary)]/50 hover:bg-[var(--surface-raised)] hover:-translate-y-0.5"
                    )}
                  >
                    <div className={cn(
                      "mr-5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                      answers[currentQuestionIndex] === idx 
                        ? "border-[var(--primary)] bg-[var(--primary)] text-white shadow-[0_0_10px_rgba(var(--primary-rgb),0.4)]" 
                        : "border-[var(--outline)] group-hover:border-[var(--primary)]/50"
                    )}>
                      {answers[currentQuestionIndex] === idx && <Check className="h-4 w-4" />}
                    </div>
                    <span className={cn(
                      "text-lg font-medium",
                      answers[currentQuestionIndex] === idx ? "text-[var(--primary-dark)] dark:text-[var(--primary-light)]" : "text-[var(--on-surface)]"
                    )}>
                      {option}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-between p-6 border-t border-[var(--outline)]/50 bg-[var(--surface-raised)]/30">
              <button 
                onClick={handlePrev} 
                disabled={currentQuestionIndex === 0}
                className="flex items-center gap-2 rounded-xl px-5 py-3 font-bold text-[var(--on-surface)] transition-all hover:bg-[var(--surface-raised)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] disabled:opacity-50 disabled:pointer-events-none"
              >
                <ArrowLeft className="h-5 w-5" /> Previous
              </button>
              
              {isLastQuestion ? (
                <button 
                  onClick={handleFinish}
                  disabled={submitting || answers.includes(-1)}
                  className="flex items-center gap-2 rounded-xl bg-[var(--success)] px-8 py-3 font-bold text-white shadow-lg shadow-[var(--success)]/20 transition-all hover:bg-[#15803d] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--success)]/30 disabled:opacity-50 disabled:pointer-events-none"
                >
                  {submitting ? "Submitting..." : (
                    <>Submit Assessment <CheckCircle2 className="h-5 w-5 ml-1" /></>
                  )}
                </button>
              ) : (
                <button 
                  onClick={handleNext}
                  className="flex items-center gap-2 rounded-xl bg-[var(--primary)] px-8 py-3 font-bold text-white shadow-lg shadow-[var(--primary)]/20 transition-all hover:bg-[var(--primary-dark)] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--primary)]/30"
                >
                  Next <ArrowRight className="h-5 w-5 ml-1" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar - Navigator */}
        <div className="flex flex-col gap-6 lg:sticky lg:top-24">
          <div className="rounded-3xl border border-[var(--outline)] bg-[var(--surface-card)] shadow-md overflow-hidden">
            <div className="p-5 border-b border-[var(--outline)]/50 bg-[var(--surface-raised)]/30">
              <h3 className="font-heading text-base font-bold text-[var(--on-surface)]">Question Navigator</h3>
            </div>
            
            <div className="p-5">
              <div className="grid grid-cols-5 gap-3">
                {assessment.questions.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-xl border-2 text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]",
                      currentQuestionIndex === idx
                        ? "border-[var(--primary)] bg-[var(--primary)] text-white shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)] scale-110 z-10"
                        : answers[idx] !== -1
                        ? "border-[var(--success)]/50 bg-[var(--success)]/10 text-[var(--success)] hover:bg-[var(--success)]/20"
                        : "border-[var(--outline)] bg-[var(--surface-raised)] text-[var(--on-surface-muted)] hover:border-[var(--primary)]/30"
                    )}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
              
              <div className="mt-8 flex flex-col gap-3 rounded-2xl bg-[var(--surface-raised)]/50 p-4 border border-[var(--outline)]/50">
                <div className="flex items-center gap-3 text-sm font-medium text-[var(--on-surface)]">
                  <div className="h-4 w-4 rounded-full border-2 border-[var(--success)]/50 bg-[var(--success)]/10"></div>
                  <span>Answered</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-medium text-[var(--on-surface)]">
                  <div className="h-4 w-4 rounded-full border-2 border-[var(--outline)] bg-[var(--surface-raised)]"></div>
                  <span>Unanswered</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-medium text-[var(--on-surface)]">
                  <div className="h-4 w-4 rounded-full border-2 border-[var(--primary)] bg-[var(--primary)] shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]"></div>
                  <span>Current</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
