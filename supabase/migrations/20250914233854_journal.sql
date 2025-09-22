-- Personal Journaling Database Schema
-- PostgreSQL implementation for journaling, mood tracking, prompts, and reflections

-- Create database (uncomment if needed)
-- CREATE DATABASE personal_journaling;

-- Use the database
-- \c personal_journaling;
create schema if not exists journal;

grant usage on schema journal to authenticated;

-- Journal Categories/Types
CREATE TABLE journal.journal_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(7), -- Hex color code
    icon VARCHAR(50),
    is_system BOOLEAN DEFAULT FALSE, -- System categories vs user-created
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

revoke all on table journal.journal_categories from anon, authenticated, service_role;
grant select on table journal.journal_categories to authenticated;

alter table journal.journal_categories enable row level security;

create policy "Allow authenticated read access" on journal.journal_categories
    for select
    to authenticated
    using (true);

-- Main Journal Entries Table
CREATE TABLE journal.journal_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES supasheet.accounts(id) ON DELETE CASCADE,
    title VARCHAR(300),
    content TEXT NOT NULL,
    entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
    entry_time TIME DEFAULT CURRENT_TIME,
    category_id INTEGER REFERENCES journal.journal_categories(id),
    mood_rating INTEGER CHECK (mood_rating >= 1 AND mood_rating <= 10),
    energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 10),
    stress_level INTEGER CHECK (stress_level >= 1 AND stress_level <= 10),
    sleep_quality INTEGER CHECK (sleep_quality >= 1 AND sleep_quality <= 10),
    weather VARCHAR(50),
    location VARCHAR(200),
    privacy_level VARCHAR(20) CHECK (privacy_level IN ('private', 'semi_private', 'public')) DEFAULT 'private',
    is_favorite BOOLEAN DEFAULT FALSE,
    tags TEXT[], -- Array of tags
    word_count INTEGER DEFAULT 0,
    reading_time INTEGER DEFAULT 0, -- Estimated reading time in seconds
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

revoke all on table journal.journal_entries from anon, authenticated, service_role;
grant select on table journal.journal_entries to authenticated;

alter table journal.journal_entries enable row level security;

create policy "Allow authenticated read access" on journal.journal_entries
    for select
    to authenticated
    using (true);

-- Mood Tracking (separate detailed mood tracking)
CREATE TABLE journal.mood_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES supasheet.accounts(id) ON DELETE CASCADE,
    journal_entry_id UUID REFERENCES journal.journal_entries(id) ON DELETE SET NULL,
    entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
    entry_time TIME DEFAULT CURRENT_TIME,
    primary_mood VARCHAR(50), -- happy, sad, anxious, excited, etc.
    mood_intensity INTEGER CHECK (mood_intensity >= 1 AND mood_intensity <= 10),
    emotions TEXT[], -- Array of emotions
    triggers TEXT[], -- What triggered this mood
    coping_strategies TEXT[], -- What helped or could help
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

revoke all on table journal.mood_entries from anon, authenticated, service_role;
grant select on table journal.mood_entries to authenticated;

alter table journal.mood_entries enable row level security;

create policy "Allow authenticated read access" on journal.mood_entries
    for select
    to authenticated
    using (true);

-- Gratitude Entries
CREATE TABLE journal.gratitude_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES supasheet.accounts(id) ON DELETE CASCADE,
    journal_entry_id UUID REFERENCES journal.journal_entries(id) ON DELETE SET NULL,
    entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
    gratitude_text TEXT NOT NULL,
    category VARCHAR(100), -- relationships, health, opportunities, etc.
    intensity INTEGER CHECK (intensity >= 1 AND intensity <= 5) DEFAULT 3,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

revoke all on table journal.gratitude_entries from anon, authenticated, service_role;
grant select on table journal.gratitude_entries to authenticated;

alter table journal.gratitude_entries enable row level security;

create policy "Allow authenticated read access" on journal.gratitude_entries
    for select
    to authenticated
    using (true);

