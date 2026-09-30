# Data Model

This document outlines the database schema for AtmoCraft. It details the tables, their columns, data types, relationships, and Row Level Security (RLS) rules.

## Core Tables

### `users`
Stores user profile information and role assignments.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | Primary Key, Default: `uuid_generate_v4()` | Unique identifier for the user. Matches Supabase Auth UID. |
| `email` | `text` | Unique, Not Null | User's email address. |
| `first_name` | `text` | Not Null | User's first name. |
| `last_name` | `text` | Not Null | User's last name. |
| `role` | `enum` | Not Null, Default: `'learner'` | User role (`'admin'`, `'manager'`, `'learner'`). |
| `created_at` | `timestamptz` | Not Null, Default: `now()` | Timestamp of creation. |

**Relationships:** None.
**RLS Rules:**
- Read: Users can read their own profile. Admins and managers can read all profiles.
- Write: Users can update their own profile (except role). Admins can update any profile.

### `modules`
Represents a learning module or course section.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | Primary Key, Default: `uuid_generate_v4()` | Unique identifier for the module. |
| `title` | `text` | Not Null | Title of the module. |
| `description` | `text` | | Detailed description of module contents. |
| `order_index` | `integer` | Not Null | Order of the module in the overall curriculum. |
| `is_published` | `boolean` | Not Null, Default: `false` | Whether the module is visible to learners. |
| `created_at` | `timestamptz` | Not Null, Default: `now()` | Timestamp of creation. |

**Relationships:** None.
**RLS Rules:**
- Read: All authenticated users can read published modules. Admins can read all modules.
- Write: Admins can create, update, and delete modules.

### `resources`
Learning materials associated with a module.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | Primary Key, Default: `uuid_generate_v4()` | Unique identifier for the resource. |
| `module_id` | `uuid` | Foreign Key (`modules.id`), Not Null | The module this resource belongs to. |
| `title` | `text` | Not Null | Title of the resource. |
| `type` | `enum` | Not Null | Type of resource (`'video'`, `'pdf'`, `'article'`). |
| `url` | `text` | Not Null | Link to the resource content. |
| `order_index` | `integer` | Not Null | Order within the module. |

**Relationships:** Belongs to `modules`.
**RLS Rules:**
- Read: All authenticated users can read resources of published modules.
- Write: Admins can create, update, and delete resources.

### `assessments`
Quizzes or tests to evaluate learner knowledge.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | Primary Key, Default: `uuid_generate_v4()` | Unique identifier for the assessment. |
| `module_id` | `uuid` | Foreign Key (`modules.id`), Not Null | The module this assessment belongs to. |
| `title` | `text` | Not Null | Title of the assessment. |
| `passing_score` | `integer` | Not Null, Default: `50` | Minimum score required to pass (percentage). |
| `is_published` | `boolean` | Not Null, Default: `false` | Whether the assessment is visible to learners. |

**Relationships:** Belongs to `modules`.
**RLS Rules:**
- Read: All authenticated users can read published assessments. Admins can read all.
- Write: Admins can create, update, and delete assessments.

### `questions`
Individual questions within an assessment.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | Primary Key, Default: `uuid_generate_v4()` | Unique identifier for the question. |
| `assessment_id`| `uuid` | Foreign Key (`assessments.id`), Not Null | The assessment this question belongs to. |
| `text` | `text` | Not Null | The question prompt. |
| `options` | `jsonb` | Not Null | Array of possible answers. |
| `correct_option`| `text` | Not Null | The correct answer (hidden from learners). |

**Relationships:** Belongs to `assessments`.
**RLS Rules:**
- Read: Learners can read questions for assessments they are attempting (but not `correct_option`). Admins can read all fields.
- Write: Admins can create, update, and delete questions.

### `attempts`
Records of a user taking an assessment.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | Primary Key, Default: `uuid_generate_v4()` | Unique identifier for the attempt. |
| `user_id` | `uuid` | Foreign Key (`users.id`), Not Null | The user making the attempt. |
| `assessment_id`| `uuid` | Foreign Key (`assessments.id`), Not Null | The assessment being taken. |
| `score` | `integer` | | Score achieved (percentage). Null if still in progress. |
| `passed` | `boolean` | | Whether the score met the passing criteria. |
| `created_at` | `timestamptz` | Not Null, Default: `now()` | When the attempt started. |
| `completed_at` | `timestamptz` | | When the attempt was finished. |

**Relationships:** Belongs to `users` and `assessments`.
**RLS Rules:**
- Read: Users can read their own attempts. Admins and managers can read all.
- Write: Users can insert and update their own attempts. Admins can manage all.

### `progress`
Tracking of which resources a user has completed.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | Primary Key, Default: `uuid_generate_v4()` | Unique identifier. |
| `user_id` | `uuid` | Foreign Key (`users.id`), Not Null | The user. |
| `resource_id` | `uuid` | Foreign Key (`resources.id`), Not Null | The resource they viewed. |
| `completed_at` | `timestamptz` | Not Null, Default: `now()` | When the resource was marked complete. |

**Relationships:** Belongs to `users` and `resources`.
**RLS Rules:**
- Read: Users can read their own progress. Admins and managers can read all.
- Write: Users can insert their own progress records.

### `questionnaires`
Deadline-based surveys or assessments for organizational data gathering.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | Primary Key, Default: `uuid_generate_v4()` | Unique identifier. |
| `title` | `text` | Not Null | Title of the questionnaire. |
| `description` | `text` | | Purpose of the questionnaire. |
| `deadline` | `timestamptz` | Not Null | The date and time by which it must be completed. |
| `created_at` | `timestamptz` | Not Null, Default: `now()` | Timestamp of creation. |

**Relationships:** None.
**RLS Rules:**
- Read: All users can read active questionnaires.
- Write: Admins can create, update, and delete.

### `questionnaire_responses`
Answers submitted by users for a questionnaire.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | Primary Key, Default: `uuid_generate_v4()` | Unique identifier. |
| `questionnaire_id`| `uuid` | Foreign Key (`questionnaires.id`), Not Null | The questionnaire being answered. |
| `user_id` | `uuid` | Foreign Key (`users.id`), Not Null | The user responding. |
| `answers` | `jsonb` | Not Null | The user's submitted answers. |
| `submitted_at` | `timestamptz` | Not Null, Default: `now()` | Timestamp of submission. |

**Relationships:** Belongs to `questionnaires` and `users`.
**RLS Rules:**
- Read: Users can read their own responses. Admins and managers can read all.
- Write: Users can insert their own responses (once per questionnaire).
