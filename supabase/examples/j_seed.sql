-- Journal Schema Seed Data
-- This file contains seed data for all journal schema tables except journal_categories and journal_prompts
-- which are already seeded in the migration file

DO $$
DECLARE
    -- Account IDs - using specific UUIDs
    account1 UUID := 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4';
    account2 UUID := 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4';
    account3 UUID := 'b73eb03e-fb7a-424d-84ff-18e2791ce0b1';
    
    -- Category IDs
    daily_life_cat_id INTEGER;
    gratitude_cat_id INTEGER;
    dreams_cat_id INTEGER;
    goals_cat_id INTEGER;
    travel_cat_id INTEGER;
    reading_cat_id INTEGER;
    work_cat_id INTEGER;
    relationships_cat_id INTEGER;
    health_cat_id INTEGER;
    creative_cat_id INTEGER;
    
    -- Journal Entry IDs for relationships
    entry1 UUID;
    entry2 UUID;
    entry3 UUID;
    entry4 UUID;
    entry5 UUID;
    entry6 UUID;
    entry7 UUID;
    entry8 UUID;
    entry9 UUID;
    entry10 UUID;
    
    -- Prompt IDs
    prompt1 UUID;
    prompt2 UUID;
    prompt3 UUID;
BEGIN
    -- Account IDs are already hardcoded above
    
    -- Get category IDs
    SELECT id INTO daily_life_cat_id FROM journal.journal_categories WHERE name = 'Daily Life';
    SELECT id INTO gratitude_cat_id FROM journal.journal_categories WHERE name = 'Gratitude';
    SELECT id INTO dreams_cat_id FROM journal.journal_categories WHERE name = 'Dreams';
    SELECT id INTO goals_cat_id FROM journal.journal_categories WHERE name = 'Goals & Reflection';
    SELECT id INTO travel_cat_id FROM journal.journal_categories WHERE name = 'Travel';
    SELECT id INTO reading_cat_id FROM journal.journal_categories WHERE name = 'Reading';
    SELECT id INTO work_cat_id FROM journal.journal_categories WHERE name = 'Work & Career';
    SELECT id INTO relationships_cat_id FROM journal.journal_categories WHERE name = 'Relationships';
    SELECT id INTO health_cat_id FROM journal.journal_categories WHERE name = 'Health & Wellness';
    SELECT id INTO creative_cat_id FROM journal.journal_categories WHERE name = 'Creative';
    
    -- Get some prompt IDs
    SELECT id INTO prompt1 FROM journal.journal_prompts WHERE title = 'Daily Reflection';
    SELECT id INTO prompt2 FROM journal.journal_prompts WHERE title = 'Gratitude Practice';
    SELECT id INTO prompt3 FROM journal.journal_prompts WHERE title = 'Future Self';
    
    -- ==========================================
    -- JOURNAL ENTRIES (20 entries across 3 users)
    -- ==========================================
    
    -- User 1 entries (8 entries)
    INSERT INTO journal.journal_entries 
    (id, account_id, title, content, entry_date, category_id, mood_rating, energy_level, stress_level, sleep_quality, weather, location, tags, is_favorite)
    VALUES
    (gen_random_uuid(), account1, 'Morning Meditation Breakthrough', 
     'Had an incredible meditation session this morning. For the first time in months, I managed to quiet my mind completely for about 10 minutes. The sense of peace and clarity that followed has stayed with me throughout the morning. I noticed how much easier it was to focus on tasks and how patient I felt with everything. Need to make this a daily habit.',
     current_date - interval '15 days', health_cat_id, 9, 8, 3, 8, 'Sunny', 'Home - Meditation Room', 
     ARRAY['meditation', 'mindfulness', 'breakthrough', 'mental-health'], true)
    RETURNING id INTO entry1;
    
    INSERT INTO journal.journal_entries 
    (id, account_id, title, content, entry_date, category_id, mood_rating, energy_level, stress_level, sleep_quality, weather, location, tags)
    VALUES
    (gen_random_uuid(), account1, 'Quarterly Review Thoughts', 
     'Just finished my Q3 review at work. The feedback was mostly positive, but there are definitely areas where I need to improve. My manager mentioned that while my technical skills are strong, I need to work on my presentation skills and stakeholder communication. It''s tough to hear, but I know it''s true. I tend to get too technical and lose people. Going to sign up for that public speaking course next month.',
     current_date - interval '28 days', work_cat_id, 6, 5, 7, 6, 'Cloudy', 'Office', 
     ARRAY['work', 'review', 'feedback', 'growth', 'professional-development'])
    RETURNING id INTO entry2;
    
    INSERT INTO journal.journal_entries 
    (id, account_id, title, content, entry_date, category_id, mood_rating, energy_level, stress_level, sleep_quality, weather, location, tags, is_favorite)
    VALUES
    (gen_random_uuid(), account1, 'Family Reunion Weekend', 
     'What an amazing weekend! Haven''t seen some of these cousins in over 5 years. We spent hours sharing stories, playing games, and just enjoying each other''s company. Grandma was in her element, cooking for everyone and telling embarrassing stories from when we were kids. These are the moments that really matter. Made me realize how much I''ve been prioritizing work over family lately. Need to change that.',
     current_date - interval '25 days', relationships_cat_id, 9, 9, 2, 7, 'Partly Cloudy', 'Grandma''s House', 
     ARRAY['family', 'reunion', 'joy', 'connections', 'memories'], true)
    RETURNING id INTO entry3;
    
    INSERT INTO journal.journal_entries 
    (id, account_id, title, content, entry_date, category_id, mood_rating, energy_level, stress_level, sleep_quality, weather, location, tags)
    VALUES
    (gen_random_uuid(), account1, 'Struggling with Project Deadline', 
     'The project that was supposed to be straightforward has turned into a nightmare. We keep discovering new requirements, and the client keeps changing their mind. I''m working 12-hour days trying to keep up, and I can feel the burnout creeping in. Need to have a serious conversation with my manager about realistic timelines and scope creep. Can''t keep doing this.',
     current_date - interval '20 days', work_cat_id, 4, 3, 9, 4, 'Rainy', 'Home Office', 
     ARRAY['work', 'stress', 'burnout', 'project-management', 'challenges']);
    
    INSERT INTO journal.journal_entries 
    (id, account_id, title, content, entry_date, category_id, mood_rating, energy_level, stress_level, sleep_quality, weather, location, tags)
    VALUES
    (gen_random_uuid(), account1, 'Started Learning Spanish', 
     'Finally took the plunge and signed up for Spanish classes! Had my first lesson today. It''s challenging but exciting. The teacher is patient and encouraging. We learned basic greetings and introductions. I can now say "Hola, me llamo..." with confidence! Planning to practice 30 minutes every day. This has been on my bucket list for years.',
     current_date - interval '15 days', goals_cat_id, 8, 7, 4, 7, 'Sunny', 'Language School', 
     ARRAY['learning', 'spanish', 'languages', 'goals', 'new-skills'])
    RETURNING id INTO entry4;
    
    INSERT INTO journal.journal_entries 
    (id, account_id, title, content, entry_date, category_id, mood_rating, energy_level, stress_level, sleep_quality, weather, location, tags)
    VALUES
    (gen_random_uuid(), account1, 'Cooking Disaster Turned Success', 
     'Attempted to make homemade pasta for the first time. The kitchen looked like a flour bomb had gone off! The first batch was too thick, the second too thin. But the third batch... perfection! Served it with a simple tomato sauce and fresh basil from the garden. Even though it took 3 hours and made a huge mess, the satisfaction of making something from scratch was worth it.',
     current_date - interval '10 days', creative_cat_id, 7, 6, 3, 8, 'Clear', 'Home - Kitchen', 
     ARRAY['cooking', 'pasta', 'creativity', 'learning', 'accomplishment']);
    
    INSERT INTO journal.journal_entries 
    (id, account_id, title, content, entry_date, category_id, mood_rating, energy_level, stress_level, sleep_quality, weather, location, tags)
    VALUES
    (gen_random_uuid(), account1, 'Reflecting on the Past Month', 
     'As I look back on the past month, I see a pattern of ups and downs. Work has been overwhelming, but I''ve also had some beautiful moments with family and started pursuing personal goals. I''m learning that balance isn''t about having everything perfect all the time - it''s about making conscious choices about what matters most in each moment. Tomorrow starts a new month, and I''m ready for it.',
     current_date - interval '5 days', goals_cat_id, 7, 6, 5, 7, 'Cloudy', 'Home - Study', 
     ARRAY['reflection', 'balance', 'growth', 'monthly-review', 'insights'])
    RETURNING id INTO entry5;
    
    INSERT INTO journal.journal_entries 
    (id, account_id, title, content, entry_date, category_id, mood_rating, energy_level, stress_level, sleep_quality, weather, location, tags, is_favorite)
    VALUES
    (gen_random_uuid(), account1, 'Perfect Autumn Day', 
     'Today was one of those perfect autumn days. Went for a long walk in the park, leaves crunching underfoot, crisp air, golden sunlight filtering through the trees. Stopped at the farmer''s market and got fresh apples and pumpkin bread. Came home and read by the window with a cup of tea. Sometimes the simplest days are the most memorable.',
     current_date - interval '2 days', daily_life_cat_id, 9, 8, 2, 9, 'Clear and Crisp', 'City Park', 
     ARRAY['autumn', 'nature', 'simple-pleasures', 'mindfulness', 'gratitude'], true);
    
    -- User 2 entries (7 entries)
    INSERT INTO journal.journal_entries 
    (id, account_id, title, content, entry_date, category_id, mood_rating, energy_level, stress_level, sleep_quality, weather, location, tags)
    VALUES
    (gen_random_uuid(), account2, 'Marathon Training Week 1', 
     'Started my marathon training program today! Ran 5 miles at an easy pace. My legs feel good, but I know the real challenge is ahead. Following a 16-week program that gradually builds up the mileage. Also started tracking my nutrition more carefully - need to fuel properly for these longer runs. Excited and nervous about this journey!',
     current_date - interval '17 days', health_cat_id, 8, 9, 4, 8, 'Perfect Running Weather', 'Riverside Trail', 
     ARRAY['running', 'marathon', 'fitness', 'training', 'goals'])
    RETURNING id INTO entry6;
    
    INSERT INTO journal.journal_entries 
    (id, account_id, title, content, entry_date, category_id, mood_rating, energy_level, stress_level, sleep_quality, weather, location, tags)
    VALUES
    (gen_random_uuid(), account2, 'Dad''s Birthday Celebration', 
     'Organized a surprise party for dad''s 60th birthday. Seeing his face when he walked in and saw everyone was priceless. We had people fly in from different states. Mom cried happy tears. We shared stories, looked through old photo albums, and dad gave a speech that had everyone tearing up. These are the moments that make life beautiful.',
     current_date - interval '22 days', relationships_cat_id, 9, 7, 3, 6, 'Warm Evening', 'Parents'' House', 
     ARRAY['family', 'celebration', 'birthday', 'love', 'memories']);
    
    INSERT INTO journal.journal_entries 
    (id, account_id, title, content, entry_date, category_id, mood_rating, energy_level, stress_level, sleep_quality, weather, location, tags)
    VALUES
    (gen_random_uuid(), account2, 'Career Crossroads', 
     'Got a job offer from a startup today. The role is exciting, the team seems great, but it would mean leaving my stable job of 5 years. The startup offers more growth potential and equity, but less stability. I have a week to decide. Made a pros and cons list but still can''t decide. Maybe the fact that I''m excited about it is my answer?',
     current_date - interval '18 days', work_cat_id, 6, 5, 8, 5, 'Overcast', 'Coffee Shop', 
     ARRAY['career', 'decisions', 'opportunity', 'change', 'uncertainty'])
    RETURNING id INTO entry7;
    
    INSERT INTO journal.journal_entries 
    (id, account_id, title, content, entry_date, category_id, mood_rating, energy_level, stress_level, sleep_quality, weather, location, tags)
    VALUES
    (gen_random_uuid(), account2, 'Painting After Years', 
     'Picked up a paintbrush for the first time in probably 10 years. Just started with abstract colors and shapes, no plan, no pressure. It felt incredibly liberating to create without worrying about the outcome. The painting isn''t "good" by any objective standard, but it''s mine, and it represents two hours of pure creative flow. Going to make this a weekly practice.',
     current_date - interval '12 days', creative_cat_id, 8, 7, 3, 7, 'Sunny', 'Home - Spare Room', 
     ARRAY['art', 'painting', 'creativity', 'flow', 'self-expression']);
    
    INSERT INTO journal.journal_entries 
    (id, account_id, title, content, entry_date, category_id, mood_rating, energy_level, stress_level, sleep_quality, weather, location, tags)
    VALUES
    (gen_random_uuid(), account2, 'Dealing with Anxiety', 
     'Had a panic attack at the grocery store today. Haven''t had one in months and thought I was past this. The breathing exercises helped, but it still took me 20 minutes in the car to calm down completely. Reminder that healing isn''t linear. Going to schedule an appointment with my therapist and get back to daily meditation.',
     current_date - interval '8 days', health_cat_id, 4, 3, 9, 4, 'Humid', 'Grocery Store Parking Lot', 
     ARRAY['anxiety', 'mental-health', 'panic-attack', 'healing', 'self-care']);
    
    INSERT INTO journal.journal_entries 
    (id, account_id, title, content, entry_date, category_id, mood_rating, energy_level, stress_level, sleep_quality, weather, location, tags, is_favorite)
    VALUES
    (gen_random_uuid(), account2, 'Accepted the Startup Job!', 
     'I did it! Accepted the offer from the startup. Gave notice at my current job today. My manager was supportive and said the door is always open if I want to come back. I''m terrified and exhilarated at the same time. This is the kind of risk I wouldn''t have taken 5 years ago. Growth happens outside the comfort zone, right?',
     current_date - interval '3 days', work_cat_id, 9, 8, 6, 6, 'Bright and Clear', 'New Office Visit', 
     ARRAY['career', 'new-job', 'risk', 'growth', 'excitement', 'change'], true)
    RETURNING id INTO entry8;
    
    INSERT INTO journal.journal_entries 
    (id, account_id, title, content, entry_date, category_id, mood_rating, energy_level, stress_level, sleep_quality, weather, location, tags)
    VALUES
    (gen_random_uuid(), account2, 'Sunday Gratitude List', 
     'Taking a moment to appreciate the good things: 1) My health and ability to run, 2) Parents who are still here and healthy, 3) The courage to make big career changes, 4) Friends who check in when I''m struggling, 5) Access to therapy and mental health resources, 6) A warm home, 7) The ability to pursue creative hobbies, 8) Good coffee, 9) Sunny Sunday mornings, 10) This journal that helps me process everything.',
     current_date - interval '1 day', gratitude_cat_id, 8, 7, 3, 8, 'Sunny', 'Home - Living Room', 
     ARRAY['gratitude', 'appreciation', 'mindfulness', 'sunday', 'reflection']);
    
    -- User 3 entries (5 entries)
    INSERT INTO journal.journal_entries 
    (id, account_id, title, content, entry_date, category_id, mood_rating, energy_level, stress_level, sleep_quality, weather, location, tags)
    VALUES
    (gen_random_uuid(), account3, 'Back from Japan Trip', 
     'Just returned from 2 weeks in Japan. My mind is still processing everything - the temples in Kyoto, the bustle of Tokyo, the peace of Mt. Fuji, the incredible food, the kindness of strangers who helped despite the language barrier. Traveled solo for the first time and discovered I''m braver than I thought. Already planning my next adventure.',
     current_date - interval '20 days', travel_cat_id, 9, 6, 2, 5, 'Jet-lagged Weather', 'Home', 
     ARRAY['travel', 'japan', 'adventure', 'solo-travel', 'growth', 'culture'])
    RETURNING id INTO entry9;
    
    INSERT INTO journal.journal_entries 
    (id, account_id, title, content, entry_date, category_id, mood_rating, energy_level, stress_level, sleep_quality, weather, location, tags)
    VALUES
    (gen_random_uuid(), account3, 'Finished "Atomic Habits"', 
     'Just finished reading Atomic Habits by James Clear. The concept of 1% improvements really resonates with me. Started implementing some of the strategies - habit stacking has been particularly effective. I now do 10 pushups every time I make coffee. Small change, but I can already feel the difference. The book''s emphasis on systems over goals is a game-changer.',
     current_date - interval '15 days', reading_cat_id, 7, 6, 4, 7, 'Cloudy', 'Home - Reading Nook', 
     ARRAY['reading', 'books', 'self-improvement', 'habits', 'learning'])
    RETURNING id INTO entry10;
    
    INSERT INTO journal.journal_entries 
    (id, account_id, title, content, entry_date, category_id, mood_rating, energy_level, stress_level, sleep_quality, weather, location, tags)
    VALUES
    (gen_random_uuid(), account3, 'Relationship Milestone', 
     'Today marks 3 years with Sarah. We celebrated quietly - cooked dinner together, looked through photos from our adventures, talked about our dreams for the future. No grand gestures, just genuine connection and appreciation for what we''ve built together. Through all the ups and downs, we''ve learned to communicate better, support each other''s growth, and laugh together daily.',
     current_date - interval '14 days', relationships_cat_id, 9, 7, 2, 8, 'Beautiful Sunset', 'Our Apartment', 
     ARRAY['relationship', 'anniversary', 'love', 'gratitude', 'partnership']);
    
    INSERT INTO journal.journal_entries 
    (id, account_id, title, content, entry_date, category_id, mood_rating, energy_level, stress_level, sleep_quality, weather, location, tags)
    VALUES
    (gen_random_uuid(), account3, 'Gardening Success!', 
     'My tomatoes are finally ripening! After months of careful tending, watering, and worry, I have actual, edible tomatoes. Made a caprese salad with them tonight - the taste difference from store-bought is incredible. There''s something deeply satisfying about growing your own food. Already planning next year''s garden expansion.',
     current_date - interval '7 days', daily_life_cat_id, 8, 7, 3, 7, 'Warm and Sunny', 'Backyard Garden', 
     ARRAY['gardening', 'accomplishment', 'food', 'nature', 'patience']);
    
    INSERT INTO journal.journal_entries 
    (id, account_id, title, content, entry_date, category_id, mood_rating, energy_level, stress_level, sleep_quality, weather, location, tags, is_favorite)
    VALUES
    (gen_random_uuid(), account3, 'Letter to Future Me', 
     'Dear Future Me (reading this in 2025), I hope you remember this moment of clarity. Right now, at this exact moment, life feels balanced. Not perfect, but balanced. You''ve learned to accept imperfection, to find joy in small moments, to prioritize what truly matters. If you''re reading this during a tough time, remember: you''ve overcome every challenge so far. If you''re reading this during a good time, remember to appreciate it fully. Either way, keep growing, keep loving, keep writing.',
     current_date, goals_cat_id, 8, 7, 3, 8, 'New Day', 'Writing Desk', 
     ARRAY['future-self', 'reflection', 'wisdom', 'perspective', 'time-capsule'], true);
    
    -- ==========================================
    -- MOOD ENTRIES (15 entries)
    -- ==========================================
    INSERT INTO journal.mood_entries 
    (account_id, journal_entry_id, entry_date, entry_time, primary_mood, mood_intensity, emotions, triggers, coping_strategies, notes)
    VALUES
    (account1, entry1, current_date - interval '15 days', '08:00:00', 'peaceful', 9, 
     ARRAY['calm', 'centered', 'grateful'], 
     ARRAY['meditation', 'good sleep', 'morning quiet'],
     ARRAY['deep breathing', 'mindfulness', 'journaling'],
     'Best meditation session in months'),
    
    (account1, entry2, current_date - interval '28 days', '18:30:00', 'anxious', 6,
     ARRAY['worried', 'self-doubt', 'motivated'],
     ARRAY['work review', 'feedback', 'imposter syndrome'],
     ARRAY['talking to partner', 'making action plan', 'exercise'],
     'Review was actually mostly positive, anxiety was anticipatory'),
    
    (account1, entry3, current_date - interval '25 days', '20:00:00', 'joyful', 9,
     ARRAY['happy', 'loved', 'nostalgic', 'connected'],
     ARRAY['family gathering', 'shared memories', 'laughter'],
     ARRAY['being present', 'expressing gratitude'],
     'These are the moments that matter most'),
    
    (account1, NULL, current_date - interval '23 days', '14:00:00', 'stressed', 8,
     ARRAY['overwhelmed', 'frustrated', 'exhausted'],
     ARRAY['work deadlines', 'lack of sleep', 'too many commitments'],
     ARRAY['time blocking', 'saying no', 'asking for help'],
     'Need to set better boundaries'),
    
    (account1, entry5, current_date - interval '5 days', '21:00:00', 'contemplative', 7,
     ARRAY['thoughtful', 'hopeful', 'determined'],
     ARRAY['monthly reflection', 'goal review', 'progress check'],
     ARRAY['journaling', 'planning', 'visualization'],
     'Good month overall despite challenges'),
    
    (account2, entry6, current_date - interval '17 days', '06:00:00', 'excited', 9,
     ARRAY['energized', 'determined', 'optimistic'],
     ARRAY['new goal', 'physical activity', 'challenge accepted'],
     ARRAY['training plan', 'community support', 'tracking progress'],
     'Marathon training begins!'),
    
    (account2, NULL, current_date - interval '20 days', '15:00:00', 'content', 6,
     ARRAY['satisfied', 'calm', 'balanced'],
     ARRAY['productive day', 'tasks completed', 'time for self'],
     ARRAY['routine', 'breaks', 'boundaries'],
     'Finding my rhythm'),
    
    (account2, entry7, current_date - interval '18 days', '22:00:00', 'uncertain', 7,
     ARRAY['confused', 'excited', 'nervous'],
     ARRAY['big decision', 'career change', 'opportunity'],
     ARRAY['pro/con lists', 'talking to mentors', 'meditation'],
     'Big decisions require time and reflection'),
    
    (account2, NULL, current_date - interval '8 days', '13:00:00', 'anxious', 9,
     ARRAY['panicked', 'scared', 'frustrated'],
     ARRAY['crowded space', 'unexpected trigger', 'sensory overload'],
     ARRAY['breathing exercises', 'grounding techniques', 'safe space'],
     'Setback but not failure - healing isn''t linear'),
    
    (account2, entry8, current_date - interval '3 days', '19:00:00', 'exhilarated', 9,
     ARRAY['brave', 'proud', 'nervous', 'alive'],
     ARRAY['taking risk', 'making change', 'growth opportunity'],
     ARRAY['support system', 'self-belief', 'preparation'],
     'Jumped and hoping the net appears!'),
    
    (account3, entry9, current_date - interval '20 days', '11:00:00', 'accomplished', 9,
     ARRAY['proud', 'inspired', 'grateful', 'tired'],
     ARRAY['travel return', 'adventure completed', 'goals achieved'],
     ARRAY['rest', 'photo organizing', 'sharing stories'],
     'Life-changing experience'),
    
    (account3, NULL, current_date - interval '25 days', '07:30:00', 'motivated', 7,
     ARRAY['focused', 'energized', 'optimistic'],
     ARRAY['morning routine', 'good sleep', 'clear goals'],
     ARRAY['exercise', 'healthy breakfast', 'planning'],
     'Starting the day right makes all the difference'),
    
    (account3, entry10, current_date - interval '14 days', '20:30:00', 'loved', 9,
     ARRAY['grateful', 'secure', 'happy', 'peaceful'],
     ARRAY['anniversary', 'quality time', 'deep conversation'],
     ARRAY['presence', 'appreciation', 'communication'],
     'Three years of growth together'),
    
    (account3, NULL, current_date - interval '4 days', '16:00:00', 'frustrated', 5,
     ARRAY['annoyed', 'disappointed', 'tired'],
     ARRAY['technology issues', 'lost work', 'time wasted'],
     ARRAY['backup systems', 'breaks', 'perspective'],
     'Remember to save work frequently!'),
    
    (account3, NULL, current_date, '09:00:00', 'hopeful', 8,
     ARRAY['optimistic', 'peaceful', 'ready'],
     ARRAY['new day', 'fresh start', 'possibilities'],
     ARRAY['morning routine', 'intention setting', 'gratitude'],
     'Each day is a new opportunity');
    
    -- ==========================================
    -- GRATITUDE ENTRIES (20 entries)
    -- ==========================================
    INSERT INTO journal.gratitude_entries 
    (account_id, journal_entry_id, entry_date, gratitude_text, category, intensity)
    VALUES
    (account1, entry1, current_date - interval '15 days', 'The ability to find peace within myself through meditation', 'health', 5),
    (account1, entry3, current_date - interval '25 days', 'My wonderful extended family and the love we share', 'relationships', 5),
    (account1, NULL, current_date - interval '24 days', 'A stable job that provides for my needs', 'opportunities', 4),
    (account1, NULL, current_date - interval '20 days', 'My manager who understands when I need flexibility', 'relationships', 4),
    (account1, entry5, current_date - interval '5 days', 'The growth and learning from this past month', 'opportunities', 4),
    (account1, NULL, current_date - interval '3 days', 'Access to fresh, healthy food', 'health', 3),
    (account1, NULL, current_date - interval '1 day', 'A warm, safe home to return to each day', 'opportunities', 5),
    
    (account2, entry6, current_date - interval '17 days', 'My body''s ability to run and train for a marathon', 'health', 5),
    (account2, NULL, current_date - interval '15 days', 'Supportive friends who encourage my goals', 'relationships', 4),
    (account2, NULL, current_date - interval '22 days', 'Parents who are still healthy and active', 'relationships', 5),
    (account2, NULL, current_date - interval '15 days', 'The opportunity to choose between job offers', 'opportunities', 4),
    (account2, NULL, current_date - interval '10 days', 'Access to mental health support when needed', 'health', 5),
    (account2, entry8, current_date - interval '3 days', 'The courage to take risks and embrace change', 'opportunities', 5),
    (account2, NULL, current_date - interval '1 day', 'Sunday mornings with nowhere to be', 'health', 3),
    
    (account3, entry9, current_date - interval '20 days', 'The privilege to travel and explore the world', 'opportunities', 5),
    (account3, NULL, current_date - interval '15 days', 'Books that expand my mind and perspective', 'opportunities', 4),
    (account3, NULL, current_date - interval '20 days', 'A partner who supports and loves me', 'relationships', 5),
    (account3, entry10, current_date - interval '14 days', 'Three years of love and growth with Sarah', 'relationships', 5),
    (account3, NULL, current_date - interval '7 days', 'The satisfaction of growing my own food', 'health', 4),
    (account3, NULL, current_date, 'This moment of clarity and balance in life', 'health', 4);
    
    -- ==========================================
    -- DREAM ENTRIES (8 entries)
    -- ==========================================
    INSERT INTO journal.dream_entries 
    (account_id, journal_entry_id, dream_date, title, content, dream_type, vividness, emotional_tone, 
     recurring_elements, people_involved, locations, symbols, interpretation)
    VALUES
    (account1, NULL, current_date - interval '29 days', 'Flying Over the Ocean',
     'I was flying over a vast blue ocean, no plane, just me with wings. The water was crystal clear and I could see dolphins jumping below. Felt completely free and weightless. Suddenly realized I could control my direction with thoughts.',
     'lucid', 9, 'positive',
     ARRAY['flying', 'ocean', 'freedom'],
     ARRAY['none - was alone'],
     ARRAY['endless ocean', 'clear sky'],
     ARRAY['wings', 'dolphins', 'blue water'],
     'Possibly representing desire for freedom and escape from work stress'),
    
    (account1, NULL, current_date - interval '15 days', 'The Endless Library',
     'Found myself in a library that seemed to go on forever. Books were flying off shelves and rearranging themselves. I was searching for a specific book but couldn''t remember its title. An old librarian kept pointing in different directions.',
     'symbolic', 7, 'neutral',
     ARRAY['searching', 'books', 'confusion'],
     ARRAY['mysterious librarian'],
     ARRAY['infinite library', 'moving shelves'],
     ARRAY['books', 'endless corridors', 'old guide'],
     'Might represent my search for knowledge or answers in my career'),
    
    (account2, NULL, current_date - interval '34 days', 'Running But Not Moving',
     'Was in a race but my legs felt like they were in quicksand. Everyone was passing me. The finish line kept moving further away. Woke up exhausted.',
     'anxiety', 8, 'negative',
     ARRAY['running', 'stuck', 'competition'],
     ARRAY['faceless competitors'],
     ARRAY['race track', 'moving finish line'],
     ARRAY['quicksand', 'endless track', 'unreachable goal'],
     'Anxiety about marathon training or fear of not meeting goals'),
    
    (account2, NULL, current_date - interval '10 days', 'Childhood Home Transformed',
     'Was back in my childhood home but rooms kept changing. My old bedroom was now a garden. Parents were young again. Found treasures I had forgotten about in hidden drawers.',
     'nostalgic', 6, 'mixed',
     ARRAY['childhood home', 'transformation', 'discovery'],
     ARRAY['younger parents', 'childhood self'],
     ARRAY['morphing house', 'hidden rooms', 'garden bedroom'],
     ARRAY['treasures', 'youth', 'hidden spaces'],
     'Processing childhood memories and how I''ve changed'),
    
    (account3, NULL, current_date - interval '38 days', 'Lost in Tokyo',
     'Back in Tokyo but couldn''t read any signs. Was trying to find my hotel but streets kept changing. A kind stranger who didn''t speak English helped me using only gestures. Felt both lost and safe.',
     'travel', 7, 'mixed',
     ARRAY['being lost', 'foreign places', 'helpful strangers'],
     ARRAY['anonymous helper', 'crowds of people'],
     ARRAY['Tokyo streets', 'neon signs', 'unknown hotel'],
     ARRAY['foreign text', 'gestures', 'maze of streets'],
     'Processing my recent trip and the vulnerability of solo travel'),
    
    (account3, NULL, current_date - interval '20 days', 'The Garden That Grew Overnight',
     'My small garden had transformed into a jungle overnight. Vegetables were the size of trees. I was harvesting giant tomatoes with a ladder. Neighbors came to see the miracle garden.',
     'wishful', 8, 'positive',
     ARRAY['garden', 'growth', 'abundance'],
     ARRAY['amazed neighbors'],
     ARRAY['transformed backyard', 'giant greenhouse'],
     ARRAY['oversized plants', 'ladder', 'abundance'],
     'Hopes for my garden and perhaps desire for quick success'),
    
    (account3, NULL, current_date - interval '5 days', 'Recurring Exam Dream',
     'The classic - showed up to an exam for a class I forgot I was enrolled in. Couldn''t find the room, then couldn''t read the questions. Everyone else was finishing while I had just started.',
     'recurring', 5, 'negative',
     ARRAY['unprepared', 'exam', 'panic'],
     ARRAY['faceless classmates', 'stern professor'],
     ARRAY['university', 'exam hall', 'empty desk'],
     ARRAY['blank paper', 'clock', 'locked door'],
     'General anxiety about being unprepared or judged'),
    
    (account1, NULL, current_date - interval '2 days', 'Meeting My Future Self',
     'Met myself but 20 years older. Older me was calm, wise, and happy. We had tea and older me gave advice but I couldn''t remember the words when I woke up, just the feeling of reassurance.',
     'prophetic', 9, 'positive',
     ARRAY['future self', 'wisdom', 'time'],
     ARRAY['older self'],
     ARRAY['peaceful garden', 'tea house'],
     ARRAY['tea', 'mirror', 'aged hands', 'knowing smile'],
     'Desire for wisdom and reassurance about future choices');
    
    -- ==========================================
    -- TRAVEL ENTRIES (5 entries)
    -- ==========================================
    INSERT INTO journal.travel_entries 
    (account_id, journal_entry_id, destination, country, trip_start_date, trip_end_date, trip_type, 
     accommodation, transportation, budget_planned, budget_actual, currency, weather_conditions,
     favorite_moments, challenges, local_food_tried, people_met, would_return, overall_rating, photos_count)
    VALUES
    (account3, entry9, 'Tokyo, Kyoto, Osaka', 'Japan', 
     current_date - interval '27 days', current_date - interval '20 days', 'adventure',
     'Mix of hotels and traditional ryokan', ARRAY['plane', 'shinkansen', 'local trains', 'walking'],
     5000.00, 5800.00, 'USD', 'Mostly sunny, one typhoon day',
     'Sunrise at Mount Fuji, tea ceremony in Kyoto, meeting locals in an izakaya, getting lost in Tokyo and finding hidden gems',
     'Language barrier, navigating train system initially, typhoon day changed plans',
     ARRAY['ramen', 'sushi', 'takoyaki', 'okonomiyaki', 'matcha everything', 'convenience store foods'],
     ARRAY['Helpful salary man who walked me to station', 'Ryokan owner who spoke English', 'Fellow travelers at hostel'],
     true, 9, 847),
    
    (account1, NULL, 'Barcelona', 'Spain',
     current_date - interval '45 days', current_date - interval '86 days', 'vacation',
     'Airbnb in Gothic Quarter', ARRAY['plane', 'metro', 'walking', 'bicycle'],
     2000.00, 2200.00, 'EUR', 'Perfect Mediterranean weather',
     'Sagrada Familia at sunset, beach picnic, Park G�ell, tapas crawl in El Born, Bunkers del Carmel viewpoint',
     'Pickpocket attempt (unsuccessful), August crowds at major attractions',
     ARRAY['paella', 'tapas', 'jam�n ib�rico', 'cava', 'churros', 'gazpacho'],
     ARRAY['Local artist in Park G�ell', 'Friendly bartender who taught me Catalan phrases'],
     true, 9, 412),
    
    (account2, NULL, 'Portland', 'USA',
     current_date - interval '45 days', current_date - interval '43 days', 'vacation',
     'Downtown hotel', ARRAY['plane', 'rental car', 'walking'],
     1000.00, 900.00, 'USD', 'Typical Portland drizzle',
     'Powell''s Bookstore for hours, food truck pods, Japanese Garden, Mount Hood day trip',
     'Constant rain (but expected)', 
     ARRAY['food trucks', 'craft beer', 'donuts', 'coffee', 'farm-to-table dining'],
     ARRAY['Bookstore employee with great recommendations', 'Trail guide on Mount Hood'],
     true, 8, 234),
    
    (account1, NULL, 'Iceland Ring Road', 'Iceland',
     current_date - interval '200 days', current_date - interval '195 days', 'adventure',
     'Mix of guesthouses and camping', ARRAY['plane', 'rental camper van'],
     4000.00, 5500.00, 'USD', 'Variable - sun, rain, wind, even summer snow',
     'Northern Lights on night 3, glacier hiking, black sand beaches, countless waterfalls, midnight sun',
     'Expensive everything, car troubles day 5, weather changes',
     ARRAY['lamb soup', 'skyr', 'hot dogs', 'arctic char', 'kleinur'],
     ARRAY['German couple traveling same route', 'Local who helped with car', 'Guesthouse family'],
     true, 9, 1243),
    
    (account2, NULL, 'New York City', 'USA',
     current_date - interval '30 days', current_date - interval '28 days', 'business',
     'Midtown hotel (company paid)', ARRAY['plane', 'subway', 'taxi', 'walking'],
     500.00, 750.00, 'USD', 'Hot summer days',
     'Central Park morning runs, Broadway show, Brooklyn Bridge walk, amazing pizza, Metropolitan Museum',
     'Conference was exhausting, little free time, expensive food',
     ARRAY['NY pizza', 'bagels', 'deli sandwiches', 'street food', 'fancy conference dinners'],
     ARRAY['Conference connections', 'Friendly New Yorkers who gave directions'],
     true, 7, 156);
    
    -- ==========================================
    -- READING ENTRIES (10 entries)
    -- ==========================================
    INSERT INTO journal.reading_entries 
    (account_id, journal_entry_id, book_title, author, isbn, status, start_date, finish_date, 
     rating, pages_read, total_pages, favorite_quotes, key_takeaways, personal_reflection, 
     would_recommend, genre)
    VALUES
    (account3, entry10, 'Atomic Habits', 'James Clear', '9780735211292', 'completed',
     current_date - interval '22 days', current_date - interval '15 days', 
     5, 320, 320,
     ARRAY['You do not rise to the level of your goals. You fall to the level of your systems.',
           'Every action you take is a vote for the type of person you wish to become.'],
     '1% improvements compound over time. Focus on systems not goals. Environment design is crucial. Identity change drives behavior change.',
     'This book came at the perfect time. I''ve already implemented several strategies and seeing results. The habit stacking technique is particularly powerful.',
     true, 'Self-Help'),
    
    (account1, NULL, 'The Midnight Library', 'Matt Haig', '9780525559474', 'completed',
     current_date - interval '25 days', current_date - interval '17 days',
     4, 288, 288,
     ARRAY['The only way to learn is to live.', 
           'You don''t have to understand life. You just have to live it.'],
     'Every life contains infinite possibilities. Regret is pointless. The life we have is enough if we choose to see it that way.',
     'Beautiful concept about parallel lives. Made me appreciate my current choices more and worry less about "what ifs".',
     true, 'Fiction'),
    
    (account2, NULL, 'Can''t Hurt Me', 'David Goggins', '9781544512273', 'completed',
     current_date - interval '30 days', current_date - interval '20 days',
     4, 366, 366,
     ARRAY['When you think you''re done, you''re only at 40% of your body''s capability.'],
     'Mental toughness can be developed. Embrace discomfort. The accountability mirror. Take souls through excellence.',
     'Intense and sometimes extreme, but incredibly motivating for marathon training. The 40% rule has helped during long runs.',
     true, 'Biography'),
    
    (account1, NULL, 'Project Hail Mary', 'Andy Weir', '9780593135204', 'completed',
     current_date - interval '20 days', current_date - interval '15 days',
     5, 476, 476,
     ARRAY['Sometimes, the answer is "I don''t know" and that''s okay. That''s where science starts.'],
     'Science, friendship across species, human ingenuity, sacrifice for others.',
     'Couldn''t put it down! Funny, smart, and touching. The science was accessible and the friendship was unexpected and beautiful.',
     true, 'Science Fiction'),
    
    (account3, NULL, 'Educated', 'Tara Westover', '9780399590504', 'completed',
     current_date - interval '35 days', current_date - interval '27 days',
     5, 334, 334,
     ARRAY['You can love someone and still choose to say goodbye to them.'],
     'Education transforms but also separates. Family bonds vs personal growth. The power and price of knowledge.',
     'Incredible memoir. Made me grateful for my education and understanding of how privileged access to learning is.',
     true, 'Memoir'),
    
    (account2, NULL, 'The 7 Habits of Highly Effective People', 'Stephen Covey', '9781982137274', 'currently_reading',
     current_date - interval '10 days', NULL,
     NULL, 200, 381,
     ARRAY['Begin with the end in mind.'],
     'Paradigm shifts, proactive vs reactive, personal mission statement.',
     'Classic for a reason. Taking time with this one to really implement each habit.',
     NULL, 'Business'),
    
    (account1, NULL, 'Sapiens', 'Yuval Noah Harari', '9780062316097', 'completed',
     current_date - interval '50 days', current_date - interval '75 days',
     4, 443, 443,
     ARRAY['The ability to speak about fictions is the most unique feature of Sapiens language.'],
     'Shared myths create cooperation. Agricultural revolution was history''s biggest fraud. Money is the most universal mutual trust system.',
     'Challenged many assumptions about human history. Dense but worthwhile. The section on happiness was particularly thought-provoking.',
     true, 'History'),
    
    (account3, NULL, 'The Power of Now', 'Eckhart Tolle', '9781577314806', 'dnf',
     current_date - interval '25 days', current_date - interval '20 days',
     2, 100, 229,
     NULL,
     'Present moment awareness, ego dissolution.',
     'Too repetitive and abstract for me. Might return to it later when I''m in a different headspace.',
     false, 'Spirituality'),
    
    (account2, NULL, 'Born to Run', 'Christopher McDougall', '9780307266309', 'want_to_read',
     NULL, NULL,
     NULL, 0, 287,
     NULL, NULL,
     'Recommended by running group. Perfect for marathon training motivation.',
     NULL, 'Sports'),
    
    (account1, NULL, 'Thinking, Fast and Slow', 'Daniel Kahneman', '9780374533557', 'currently_reading',
     current_date - interval '5 days', NULL,
     NULL, 150, 499,
     ARRAY['Nothing in life is as important as you think it is while you are thinking about it.'],
     'System 1 vs System 2 thinking, cognitive biases, prospect theory.',
     'Dense but fascinating. Understanding these biases is changing how I make decisions.',
     NULL, 'Psychology');
    
    -- ==========================================
    -- LIFE EVENTS (12 events)
    -- ==========================================
    INSERT INTO journal.life_events 
    (account_id, title, description, event_date, event_type, significance, emotional_impact, 
     tags, related_people, location)
    VALUES
    (account1, 'Got Promoted to Senior Developer',
     'After 3 years of hard work, finally got the senior developer promotion. Comes with more responsibilities but also better compensation and interesting projects.',
     current_date - interval '22 days', 'job_change', 8, 'very_positive',
     ARRAY['career', 'achievement', 'growth'],
     ARRAY['Manager', 'Team'],
     'Company Office'),
    
    (account1, 'Moved to New Apartment',
     'Finally moved out of the cramped studio into a proper one-bedroom apartment. Has a small balcony and room for a home office.',
     current_date - interval '120 days', 'relocation', 7, 'positive',
     ARRAY['moving', 'new-beginning', 'independence'],
     ARRAY['Parents helped with move'],
     'Downtown District'),
    
    (account2, 'Started Marathon Training',
     'Committed to running my first marathon. Joined a running group and started structured training program.',
     current_date - interval '17 days', 'fitness', 9, 'very_positive',
     ARRAY['fitness', 'goals', 'challenge'],
     ARRAY['Running group members'],
     'City Running Club'),
    
    (account2, 'Best Friend''s Wedding',
     'My best friend from college got married. I was in the wedding party. Beautiful ceremony, emotional speeches, danced until 3am.',
     current_date - interval '40 days', 'celebration', 8, 'very_positive',
     ARRAY['friendship', 'celebration', 'memories'],
     ARRAY['College friends', 'Bride and Groom'],
     'Vineyard Wedding Venue'),
    
    (account3, 'Completed Solo Japan Trip',
     'Spent two weeks traveling solo through Japan. First solo international trip. Gained confidence and had amazing experiences.',
     current_date - interval '20 days', 'travel', 9, 'very_positive',
     ARRAY['travel', 'adventure', 'independence', 'growth'],
     ARRAY['Various kind strangers'],
     'Japan'),
    
    (account3, '3 Year Anniversary with Sarah',
     'Celebrated three years together. Feels like a significant milestone. We''ve grown so much together.',
     current_date - interval '14 days', 'relationship', 9, 'very_positive',
     ARRAY['love', 'milestone', 'relationship'],
     ARRAY['Sarah'],
     'Our Favorite Restaurant'),
    
    (account1, 'Grandmother''s 85th Birthday',
     'Whole family gathered to celebrate grandma''s 85th birthday. Four generations in one room. Precious memories.',
     current_date - interval '200 days', 'birthday', 8, 'very_positive',
     ARRAY['family', 'celebration', 'generations'],
     ARRAY['Extended family', 'Grandmother'],
     'Grandma''s House'),
    
    (account2, 'Overcame Public Speaking Fear',
     'Gave my first conference presentation to 200+ people. Was terrified but did it and got positive feedback.',
     current_date - interval '75 days', 'achievement', 8, 'positive',
     ARRAY['growth', 'fear', 'achievement'],
     ARRAY['Conference attendees', 'Colleagues'],
     'Tech Conference Center'),
    
    (account3, 'Published First Blog Post',
     'After years of thinking about it, finally published my first blog post about sustainable living. Got 500 views in first week!',
     current_date - interval '45 days', 'achievement', 6, 'positive',
     ARRAY['writing', 'creativity', 'sharing'],
     ARRAY['Online readers'],
     'Home - Writing Desk'),
    
    (account1, 'Lost Childhood Pet',
     'Family dog of 14 years passed away. Was there from middle school through college. End of an era.',
     current_date - interval '300 days', 'loss', 9, 'very_negative',
     ARRAY['loss', 'grief', 'pet', 'family'],
     ARRAY['Family members', 'Max the dog'],
     'Parents'' House'),
    
    (account2, 'Completed First Half-Marathon',
     'Ran my first half-marathon in 2:05. Not fast but finished strong. Great preparation for full marathon.',
     current_date - interval '30 days', 'fitness', 7, 'very_positive',
     ARRAY['running', 'achievement', 'fitness'],
     ARRAY['Running buddies', 'Supporters'],
     'City Marathon Route'),
    
    (account3, 'Started Therapy',
     'Made the decision to start therapy for anxiety. Big step in prioritizing mental health.',
     current_date - interval '45 days', 'health', 8, 'positive',
     ARRAY['mental-health', 'self-care', 'growth'],
     ARRAY['Therapist'],
     'Therapy Office');
    
    -- ==========================================
    -- PROMPT RESPONSES (8 responses linking prompts to entries)
    -- ==========================================
    INSERT INTO journal.prompt_responses 
    (account_id, prompt_id, journal_entry_id, response_quality, completion_time)
    VALUES
    (account1, prompt1, entry5, 4, 15),
    (account1, prompt2, entry3, 5, 8),
    (account2, prompt3, entry8, 5, 25),
    (account2, prompt1, entry6, 4, 12),
    (account3, prompt3, entry9, 5, 30),
    (account3, prompt2, NULL, 4, 10),
    (account1, prompt1, entry2, 3, 10),
    (account2, prompt2, NULL, 5, 5);
    
    -- ==========================================
    -- DAILY ACTIVITIES (15 entries)
    -- ==========================================
    INSERT INTO journal.daily_activities 
    (account_id, entry_date, activity_name, completed, rating, notes)
    VALUES
    (account1, current_date - interval '5 days', 'Morning Meditation', true, 5, 'Great session, very peaceful'),
    (account1, current_date - interval '5 days', 'Exercise', true, 4, '30 min run'),
    (account1, current_date - interval '5 days', 'Read for 30 mins', true, 4, 'Finished chapter 3'),
    (account1, current_date - interval '4 days', 'Morning Meditation', true, 3, 'Distracted today'),
    (account1, current_date - interval '4 days', 'Exercise', false, NULL, 'Too tired from work'),
    (account1, current_date - interval '3 days', 'Morning Meditation', true, 4, 'Better than yesterday'),
    
    (account2, current_date - interval '10 days', 'Marathon Training Run', true, 5, '8 miles at easy pace'),
    (account2, current_date - interval '10 days', 'Stretching', true, 4, '15 minutes post-run'),
    (account2, current_date - interval '9 days', 'Marathon Training Run', true, 4, '5 miles recovery run'),
    (account2, current_date - interval '8 days', 'Rest Day', true, 5, 'Needed the recovery'),
    
    (account3, current_date - interval '7 days', 'Garden Watering', true, 5, 'Tomatoes looking great'),
    (account3, current_date - interval '7 days', 'Journal Writing', true, 5, 'Good reflection session'),
    (account3, current_date - interval '6 days', 'Garden Watering', true, 4, 'Quick morning water'),
    (account3, current_date - interval '5 days', 'Weekly Planning', true, 4, 'Set goals for the week'),
    (account3, current_date - interval '4 days', 'Garden Watering', true, 5, 'Harvested first tomatoes!');
    
    -- ==========================================
    -- REFLECTION SESSIONS (6 sessions)
    -- ==========================================
    INSERT INTO journal.reflection_sessions 
    (account_id, session_type, session_date, period_start, period_end, highlights, lowlights, 
     lessons_learned, goals_achieved, goals_missed, areas_for_improvement, gratitude_summary, 
     next_period_intentions, overall_satisfaction)
    VALUES
    (account1, 'monthly', current_date - interval '5 days', 
     current_date - interval '17 days', current_date - interval '5 days',
     'Got promoted, started Spanish classes, wonderful family reunion, improved meditation practice',
     'Work stress and burnout, struggled with work-life balance, some days felt overwhelming',
     'Need better boundaries at work. Small daily habits compound. Family time is precious.',
     'Promotion achieved, meditation consistency improved, read 3 books',
     'Gym consistency, meal prep planning, earlier bedtime goal',
     'Time management, saying no to commitments, physical fitness',
     'Grateful for family support, career growth, health, learning opportunities',
     'Focus on work-life balance, continue Spanish, exercise 3x per week minimum',
     7),
    
    (account2, 'weekly', current_date - interval '3 days',
     current_date - interval '10 days', current_date - interval '3 days',
     'Accepted new job offer! Maintained running schedule, quality time with parents',
     'Anxiety attack at store, job decision stress',
     'Big decisions take time and that''s okay. Mental health requires continuous attention.',
     'Made career decision, ran 25 miles total, completed all training runs',
     'Meditation practice, reading goals',
     'Stress management, maintaining routine during change',
     'New opportunities, supportive family and friends, physical health',
     'Smooth job transition, maintain training, restart meditation',
     8),
    
    (account3, 'quarterly', current_date - interval '10 days',
     current_date - interval '50 days', current_date - interval '10 days',
     'Japan trip, 3-year anniversary, garden success, published blog post, consistent journaling',
     'Some relationship tensions, work stress periods, abandoned some books',
     'Solo travel builds confidence. Relationships require continuous work. Not every book needs finishing.',
     'Travel goal, garden establishment, blog launch, therapy started',
     'Exercise routine, cooking more, less screen time',
     'Physical fitness, work boundaries, social connections',
     'Adventures, partnership, growth, health, creative expression',
     'Focus on fitness, nurture relationships, continue therapy, expand garden',
     9),
    
    (account1, 'yearly', current_date - interval '15 days',
     current_date - interval '395 days', current_date - interval '15 days',
     'Major promotion, new apartment, Iceland trip, improved mental health, stronger family bonds',
     'Lost family dog, some health scares, friendship drifts, financial stress periods',
     'Change is constant. Grief is love with nowhere to go. Career isn''t everything. Health is wealth.',
     'Career advancement, housing upgrade, travel goals, meditation habit',
     'Savings goals, fitness consistency, dating goals, language learning (until recently)',
     'Physical health, financial planning, romantic relationships, hobbies',
     'Growth opportunities, family love, adventures, resilience, new experiences',
     'Balance all life areas, not just career. Prioritize health. Build savings. Nurture relationships.',
     8),
    
    (account2, 'monthly', current_date - interval '16 days',
     current_date - interval '63 days', current_date - interval '16 days',
     'Started marathon training, best friend''s wedding, NYC business trip success',
     'Training injuries, work-life imbalance, dating disappointments',
     'Consistency beats perfection. Rest is part of training. Celebration matters.',
     'Training plan started, half-marathon completed, conference presentation',
     'Consistent sleep schedule, meal planning, side project progress',
     'Recovery and rest, nutrition, time management',
     'Physical capability, friendship, career opportunities, growth',
     'Build training gradually, prioritize sleep, maintain social connections',
     7),
    
    (account3, 'weekly', current_date - interval '1 day',
     current_date - interval '8 days', current_date - interval '1 day',
     'Tomato harvest!, quality time with Sarah, finished great book, consistent journaling',
     'Work deadline stress, skipped exercises, too much screen time',
     'Garden patience pays off. Consistency in small things matters.',
     'Garden harvest, reading goal, journal daily',
     'Exercise routine, early rising',
     'Physical activity, morning routine, work boundaries',
     'Garden success, relationship, books, daily peace moments',
     'Exercise daily, limit evening screen time, plan next garden phase',
     8);
    
    -- ==========================================
    -- MEDIA ATTACHMENTS (Sample records - actual files would need to be uploaded)
    -- ==========================================
    INSERT INTO journal.media_attachments 
    (journal_entry_id, file_name, file_path, file_type, file_size, mime_type, caption, order_index)
    VALUES
    (entry1, 'morning_meditation.jpg', '/uploads/journal/morning_meditation.jpg', 'image', 
     2048000, 'image/jpeg', 'My meditation corner', 1),
    
    (entry3, 'family_reunion_group.jpg', '/uploads/journal/family_reunion_group.jpg', 'image',
     3500000, 'image/jpeg', 'Four generations together!', 1),
    
    (entry3, 'grandma_cooking.jpg', '/uploads/journal/grandma_cooking.jpg', 'image',
     2800000, 'image/jpeg', 'Grandma in her element', 2),
    
    (entry9, 'fuji_sunrise.jpg', '/uploads/journal/fuji_sunrise.jpg', 'image',
     4200000, 'image/jpeg', 'Sunrise at Mount Fuji - worth the 3am start', 1),
    
    (entry9, 'kyoto_temple.jpg', '/uploads/journal/kyoto_temple.jpg', 'image',
     3900000, 'image/jpeg', 'Fushimi Inari shrine - thousands of torii gates', 2),
    
    (entry9, 'tokyo_night.jpg', '/uploads/journal/tokyo_night.jpg', 'image',
     3600000, 'image/jpeg', 'Tokyo at night from Skytree', 3);
    
    -- ==========================================
    -- JOURNAL STATISTICS (Generate some sample statistics)
    -- ==========================================
    -- Statistics would typically be generated by triggers, but we'll insert some sample data
    -- Aggregate by account_id and entry_date to avoid duplicate conflicts
    INSERT INTO journal.journal_statistics 
    (account_id, stat_date, entries_count, words_written, avg_mood, avg_energy, avg_stress, 
     streak_days, longest_streak, prompts_used)
    SELECT 
        account_id,
        entry_date,
        COUNT(*) as entries_count,
        SUM(word_count) as words_written,
        AVG(mood_rating)::DECIMAL(3,2) as avg_mood,
        AVG(energy_level)::DECIMAL(3,2) as avg_energy,
        AVG(stress_level)::DECIMAL(3,2) as avg_stress,
        1 as streak_days,
        1 as longest_streak,
        0 as prompts_used
    FROM journal.journal_entries
    WHERE entry_date >= current_date - interval '15 days'
    GROUP BY account_id, entry_date
    ON CONFLICT (account_id, stat_date) DO UPDATE SET
        entries_count = journal_statistics.entries_count + EXCLUDED.entries_count,
        words_written = journal_statistics.words_written + EXCLUDED.words_written,
        avg_mood = (journal_statistics.avg_mood + EXCLUDED.avg_mood) / 2,
        avg_energy = (journal_statistics.avg_energy + EXCLUDED.avg_energy) / 2,
        avg_stress = (journal_statistics.avg_stress + EXCLUDED.avg_stress) / 2;