-- Dream Journal
CREATE TABLE journal.dream_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES supasheet.accounts(id) ON DELETE CASCADE,
    journal_entry_id UUID REFERENCES journal.journal_entries(id) ON DELETE SET NULL,
    dream_date DATE NOT NULL DEFAULT CURRENT_DATE,
    title VARCHAR(200),
    content TEXT NOT NULL,
    dream_type VARCHAR(50), -- lucid, nightmare, recurring, prophetic, etc.
    vividness INTEGER CHECK (vividness >= 1 AND vividness <= 10),
    emotional_tone VARCHAR(50), -- positive, negative, neutral, mixed
    recurring_elements TEXT[],
    people_involved TEXT[],
    locations TEXT[],
    symbols TEXT[],
    interpretation TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

revoke all on table journal.dream_entries from anon, authenticated, service_role;
grant select on table journal.dream_entries to authenticated;

alter table journal.dream_entries enable row level security;

create policy "Allow authenticated read access" on journal.dream_entries
    for select
    to authenticated
    using (true);

-- Prompts for journaling inspiration
CREATE TABLE journal.journal_prompts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(300) NOT NULL,
    prompt_text TEXT NOT NULL,
    category VARCHAR(100), -- self-reflection, creativity, gratitude, goals, etc.
    difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('easy', 'medium', 'hard')) DEFAULT 'medium',
    estimated_time INTEGER, -- in minutes
    tags TEXT[],
    is_active BOOLEAN DEFAULT TRUE,
    usage_count INTEGER DEFAULT 0,
    created_by UUID REFERENCES supasheet.accounts(id), -- NULL for system prompts
    is_system BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

revoke all on table journal.journal_prompts from anon, authenticated, service_role;
grant select on table journal.journal_prompts to authenticated;

alter table journal.journal_prompts enable row level security;

create policy "Allow authenticated read access" on journal.journal_prompts
    for select
    to authenticated
    using (true);

-- Prompt Usage Tracking
CREATE TABLE journal.prompt_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES supasheet.accounts(id) ON DELETE CASCADE,
    prompt_id UUID REFERENCES journal.journal_prompts(id) ON DELETE CASCADE,
    journal_entry_id UUID REFERENCES journal.journal_entries(id) ON DELETE CASCADE,
    response_quality INTEGER CHECK (response_quality >= 1 AND response_quality <= 5),
    completion_time INTEGER, -- in minutes
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

revoke all on table journal.prompt_responses from anon, authenticated, service_role;
grant select on table journal.prompt_responses to authenticated;

alter table journal.prompt_responses enable row level security;

create policy "Allow authenticated read access" on journal.prompt_responses
    for select
    to authenticated
    using (true);

-- Habit/Activity Tracking (related to journaling)
CREATE TABLE journal.daily_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES supasheet.accounts(id) ON DELETE CASCADE,
    entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
    activity_name VARCHAR(100) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5), -- How did it go?
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(account_id, entry_date, activity_name)
);

revoke all on table journal.daily_activities from anon, authenticated, service_role;
grant select on table journal.daily_activities to authenticated;

alter table journal.daily_activities enable row level security;

create policy "Allow authenticated read access" on journal.daily_activities
    for select
    to authenticated
    using (true);

-- Life Events/Milestones
CREATE TABLE journal.life_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES supasheet.accounts(id) ON DELETE CASCADE,
    title VARCHAR(300) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    event_type VARCHAR(100), -- birthday, graduation, job_change, relationship, travel, etc.
    significance INTEGER CHECK (significance >= 1 AND significance <= 10),
    emotional_impact VARCHAR(20) CHECK (emotional_impact IN ('very_positive', 'positive', 'neutral', 'negative', 'very_negative')),
    tags TEXT[],
    related_people TEXT[],
    location VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

revoke all on table journal.life_events from anon, authenticated, service_role;
grant select on table journal.life_events to authenticated;

alter table journal.life_events enable row level security;

create policy "Allow authenticated read access" on journal.life_events
    for select
    to authenticated
    using (true);

