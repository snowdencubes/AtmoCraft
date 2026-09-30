-- AtmoCraft: Stage 3 - Security, RLS, Storage, and Views Migration

-- 1. Create Helper Functions for Security
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM users WHERE id = auth.uid() OR id::text = current_setting('request.jwt.claims', true)::jsonb->>'sub';
$$;

-- 2. Enable Row Level Security (RLS) on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE questionnaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE competencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE trainer_competencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE certification_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies

-- Users: Read own data, Admins read all
CREATE POLICY "Users can read own data" ON users FOR SELECT USING (id = auth.uid());
CREATE POLICY "Admins can manage all users" ON users FOR ALL USING (public.current_user_role() = 'admin');

-- Profiles: Users manage own profile (except role/status, handled by API), Admins manage all
CREATE POLICY "Users can manage own profile" ON profiles FOR ALL USING (userId = auth.uid());
CREATE POLICY "Admins can manage all profiles" ON profiles FOR ALL USING (public.current_user_role() = 'admin');

-- Courses: Anyone can read published courses, Trainers manage own, Admins manage all
CREATE POLICY "Anyone can read published courses" ON courses FOR SELECT USING (status = 'published');
CREATE POLICY "Trainers can manage own courses" ON courses FOR ALL USING (trainerId = auth.uid() AND public.current_user_role() = 'trainer');
CREATE POLICY "Admins can manage all courses" ON courses FOR ALL USING (public.current_user_role() = 'admin');

-- 4. Storage Buckets Creation
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('course-covers', 'course-covers', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('certificates', 'certificates', false) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('library', 'library', false) ON CONFLICT DO NOTHING;

-- 5. Dashboard Views for Fast Analytics
CREATE OR REPLACE VIEW admin_dashboard_stats AS
SELECT 
  (SELECT count(*) FROM users) as total_users,
  (SELECT count(*) FROM courses) as total_courses,
  (SELECT count(*) FROM enrollments) as total_enrollments,
  (SELECT count(*) FROM certification_records) as total_certifications;

-- Prevent role/status modifications on UPDATE for Users table (Column Guard Trigger)
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
