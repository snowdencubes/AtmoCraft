import { coursesRepo, enrollmentsRepo } from '@/lib/db/repos';
import { Course, Enrollment } from '@/lib/types';
import { useAuthStore } from '@/store/auth-store';

const DELAY = 500;
const delay = (ms: number = DELAY) => new Promise(r => setTimeout(r, ms));

export const courseService = {
  async getCourses(): Promise<Course[]> {
    await delay();
    return await coursesRepo.findAll();
  },

  async getCourseById(id: string): Promise<Course | undefined> {
    await delay();
    return await coursesRepo.findById(id);
  },

  async getEnrolledCourses(userId: string): Promise<(Course & { progress: number })[]> {
    await delay();
    const enrollments = await enrollmentsRepo.findAll();
    const userEnrollments = enrollments.filter(e => e.userId === userId);
    
    const courses = await coursesRepo.findAll();
    
    return userEnrollments.map(enrollment => {
      const course = courses.find(c => c.id === enrollment.courseId)!;
      return {
        ...course,
        progress: enrollment.progress
      };
    }).filter(c => !!c.id);
  },

  async getEnrollment(userId: string, courseId: string): Promise<Enrollment | undefined> {
    await delay(200);
    const enrollments = await enrollmentsRepo.findAll();
    return enrollments.find(e => e.userId === userId && e.courseId === courseId);
  },

  async enroll(userId: string, courseId: string): Promise<boolean> {
    await delay();
    const authUser = useAuthStore.getState().currentUser;
    if (authUser?.role !== 'trainee') {
      throw new Error('Only trainees can enroll in courses');
    }
    if (authUser.id !== userId) {
      throw new Error('Unauthorized');
    }

    const existing = await this.getEnrollment(userId, courseId);
    if (existing) {
      return false; // Already enrolled
    }

    await enrollmentsRepo.create({
      courseId,
      userId,
      progress: 0,
      enrolledAt: new Date().toISOString()
    } as Enrollment);
    
    // Update course enrolled count
    const course = await coursesRepo.findById(courseId);
    if (course) {
      await coursesRepo.update(courseId, { enrolled: (course.enrolled || 0) + 1 });
    }

    return true;
  },

  async unenroll(userId: string, courseId: string): Promise<boolean> {
    await delay();
    const authUser = useAuthStore.getState().currentUser;
    if (authUser?.role !== 'trainee') {
      throw new Error('Only trainees can unenroll from courses');
    }
    if (authUser.id !== userId) {
      throw new Error('Unauthorized');
    }

    const existing = await this.getEnrollment(userId, courseId);
    if (!existing) {
      return false;
    }

    await enrollmentsRepo.delete(existing.id);

    // Update course enrolled count
    const course = await coursesRepo.findById(courseId);
    if (course && course.enrolled > 0) {
      await coursesRepo.update(courseId, { enrolled: course.enrolled - 1 });
    }

    return true;
  }
};