-- Reflection Sessions (weekly, monthly, yearly reviews)
CREATE TABLE journal.reflection_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES supasheet.accounts(id) ON DELETE CASCADE,
    session_type VARCHAR(20) CHECK (session_type IN ('weekly', 'monthly', 'quarterly', 'yearly', 'custom')) NOT NULL,
    session_date DATE NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    highlights TEXT,
    lowlights TEXT,
    lessons_learned TEXT,
    goals_achieved TEXT,
    goals_missed TEXT,
    areas_for_improvement TEXT,
    gratitude_summary TEXT,
    next_period_intentions TEXT,
    overall_satisfaction INTEGER CHECK (overall_satisfaction >= 1 AND overall_satisfaction <= 10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(account_id, session_type, session_date)
);

revoke all on table journal.reflection_sessions from anon, authenticated, service_role;
grant select on table journal.reflection_sessions to authenticated;

alter table journal.reflection_sessions enable row level security;

create policy "Allow authenticated read access" on journal.reflection_sessions
    for select
    to authenticated
    using (true);

-- Reading/Book Journal
CREATE TABLE journal.reading_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES supasheet.accounts(id) ON DELETE CASCADE,
    journal_entry_id UUID REFERENCES journal.journal_entries(id) ON DELETE SET NULL,
    book_title VARCHAR(300) NOT NULL,
    author VARCHAR(200),
    isbn VARCHAR(20),
    status VARCHAR(20) CHECK (status IN ('want_to_read', 'currently_reading', 'completed', 'dnf')) DEFAULT 'want_to_read',
    start_date DATE,
    finish_date DATE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    pages_read INTEGER,
    total_pages INTEGER,
    favorite_quotes TEXT[],
    key_takeaways TEXT,
    personal_reflection TEXT,
    would_recommend BOOLEAN,
    genre VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

revoke all on table journal.reading_entries from anon, authenticated, service_role;
grant select on table journal.reading_entries to authenticated;

alter table journal.reading_entries enable row level security;

create policy "Allow authenticated read access" on journal.reading_entries
    for select
    to authenticated
    using (true);

-- Travel Journal
CREATE TABLE journal.travel_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES supasheet.accounts(id) ON DELETE CASCADE,
    journal_entry_id UUID REFERENCES journal.journal_entries(id) ON DELETE SET NULL,
    destination VARCHAR(200) NOT NULL,
    country VARCHAR(100),
    trip_start_date DATE,
    trip_end_date DATE,
    trip_type VARCHAR(50), -- vacation, business, adventure, etc.
    accommodation VARCHAR(200),
    transportation TEXT[],
    budget_planned DECIMAL(10,2),
    budget_actual DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    weather_conditions TEXT,
    favorite_moments TEXT,
    challenges TEXT,
    local_food_tried TEXT[],
    people_met TEXT[],
    would_return BOOLEAN,
    overall_rating INTEGER CHECK (overall_rating >= 1 AND overall_rating <= 10),
    photos_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

revoke all on table journal.travel_entries from anon, authenticated, service_role;
grant select on table journal.travel_entries to authenticated;

alter table journal.travel_entries enable row level security;

create policy "Allow authenticated read access" on journal.travel_entries
    for select
    to authenticated
    using (true);

-- Media Attachments
CREATE TABLE journal.media_attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    journal_entry_id UUID REFERENCES journal.journal_entries(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_type VARCHAR(50), -- image, audio, video, document
    file_size INTEGER, -- in bytes
    mime_type VARCHAR(100),
    caption TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

revoke all on table journal.media_attachments from anon, authenticated, service_role;
grant select on table journal.media_attachments to authenticated;

alter table journal.media_attachments enable row level security;

create policy "Allow authenticated read access" on journal.media_attachments
    for select
    to authenticated
    using (true);

-- Journal Statistics/Metrics
CREATE TABLE journal.journal_statistics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES supasheet.accounts(id) ON DELETE CASCADE,
    stat_date DATE NOT NULL DEFAULT CURRENT_DATE,
    entries_count INTEGER DEFAULT 0,
    words_written INTEGER DEFAULT 0,
    avg_mood DECIMAL(3,2),
    avg_energy DECIMAL(3,2),
    avg_stress DECIMAL(3,2),
    streak_days INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    prompts_used INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(account_id, stat_date)
);

