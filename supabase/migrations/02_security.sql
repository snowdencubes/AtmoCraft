-- ==========================================
-- 02_security.sql: Security, RLS, Views & Storage
-- ==========================================

-- 1. Helper Functions
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM users WHERE id = auth.uid() OR id::text = current_setting('request.jwt.claims', true)::jsonb->>'sub';
$$;

CREATE OR REPLACE FUNCTION public.get_email_by_username(p_username TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_email TEXT;
BEGIN
  SELECT email INTO v_email FROM users WHERE username = p_username LIMIT 1;
  RETURN v_email;
END;
$$;

-- 2. Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE questionnaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE questionnaire_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE competencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE trainer_competencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE certification_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
-- Users
CREATE POLICY "Users can read own data" ON users FOR SELECT USING (id = auth.uid());
CREATE POLICY "Admins can manage all users" ON users FOR ALL USING (public.current_user_role() = 'admin');

-- Profiles
CREATE POLICY "Users can manage own profile" ON profiles FOR ALL USING ("userId" = auth.uid());
CREATE POLICY "Admins can manage all profiles" ON profiles FOR ALL USING (public.current_user_role() = 'admin');

-- Courses
CREATE POLICY "Anyone can read published courses" ON courses FOR SELECT USING (status = 'published');
CREATE POLICY "Trainers can manage own courses" ON courses FOR ALL USING ("trainerId" = auth.uid() AND public.current_user_role() = 'trainer');
CREATE POLICY "Admins can manage all courses" ON courses FOR ALL USING (public.current_user_role() = 'admin');

-- 4. Storage Setup
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('course-covers', 'course-covers', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('certificates', 'certificates', false) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('library', 'library', false) ON CONFLICT DO NOTHING;

-- 5. Storage RLS Policies (Apply to storage.objects)
DROP POLICY IF EXISTS "Avatars are publicly accessible" ON storage.objects;
CREATE POLICY "Avatars are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Users can upload their own avatars" ON storage.objects;
CREATE POLICY "Users can upload their own avatars" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Users can update their own avatars" ON storage.objects;
CREATE POLICY "Users can update their own avatars" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Course covers are publicly accessible" ON storage.objects;
CREATE POLICY "Course covers are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'course-covers');

DROP POLICY IF EXISTS "Trainers/Admins can upload course covers" ON storage.objects;
CREATE POLICY "Trainers/Admins can upload course covers" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'course-covers' AND public.current_user_role() IN ('trainer', 'admin'));

DROP POLICY IF EXISTS "Users can read own certificates" ON storage.objects;
CREATE POLICY "Users can read own certificates" ON storage.objects FOR SELECT USING (bucket_id = 'certificates' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Trainers/Admins can manage certificates" ON storage.objects;
CREATE POLICY "Trainers/Admins can manage certificates" ON storage.objects FOR ALL USING (bucket_id = 'certificates' AND public.current_user_role() IN ('trainer', 'admin'));

DROP POLICY IF EXISTS "Library files readable by authenticated" ON storage.objects;
CREATE POLICY "Library files readable by authenticated" ON storage.objects FOR SELECT USING (bucket_id = 'library' AND auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Trainers can manage library" ON storage.objects;
CREATE POLICY "Trainers can manage library" ON storage.objects FOR ALL USING (bucket_id = 'library' AND public.current_user_role() IN ('trainer', 'admin'));


-- 6. Views
CREATE OR REPLACE VIEW admin_dashboard_stats AS
SELECT 
  (SELECT count(*) FROM users) as total_users,
  (SELECT count(*) FROM courses) as total_courses,
  (SELECT count(*) FROM enrollments) as total_enrollments,
  (SELECT count(*) FROM certification_records) as total_certifications;

-- 7. Prevent Role Escalation Trigger
CREATE OR REPLACE FUNCTION prevent_role_status_update()
RETURNS TRIGGER AS $$
BEGIN
  IF public.current_user_role() != 'admin' THEN
    NEW.role = OLD.role;
    NEW.status = OLD.status;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER users_prevent_role_escalation
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION prevent_role_status_update();
