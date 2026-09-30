# Business Rules & Assumptions

This document lists the core assumptions and business logic rules that drive the implementation of Capacity Connect. Any deviation from these rules would require architectural or logic updates.

## 1. Assessments & Attempts
- **One Attempt by Default:** Unless specifically reset by an administrator, a learner is permitted only **one attempt** per assessment.
- **Pass Mark:** The default passing threshold for any assessment is **50%**. This can be adjusted at the assessment level by admins, but defaults to 50% upon creation.
- **Immediate Feedback:** Assessment scores are calculated immediately upon submission.

## 2. Questionnaires vs. Assessments
- **Assessments** are tied to specific learning modules. They test knowledge retention and contribute to module completion.
- **Questionnaires** are global, deadline-based data-gathering tools. They are not tied to a specific module.
- Questionnaires do not have "correct" answers or a "passing score". They simply track completion status before the deadline.

## 3. Progress Tracking
- **Overall Progress Calculation:** A user's overall progress is a combined metric.
- **Formula:** `Progress = (Resources Viewed + Assessments Passed) / (Total Resources + Total Assessments)`
- Viewing a resource is self-reported (clicking "Mark as Read" or watching a video to the end triggers the completion event).
- Passing an assessment automatically marks it as complete. Failing an assessment means that part of the progress is incomplete until a retake is granted and passed.

## 4. Roles & Access
- **Learner:** Can view published curriculum, take assessments, and submit questionnaires. Cannot view other users' data.
- **Admin:** Has full CRUD access to curriculum, assessments, and questionnaires. Can view reports on all users' progress and scores.
- **Manager (Optional):** Can view reports for their direct reports but cannot edit curriculum content. (To be implemented in v2).

## 5. Content Availability
- Modules and assessments have an `is_published` flag. Draft content is completely hidden from the Learner role.
- Modules must be completed sequentially if `order_index` enforcement is toggled on (assumed OFF by default for flexible learning, but the data model supports sequential locking).