revoke all on table journal.journal_statistics from anon, authenticated, service_role;
grant select on table journal.journal_statistics to authenticated;

alter table journal.journal_statistics enable row level security;

create policy "Allow authenticated read access" on journal.journal_statistics
    for select
    to authenticated
    using (true);

-- Indexes for better performance
CREATE INDEX idx_journal_entries_user_date ON journal.journal_entries(account_id, entry_date);
CREATE INDEX idx_journal_entries_category ON journal.journal_entries(category_id);
CREATE INDEX idx_journal_entries_mood ON journal.journal_entries(mood_rating);
CREATE INDEX idx_journal_entries_tags ON journal.journal_entries USING GIN(tags);
CREATE INDEX idx_mood_entries_user_date ON journal.mood_entries(account_id, entry_date);
CREATE INDEX idx_gratitude_entries_user_date ON journal.gratitude_entries(account_id, entry_date);
CREATE INDEX idx_dream_entries_user_date ON journal.dream_entries(account_id, dream_date);
CREATE INDEX idx_life_events_user_date ON journal.life_events(account_id, event_date);
CREATE INDEX idx_reading_entries_user_status ON journal.reading_entries(account_id, status);
CREATE INDEX idx_travel_entries_user_dates ON journal.travel_entries(account_id, trip_start_date, trip_end_date);
CREATE INDEX idx_daily_activities_user_date ON journal.daily_activities(account_id, entry_date);

-- Insert default journal categories
INSERT INTO journal.journal_categories (name, description, color, icon, is_system) VALUES
('Daily Life', 'General daily experiences and thoughts', '#4A90E2', 'calendar', TRUE),
('Gratitude', 'Things you are grateful for', '#F5A623', 'heart', TRUE),
('Dreams', 'Dream journal entries', '#7B68EE', 'moon', TRUE),
('Goals & Reflection', 'Personal goals and self-reflection', '#50E3C2', 'target', TRUE),
('Travel', 'Travel experiences and memories', '#BD10E0', 'map', TRUE),
('Reading', 'Book reviews and reading thoughts', '#B8E986', 'book', TRUE),
('Work & Career', 'Professional life and career thoughts', '#9013FE', 'briefcase', TRUE),
('Relationships', 'Family, friends, and relationships', '#FF6B6B', 'users', TRUE),
('Health & Wellness', 'Physical and mental health', '#4ECDC4', 'activity', TRUE),
('Creative', 'Creative projects and inspiration', '#FFE66D', 'palette', TRUE);

-- Note: Default user not needed as we're using supasheet.accounts

-- Insert sample journal prompts
INSERT INTO journal.journal_prompts (title, prompt_text, category, difficulty_level, estimated_time, is_system) VALUES
('Daily Reflection', 'What were the three most significant moments of your day? How did they make you feel?', 'self-reflection', 'easy', 10, TRUE),
('Gratitude Practice', 'List five things you are grateful for today and explain why each one matters to you.', 'gratitude', 'easy', 5, TRUE),
('Future Self', 'Write a letter to yourself 5 years from now. What do you hope to have accomplished?', 'goals', 'medium', 20, TRUE),
('Childhood Memory', 'Describe a vivid childhood memory. What details do you remember and how does it make you feel now?', 'self-reflection', 'medium', 15, TRUE),
('Overcoming Challenge', 'Think of a recent challenge you faced. How did you handle it and what did you learn?', 'self-reflection', 'medium', 15, TRUE),
('Perfect Day', 'Describe your perfect day from start to finish. What would you do, who would you spend it with?', 'creativity', 'easy', 10, TRUE),
('Values Exploration', 'What are your top 5 core values? How do they show up in your daily life?', 'self-reflection', 'hard', 25, TRUE),
('Forgiveness', 'Is there someone (including yourself) you need to forgive? Write about that experience.', 'self-reflection', 'hard', 20, TRUE),
('Creative Expression', 'If you could master any creative skill, what would it be and why? How would you use it?', 'creativity', 'medium', 15, TRUE),
('Life Lessons', 'What is the most important lesson life has taught you so far? How has it shaped who you are?', 'self-reflection', 'hard', 20, TRUE);

