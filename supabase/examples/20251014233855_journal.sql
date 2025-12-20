-- Personal Journaling Database Schema
-- PostgreSQL implementation for journaling, mood tracking, prompts, and reflections

-- Create database (uncomment if needed)
-- CREATE DATABASE personal_journaling;

-- Use the database
-- \c personal_journaling;
create schema if not exists journal;

grant usage on schema journal to authenticated;

begin;
-- Define enum types for journal schema
create type journal.privacy_level as enum ('private', 'semi_private', 'public');
create type journal.prompt_difficulty_level as enum ('easy', 'medium', 'hard');
create type journal.emotional_impact as enum ('very_positive', 'positive', 'neutral', 'negative', 'very_negative');
create type journal.reflection_session_type as enum ('weekly', 'monthly', 'quarterly', 'yearly', 'custom');
create type journal.reading_status as enum ('want_to_read', 'currently_reading', 'completed', 'dnf');

-- Add journal permissions to app_permission enum
alter type supasheet.app_permission add value 'journal.journal_categories:select';
alter type supasheet.app_permission add value 'journal.journal_categories:insert';
alter type supasheet.app_permission add value 'journal.journal_categories:update';
alter type supasheet.app_permission add value 'journal.journal_categories:delete';

alter type supasheet.app_permission add value 'journal.journal_entries:select';
alter type supasheet.app_permission add value 'journal.journal_entries:insert';
alter type supasheet.app_permission add value 'journal.journal_entries:update';
alter type supasheet.app_permission add value 'journal.journal_entries:delete';

alter type supasheet.app_permission add value 'journal.mood_entries:select';
alter type supasheet.app_permission add value 'journal.mood_entries:insert';
alter type supasheet.app_permission add value 'journal.mood_entries:update';
alter type supasheet.app_permission add value 'journal.mood_entries:delete';

alter type supasheet.app_permission add value 'journal.gratitude_entries:select';
alter type supasheet.app_permission add value 'journal.gratitude_entries:insert';
alter type supasheet.app_permission add value 'journal.gratitude_entries:update';
alter type supasheet.app_permission add value 'journal.gratitude_entries:delete';

alter type supasheet.app_permission add value 'journal.dream_entries:select';
alter type supasheet.app_permission add value 'journal.dream_entries:insert';
alter type supasheet.app_permission add value 'journal.dream_entries:update';
alter type supasheet.app_permission add value 'journal.dream_entries:delete';

alter type supasheet.app_permission add value 'journal.journal_prompts:select';
alter type supasheet.app_permission add value 'journal.journal_prompts:insert';
alter type supasheet.app_permission add value 'journal.journal_prompts:update';
alter type supasheet.app_permission add value 'journal.journal_prompts:delete';

alter type supasheet.app_permission add value 'journal.prompt_responses:select';
alter type supasheet.app_permission add value 'journal.prompt_responses:insert';
alter type supasheet.app_permission add value 'journal.prompt_responses:update';
alter type supasheet.app_permission add value 'journal.prompt_responses:delete';

alter type supasheet.app_permission add value 'journal.daily_activities:select';
alter type supasheet.app_permission add value 'journal.daily_activities:insert';
alter type supasheet.app_permission add value 'journal.daily_activities:update';
alter type supasheet.app_permission add value 'journal.daily_activities:delete';

alter type supasheet.app_permission add value 'journal.life_events:select';
alter type supasheet.app_permission add value 'journal.life_events:insert';
alter type supasheet.app_permission add value 'journal.life_events:update';
alter type supasheet.app_permission add value 'journal.life_events:delete';

alter type supasheet.app_permission add value 'journal.reflection_sessions:select';
alter type supasheet.app_permission add value 'journal.reflection_sessions:insert';
alter type supasheet.app_permission add value 'journal.reflection_sessions:update';
alter type supasheet.app_permission add value 'journal.reflection_sessions:delete';

alter type supasheet.app_permission add value 'journal.reading_entries:select';
alter type supasheet.app_permission add value 'journal.reading_entries:insert';
alter type supasheet.app_permission add value 'journal.reading_entries:update';
alter type supasheet.app_permission add value 'journal.reading_entries:delete';

alter type supasheet.app_permission add value 'journal.travel_entries:select';
alter type supasheet.app_permission add value 'journal.travel_entries:insert';
alter type supasheet.app_permission add value 'journal.travel_entries:update';
alter type supasheet.app_permission add value 'journal.travel_entries:delete';

alter type supasheet.app_permission add value 'journal.media_attachments:select';
alter type supasheet.app_permission add value 'journal.media_attachments:insert';
alter type supasheet.app_permission add value 'journal.media_attachments:update';
alter type supasheet.app_permission add value 'journal.media_attachments:delete';

alter type supasheet.app_permission add value 'journal.journal_statistics:select';

alter type supasheet.app_permission add value 'journal.journal_entries_with_details:select';
alter type supasheet.app_permission add value 'journal.recent_activity:select';
alter type supasheet.app_permission add value 'journal.mood_trends:select';
alter type supasheet.app_permission add value 'journal.monthly_writing_stats:select';
alter type supasheet.app_permission add value 'journal.popular_tags:select';

-- Report views
alter type supasheet.app_permission add value 'journal.journal_report:select';
alter type supasheet.app_permission add value 'journal.mood_report:select';

-- Dashboard widget views (Card types)
alter type supasheet.app_permission add value 'journal.total_entries_count:select';
alter type supasheet.app_permission add value 'journal.mood_energy_comparison:select';
alter type supasheet.app_permission add value 'journal.writing_streak:select';
alter type supasheet.app_permission add value 'journal.category_distribution:select';

-- Dashboard widget views (Table types)
alter type supasheet.app_permission add value 'journal.recent_entries_simple:select';
alter type supasheet.app_permission add value 'journal.favorite_entries_simple:select';
alter type supasheet.app_permission add value 'journal.entry_overview_detailed:select';
alter type supasheet.app_permission add value 'journal.gratitude_log_detailed:select';

