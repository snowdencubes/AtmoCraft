-- Stage 5: Resources Schema
-- Create resource providers table
DROP TABLE IF EXISTS public.resource_providers CASCADE;
CREATE TABLE public.resource_providers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    domain TEXT NOT NULL,
    domain_type TEXT,
    website TEXT,
    terms_url TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create resources table
DROP TABLE IF EXISTS public.resources CASCADE;
CREATE TABLE public.resources (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    provider_id UUID REFERENCES public.resource_providers(id) ON DELETE SET NULL,
    subject TEXT NOT NULL,
    sub_topics TEXT[] DEFAULT '{}',
    level TEXT,
    languages TEXT[] DEFAULT '{}',
    duration TEXT,
    format TEXT,
    cost TEXT,
    access TEXT,
    url TEXT NOT NULL,
    direct_file_url TEXT,
    storage_path TEXT,
    file_type TEXT,
    file_size TEXT,
    page_count INTEGER,
    checksum TEXT,
    summary TEXT,
    modules JSONB DEFAULT '[]',
    prerequisites TEXT,
    certificate_offered TEXT,
    license_name TEXT,
    license_url TEXT,
    redistribution_allowed TEXT,
    attribution_text TEXT,
    embeddable TEXT,
    date_published TEXT,
    verified_date TEXT,
    link_status TEXT,
    is_published BOOLEAN DEFAULT true,
    cover_image TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create course_resources table
CREATE TABLE public.course_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    resource_id TEXT REFERENCES public.resources(id) ON DELETE CASCADE,
    position INTEGER NOT NULL DEFAULT 0,
    is_required BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(course_id, resource_id)
);

-- Create resource_views
CREATE TABLE public.resource_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    resource_id TEXT REFERENCES public.resources(id) ON DELETE CASCADE,
    viewed_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, resource_id)
);

-- Create resource_bookmarks
CREATE TABLE public.resource_bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    resource_id TEXT REFERENCES public.resources(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, resource_id)
);

-- Create glossary_terms
CREATE TABLE public.glossary_terms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    term TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    definition TEXT NOT NULL,
    source_url TEXT,
    source_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create circulars
CREATE TABLE public.circulars (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    issuing_body TEXT NOT NULL,
    publish_date TIMESTAMPTZ,
    source_url TEXT,
    summary TEXT,
    is_sample BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ENABLE RLS
ALTER TABLE public.resource_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.glossary_terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circulars ENABLE ROW LEVEL SECURITY;

-- POLICIES
-- Providers: readable by all, writable by admin
CREATE POLICY "Providers are viewable by everyone" ON public.resource_providers FOR SELECT USING (true);
-- Resources: readable by all if published, writable by admin
CREATE POLICY "Published resources are viewable by everyone" ON public.resources FOR SELECT USING (is_published = true);
CREATE POLICY "Course resources are viewable by everyone" ON public.course_resources FOR SELECT USING (true);
CREATE POLICY "Glossary viewable by everyone" ON public.glossary_terms FOR SELECT USING (true);
CREATE POLICY "Circulars viewable by everyone" ON public.circulars FOR SELECT USING (true);

-- User specific: views and bookmarks
CREATE POLICY "Users can see own bookmarks" ON public.resource_bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own bookmarks" ON public.resource_bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own bookmarks" ON public.resource_bookmarks FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can see own views" ON public.resource_views FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own views" ON public.resource_views FOR INSERT WITH CHECK (auth.uid() = user_id);

-- GIN Indexes for Full-Text Search
ALTER TABLE public.resources ADD COLUMN fts tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('english'::regconfig, coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english'::regconfig, coalesce(summary, '')), 'B')
) STORED;
CREATE INDEX resources_fts_idx ON public.resources USING GIN (fts);