-- Views for common queries

-- Journal entries with category names
CREATE VIEW journal.journal_entries_with_details AS
SELECT 
    je.id,
    je.title,
    je.content,
    je.entry_date,
    je.entry_time,
    jc.name as category_name,
    jc.color as category_color,
    je.mood_rating,
    je.energy_level,
    je.stress_level,
    je.word_count,
    je.tags,
    je.is_favorite,
    je.created_at
FROM journal.journal_entries je
LEFT JOIN journal.journal_categories jc ON je.category_id = jc.id
ORDER BY je.entry_date DESC, je.entry_time DESC;

-- Recent journal activity
CREATE VIEW journal.recent_activity AS
SELECT 
    'journal_entry' as activity_type,
    je.id,
    je.title as activity_title,
    je.entry_date as activity_date,
    je.created_at
FROM journal.journal_entries je
WHERE je.created_at >= CURRENT_DATE - INTERVAL '30 days'

UNION ALL

SELECT 
    'mood_entry' as activity_type,
    me.id,
    'Mood: ' || me.primary_mood as activity_title,
    me.entry_date as activity_date,
    me.created_at
FROM journal.mood_entries me
WHERE me.created_at >= CURRENT_DATE - INTERVAL '30 days'

UNION ALL

SELECT 
    'reflection' as activity_type,
    rs.id,
    rs.session_type || ' reflection' as activity_title,
    rs.session_date as activity_date,
    rs.created_at
FROM journal.reflection_sessions rs
WHERE rs.created_at >= CURRENT_DATE - INTERVAL '30 days'

ORDER BY created_at DESC;

-- Mood trends
CREATE VIEW journal.mood_trends AS
SELECT 
    entry_date,
    AVG(mood_rating) as avg_mood,
    AVG(energy_level) as avg_energy,
    AVG(stress_level) as avg_stress,
    COUNT(*) as entry_count
FROM journal.journal_entries
WHERE mood_rating IS NOT NULL
  AND entry_date >= CURRENT_DATE - INTERVAL '90 days'
GROUP BY entry_date
ORDER BY entry_date DESC;

-- Writing statistics by month
CREATE VIEW journal.monthly_writing_stats AS
SELECT 
    DATE_TRUNC('month', entry_date) as month,
    COUNT(*) as total_entries,
    SUM(word_count) as total_words,
    AVG(word_count) as avg_words_per_entry,
    COUNT(DISTINCT entry_date) as days_journaled
FROM journal.journal_entries
GROUP BY DATE_TRUNC('month', entry_date)
ORDER BY month DESC;

-- Popular tags
CREATE VIEW journal.popular_tags AS
SELECT 
    tag,
    COUNT(*) as usage_count,
    COUNT(DISTINCT account_id) as users_count
FROM (
    SELECT 
        account_id,
        unnest(tags) as tag
    FROM journal.journal_entries
    WHERE tags IS NOT NULL
) t
GROUP BY tag
ORDER BY usage_count DESC;

-- Functions

-- Function to calculate word count
CREATE OR REPLACE FUNCTION journal.calculate_word_count(content_text TEXT)
RETURNS INTEGER AS $$
BEGIN
    IF content_text IS NULL OR content_text = '' THEN
        RETURN 0;
    END IF;
    
    RETURN array_length(string_to_array(trim(regexp_replace(content_text, '\s+', ' ', 'g')), ' '), 1);
END;
$$ LANGUAGE plpgsql;

-- Function to estimate reading time (average 200 words per minute)
CREATE OR REPLACE FUNCTION journal.calculate_reading_time(word_count INTEGER)
RETURNS INTEGER AS $$
BEGIN
    IF word_count IS NULL OR word_count = 0 THEN
        RETURN 0;
    END IF;
    
    RETURN CEIL(word_count / 200.0) * 60; -- Return seconds
END;
$$ LANGUAGE plpgsql;

