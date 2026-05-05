-- Blog Schema Seed Data
-- Hardcoded user ID from supabase/seed.sql:
--   b73eb03e-fb7a-424d-84ff-18e2791ce0b4  user@supasheet.dev

DO $$
DECLARE
    user_1_id UUID := 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4';

    author_1_id UUID;
    author_2_id UUID;

    tech_cat_id UUID;
    travel_cat_id UUID;
    food_cat_id UUID;
    lifestyle_cat_id UUID;
    tutorial_cat_id UUID;
    news_cat_id UUID;

    post_1_id UUID;
    post_2_id UUID;
    post_3_id UUID;
    post_4_id UUID;
    post_5_id UUID;
    post_6_id UUID;
    post_7_id UUID;
    post_8_id UUID;
    post_9_id UUID;
    post_10_id UUID;
    post_11_id UUID;
    post_12_id UUID;

    comment_1_id UUID;
    comment_3_id UUID;
BEGIN
    ----------------------------------------------------------------
    -- Authors
    ----------------------------------------------------------------
    INSERT INTO blog.authors (id, user_id, display_name, bio, language, country, created_at, updated_at) VALUES
    (gen_random_uuid(), user_1_id, 'John Doe',
     'Software engineer writing about distributed systems, databases, and the small details that make great products.',
     'en', 'US', current_timestamp - interval '180 days', current_timestamp)
    RETURNING id INTO author_1_id;

    INSERT INTO blog.authors (id, user_id, display_name, bio, language, country, created_at, updated_at) VALUES
    (gen_random_uuid(), user_1_id, 'Jane Smith',
     'Travel writer and home cook documenting recipes, routines, and the occasional misadventure abroad.',
     'en', 'GB', current_timestamp - interval '120 days', current_timestamp)
    RETURNING id INTO author_2_id;

    ----------------------------------------------------------------
    -- Additional authors — all bound to user_1_id, each with a unique
    -- (language, country) pair so the (user_id, language, country)
    -- uniqueness constraint is satisfied.
    ----------------------------------------------------------------
    INSERT INTO blog.authors (id, user_id, display_name, bio, language, country, created_at, updated_at) VALUES
    (gen_random_uuid(), user_1_id, 'John Doe (AU)',
     'Australian edition — engineering notes, with a Southern Hemisphere calendar.',
     'en', 'AU', current_timestamp - interval '170 days', current_timestamp),
    (gen_random_uuid(), user_1_id, 'John Doe (CA)',
     'Canadian edition — engineering notes from a remote-first team.',
     'en', 'CA', current_timestamp - interval '165 days', current_timestamp),
    (gen_random_uuid(), user_1_id, 'John Doe (IE)',
     'Irish edition — engineering notes for the Dublin tech scene.',
     'en', 'IE', current_timestamp - interval '160 days', current_timestamp),
    (gen_random_uuid(), user_1_id, 'Jean Dupont',
     'Édition française : systèmes distribués, bases de données et qualité produit.',
     'fr', 'FR', current_timestamp - interval '155 days', current_timestamp),
    (gen_random_uuid(), user_1_id, 'Jeanne Tremblay',
     'Édition franco-canadienne : ingénierie logicielle et culture d''équipe.',
     'fr', 'CA', current_timestamp - interval '150 days', current_timestamp),
    (gen_random_uuid(), user_1_id, 'Julien Lambert',
     'Édition belge francophone : architecture logicielle et bonnes pratiques.',
     'fr', 'BE', current_timestamp - interval '145 days', current_timestamp),
    (gen_random_uuid(), user_1_id, 'Johann Schmidt',
     'Deutsche Ausgabe rund um verteilte Systeme, Datenbanken und Engineering-Kultur.',
     'de', 'DE', current_timestamp - interval '140 days', current_timestamp),
    (gen_random_uuid(), user_1_id, 'Stefan Müller',
     'Österreichische Ausgabe: Engineering-Workflows und Team-Praxis.',
     'de', 'AT', current_timestamp - interval '135 days', current_timestamp),
    (gen_random_uuid(), user_1_id, 'Markus Weber',
     'Schweizer Ausgabe: präzise Notizen zu Datenbanken und Systemdesign.',
     'de', 'CH', current_timestamp - interval '130 days', current_timestamp),
    (gen_random_uuid(), user_1_id, 'Juan García',
     'Edición en español: sistemas distribuidos, bases de datos y detalles de producto.',
     'es', 'ES', current_timestamp - interval '125 days', current_timestamp),
    (gen_random_uuid(), user_1_id, 'Juana Martínez',
     'Edición mexicana: ingeniería de software y prácticas de equipo.',
     'es', 'MX', current_timestamp - interval '120 days', current_timestamp),
    (gen_random_uuid(), user_1_id, 'Diego Fernández',
     'Edición argentina: notas sobre arquitectura y trabajo remoto.',
     'es', 'AR', current_timestamp - interval '115 days', current_timestamp),
    (gen_random_uuid(), user_1_id, 'Giovanni Rossi',
     'Edizione italiana: sistemi distribuiti e cultura ingegneristica.',
     'it', 'IT', current_timestamp - interval '110 days', current_timestamp),
    (gen_random_uuid(), user_1_id, 'João Silva',
     'Edição em português do Brasil — engenharia de software e boas práticas.',
     'pt', 'BR', current_timestamp - interval '105 days', current_timestamp),
    (gen_random_uuid(), user_1_id, 'Tiago Sousa',
     'Edição em português de Portugal — arquitetura de sistemas e produto.',
     'pt', 'PT', current_timestamp - interval '100 days', current_timestamp),
    (gen_random_uuid(), user_1_id, 'Janneke de Vries',
     'Nederlandse editie — software-engineering en team-cultuur.',
     'nl', 'NL', current_timestamp - interval '95 days', current_timestamp),
    (gen_random_uuid(), user_1_id, 'Saki Tanaka',
     '日本語版：分散システム、データベース、そして日々のエンジニアリングノート。',
     'ja', 'JP', current_timestamp - interval '90 days', current_timestamp),
    (gen_random_uuid(), user_1_id, 'Jin-ah Kim',
     '한국어판: 분산 시스템과 엔지니어링 문화에 대한 노트.',
     'ko', 'KR', current_timestamp - interval '85 days', current_timestamp),
    (gen_random_uuid(), user_1_id, '李伟',
     '中文版：分布式系统、数据库和工程文化的观察笔记。',
     'zh', 'CN', current_timestamp - interval '80 days', current_timestamp);

    ----------------------------------------------------------------
    -- Social links
    ----------------------------------------------------------------
    INSERT INTO blog.social_links (author_id, website, github, twitter, linkedin) VALUES
    (author_1_id, 'https://johndoe.dev',    'https://github.com/johndoe', 'https://twitter.com/johndoe',   'https://linkedin.com/in/johndoe'),
    (author_2_id, 'https://janesmith.blog', 'https://github.com/janesmith','https://twitter.com/janesmith', 'https://linkedin.com/in/janesmith');

    -- Social links for the additional locale-variant authors (looked up by locale).
    INSERT INTO blog.social_links (author_id, website, github, twitter, linkedin)
    SELECT a.id, s.website, s.github, s.twitter, s.linkedin
    FROM blog.authors a
    JOIN (VALUES
        ('en', 'AU', 'https://johndoe.com.au',       'https://github.com/johndoe', 'https://twitter.com/johndoe_au', 'https://linkedin.com/in/johndoe'),
        ('en', 'CA', 'https://johndoe.ca',           'https://github.com/johndoe', 'https://twitter.com/johndoe_ca', NULL),
        ('en', 'IE', 'https://johndoe.ie',           'https://github.com/johndoe', NULL,                              'https://linkedin.com/in/johndoe'),
        ('fr', 'FR', 'https://jeandupont.fr',        NULL,                          'https://twitter.com/jeandupont',  NULL),
        ('fr', 'CA', 'https://jeannetremblay.ca',    NULL,                          'https://twitter.com/jeannetremblay', NULL),
        ('fr', 'BE', 'https://julienlambert.be',     NULL,                          NULL,                              'https://linkedin.com/in/julienlambert'),
        ('de', 'DE', 'https://johannschmidt.de',     NULL,                          NULL,                              'https://linkedin.com/in/johannschmidt'),
        ('de', 'AT', 'https://stefanmueller.at',     NULL,                          NULL,                              'https://linkedin.com/in/stefanmueller'),
        ('de', 'CH', 'https://markusweber.ch',       NULL,                          'https://twitter.com/markusweber',  NULL),
        ('es', 'ES', 'https://juangarcia.es',        NULL,                          'https://twitter.com/juangarcia',   NULL),
        ('es', 'MX', 'https://juanamartinez.mx',     NULL,                          'https://twitter.com/juanamartinez',NULL),
        ('es', 'AR', 'https://diegofernandez.ar',    NULL,                          'https://twitter.com/diegofernandez', NULL),
        ('it', 'IT', 'https://giovannirossi.it',     NULL,                          NULL,                              'https://linkedin.com/in/giovannirossi'),
        ('pt', 'BR', 'https://joaosilva.com.br',     NULL,                          'https://twitter.com/joaosilva',    'https://linkedin.com/in/joaosilva'),
        ('pt', 'PT', 'https://tiagosousa.pt',        NULL,                          'https://twitter.com/tiagosousa',   NULL),
        ('nl', 'NL', 'https://jannekedevries.nl',    NULL,                          'https://twitter.com/jannekedv',    NULL),
        ('ja', 'JP', 'https://sakitanaka.jp',        NULL,                          'https://twitter.com/sakitanaka',   NULL),
        ('ko', 'KR', 'https://jinahkim.kr',          NULL,                          NULL,                              'https://linkedin.com/in/jinahkim'),
        ('zh', 'CN', 'https://liwei.cn',             NULL,                          NULL,                              NULL)
    ) AS s(lang, ctry, website, github, twitter, linkedin)
        ON s.lang = a.language AND s.ctry = a.country
    WHERE a.user_id = user_1_id
      AND NOT (a.language = 'en' AND a.country = 'US')
      AND NOT (a.language = 'en' AND a.country = 'GB');

    ----------------------------------------------------------------
    -- Categories (global = user_id NULL; tutorials owned by user_1)
    ----------------------------------------------------------------
    INSERT INTO blog.categories (id, name, slug, description, color, icon, user_id) VALUES
    (gen_random_uuid(), 'Technology',     'technology',   'All about the latest in tech and software development', '#3b82f6', 'Cpu',       NULL)
    RETURNING id INTO tech_cat_id;

    INSERT INTO blog.categories (id, name, slug, description, color, icon, user_id) VALUES
    (gen_random_uuid(), 'Travel',         'travel',       'Travel stories and destination guides',                 '#f59e0b', 'Plane',     NULL)
    RETURNING id INTO travel_cat_id;

    INSERT INTO blog.categories (id, name, slug, description, color, icon, user_id) VALUES
    (gen_random_uuid(), 'Food & Recipes', 'food-recipes', 'Delicious recipes and culinary adventures',             '#ef4444', 'Utensils',  NULL)
    RETURNING id INTO food_cat_id;

    INSERT INTO blog.categories (id, name, slug, description, color, icon, user_id) VALUES
    (gen_random_uuid(), 'Lifestyle',      'lifestyle',    'Tips and insights for everyday living',                 '#ec4899', 'Heart',     NULL)
    RETURNING id INTO lifestyle_cat_id;

    INSERT INTO blog.categories (id, name, slug, description, color, icon, user_id) VALUES
    (gen_random_uuid(), 'Tutorials',      'tutorials',    'Step-by-step guides and how-tos',                       '#10b981', 'BookOpen',  user_1_id)
    RETURNING id INTO tutorial_cat_id;

    INSERT INTO blog.categories (id, name, slug, description, color, icon, user_id) VALUES
    (gen_random_uuid(), 'News',           'news',         'Latest news and updates',                               '#8b5cf6', 'Newspaper', NULL)
    RETURNING id INTO news_cat_id;

    ----------------------------------------------------------------
    -- Posts
    ----------------------------------------------------------------

    -- 1: published tech tutorial (featured)
    INSERT INTO blog.posts (id, author_id, title, slug, excerpt, content, status, featured, tags, view_count, published_at, created_at, updated_at) VALUES
    (gen_random_uuid(), author_1_id,
     'Getting Started with PostgreSQL Row Level Security',
     'getting-started-with-postgresql-row-level-security',
     'Row Level Security (RLS) is a powerful PostgreSQL feature that controls which rows users can access. A practical introduction with policies you can copy.',
     E'# Getting Started with PostgreSQL Row Level Security\n\n' ||
     E'Row Level Security (RLS) is a powerful feature in PostgreSQL that allows you to control which rows users can access in database tables. ' ||
     E'This is particularly useful for multi-tenant applications where you want to ensure that users can only see their own data.\n\n' ||
     E'## What is Row Level Security?\n\n' ||
     E'RLS policies are expressions that PostgreSQL evaluates for each row. If the policy expression returns true, the row is visible to the user; ' ||
     E'otherwise, it''s hidden. This happens at the database level, making it a robust security mechanism.\n\n' ||
     E'## Setting Up RLS\n\n' ||
     E'```sql\n' ||
     E'ALTER TABLE documents ENABLE ROW LEVEL SECURITY;\n\n' ||
     E'CREATE POLICY user_documents ON documents\n' ||
     E'FOR ALL USING (user_id = current_user_id());\n' ||
     E'```\n\n' ||
     E'## Best Practices\n\n' ||
     E'1. Always enable RLS on tables containing user data\n' ||
     E'2. Write clear, simple policies that are easy to understand\n' ||
     E'3. Test your policies thoroughly\n' ||
     E'4. Consider performance implications for complex policies',
     'published', true, ARRAY['postgres', 'security', 'rls'], 4821,
     current_date - interval '45 days',
     current_date - interval '50 days',
     current_date - interval '45 days')
    RETURNING id INTO post_1_id;

    -- 2: published travel
    INSERT INTO blog.posts (id, author_id, title, slug, excerpt, content, status, featured, tags, view_count, published_at, created_at, updated_at) VALUES
    (gen_random_uuid(), author_2_id,
     'Hidden Gems of Kyoto: A Local''s Guide',
     'hidden-gems-of-kyoto-locals-guide',
     'Kyoto is famous for its temples, but the real magic is in the early morning torii, autumn canal paths, and quiet alleys most tourists miss.',
     E'# Hidden Gems of Kyoto: A Local''s Guide\n\n' ||
     E'Kyoto is known for its stunning temples and traditional gardens, but beyond the tourist hotspots lie countless hidden treasures waiting to be discovered.\n\n' ||
     E'## 1. Fushimi Inari Early Morning\n\n' ||
     E'While Fushimi Inari is famous, most tourists don''t know the magic of visiting at 5 AM.\n\n' ||
     E'## 2. Philosopher''s Path in Autumn\n\n' ||
     E'This canal-side path becomes a tunnel of red and gold leaves in November.\n\n' ||
     E'## 3. Nishiki Market Side Alleys\n\n' ||
     E'Everyone visits Nishiki Market, but the real treasures are in the tiny side alleys.\n\n' ||
     E'## 4. Arashiyama Bamboo Grove at Dusk\n\n' ||
     E'Skip the crowded daytime visit and come at dusk when the grove is lit up and almost empty.',
     'published', false, ARRAY['kyoto', 'japan', 'travel'], 2147,
     current_date - interval '30 days',
     current_date - interval '35 days',
     current_date - interval '30 days')
    RETURNING id INTO post_2_id;

    -- 3: published food
    INSERT INTO blog.posts (id, author_id, title, slug, excerpt, content, status, featured, tags, view_count, published_at, created_at, updated_at) VALUES
    (gen_random_uuid(), author_1_id,
     'Perfect Homemade Sourdough Bread Recipe',
     'perfect-homemade-sourdough-bread-recipe',
     'After years of experimentation, my reliable sourdough recipe — 70% hydration, 4 sets of folds, and a long cold ferment.',
     E'# Perfect Homemade Sourdough Bread Recipe\n\n' ||
     E'After years of experimentation, I''ve finally perfected my sourdough bread recipe. The secret? Patience and understanding your starter.\n\n' ||
     E'## Ingredients\n\n' ||
     E'- 500g bread flour\n- 350g water (70% hydration)\n- 100g active sourdough starter\n- 10g salt\n\n' ||
     E'## Method\n\n' ||
     E'### Day 1\n' ||
     E'1. Autolyse 30 minutes\n' ||
     E'2. Add starter and salt\n' ||
     E'3. 4 sets of stretch and folds\n' ||
     E'4. Shape, bench rest, cold retard overnight\n\n' ||
     E'### Day 2\n' ||
     E'5. Preheat Dutch oven to 500F\n' ||
     E'6. Score and bake 20 min covered, 25 min uncovered at 450F',
     'published', false, ARRAY['baking', 'bread', 'recipe'], 1532,
     current_date - interval '20 days',
     current_date - interval '22 days',
     current_date - interval '20 days')
    RETURNING id INTO post_3_id;

    -- 4: published tech tutorial (featured)
    INSERT INTO blog.posts (id, author_id, title, slug, excerpt, content, status, featured, tags, view_count, published_at, created_at, updated_at) VALUES
    (gen_random_uuid(), author_1_id,
     'Building a REST API with Node.js and Express',
     'building-rest-api-nodejs-express',
     'A practical walkthrough of building a production-ready REST API from scratch with Node.js and Express, including error handling.',
     E'# Building a REST API with Node.js and Express\n\n' ||
     E'Learn how to build a production-ready REST API from scratch using Node.js and Express.\n\n' ||
     E'## Setup\n\n' ||
     E'```bash\nnpm init -y\nnpm install express dotenv cors helmet\n```\n\n' ||
     E'## Basic Server\n\n' ||
     E'```javascript\nconst express = require(''express'');\nconst app = express();\napp.use(express.json());\napp.listen(3000);\n```\n\n' ||
     E'## CRUD + Error Handling\n\n' ||
     E'Always implement proper error handling and validation.',
     'published', true, ARRAY['nodejs', 'express', 'api', 'tutorial'], 3290,
     current_date - interval '15 days',
     current_date - interval '18 days',
     current_date - interval '15 days')
    RETURNING id INTO post_4_id;

    -- 5: draft
    INSERT INTO blog.posts (id, author_id, title, slug, excerpt, content, status, featured, tags, view_count, published_at, created_at, updated_at) VALUES
    (gen_random_uuid(), author_2_id,
     'Top 10 Productivity Apps for 2026',
     'top-10-productivity-apps-2026',
     'A draft round-up of the productivity apps I actually still use after a year — Notion, Todoist, and seven others.',
     E'# Top 10 Productivity Apps for 2026\n\n*Draft — work in progress*\n\n## 1. Notion\n## 2. Todoist\n[More content to be added...]',
     'draft', false, ARRAY['productivity', 'apps'], 0,
     NULL,
     current_date - interval '5 days',
     current_date - interval '2 days')
    RETURNING id INTO post_5_id;

    -- 6: published lifestyle
    INSERT INTO blog.posts (id, author_id, title, slug, excerpt, content, status, featured, tags, view_count, published_at, created_at, updated_at) VALUES
    (gen_random_uuid(), author_2_id,
     'Morning Routines That Actually Work',
     'morning-routines-that-actually-work',
     'A year of testing morning routines: what actually moved the needle, and what just stressed me out before 8am.',
     E'# Morning Routines That Actually Work\n\n' ||
     E'I''ve tested dozens of morning routines over the past year. Here''s what actually made a difference.\n\n' ||
     E'## What Worked\n\n' ||
     E'1. No phone for the first hour\n' ||
     E'2. Hydrate before caffeine\n' ||
     E'3. Move your body for 15 minutes\n\n' ||
     E'## What Didn''t\n\n' ||
     E'- Waking up at 5 AM\n- Complex breakfast routines\n- Checking email first thing',
     'published', false, ARRAY['lifestyle', 'habits'], 987,
     current_date - interval '10 days',
     current_date - interval '12 days',
     current_date - interval '10 days')
    RETURNING id INTO post_6_id;

    -- 7: published tech news
    INSERT INTO blog.posts (id, author_id, title, slug, excerpt, content, status, featured, tags, view_count, published_at, created_at, updated_at) VALUES
    (gen_random_uuid(), author_1_id,
     'The Rise of Edge Computing',
     'rise-of-edge-computing',
     'Why edge computing is reshaping data processing — from autonomous vehicles to in-store analytics — and what trade-offs to plan for.',
     E'# The Rise of Edge Computing\n\n' ||
     E'Edge computing is transforming how we process and analyze data, bringing computation closer to where data is generated.\n\n' ||
     E'## Key Benefits\n\n' ||
     E'1. Lower latency\n2. Reduced bandwidth\n3. Enhanced privacy\n4. Improved reliability\n\n' ||
     E'## Real-World Applications\n\n' ||
     E'- IoT, retail, healthcare, manufacturing.\n\n' ||
     E'## Challenges\n\n' ||
     E'- Device management at scale\n- Distributed security\n- Standardization',
     'published', false, ARRAY['edge', 'cloud', 'iot'], 2654,
     current_date - interval '7 days',
     current_date - interval '8 days',
     current_date - interval '7 days')
    RETURNING id INTO post_7_id;

    -- 8: published food
    INSERT INTO blog.posts (id, author_id, title, slug, excerpt, content, status, featured, tags, view_count, published_at, created_at, updated_at) VALUES
    (gen_random_uuid(), author_2_id,
     '15-Minute Weeknight Dinners',
     '15-minute-weeknight-dinners',
     'Three weeknight dinners I actually cook on busy nights — pasta, sheet pan fajitas, and fried rice — plus the prep tricks that make them work.',
     E'# 15-Minute Weeknight Dinners\n\n' ||
     E'## 1. Garlic Shrimp Pasta\n\nCook pasta. Saute garlic and shrimp. Toss together.\n\n' ||
     E'## 2. Sheet Pan Chicken Fajitas\n\nToss everything on a sheet pan. Broil 12 minutes.\n\n' ||
     E'## 3. Fried Rice\n\nDay-old rice + 2 eggs + mixed veg + soy sauce.',
     'published', false, ARRAY['recipes', 'weeknight', 'quick'], 1845,
     current_date - interval '25 days',
     current_date - interval '27 days',
     current_date - interval '25 days')
    RETURNING id INTO post_8_id;

    -- 9: draft
    INSERT INTO blog.posts (id, author_id, title, slug, excerpt, content, status, featured, tags, view_count, published_at, created_at, updated_at) VALUES
    (gen_random_uuid(), author_1_id,
     'Introduction to Docker Containers',
     'introduction-to-docker-containers',
     'A draft intro to Docker covering the basics most teams actually need: images, containers, volumes, and a sane local workflow.',
     E'# Introduction to Docker Containers\n\n*Draft*\n\nDocker is a platform for developing, shipping, and running applications in containers.',
     'draft', false, ARRAY['docker', 'devops'], 0,
     NULL,
     current_date - interval '3 days',
     current_timestamp)
    RETURNING id INTO post_9_id;

    -- 10: published travel
    INSERT INTO blog.posts (id, author_id, title, slug, excerpt, content, status, featured, tags, view_count, published_at, created_at, updated_at) VALUES
    (gen_random_uuid(), author_2_id,
     'Budget Travel: Europe on $50 a Day',
     'budget-travel-europe-50-per-day',
     'Three months of European travel on $50/day — how I split accommodation, transport, food, and activities without missing the good stuff.',
     E'# Budget Travel: Europe on $50 a Day\n\n' ||
     E'Yes, you can travel Europe on a budget. Here''s how I did it for 3 months.\n\n' ||
     E'## Accommodation ($15-20)\n\nHostels, Couchsurfing, house sitting.\n\n' ||
     E'## Transport ($10-15)\n\nFlixBus, BlaBlaCar, walking.\n\n' ||
     E'## Food ($15-20)\n\nSupermarkets, local markets, happy hours, street food.\n\n' ||
     E'## Activities ($5-10)\n\nFree walking tours, museum free days, parks.',
     'published', false, ARRAY['budget', 'europe', 'travel'], 3120,
     current_date - interval '40 days',
     current_date - interval '42 days',
     current_date - interval '40 days')
    RETURNING id INTO post_10_id;

    -- 11: scheduled
    INSERT INTO blog.posts (id, author_id, title, slug, excerpt, content, status, featured, tags, view_count, published_at, created_at, updated_at) VALUES
    (gen_random_uuid(), author_1_id,
     'Database Migration Strategies for Growing Teams',
     'database-migration-strategies-growing-teams',
     'A scheduled deep-dive on safe migration patterns: expand-and-contract, dual-writes, and shadow tables — with rollback plans.',
     E'# Database Migration Strategies for Growing Teams\n\n' ||
     E'## Expand and Contract\n\nAdd new columns first, backfill, then remove old.\n\n' ||
     E'## Dual Writes\n\nWrite to both schemas during transition.\n\n' ||
     E'## Shadow Tables\n\nValidate by mirroring writes before cutover.',
     'scheduled', false, ARRAY['database', 'migrations', 'devops'], 0,
     current_date + interval '5 days',
     current_date - interval '2 days',
     current_date - interval '1 day')
    RETURNING id INTO post_11_id;

    -- 12: archived
    INSERT INTO blog.posts (id, author_id, title, slug, excerpt, content, status, featured, tags, view_count, published_at, created_at, updated_at) VALUES
    (gen_random_uuid(), author_2_id,
     'My 2023 Reading List',
     'my-2023-reading-list',
     'An archived round-up of the 12 books that stuck with me in 2023 — kept around for posterity, no longer maintained.',
     E'# My 2023 Reading List\n\n' ||
     E'A look back at the books that defined my 2023.\n\n' ||
     E'1. ...\n2. ...\n3. ...',
     'archived', false, ARRAY['books', 'reading', 'retrospective'], 412,
     current_date - interval '300 days',
     current_date - interval '320 days',
     current_date - interval '180 days')
    RETURNING id INTO post_12_id;

    ----------------------------------------------------------------
    -- Post categories
    ----------------------------------------------------------------
    INSERT INTO blog.post_categories (post_id, category_id) VALUES
    (post_1_id,  tech_cat_id),
    (post_1_id,  tutorial_cat_id),

    (post_2_id,  travel_cat_id),

    (post_3_id,  food_cat_id),

    (post_4_id,  tech_cat_id),
    (post_4_id,  tutorial_cat_id),

    (post_5_id,  tech_cat_id),
    (post_5_id,  lifestyle_cat_id),

    (post_6_id,  lifestyle_cat_id),

    (post_7_id,  tech_cat_id),
    (post_7_id,  news_cat_id),

    (post_8_id,  food_cat_id),

    (post_9_id,  tech_cat_id),
    (post_9_id,  tutorial_cat_id),

    (post_10_id, travel_cat_id),
    (post_10_id, lifestyle_cat_id),

    (post_11_id, tech_cat_id),
    (post_11_id, tutorial_cat_id),

    (post_12_id, lifestyle_cat_id);

    ----------------------------------------------------------------
    -- Comments (mix of approved + pending; one threaded reply)
    ----------------------------------------------------------------
    INSERT INTO blog.comments (id, post_id, user_id, parent_id, author_name, author_email, content, status, created_at, updated_at) VALUES
    (gen_random_uuid(), post_1_id, user_1_id, NULL, 'Jane Smith', 'user@supasheet.dev',
     'Great primer! The expand-and-contract analogy clicked for me.',
     'approved',
     current_date - interval '40 days', current_date - interval '40 days')
    RETURNING id INTO comment_1_id;

    -- threaded reply to comment_1 by the original author
    INSERT INTO blog.comments (post_id, user_id, parent_id, author_name, author_email, content, status, created_at, updated_at) VALUES
    (post_1_id, user_1_id, comment_1_id, 'John Doe', 'user@supasheet.dev',
     'Thanks Jane — that section took the longest to write. Glad it landed.',
     'approved',
     current_date - interval '39 days', current_date - interval '39 days');

    INSERT INTO blog.comments (id, post_id, user_id, parent_id, author_name, author_email, content, status, created_at, updated_at) VALUES
    (gen_random_uuid(), post_2_id, user_1_id, NULL, 'John Doe', 'user@supasheet.dev',
     'The early-morning Fushimi tip is gold. Confirming: 5am is correct, 6am is already busy.',
     'approved',
     current_date - interval '28 days', current_date - interval '28 days')
    RETURNING id INTO comment_3_id;

    INSERT INTO blog.comments (post_id, user_id, parent_id, author_name, author_email, content, status, created_at, updated_at) VALUES
    (post_3_id, user_1_id, NULL, 'Jane Smith', 'user@supasheet.dev',
     'Tried the recipe over the weekend with 75% hydration — slightly wetter crumb, still excellent.',
     'approved',
     current_date - interval '15 days', current_date - interval '15 days');

    -- pending (awaits moderation)
    INSERT INTO blog.comments (post_id, user_id, parent_id, author_name, author_email, content, status, created_at, updated_at) VALUES
    (post_4_id, user_1_id, NULL, 'Jane Smith', 'user@supasheet.dev',
     'Would love a follow-up on auth middleware patterns — JWT vs session cookies for an Express API.',
     'pending',
     current_date - interval '4 days', current_date - interval '4 days');

    INSERT INTO blog.comments (post_id, user_id, parent_id, author_name, author_email, content, status, created_at, updated_at) VALUES
    (post_7_id, user_1_id, NULL, 'Jane Smith', 'user@supasheet.dev',
     'The retail analytics example matches what we''re seeing on the ground. Bandwidth costs are the hidden tax.',
     'pending',
     current_date - interval '2 days', current_date - interval '2 days');

    RAISE NOTICE 'Blog seed inserted: 21 authors, 6 categories, 12 posts (8 published / 2 drafts / 1 scheduled / 1 archived), 6 comments';
END $$;
