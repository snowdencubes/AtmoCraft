-- Capacity Connect - Initial Schema Migration

-- This schema matches the types defined in src/lib/types.ts to ensure
-- a 1-to-1 mapping when using Supabase data fetching.

-- Users
CREATE TABLE users (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" TEXT NOT NULL,
  "email" TEXT UNIQUE NOT NULL,
  "role" TEXT NOT NULL, 
  "avatar" TEXT NOT NULL,
  "department" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Profiles
CREATE TABLE profiles (
  "userId" UUID PRIMARY KEY REFERENCES users("id") ON DELETE CASCADE,
  "qualifications" JSONB NOT NULL DEFAULT '[]',
  "workExperience" JSONB NOT NULL DEFAULT '[]',
  "interests" JSONB NOT NULL DEFAULT '[]',
  "skills" JSONB NOT NULL DEFAULT '[]',
  "certificates" JSONB NOT NULL DEFAULT '[]',
  "completionPercent" INTEGER NOT NULL DEFAULT 0
);

-- Courses
CREATE TABLE courses (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "subject" TEXT NOT NULL,
  "level" TEXT NOT NULL,
  "trainerId" UUID NOT NULL REFERENCES users("id") ON DELETE CASCADE,
  "trainerName" TEXT NOT NULL,
  "duration" TEXT NOT NULL,
  "enrolled" INTEGER NOT NULL DEFAULT 0,
  "rating" FLOAT NOT NULL DEFAULT 0,
  "syllabus" JSONB NOT NULL DEFAULT '[]',
  "imageUrl" TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enrollments
CREATE TABLE enrollments (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "courseId" UUID NOT NULL REFERENCES courses("id") ON DELETE CASCADE,
  "userId" UUID NOT NULL REFERENCES users("id") ON DELETE CASCADE,
  "progress" INTEGER NOT NULL DEFAULT 0,
  "viewedResources" JSONB DEFAULT '[]',
  "enrolledAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "completedAt" TIMESTAMPTZ
);

-- Resources
CREATE TABLE resources (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "courseId" UUID NOT NULL REFERENCES courses("id") ON DELETE CASCADE,
  "title" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "size" TEXT NOT NULL,
  "uploadedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "description" TEXT NOT NULL
);

-- Assessments
CREATE TABLE assessments (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "title" TEXT NOT NULL,
  "subject" TEXT NOT NULL,
  "courseId" UUID NOT NULL REFERENCES courses("id") ON DELETE CASCADE,
  "questions" JSONB NOT NULL DEFAULT '[]',
  "duration" INTEGER NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Questions (Standalone bank or reusable)
CREATE TABLE questions (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "text" TEXT NOT NULL,
  "options" JSONB NOT NULL DEFAULT '[]',
  "correctIndex" INTEGER NOT NULL,
  "explanation" TEXT
);

-- Attempts
CREATE TABLE attempts (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "assessmentId" UUID NOT NULL REFERENCES assessments("id") ON DELETE CASCADE,
  "userId" UUID NOT NULL REFERENCES users("id") ON DELETE CASCADE,
  "answers" JSONB NOT NULL DEFAULT '[]',
  "markedForReview" JSONB NOT NULL DEFAULT '[]',
  "score" INTEGER NOT NULL,
  "total" INTEGER NOT NULL,
  "startedAt" TIMESTAMPTZ NOT NULL,
  "submittedAt" TIMESTAMPTZ NOT NULL
);

-- Questionnaires
CREATE TABLE questionnaires (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "title" TEXT NOT NULL,
  "subject" TEXT NOT NULL,
  "trainerId" UUID NOT NULL REFERENCES users("id") ON DELETE CASCADE,
  "questions" JSONB NOT NULL DEFAULT '[]',
  "deadline" TIMESTAMPTZ NOT NULL,
  "status" TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Questionnaire Responses
CREATE TABLE questionnaire_responses (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "questionnaireId" UUID NOT NULL REFERENCES questionnaires("id") ON DELETE CASCADE,
  "userId" UUID NOT NULL REFERENCES users("id") ON DELETE CASCADE,
  "answers" JSONB NOT NULL DEFAULT '{}',
  "submittedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Feedback
CREATE TABLE feedback (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "courseId" UUID NOT NULL REFERENCES courses("id") ON DELETE CASCADE,
  "userId" UUID NOT NULL REFERENCES users("id") ON DELETE CASCADE,
  "userName" TEXT NOT NULL,
  "rating" INTEGER NOT NULL,
  "comment" TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Announcements
CREATE TABLE announcements (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "title" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "pinned" BOOLEAN NOT NULL DEFAULT false,
  "published" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Competencies
CREATE TABLE competencies (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" TEXT NOT NULL,
  "category" TEXT NOT NULL
);

-- Trainer Competencies
CREATE TABLE trainer_competencies (
  "trainerId" UUID NOT NULL REFERENCES users("id") ON DELETE CASCADE,
  "trainerName" TEXT NOT NULL,
  "competencyId" UUID NOT NULL REFERENCES competencies("id") ON DELETE CASCADE,
  "competencyName" TEXT NOT NULL,
  "proficiency" TEXT NOT NULL,
  PRIMARY KEY ("trainerId", "competencyId")
);

-- Certification Records
CREATE TABLE certification_records (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL REFERENCES users("id") ON DELETE CASCADE,
  "userName" TEXT NOT NULL,
  "courseId" UUID NOT NULL REFERENCES courses("id") ON DELETE CASCADE,
  "courseName" TEXT NOT NULL,
  "issuedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Notifications
CREATE TABLE notifications (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "title" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "read" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);