-- Function to update journal statistics
CREATE OR REPLACE FUNCTION journal.update_journal_statistics(user_uuid UUID, p_stat_date DATE)
RETURNS VOID AS $$
DECLARE
    entry_count INTEGER;
    total_words INTEGER;
    avg_mood_val DECIMAL;
    avg_energy_val DECIMAL;
    avg_stress_val DECIMAL;
    prompts_count INTEGER;
BEGIN
    -- Calculate statistics for the date
    SELECT 
        COUNT(*),
        COALESCE(SUM(word_count), 0),
        LEAST(9.99, ROUND(AVG(mood_rating), 2)),
        LEAST(9.99, ROUND(AVG(energy_level), 2)),
        LEAST(9.99, ROUND(AVG(stress_level), 2))
    INTO entry_count, total_words, avg_mood_val, avg_energy_val, avg_stress_val
    FROM journal.journal_entries
    WHERE account_id = user_uuid AND entry_date = p_stat_date;
    
    -- Count prompts used
    SELECT COUNT(*)
    INTO prompts_count
    FROM journal.prompt_responses pr
    JOIN journal.journal_entries je ON pr.journal_entry_id = je.id
    WHERE pr.account_id = user_uuid AND je.entry_date = p_stat_date;
    
    -- Upsert statistics
    INSERT INTO journal.journal_statistics (
        account_id, stat_date, entries_count, words_written, 
        avg_mood, avg_energy, avg_stress, prompts_used
    ) VALUES (
        user_uuid, p_stat_date, entry_count, total_words,
        avg_mood_val, avg_energy_val, avg_stress_val, prompts_count
    )
    ON CONFLICT (account_id, stat_date) 
    DO UPDATE SET
        entries_count = EXCLUDED.entries_count,
        words_written = EXCLUDED.words_written,
        avg_mood = EXCLUDED.avg_mood,
        avg_energy = EXCLUDED.avg_energy,
        avg_stress = EXCLUDED.avg_stress,
        prompts_used = EXCLUDED.prompts_used;
END;
$$ LANGUAGE plpgsql;

-- Function to get journal insights for date range
CREATE OR REPLACE FUNCTION journal.get_journal_insights(
    user_uuid UUID,
    start_date DATE,
    end_date DATE
)
RETURNS TABLE(
    total_entries INTEGER,
    total_words INTEGER,
    avg_daily_words DECIMAL,
    most_common_mood VARCHAR,
    mood_trend VARCHAR,
    top_tags TEXT[],
    days_journaled INTEGER,
    consistency_percentage DECIMAL
) AS $$
DECLARE
    date_range_days INTEGER;
BEGIN
    date_range_days := end_date - start_date + 1;
    
    RETURN QUERY
    WITH entry_stats AS (
        SELECT 
            COUNT(*) as entries,
            SUM(word_count) as words,
            COUNT(DISTINCT entry_date) as unique_days,
            mode() WITHIN GROUP (ORDER BY mood_rating) as common_mood
        FROM journal.journal_entries
        WHERE account_id = user_uuid 
          AND entry_date BETWEEN start_date AND end_date
    ),
    tag_stats AS (
        SELECT array_agg(tag ORDER BY cnt DESC) as top_tag_list
        FROM (
            SELECT tag, COUNT(*) as cnt
            FROM (
                SELECT unnest(tags) as tag
                FROM journal_entries
                WHERE account_id = user_uuid 
                  AND entry_date BETWEEN start_date AND end_date
                  AND tags IS NOT NULL
            ) t
            GROUP BY tag
            ORDER BY cnt DESC
            LIMIT 5
        ) top_tags
    )
    SELECT 
        es.entries::INTEGER,
        es.words::INTEGER,
        ROUND(es.words::DECIMAL / NULLIF(es.unique_days, 0), 2) as avg_daily_words,
        CASE 
            WHEN es.common_mood BETWEEN 8 AND 10 THEN 'Very Positive'
            WHEN es.common_mood BETWEEN 6 AND 7 THEN 'Positive'
            WHEN es.common_mood BETWEEN 4 AND 5 THEN 'Neutral'
            WHEN es.common_mood BETWEEN 2 AND 3 THEN 'Negative'
            WHEN es.common_mood = 1 THEN 'Very Negative'
            ELSE 'Mixed'
        END as most_common_mood,
        'Stable' as mood_trend, -- Simplified, could be enhanced
        COALESCE(ts.top_tag_list, ARRAY[]::TEXT[]) as top_tags,
        es.unique_days::INTEGER,
        ROUND((es.unique_days::DECIMAL / date_range_days) * 100, 2) as consistency_percentage
    FROM entry_stats es
    CROSS JOIN tag_stats ts;