-- Chart views
alter type supasheet.app_permission add value 'journal.mood_trend_area:select';
alter type supasheet.app_permission add value 'journal.category_usage_bar:select';
alter type supasheet.app_permission add value 'journal.writing_frequency_line:select';
alter type supasheet.app_permission add value 'journal.emotion_distribution_pie:select';
alter type supasheet.app_permission add value 'journal.wellness_metrics_radar:select';

commit;

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
grant select, insert, update, delete on table journal.journal_categories to authenticated;

alter table journal.journal_categories enable row level security;

create policy journal_categories_select on journal.journal_categories
    for select
    to authenticated
    using (supasheet.has_permission('journal.journal_categories:select'));

create policy journal_categories_insert on journal.journal_categories
    for insert
    to authenticated
    with check (supasheet.has_permission('journal.journal_categories:insert'));

create policy journal_categories_update on journal.journal_categories
    for update
    to authenticated
    using (supasheet.has_permission('journal.journal_categories:update'))
    with check (supasheet.has_permission('journal.journal_categories:update'));

create policy journal_categories_delete on journal.journal_categories
    for delete
    to authenticated
    using (supasheet.has_permission('journal.journal_categories:delete'));

-- Main Journal Entries Table
CREATE TABLE journal.journal_entries (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
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
    privacy_level journal.privacy_level DEFAULT 'private',
    is_favorite BOOLEAN DEFAULT FALSE,
    tags TEXT[], -- Array of tags
    word_count INTEGER DEFAULT 0,
    reading_time INTEGER DEFAULT 0, -- Estimated reading time in seconds
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

revoke all on table journal.journal_entries from anon, authenticated, service_role;
grant select, insert, update, delete on table journal.journal_entries to authenticated;

alter table journal.journal_entries enable row level security;

create policy journal_entries_select on journal.journal_entries
    for select
    to authenticated
    using (account_id = auth.uid() and supasheet.has_permission('journal.journal_entries:select'));

create policy journal_entries_insert on journal.journal_entries
    for insert
    to authenticated
    with check (account_id = auth.uid() and supasheet.has_permission('journal.journal_entries:insert'));

create policy journal_entries_update on journal.journal_entries
    for update
    to authenticated
    using (account_id = auth.uid() and supasheet.has_permission('journal.journal_entries:update'))
    with check (account_id = auth.uid() and supasheet.has_permission('journal.journal_entries:update'));

create policy journal_entries_delete on journal.journal_entries
    for delete
    to authenticated
    using (account_id = auth.uid() and supasheet.has_permission('journal.journal_entries:delete'));

-- Mood Tracking (separate detailed mood tracking)
CREATE TABLE journal.mood_entries (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
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
grant select, insert, update, delete on table journal.mood_entries to authenticated;

alter table journal.mood_entries enable row level security;

create policy mood_entries_select on journal.mood_entries
    for select
    to authenticated
    using (account_id = auth.uid() and supasheet.has_permission('journal.mood_entries:select'));

create policy mood_entries_insert on journal.mood_entries
    for insert
    to authenticated
    with check (account_id = auth.uid() and supasheet.has_permission('journal.mood_entries:insert'));

create policy mood_entries_update on journal.mood_entries
    for update
    to authenticated
    using (account_id = auth.uid() and supasheet.has_permission('journal.mood_entries:update'))
    with check (account_id = auth.uid() and supasheet.has_permission('journal.mood_entries:update'));

create policy mood_entries_delete on journal.mood_entries
    for delete
    to authenticated
    using (account_id = auth.uid() and supasheet.has_permission('journal.mood_entries:delete'));

-- Gratitude Entries
CREATE TABLE journal.gratitude_entries (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    account_id UUID REFERENCES supasheet.accounts(id) ON DELETE CASCADE,
    journal_entry_id UUID REFERENCES journal.journal_entries(id) ON DELETE SET NULL,
    entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
    gratitude_text TEXT NOT NULL,
    category VARCHAR(100), -- relationships, health, opportunities, etc.
    intensity INTEGER CHECK (intensity >= 1 AND intensity <= 5) DEFAULT 3,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

revoke all on table journal.gratitude_entries from anon, authenticated, service_role;
grant select, insert, update, delete on table journal.gratitude_entries to authenticated;

alter table journal.gratitude_entries enable row level security;

create policy gratitude_entries_select on journal.gratitude_entries
    for select
    to authenticated
    using (account_id = auth.uid() and supasheet.has_permission('journal.gratitude_entries:select'));

create policy gratitude_entries_insert on journal.gratitude_entries
    for insert
    to authenticated
    with check (account_id = auth.uid() and supasheet.has_permission('journal.gratitude_entries:insert'));

create policy gratitude_entries_update on journal.gratitude_entries
    for update
    to authenticated
    using (account_id = auth.uid() and supasheet.has_permission('journal.gratitude_entries:update'))
    with check (account_id = auth.uid() and supasheet.has_permission('journal.gratitude_entries:update'));

create policy gratitude_entries_delete on journal.gratitude_entries
    for delete
    to authenticated
    using (account_id = auth.uid() and supasheet.has_permission('journal.gratitude_entries:delete'));

-- Dream Journal
CREATE TABLE journal.dream_entries (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
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
grant select, insert, update, delete on table journal.dream_entries to authenticated;

alter table journal.dream_entries enable row level security;

create policy dream_entries_select on journal.dream_entries
    for select
    to authenticated
    using (account_id = auth.uid() and supasheet.has_permission('journal.dream_entries:select'));

create policy dream_entries_insert on journal.dream_entries
    for insert
    to authenticated
    with check (account_id = auth.uid() and supasheet.has_permission('journal.dream_entries:insert'));

create policy dream_entries_update on journal.dream_entries
    for update
    to authenticated
    using (account_id = auth.uid() and supasheet.has_permission('journal.dream_entries:update'))
    with check (account_id = auth.uid() and supasheet.has_permission('journal.dream_entries:update'));

create policy dream_entries_delete on journal.dream_entries
    for delete
    to authenticated
    using (account_id = auth.uid() and supasheet.has_permission('journal.dream_entries:delete'));

-- Prompts for journaling inspiration
CREATE TABLE journal.journal_prompts (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    title VARCHAR(300) NOT NULL,
    prompt_text TEXT NOT NULL,
    category VARCHAR(100), -- self-reflection, creativity, gratitude, goals, etc.
    difficulty_level journal.prompt_difficulty_level DEFAULT 'medium',
    estimated_time INTEGER, -- in minutes
    tags TEXT[],
    is_active BOOLEAN DEFAULT TRUE,
    usage_count INTEGER DEFAULT 0,
    created_by UUID REFERENCES supasheet.accounts(id), -- NULL for system prompts
    is_system BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

revoke all on table journal.journal_prompts from anon, authenticated, service_role;
grant select, insert, update, delete on table journal.journal_prompts to authenticated;

alter table journal.journal_prompts enable row level security;

create policy journal_prompts_select on journal.journal_prompts
    for select
    to authenticated
    using (supasheet.has_permission('journal.journal_prompts:select'));

create policy journal_prompts_insert on journal.journal_prompts
    for insert
    to authenticated
    with check (supasheet.has_permission('journal.journal_prompts:insert'));

create policy journal_prompts_update on journal.journal_prompts
    for update
    to authenticated
    using (supasheet.has_permission('journal.journal_prompts:update'))
    with check (supasheet.has_permission('journal.journal_prompts:update'));

create policy journal_prompts_delete on journal.journal_prompts
    for delete
    to authenticated
    using (supasheet.has_permission('journal.journal_prompts:delete'));

-- Prompt Usage Tracking
CREATE TABLE journal.prompt_responses (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    account_id UUID REFERENCES supasheet.accounts(id) ON DELETE CASCADE,
    prompt_id UUID REFERENCES journal.journal_prompts(id) ON DELETE CASCADE,
    journal_entry_id UUID REFERENCES journal.journal_entries(id) ON DELETE CASCADE,
    response_quality INTEGER CHECK (response_quality >= 1 AND response_quality <= 5),
    completion_time INTEGER, -- in minutes
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

revoke all on table journal.prompt_responses from anon, authenticated, service_role;
grant select, insert, update, delete on table journal.prompt_responses to authenticated;

alter table journal.prompt_responses enable row level security;

create policy prompt_responses_select on journal.prompt_responses
    for select
    to authenticated
    using (account_id = auth.uid() and supasheet.has_permission('journal.prompt_responses:select'));

create policy prompt_responses_insert on journal.prompt_responses
    for insert
    to authenticated
    with check (account_id = auth.uid() and supasheet.has_permission('journal.prompt_responses:insert'));

create policy prompt_responses_update on journal.prompt_responses
    for update
    to authenticated
    using (account_id = auth.uid() and supasheet.has_permission('journal.prompt_responses:update'))
    with check (account_id = auth.uid() and supasheet.has_permission('journal.prompt_responses:update'));

create policy prompt_responses_delete on journal.prompt_responses
    for delete
    to authenticated
    using (account_id = auth.uid() and supasheet.has_permission('journal.prompt_responses:delete'));

-- Habit/Activity Tracking (related to journaling)
CREATE TABLE journal.daily_activities (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
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
grant select, insert, update, delete on table journal.daily_activities to authenticated;

alter table journal.daily_activities enable row level security;

create policy daily_activities_select on journal.daily_activities
    for select
    to authenticated
    using (account_id = auth.uid() and supasheet.has_permission('journal.daily_activities:select'));

create policy daily_activities_insert on journal.daily_activities
    for insert
    to authenticated
    with check (account_id = auth.uid() and supasheet.has_permission('journal.daily_activities:insert'));

create policy daily_activities_update on journal.daily_activities
    for update
    to authenticated
    using (account_id = auth.uid() and supasheet.has_permission('journal.daily_activities:update'))
    with check (account_id = auth.uid() and supasheet.has_permission('journal.daily_activities:update'));

create policy daily_activities_delete on journal.daily_activities
    for delete
    to authenticated
    using (account_id = auth.uid() and supasheet.has_permission('journal.daily_activities:delete'));

-- Life Events/Milestones
CREATE TABLE journal.life_events (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    account_id UUID REFERENCES supasheet.accounts(id) ON DELETE CASCADE,
    title VARCHAR(300) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    event_type VARCHAR(100), -- birthday, graduation, job_change, relationship, travel, etc.
    significance INTEGER CHECK (significance >= 1 AND significance <= 10),
    emotional_impact journal.emotional_impact,
    tags TEXT[],
    related_people TEXT[],
    location VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

revoke all on table journal.life_events from anon, authenticated, service_role;
grant select, insert, update, delete on table journal.life_events to authenticated;

alter table journal.life_events enable row level security;

create policy life_events_select on journal.life_events
    for select
    to authenticated
    using (account_id = auth.uid() and supasheet.has_permission('journal.life_events:select'));

create policy life_events_insert on journal.life_events
    for insert
    to authenticated
    with check (account_id = auth.uid() and supasheet.has_permission('journal.life_events:insert'));

create policy life_events_update on journal.life_events
    for update
    to authenticated
    using (account_id = auth.uid() and supasheet.has_permission('journal.life_events:update'))
    with check (account_id = auth.uid() and supasheet.has_permission('journal.life_events:update'));

create policy life_events_delete on journal.life_events
    for delete
    to authenticated
    using (account_id = auth.uid() and supasheet.has_permission('journal.life_events:delete'));

-- Reflection Sessions (weekly, monthly, yearly reviews)
CREATE TABLE journal.reflection_sessions (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    account_id UUID REFERENCES supasheet.accounts(id) ON DELETE CASCADE,
    session_type journal.reflection_session_type NOT NULL,
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
grant select, insert, update, delete on table journal.reflection_sessions to authenticated;

alter table journal.reflection_sessions enable row level security;

create policy reflection_sessions_select on journal.reflection_sessions
    for select
    to authenticated
    using (account_id = auth.uid() and supasheet.has_permission('journal.reflection_sessions:select'));

create policy reflection_sessions_insert on journal.reflection_sessions
    for insert
    to authenticated
    with check (account_id = auth.uid() and supasheet.has_permission('journal.reflection_sessions:insert'));

create policy reflection_sessions_update on journal.reflection_sessions
    for update
    to authenticated
    using (account_id = auth.uid() and supasheet.has_permission('journal.reflection_sessions:update'))
    with check (account_id = auth.uid() and supasheet.has_permission('journal.reflection_sessions:update'));

create policy reflection_sessions_delete on journal.reflection_sessions
    for delete
    to authenticated
    using (account_id = auth.uid() and supasheet.has_permission('journal.reflection_sessions:delete'));

-- Reading/Book Journal
CREATE TABLE journal.reading_entries (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    account_id UUID REFERENCES supasheet.accounts(id) ON DELETE CASCADE,
    journal_entry_id UUID REFERENCES journal.journal_entries(id) ON DELETE SET NULL,
    book_title VARCHAR(300) NOT NULL,
    author VARCHAR(200),
    isbn VARCHAR(20),
    status journal.reading_status DEFAULT 'want_to_read',
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
grant select, insert, update, delete on table journal.reading_entries to authenticated;

alter table journal.reading_entries enable row level security;

create policy reading_entries_select on journal.reading_entries
    for select
    to authenticated
    using (account_id = auth.uid() and supasheet.has_permission('journal.reading_entries:select'));

create policy reading_entries_insert on journal.reading_entries
    for insert
    to authenticated
    with check (account_id = auth.uid() and supasheet.has_permission('journal.reading_entries:insert'));

create policy reading_entries_update on journal.reading_entries
    for update
    to authenticated
    using (account_id = auth.uid() and supasheet.has_permission('journal.reading_entries:update'))
    with check (account_id = auth.uid() and supasheet.has_permission('journal.reading_entries:update'));

create policy reading_entries_delete on journal.reading_entries
    for delete
    to authenticated
    using (account_id = auth.uid() and supasheet.has_permission('journal.reading_entries:delete'));

-- Travel Journal
CREATE TABLE journal.travel_entries (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
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
grant select, insert, update, delete on table journal.travel_entries to authenticated;

alter table journal.travel_entries enable row level security;

create policy travel_entries_select on journal.travel_entries
    for select
    to authenticated
    using (account_id = auth.uid() and supasheet.has_permission('journal.travel_entries:select'));

create policy travel_entries_insert on journal.travel_entries
    for insert
    to authenticated
    with check (account_id = auth.uid() and supasheet.has_permission('journal.travel_entries:insert'));

create policy travel_entries_update on journal.travel_entries
    for update
    to authenticated
    using (account_id = auth.uid() and supasheet.has_permission('journal.travel_entries:update'))
    with check (account_id = auth.uid() and supasheet.has_permission('journal.travel_entries:update'));

create policy travel_entries_delete on journal.travel_entries
    for delete
    to authenticated
    using (account_id = auth.uid() and supasheet.has_permission('journal.travel_entries:delete'));

-- Media Attachments
CREATE TABLE journal.media_attachments (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
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
grant select, insert, update, delete on table journal.media_attachments to authenticated;

alter table journal.media_attachments enable row level security;

create policy media_attachments_select on journal.media_attachments
    for select
    to authenticated
    using (
        exists (
            select 1 from journal.journal_entries je
            where je.id = media_attachments.journal_entry_id
            and je.account_id = auth.uid()
        )
        and supasheet.has_permission('journal.media_attachments:select')
    );

create policy media_attachments_insert on journal.media_attachments
    for insert
    to authenticated
    with check (
        exists (
            select 1 from journal.journal_entries je
            where je.id = media_attachments.journal_entry_id
            and je.account_id = auth.uid()
        )
        and supasheet.has_permission('journal.media_attachments:insert')
    );

create policy media_attachments_update on journal.media_attachments
    for update
    to authenticated
    using (
        exists (
            select 1 from journal.journal_entries je
            where je.id = media_attachments.journal_entry_id
            and je.account_id = auth.uid()
        )
        and supasheet.has_permission('journal.media_attachments:update')
    )
    with check (
        exists (
            select 1 from journal.journal_entries je
            where je.id = media_attachments.journal_entry_id
            and je.account_id = auth.uid()
        )
        and supasheet.has_permission('journal.media_attachments:update')
    );

create policy media_attachments_delete on journal.media_attachments
    for delete
    to authenticated
    using (
        exists (
            select 1 from journal.journal_entries je
            where je.id = media_attachments.journal_entry_id
            and je.account_id = auth.uid()
        )
        and supasheet.has_permission('journal.media_attachments:delete')
    );

-- Journal Statistics/Metrics
CREATE TABLE journal.journal_statistics (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
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

create policy journal_statistics_select on journal.journal_statistics
    for select
    to authenticated
    using (account_id = auth.uid() and supasheet.has_permission('journal.journal_statistics:select'));

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
create or replace view journal.journal_entries_with_details
with (security_invoker = true) as
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

revoke all on journal.journal_entries_with_details from anon, authenticated, service_role;
grant select on journal.journal_entries_with_details to authenticated;

-- Recent journal activity
create or replace view journal.recent_activity
with (security_invoker = true) as
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

revoke all on journal.recent_activity from anon, authenticated, service_role;
grant select on journal.recent_activity to authenticated;

-- Mood trends
create or replace view journal.mood_trends
with (security_invoker = true) as
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

revoke all on journal.mood_trends from anon, authenticated, service_role;
grant select on journal.mood_trends to authenticated;

-- Writing statistics by month
create or replace view journal.monthly_writing_stats
with (security_invoker = true) as
SELECT
    DATE_TRUNC('month', entry_date) as month,
    COUNT(*) as total_entries,
    SUM(word_count) as total_words,
    AVG(word_count) as avg_words_per_entry,
    COUNT(DISTINCT entry_date) as days_journaled
FROM journal.journal_entries
GROUP BY DATE_TRUNC('month', entry_date)
ORDER BY month DESC;

revoke all on journal.monthly_writing_stats from anon, authenticated, service_role;
grant select on journal.monthly_writing_stats to authenticated;

-- Popular tags
create or replace view journal.popular_tags
with (security_invoker = true) as
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

revoke all on journal.popular_tags from anon, authenticated, service_role;
grant select on journal.popular_tags to authenticated;

-- Report Views

-- Journal Report
create or replace view journal.journal_report
with (security_invoker = true) as
select
    a.name as account_name,
    je.title,
    je.content,
    je.entry_date,
    jc.name as category,
    je.mood_rating,
    je.energy_level,
    je.stress_level,
    je.word_count,
    je.tags,
    je.created_at
from journal.journal_entries je
join supasheet.accounts a on je.account_id = a.id
left join journal.journal_categories jc on je.category_id = jc.id
order by je.entry_date desc, je.created_at desc;

revoke all on journal.journal_report from anon, authenticated, service_role;
grant select on journal.journal_report to authenticated;

comment on view journal.journal_report is '{"type": "report", "name": "Journal Report", "description": "Comprehensive journal entries with mood, energy, and word count"}';

-- Mood Report
create or replace view journal.mood_report
with (security_invoker = true) as
select
    me.entry_date,
    me.entry_time,
    me.primary_mood,
    me.mood_intensity,
    me.emotions,
    me.triggers,
    me.coping_strategies,
    je.title as related_entry,
    je.mood_rating as entry_mood_rating
from journal.mood_entries me
left join journal.journal_entries je on me.journal_entry_id = je.id
order by me.entry_date desc, me.entry_time desc;

revoke all on journal.mood_report from anon, authenticated, service_role;
grant select on journal.mood_report to authenticated;

comment on view journal.mood_report is '{"type": "report", "name": "Mood Report", "description": "Detailed mood tracking with emotions, triggers, and coping strategies"}';

-- Dashboard Card Widgets

-- Card 1: Total Entries Count
create or replace view journal.total_entries_count
with (security_invoker = true) as
select
    count(*)::integer as value,
    'book-open' as icon,
    'Total Entries' as label
from journal.journal_entries;

revoke all on journal.total_entries_count from anon, authenticated, service_role;
grant select on journal.total_entries_count to authenticated;

comment on view journal.total_entries_count is '{"type": "dashboard_widget", "name": "Total Entries Count", "description": "Total number of journal entries", "widget_type": "card_1"}';

-- Card 2: Mood Energy Comparison
create or replace view journal.mood_energy_comparison
with (security_invoker = true) as
select
    round(avg(mood_rating), 1)::numeric as primary,
    round(avg(energy_level), 1)::numeric as secondary,
    'Avg Mood' as primary_label,
    'Avg Energy' as secondary_label
from journal.journal_entries
where entry_date >= current_date - interval '30 days'
  and mood_rating is not null
  and energy_level is not null;

revoke all on journal.mood_energy_comparison from anon, authenticated, service_role;
grant select on journal.mood_energy_comparison to authenticated;

comment on view journal.mood_energy_comparison is '{"type": "dashboard_widget", "name": "Mood Energy Comparison", "description": "Comparison of average mood and energy levels (last 30 days)", "widget_type": "card_2"}';

-- Card 3: Writing Streak
create or replace view journal.writing_streak
with (security_invoker = true) as
select
    coalesce(max(streak_days), 0)::integer as value,
    round(
        (count(distinct stat_date) filter (where stat_date >= current_date - interval '30 days')::numeric / 30) * 100,
        1
    ) as percent
from journal.journal_statistics
where stat_date >= current_date - interval '90 days';

revoke all on journal.writing_streak from anon, authenticated, service_role;
grant select on journal.writing_streak to authenticated;

comment on view journal.writing_streak is '{"type": "dashboard_widget", "name": "Writing Streak", "description": "Current writing streak with 30-day consistency percentage", "widget_type": "card_3"}';

-- Card 4: Category Distribution
create or replace view journal.category_distribution
with (security_invoker = true) as
select
    sum(count) filter (where row_num <= 1)::integer as current,
    sum(count)::integer as total,
    jsonb_agg(
        jsonb_build_object(
            'label', coalesce(jc.name, 'Uncategorized'),
            'value', count,
            'color', coalesce(jc.color, '#6b7280')
        )
    ) as segments
from (
    select category_id, count(*)::integer, row_number() over (order by count(*) desc) as row_num
    from journal.journal_entries
    where entry_date >= current_date - interval '90 days'
    group by category_id
    order by count desc
    limit 5
) as category_counts
left join journal.journal_categories jc on category_counts.category_id = jc.id;

revoke all on journal.category_distribution from anon, authenticated, service_role;
grant select on journal.category_distribution to authenticated;

comment on view journal.category_distribution is '{"type": "dashboard_widget", "name": "Category Distribution", "description": "Top 5 categories by entry count (last 90 days)", "widget_type": "card_4"}';

-- Dashboard Table Widgets

-- Table 1: Recent Entries (Simple)
create or replace view journal.recent_entries_simple
with (security_invoker = true) as
select
    to_char(entry_date, 'MM/DD') as date,
    substring(title, 1, 40) || case when length(title) > 40 then '...' else '' end as title,
    mood_rating::text as mood
from journal.journal_entries
order by entry_date desc, created_at desc
limit 10;

revoke all on journal.recent_entries_simple from anon, authenticated, service_role;
grant select on journal.recent_entries_simple to authenticated;

comment on view journal.recent_entries_simple is '{"type": "dashboard_widget", "name": "Recent Entries", "description": "Latest journal entries", "widget_type": "table_1"}';

-- Table 2: Favorite Entries (Simple)
create or replace view journal.favorite_entries_simple
with (security_invoker = true) as
select
    to_char(entry_date, 'MM/DD') as date,
    substring(title, 1, 35) || case when length(title) > 35 then '...' else '' end as title,
    jc.name as category
from journal.journal_entries je
left join journal.journal_categories jc on je.category_id = jc.id
where je.is_favorite = true
order by je.entry_date desc
limit 10;

revoke all on journal.favorite_entries_simple from anon, authenticated, service_role;
grant select on journal.favorite_entries_simple to authenticated;

comment on view journal.favorite_entries_simple is '{"type": "dashboard_widget", "name": "Favorite Entries", "description": "Starred/favorite journal entries", "widget_type": "table_1"}';

-- Table 3: Entry Overview (Detailed)
create or replace view journal.entry_overview_detailed
with (security_invoker = true) as
select
    je.title,
    jc.name as category,
    je.entry_date,
    je.mood_rating,
    je.energy_level,
    je.word_count,
    case
        when je.word_count > 500 then 'Long'
        when je.word_count > 200 then 'Medium'
        else 'Short'
    end as length
from journal.journal_entries je
left join journal.journal_categories jc on je.category_id = jc.id
order by je.entry_date desc, je.created_at desc
limit 15;

revoke all on journal.entry_overview_detailed from anon, authenticated, service_role;
grant select on journal.entry_overview_detailed to authenticated;

comment on view journal.entry_overview_detailed is '{"type": "dashboard_widget", "name": "Entry Overview", "description": "Detailed view of recent journal entries", "widget_type": "table_2"}';

-- Table 4: Gratitude Log (Detailed)
create or replace view journal.gratitude_log_detailed
with (security_invoker = true) as
select
    ge.entry_date,
    substring(ge.gratitude_text, 1, 60) || case when length(ge.gratitude_text) > 60 then '...' else '' end as gratitude,
    ge.category,
    ge.intensity,
    case
        when ge.intensity >= 4 then 'High'
        when ge.intensity = 3 then 'Medium'
        else 'Low'
    end as level
from journal.gratitude_entries ge
order by ge.entry_date desc, ge.created_at desc
limit 15;

revoke all on journal.gratitude_log_detailed from anon, authenticated, service_role;
grant select on journal.gratitude_log_detailed to authenticated;

comment on view journal.gratitude_log_detailed is '{"type": "dashboard_widget", "name": "Gratitude Log", "description": "Recent gratitude entries with intensity", "widget_type": "table_2"}';

-- Chart Views

-- Area Chart: Mood Trend (Last 30 Days)
create or replace view journal.mood_trend_area
with (security_invoker = true) as
select
    to_char(entry_date, 'Mon DD') as date,
    round(avg(mood_rating), 1)::numeric as mood,
    round(avg(energy_level), 1)::numeric as energy,
    round(avg(stress_level), 1)::numeric as stress
from journal.journal_entries
where entry_date >= current_date - interval '30 days'
  and mood_rating is not null
group by entry_date
order by entry_date;

revoke all on journal.mood_trend_area from anon, authenticated, service_role;
grant select on journal.mood_trend_area to authenticated;

comment on view journal.mood_trend_area is '{"type": "chart", "name": "Mood Trend", "description": "Mood, energy, and stress trends over last 30 days", "chart_type": "area"}';

-- Bar Chart: Category Usage
create or replace view journal.category_usage_bar
with (security_invoker = true) as
select
    coalesce(jc.name, 'Uncategorized') as category,
    count(*)::integer as count,
    coalesce(jc.color, '#6b7280') as color
from journal.journal_entries je
left join journal.journal_categories jc on je.category_id = jc.id
where je.entry_date >= current_date - interval '90 days'
group by jc.name, jc.color
order by count desc
limit 10;

revoke all on journal.category_usage_bar from anon, authenticated, service_role;
grant select on journal.category_usage_bar to authenticated;

comment on view journal.category_usage_bar is '{"type": "chart", "name": "Category Usage", "description": "Journal entries by category (last 90 days)", "chart_type": "bar"}';

-- Line Chart: Writing Frequency (Last 12 Weeks)
create or replace view journal.writing_frequency_line
with (security_invoker = true) as
select
    to_char(date_trunc('week', entry_date), 'Mon DD') as week,
    count(*)::integer as entries
from journal.journal_entries
where entry_date >= current_date - interval '12 weeks'
group by date_trunc('week', entry_date)
order by date_trunc('week', entry_date);

revoke all on journal.writing_frequency_line from anon, authenticated, service_role;
grant select on journal.writing_frequency_line to authenticated;

comment on view journal.writing_frequency_line is '{"type": "chart", "name": "Writing Frequency", "description": "Weekly journal entry count over last 12 weeks", "chart_type": "line"}';

-- Pie Chart: Emotion Distribution
create or replace view journal.emotion_distribution_pie
with (security_invoker = true) as
select
    primary_mood as emotion,
    count(*)::integer as count,
    case primary_mood
        when 'happy' then '#10b981'
        when 'sad' then '#3b82f6'
        when 'anxious' then '#ef4444'
        when 'excited' then '#f59e0b'
        when 'calm' then '#8b5cf6'
        else '#6b7280'
    end as color
from journal.mood_entries
where entry_date >= current_date - interval '30 days'
group by primary_mood
order by count desc;

revoke all on journal.emotion_distribution_pie from anon, authenticated, service_role;
grant select on journal.emotion_distribution_pie to authenticated;

comment on view journal.emotion_distribution_pie is '{"type": "chart", "name": "Emotion Distribution", "description": "Primary moods tracked over last 30 days", "chart_type": "pie"}';

-- Radar Chart: Wellness Metrics
create or replace view journal.wellness_metrics_radar
with (security_invoker = true) as
select
    jsonb_build_object(
        'Mood', (
            select round(avg(mood_rating), 1)
            from journal.journal_entries
            where entry_date >= current_date - interval '7 days'
            and mood_rating is not null
        ),
        'Energy', (
            select round(avg(energy_level), 1)
            from journal.journal_entries
            where entry_date >= current_date - interval '7 days'
            and energy_level is not null
        ),
        'Sleep Quality', (
            select round(avg(sleep_quality), 1)
            from journal.journal_entries
            where entry_date >= current_date - interval '7 days'
            and sleep_quality is not null
        ),
        'Stress (Inverted)', (
            select round(10 - avg(stress_level), 1)
            from journal.journal_entries
            where entry_date >= current_date - interval '7 days'
            and stress_level is not null
        ),
        'Writing Consistency', (
            select round(
                (count(distinct entry_date)::numeric / 7) * 10,
                1
            )
            from journal.journal_entries
            where entry_date >= current_date - interval '7 days'
        )
    ) as metrics;

revoke all on journal.wellness_metrics_radar from anon, authenticated, service_role;
grant select on journal.wellness_metrics_radar to authenticated;

comment on view journal.wellness_metrics_radar is '{"type": "chart", "name": "Wellness Metrics", "description": "Multi-dimensional view of wellness indicators (last 7 days)", "chart_type": "radar"}';

-- Table Metadata Comments

comment on table journal.journal_entries is
'{
    "icon": "BookOpen",
    "display": "block",
    "query": {
        "sort": [{"id":"entry_date","desc":true}],
        "filter": [],
        "join": [
            {"table":"journal_categories","on":"category_id","columns":["name","color"]}
        ]
    },
    "items": [
        {"id":"category","name":"By Category","type":"kanban","group":"category_id","title":"title","description":"content","date":"entry_date","badge":"mood_rating"},
        {"id":"mood","name":"By Mood","type":"kanban","group":"mood_rating","title":"title","description":"content","date":"entry_date","badge":"category_id"},
        {"id":"calendar","name":"Calendar View","type":"calendar","title":"title","startDate":"entry_date","endDate":"entry_date","badge":"mood_rating"}
    ]
}';

comment on table journal.mood_entries is
'{
    "icon": "Heart",
    "display": "block",
    "query": {
        "sort": [{"id":"entry_date","desc":true}],
        "filter": [],
        "join": []
    },
    "items": [
        {"id":"mood","name":"By Mood","type":"kanban","group":"primary_mood","title":"primary_mood","description":"notes","date":"entry_date","badge":"mood_intensity"}
    ]
}';

comment on table journal.gratitude_entries is
'{
    "icon": "Smile",
    "display": "block",
    "query": {
        "sort": [{"id":"entry_date","desc":true}],
        "filter": [],
        "join": []
    },
    "items": [
        {"id":"category","name":"By Category","type":"kanban","group":"category","title":"gratitude_text","description":"gratitude_text","date":"entry_date","badge":"intensity"}
    ]
}';

comment on table journal.dream_entries is
'{
    "icon": "Moon",
    "display": "block",
    "query": {
        "sort": [{"id":"dream_date","desc":true}],
        "filter": [],
        "join": []
    },
    "items": [
        {"id":"type","name":"By Type","type":"kanban","group":"dream_type","title":"title","description":"content","date":"dream_date","badge":"vividness"}
    ]
}';

comment on table journal.life_events is
'{
    "icon": "Star",
    "display": "block",
    "query": {
        "sort": [{"id":"event_date","desc":true}],
        "filter": [],
        "join": []
    },
    "items": [
        {"id":"type","name":"By Type","type":"kanban","group":"event_type","title":"title","description":"description","date":"event_date","badge":"significance"},
        {"id":"calendar","name":"Calendar View","type":"calendar","title":"title","startDate":"event_date","endDate":"event_date","badge":"significance"}
    ]
}';

comment on table journal.reflection_sessions is
'{
    "icon": "TrendingUp",
    "display": "block",
    "query": {
        "sort": [{"id":"session_date","desc":true}],
        "filter": [],
        "join": []
    },
    "items": [
        {"id":"type","name":"By Type","type":"kanban","group":"session_type","title":"session_type","description":"highlights","date":"session_date","badge":"overall_satisfaction"}
    ]
}';

comment on table journal.reading_entries is
'{
    "icon": "Book",
    "display": "block",
    "query": {
        "sort": [{"id":"created_at","desc":true}],
        "filter": [],
        "join": []
    },
    "items": [
        {"id":"status","name":"By Status","type":"kanban","group":"status","title":"book_title","description":"author","date":"start_date","badge":"rating"}
    ]
}';

comment on table journal.travel_entries is
'{
    "icon": "Map",
    "display": "block",
    "query": {
        "sort": [{"id":"trip_start_date","desc":true}],
        "filter": [],
        "join": []
    },
    "items": [
        {"id":"type","name":"By Type","type":"kanban","group":"trip_type","title":"destination","description":"favorite_moments","date":"trip_start_date","badge":"overall_rating"},
        {"id":"calendar","name":"Calendar View","type":"calendar","title":"destination","startDate":"trip_start_date","endDate":"trip_end_date","badge":"overall_rating"}
    ]
}';

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

-- Audit Triggers

-- Journal Entries audit triggers
create trigger audit_journal_entries_insert
    after insert
    on journal.journal_entries
    for each row
execute function supasheet.audit_trigger_function();

create trigger audit_journal_entries_update
    after update
    on journal.journal_entries
    for each row
execute function supasheet.audit_trigger_function();

create trigger audit_journal_entries_delete
    before delete
    on journal.journal_entries
    for each row
execute function supasheet.audit_trigger_function();

-- Mood Entries audit triggers
create trigger audit_mood_entries_insert
    after insert
    on journal.mood_entries
    for each row
execute function supasheet.audit_trigger_function();

create trigger audit_mood_entries_update
    after update
    on journal.mood_entries
    for each row
execute function supasheet.audit_trigger_function();

create trigger audit_mood_entries_delete
    before delete
    on journal.mood_entries
    for each row
execute function supasheet.audit_trigger_function();

-- Gratitude Entries audit triggers
create trigger audit_gratitude_entries_insert
    after insert
    on journal.gratitude_entries
    for each row
execute function supasheet.audit_trigger_function();

create trigger audit_gratitude_entries_update
    after update
    on journal.gratitude_entries
    for each row
execute function supasheet.audit_trigger_function();

create trigger audit_gratitude_entries_delete
    before delete
    on journal.gratitude_entries
    for each row
execute function supasheet.audit_trigger_function();

-- Life Events audit triggers
create trigger audit_life_events_insert
    after insert
    on journal.life_events
    for each row
execute function supasheet.audit_trigger_function();

create trigger audit_life_events_update
    after update
    on journal.life_events
    for each row
execute function supasheet.audit_trigger_function();

create trigger audit_life_events_delete
    before delete
    on journal.life_events
    for each row
execute function supasheet.audit_trigger_function();

-- Reflection Sessions audit triggers
create trigger audit_reflection_sessions_insert
    after insert
    on journal.reflection_sessions
    for each row
execute function supasheet.audit_trigger_function();

create trigger audit_reflection_sessions_update
    after update
    on journal.reflection_sessions
    for each row
execute function supasheet.audit_trigger_function();

create trigger audit_reflection_sessions_delete
    before delete
    on journal.reflection_sessions
    for each row
execute function supasheet.audit_trigger_function();


-- Grant permissions to user role
insert into supasheet.role_permissions (role, permission) values ('user', 'journal.journal_categories:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'journal.journal_categories:insert');
insert into supasheet.role_permissions (role, permission) values ('user', 'journal.journal_categories:update');
insert into supasheet.role_permissions (role, permission) values ('user', 'journal.journal_categories:delete');

insert into supasheet.role_permissions (role, permission) values ('user', 'journal.journal_entries:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'journal.journal_entries:insert');
insert into supasheet.role_permissions (role, permission) values ('user', 'journal.journal_entries:update');
insert into supasheet.role_permissions (role, permission) values ('user', 'journal.journal_entries:delete');

insert into supasheet.role_permissions (role, permission) values ('user', 'journal.mood_entries:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'journal.mood_entries:insert');
insert into supasheet.role_permissions (role, permission) values ('user', 'journal.mood_entries:update');
insert into supasheet.role_permissions (role, permission) values ('user', 'journal.mood_entries:delete');

insert into supasheet.role_permissions (role, permission) values ('user', 'journal.gratitude_entries:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'journal.gratitude_entries:insert');
insert into supasheet.role_permissions (role, permission) values ('user', 'journal.gratitude_entries:update');
insert into supasheet.role_permissions (role, permission) values ('user', 'journal.gratitude_entries:delete');

insert into supasheet.role_permissions (role, permission) values ('user', 'journal.dream_entries:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'journal.dream_entries:insert');
insert into supasheet.role_permissions (role, permission) values ('user', 'journal.dream_entries:update');
insert into supasheet.role_permissions (role, permission) values ('user', 'journal.dream_entries:delete');

insert into supasheet.role_permissions (role, permission) values ('user', 'journal.journal_prompts:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'journal.journal_prompts:insert');
insert into supasheet.role_permissions (role, permission) values ('user', 'journal.journal_prompts:update');
insert into supasheet.role_permissions (role, permission) values ('user', 'journal.journal_prompts:delete');

insert into supasheet.role_permissions (role, permission) values ('user', 'journal.prompt_responses:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'journal.prompt_responses:insert');
insert into supasheet.role_permissions (role, permission) values ('user', 'journal.prompt_responses:update');
insert into supasheet.role_permissions (role, permission) values ('user', 'journal.prompt_responses:delete');

insert into supasheet.role_permissions (role, permission) values ('user', 'journal.daily_activities:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'journal.daily_activities:insert');
insert into supasheet.role_permissions (role, permission) values ('user', 'journal.daily_activities:update');
insert into supasheet.role_permissions (role, permission) values ('user', 'journal.daily_activities:delete');

insert into supasheet.role_permissions (role, permission) values ('user', 'journal.life_events:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'journal.life_events:insert');
insert into supasheet.role_permissions (role, permission) values ('user', 'journal.life_events:update');
insert into supasheet.role_permissions (role, permission) values ('user', 'journal.life_events:delete');

insert into supasheet.role_permissions (role, permission) values ('user', 'journal.reflection_sessions:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'journal.reflection_sessions:insert');
insert into supasheet.role_permissions (role, permission) values ('user', 'journal.reflection_sessions:update');
insert into supasheet.role_permissions (role, permission) values ('user', 'journal.reflection_sessions:delete');

insert into supasheet.role_permissions (role, permission) values ('user', 'journal.reading_entries:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'journal.reading_entries:insert');
insert into supasheet.role_permissions (role, permission) values ('user', 'journal.reading_entries:update');
insert into supasheet.role_permissions (role, permission) values ('user', 'journal.reading_entries:delete');

insert into supasheet.role_permissions (role, permission) values ('user', 'journal.travel_entries:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'journal.travel_entries:insert');
insert into supasheet.role_permissions (role, permission) values ('user', 'journal.travel_entries:update');
insert into supasheet.role_permissions (role, permission) values ('user', 'journal.travel_entries:delete');

insert into supasheet.role_permissions (role, permission) values ('user', 'journal.media_attachments:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'journal.media_attachments:insert');
insert into supasheet.role_permissions (role, permission) values ('user', 'journal.media_attachments:update');
insert into supasheet.role_permissions (role, permission) values ('user', 'journal.media_attachments:delete');

insert into supasheet.role_permissions (role, permission) values ('user', 'journal.journal_statistics:select');

insert into supasheet.role_permissions (role, permission) values ('user', 'journal.journal_entries_with_details:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'journal.recent_activity:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'journal.mood_trends:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'journal.monthly_writing_stats:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'journal.popular_tags:select');

-- Grant permissions for report views
insert into supasheet.role_permissions (role, permission) values ('user', 'journal.journal_report:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'journal.mood_report:select');

-- Grant permissions for dashboard widget views
insert into supasheet.role_permissions (role, permission) values ('user', 'journal.total_entries_count:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'journal.mood_energy_comparison:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'journal.writing_streak:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'journal.category_distribution:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'journal.recent_entries_simple:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'journal.favorite_entries_simple:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'journal.entry_overview_detailed:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'journal.gratitude_log_detailed:select');

-- Grant permissions for chart views
insert into supasheet.role_permissions (role, permission) values ('user', 'journal.mood_trend_area:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'journal.category_usage_bar:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'journal.writing_frequency_line:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'journal.emotion_distribution_pie:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'journal.wellness_metrics_radar:select');

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