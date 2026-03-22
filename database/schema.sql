/* 
  DATABASE SCHEMA FOR FOODIEGEN 
  Target: PostgreSQL
*/

-- 1. Table: users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(120) NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Table: ai_voices (Master Data)
CREATE TABLE ai_voices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    provider VARCHAR(50) NOT NULL, -- e.g., ElevenLabs, Azure
    gender VARCHAR(10) NOT NULL,   -- Male, Female, AI
    locale VARCHAR(10) NOT NULL,   -- vi-VN, en-US
    preview_url TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

-- 3. Table: style_presets (Master Data)
CREATE TABLE style_presets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,    -- Cinematic, Rustic, etc.
    visual_description TEXT,
    base_image_prompt TEXT,
    negative_prompt TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Table: video_projects
CREATE TABLE video_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    story_topic TEXT,
    video_genre VARCHAR(100),
    status VARCHAR(20) DEFAULT 'draft', -- draft, generating, completed, failed
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Table: project_entities (New: CHAR, FOOD, LOC)
CREATE TABLE project_entities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES video_projects(id) ON DELETE CASCADE,
    entity_type VARCHAR(20) NOT NULL, -- CHARACTER, FOOD, LOCATION
    name VARCHAR(255) NOT NULL,
    description TEXT,
    reference_image_url TEXT,
    meta_json JSONB, -- Additional attributes
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Table: video_scripts
CREATE TABLE video_scripts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES video_projects(id) ON DELETE CASCADE,
    version INTEGER DEFAULT 1,
    content JSONB NOT NULL, -- Structured scenes (Title, Visual Description, Audio Script)
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Table: video_generations
CREATE TABLE video_generations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES video_projects(id) ON DELETE CASCADE,
    script_id UUID REFERENCES video_scripts(id),
    voice_id UUID REFERENCES ai_voices(id),
    style_id UUID REFERENCES style_presets(id),
    generation_no INTEGER NOT NULL,
    resolution VARCHAR(20) NOT NULL, -- 720p, 1080p
    aspect_ratio VARCHAR(10) NOT NULL, -- 9:16, 16:9, 1:1
    motion_intensity INTEGER DEFAULT 50,
    status VARCHAR(20) DEFAULT 'pending',
    output_url TEXT,
    thumbnail_url TEXT,
    duration_seconds INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Table: video_scenes
CREATE TABLE video_scenes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    generation_id UUID REFERENCES video_generations(id) ON DELETE CASCADE,
    scene_order INTEGER NOT NULL,
    visual_prompt TEXT,
    motion_prompt TEXT,
    audio_script TEXT,
    image_url TEXT,
    video_clip_url TEXT,
    audio_url TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