END $$;

-- Verify the seeding worked
DO $$
BEGIN
    RAISE NOTICE 'Journal seeding completed successfully!';
    RAISE NOTICE 'Summary of seeded data:';
    RAISE NOTICE '- Journal entries: %', (SELECT COUNT(*) FROM journal.journal_entries);
    RAISE NOTICE '- Mood entries: %', (SELECT COUNT(*) FROM journal.mood_entries);
    RAISE NOTICE '- Gratitude entries: %', (SELECT COUNT(*) FROM journal.gratitude_entries);
    RAISE NOTICE '- Dream entries: %', (SELECT COUNT(*) FROM journal.dream_entries);
    RAISE NOTICE '- Travel entries: %', (SELECT COUNT(*) FROM journal.travel_entries);
    RAISE NOTICE '- Reading entries: %', (SELECT COUNT(*) FROM journal.reading_entries);
    RAISE NOTICE '- Life events: %', (SELECT COUNT(*) FROM journal.life_events);
    RAISE NOTICE '- Daily activities: %', (SELECT COUNT(*) FROM journal.daily_activities);
    RAISE NOTICE '- Reflection sessions: %', (SELECT COUNT(*) FROM journal.reflection_sessions);
    RAISE NOTICE '- Prompt responses: %', (SELECT COUNT(*) FROM journal.prompt_responses);
    RAISE NOTICE '- Media attachments: %', (SELECT COUNT(*) FROM journal.media_attachments);
    RAISE NOTICE '- Journal statistics: %', (SELECT COUNT(*) FROM journal.journal_statistics);
END $$;