END;
$$ LANGUAGE plpgsql;

-- Triggers

-- Auto-calculate word count and reading time
CREATE OR REPLACE FUNCTION journal.update_entry_stats()
RETURNS TRIGGER AS $$
BEGIN
    NEW.word_count = journal.calculate_word_count(NEW.content);
    NEW.reading_time = journal.calculate_reading_time(NEW.word_count);
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_entry_stats
    BEFORE INSERT OR UPDATE ON journal.journal_entries
    FOR EACH ROW
    EXECUTE FUNCTION journal.update_entry_stats();

-- Update journal statistics after entry insert/update
CREATE OR REPLACE FUNCTION journal.trigger_update_statistics()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        PERFORM journal.update_journal_statistics(NEW.account_id, NEW.entry_date);
    ELSIF TG_OP = 'UPDATE' THEN
        PERFORM journal.update_journal_statistics(NEW.account_id, NEW.entry_date);
        IF OLD.entry_date != NEW.entry_date THEN
            PERFORM journal.update_journal_statistics(OLD.account_id, OLD.entry_date);
        END IF;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_journal_statistics
    AFTER INSERT OR UPDATE ON journal.journal_entries
    FOR EACH ROW
    EXECUTE FUNCTION journal.trigger_update_statistics();

-- Sample data (uncomment to insert)
/*
-- Get default user ID
DO $$
DECLARE
    default_account_id UUID;
    daily_category_id INTEGER;
    gratitude_category_id INTEGER;
BEGIN
    -- Use an existing account from supasheet.accounts
    SELECT id INTO default_account_id FROM supasheet.accounts LIMIT 1;
    SELECT id INTO daily_category_id FROM journal.journal_categories WHERE name = 'Daily Life';
    SELECT id INTO gratitude_category_id FROM journal.journal_categories WHERE name = 'Gratitude';
    
    -- Insert sample journal entries
    INSERT INTO journal.journal_entries (account_id, title, content, category_id, mood_rating, energy_level, tags) VALUES
    (default_account_id, 'A Beautiful Morning', 'Woke up early today and watched the sunrise. There is something magical about the quiet hours of the morning when the world is still asleep. I felt a deep sense of peace and gratitude for this moment.', daily_category_id, 8, 7, ARRAY['morning', 'peace', 'sunrise']),
    
    (default_account_id, 'Grateful for Small Things', 'Today I am grateful for: 1) The warm cup of coffee that started my day 2) A call from an old friend 3) Finding a perfect parking spot 4) The way my cat purrs when content 5) Having a roof over my head', gratitude_category_id, 7, 6, ARRAY['gratitude', 'friends', 'simple_pleasures']);
    
    -- Insert sample mood entries
    INSERT INTO journal.mood_entries (account_id, entry_date, primary_mood, mood_intensity, emotions, triggers) VALUES
    (default_account_id, CURRENT_DATE, 'content', 7, ARRAY['peaceful', 'grateful', 'optimistic'], ARRAY['beautiful weather', 'good sleep', 'productive morning']);
    
    -- Insert sample gratitude entries
    INSERT INTO journal.gratitude_entries (account_id, entry_date, gratitude_text, category, intensity) VALUES
    (default_account_id, CURRENT_DATE, 'My family''s unconditional love and support', 'relationships', 5),
    (default_account_id, CURRENT_DATE, 'Good health that allows me to enjoy daily activities', 'health', 4),
    (default_account_id, CURRENT_DATE, 'The opportunity to learn something new every day', 'opportunities', 4);
END $$;
*/