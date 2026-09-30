# Services Documentation

This document describes the core service layer of the AtmoCraft application, including inputs, outputs, and the database tables they interact with. These services encapsulate the business logic and coordinate data fetching/mutating via the Supabase client.

## `UserService`
Manages user profiles and permissions.

### `getCurrentUser()`
- **Inputs:** None (uses session token).
- **Outputs:** `User` object or `null`.
- **Tables Touched:** `users`.

### `getUserProfile(userId: string)`
- **Inputs:** `userId` (UUID).
- **Outputs:** `User` object.
- **Tables Touched:** `users`.

### `updateUserProfile(userId: string, data: Partial<User>)`
- **Inputs:** `userId` (UUID), `data` (first_name, last_name, etc.).
- **Outputs:** Updated `User` object.
- **Tables Touched:** `users`.

---

## `CourseService`
Handles the retrieval and management of the curriculum (modules and resources).

### `getModules()`
- **Inputs:** None.
- **Outputs:** Array of `Module` objects, ordered by `order_index`.
- **Tables Touched:** `modules`.

### `getModuleDetails(moduleId: string)`
- **Inputs:** `moduleId` (UUID).
- **Outputs:** `Module` object including its associated `resources` and `assessments`.
- **Tables Touched:** `modules`, `resources`, `assessments`.

---

## `AssessmentService`
Manages quizzes, scoring, and attempts.

### `getAssessment(assessmentId: string)`
- **Inputs:** `assessmentId` (UUID).
- **Outputs:** `Assessment` object with its `questions` (excluding `correct_option` for learners).
- **Tables Touched:** `assessments`, `questions`.

### `startAttempt(assessmentId: string, userId: string)`
- **Inputs:** `assessmentId` (UUID), `userId` (UUID).
- **Outputs:** `Attempt` object (status: in-progress).
- **Tables Touched:** `attempts` (Insert).

### `submitAttempt(attemptId: string, answers: Record<string, string>)`
- **Inputs:** `attemptId` (UUID), `answers` (Map of question ID to selected option).
- **Outputs:** `Attempt` object updated with final `score` and `passed` boolean.
- **Tables Touched:** `attempts` (Update), `questions` (Read for validation).

---

## `ProgressService`
Tracks learner engagement and completion status.

### `markResourceComplete(resourceId: string, userId: string)`
- **Inputs:** `resourceId` (UUID), `userId` (UUID).
- **Outputs:** `Progress` object.
- **Tables Touched:** `progress` (Insert).

### `getUserProgress(userId: string)`
- **Inputs:** `userId` (UUID).
- **Outputs:** Object containing overall completion percentage, list of completed resource IDs, and passed assessment IDs.
- **Tables Touched:** `progress`, `attempts`, `modules`, `resources`.

---

## `QuestionnaireService`
Handles deadline-based organizational surveys.

### `getActiveQuestionnaires()`
- **Inputs:** None.
- **Outputs:** Array of `Questionnaire` objects where `deadline` > `now()`.
- **Tables Touched:** `questionnaires`.

### `submitQuestionnaireResponse(questionnaireId: string, userId: string, answers: any)`
- **Inputs:** `questionnaireId` (UUID), `userId` (UUID), `answers` (JSON).
- **Outputs:** `QuestionnaireResponse` object.
- **Tables Touched:** `questionnaire_responses` (Insert).
