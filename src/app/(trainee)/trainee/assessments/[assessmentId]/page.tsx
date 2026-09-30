"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { assessmentService } from "@/lib/services/assessmentService";
import { Assessment, Attempt, CertificationRecord, Question } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, Award, ArrowLeft, ArrowRight, Download, Check } from "lucide-react";

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
    <div className="mx-auto max-w-2xl py-8">
      <Card className="text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            {passed ? (
              <CheckCircle2 className="h-10 w-10 text-green-500" />
            ) : (
              <XCircle className="h-10 w-10 text-destructive" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {passed ? "Congratulations!" : "Assessment Completed"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <p className="text-lg text-muted-foreground">Your Score</p>
            <p className={`text-4xl font-bold ${passed ? "text-green-500" : "text-destructive"}`}>
              {percentage}%
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              You scored {attempt.score} out of {attempt.total} points.
              {passed ? " You have successfully passed this assessment." : " You did not meet the passing criteria of 50%."}
            </p>
          </div>

          {passed && certificate && (
            <div className="rounded-xl border bg-primary/5 p-6">
              <Award className="mx-auto mb-2 h-12 w-12 text-primary" />
              <h3 className="mb-2 font-semibold">Certificate Earned</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                You have earned a certificate for completing {certificate.courseName}.
              </p>
              <Button variant="default" className="w-full sm:w-auto" onClick={() => alert("Downloading certificate...")}>
                <Download className="mr-2 h-4 w-4" /> Download Certificate
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Button variant="outline" onClick={onReturn}>
            Return to Assessments
          </Button>
          <Button onClick={onDashboard}>
            Go to Dashboard
          </Button>
        </CardFooter>
      </Card>
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
      <div className="p-8 text-center text-muted-foreground">
        Assessment not found.
        <div className="mt-4">
          <Button onClick={() => router.push("/trainee/assessments")} variant="outline">
            Go Back
          </Button>
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
    <div className="flex flex-col gap-6">
      <PageHeader 
        title={assessment.title} 
        subtitle={assessment.subject}
        breadcrumbs={[
          { label: "Dashboard", href: "/trainee/dashboard" }, 
          { label: "Assessments", href: "/trainee/assessments" },
          { label: assessment.title }
        ]}
      />

      <div className="grid gap-6 md:grid-cols-[1fr_300px]">
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Question {currentQuestionIndex + 1} of {assessment.questions.length}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-6 text-lg">{currentQuestion.text}</p>
              <div className="flex flex-col gap-3">
                {currentQuestion.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleOptionSelect(idx)}
                    className={`flex items-center rounded-lg border p-4 text-left transition-colors ${
                      answers[currentQuestionIndex] === idx
                        ? "border-primary bg-primary/5 text-primary"
                        : "hover:bg-muted"
                    }`}
                  >
                    <div className={`mr-4 flex h-6 w-6 items-center justify-center rounded-full border ${
                      answers[currentQuestionIndex] === idx ? "border-primary bg-primary" : "border-muted-foreground"
                    }`}>
                      {answers[currentQuestionIndex] === idx && <Check className="h-4 w-4 text-primary-foreground" />}
                    </div>
                    {option}
                  </button>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t p-6">
              <Button 
                variant="outline" 
                onClick={handlePrev} 
                disabled={currentQuestionIndex === 0}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              
              {isLastQuestion ? (
                <Button 
                  onClick={handleFinish}
                  disabled={submitting || answers.includes(-1)}
                >
                  {submitting ? "Submitting..." : "Finish Assessment"}
                </Button>
              ) : (
                <Button onClick={handleNext}>
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Question Navigator</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-2">
                {assessment.questions.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`flex h-10 w-10 items-center justify-center rounded-md border text-sm font-medium transition-colors ${
                      currentQuestionIndex === idx
                        ? "border-primary bg-primary/10 text-primary"
                        : answers[idx] !== -1
                        ? "border-primary/50 bg-primary/5"
                        : "hover:bg-muted"
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
              <div className="mt-6 flex flex-col gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-sm border border-primary/50 bg-primary/5"></div>
                  <span>Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-sm border"></div>
                  <span>Unanswered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-sm border border-primary bg-primary/10"></div>
                  <span>Current</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
