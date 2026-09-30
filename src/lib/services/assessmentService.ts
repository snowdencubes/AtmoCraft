import { Assessment, Attempt, CertificationRecord, Question } from '@/lib/types';
import { assessmentsRepo, attemptsRepo, certificationRecordsRepo, coursesRepo } from '@/lib/db/repos';
import { useAuthStore } from '@/store/auth-store';

export const assessmentService = {
  async getAvailableAssessments(): Promise<Assessment[]> {
    const authUser = useAuthStore.getState().currentUser;
    if (!authUser) throw new Error('Not authenticated');

    const allAssessments = await assessmentsRepo.findAll();
    // In a real app we might filter by enrolled courses. For now, returning all or mock filtering.
    // Assuming enrollments are handled or we just return all for demo
    return allAssessments;
  },

  async getAssessment(id: string): Promise<Assessment | undefined> {
    return await assessmentsRepo.findById(id);
  },

  async submitAttempt(
    assessmentId: string,
    answers: number[],
    markedForReview: boolean[],
    durationSeconds: number
  ): Promise<{ attempt: Attempt; passed: boolean; certificate?: CertificationRecord }> {
    const authUser = useAuthStore.getState().currentUser;
    if (!authUser) throw new Error('Not authenticated');

    const assessment = await assessmentsRepo.findById(assessmentId);
    if (!assessment) throw new Error('Assessment not found');

    let score = 0;
    assessment.questions.forEach((q, idx) => {
      if (answers[idx] === q.correctIndex) {
        score++;
      }
    });

    const attempt: Attempt = {
      id: crypto.randomUUID(),
      assessmentId,
      userId: authUser.id,
      answers,
      markedForReview,
      score,
      total: assessment.questions.length,
      startedAt: new Date(Date.now() - durationSeconds * 1000).toISOString(),
      submittedAt: new Date().toISOString(),
    };

    await attemptsRepo.create(attempt);

    const percent = (score / assessment.questions.length) * 100;
    const passed = percent > 50;
    let certificate: CertificationRecord | undefined;

    if (passed) {
      const course = await coursesRepo.findById(assessment.courseId);
      
      certificate = {
        id: crypto.randomUUID(),
        userId: authUser.id,
        userName: authUser.name,
        courseId: assessment.courseId,
        courseName: course?.title || assessment.subject || 'Capacity Connect Course',
        issuedAt: new Date().toISOString(),
      };
      await certificationRecordsRepo.create(certificate);
    }

    return { attempt, passed, certificate };
  }
};
