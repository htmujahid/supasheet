-- Blog Schema Seed Data
-- This file contains seed data for the blog schema tables

DO $$
DECLARE
    -- Account IDs - using the specific UUIDs from seed.sql
    account_1_id UUID := 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4';
    account_2_id UUID := 'b73eb03e-fb7a-424d-84ff-18e2791ce0b1';

    -- Author IDs
    author_1_id UUID;
    author_2_id UUID;

    -- Category IDs
    tech_cat_id UUID;
    travel_cat_id UUID;
    food_cat_id UUID;
    lifestyle_cat_id UUID;
    tutorial_cat_id UUID;
    news_cat_id UUID;

    -- Post IDs
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
BEGIN
    -- Create Authors
    INSERT INTO blog.authors (id, account_id, language, country, created_at, updated_at) VALUES
    (gen_random_uuid(), account_1_id, 'en', 'US', current_date - interval '180 days', current_timestamp)
    RETURNING id INTO author_1_id;

    INSERT INTO blog.authors (id, account_id, language, country, created_at, updated_at) VALUES
    (gen_random_uuid(), account_2_id, 'en', 'US', current_date - interval '120 days', current_timestamp)
    RETURNING id INTO author_2_id;

    -- Create Social Links
    INSERT INTO blog.social_links (author_id, github, twitter) VALUES
    (author_1_id, 'https://github.com/johndoe', 'https://twitter.com/johndoe'),
    (author_2_id, 'https://github.com/janesmith', 'https://twitter.com/janesmith');

    -- Create Categories
    INSERT INTO blog.categories (id, name, slug, description, account_id) VALUES
    (gen_random_uuid(), 'Technology', 'technology', 'All about the latest in tech and software development', NULL)
    RETURNING id INTO tech_cat_id;

    INSERT INTO blog.categories (id, name, slug, description, account_id) VALUES
    (gen_random_uuid(), 'Travel', 'travel', 'Travel stories and destination guides', NULL)
    RETURNING id INTO travel_cat_id;

    INSERT INTO blog.categories (id, name, slug, description, account_id) VALUES
    (gen_random_uuid(), 'Food & Recipes', 'food-recipes', 'Delicious recipes and culinary adventures', NULL)
    RETURNING id INTO food_cat_id;

    INSERT INTO blog.categories (id, name, slug, description, account_id) VALUES
    (gen_random_uuid(), 'Lifestyle', 'lifestyle', 'Tips and insights for everyday living', NULL)
    RETURNING id INTO lifestyle_cat_id;

    INSERT INTO blog.categories (id, name, slug, description, account_id) VALUES
    (gen_random_uuid(), 'Tutorials', 'tutorials', 'Step-by-step guides and how-tos', account_1_id)
    RETURNING id INTO tutorial_cat_id;

    INSERT INTO blog.categories (id, name, slug, description, account_id) VALUES
    (gen_random_uuid(), 'News', 'news', 'Latest news and updates', NULL)
    RETURNING id INTO news_cat_id;

    -- Create Blog Posts

    -- Post 1: Published tech post by author 1
    INSERT INTO blog.posts (id, author_id, title, slug, content, published_at, created_at, updated_at) VALUES
    (gen_random_uuid(), author_1_id,
     'Getting Started with PostgreSQL Row Level Security',
     'getting-started-with-postgresql-row-level-security',
     E'# Getting Started with PostgreSQL Row Level Security\n\n' ||
     E'Row Level Security (RLS) is a powerful feature in PostgreSQL that allows you to control which rows users can access in database tables. ' ||
     E'This is particularly useful for multi-tenant applications where you want to ensure that users can only see their own data.\n\n' ||
     E'## What is Row Level Security?\n\n' ||
     E'RLS policies are expressions that PostgreSQL evaluates for each row. If the policy expression returns true, the row is visible to the user; ' ||
     E'otherwise, it''s hidden. This happens at the database level, making it a robust security mechanism.\n\n' ||
     E'## Setting Up RLS\n\n' ||
     E'Here''s a simple example:\n\n' ||
     E'```sql\n' ||
     E'ALTER TABLE documents ENABLE ROW LEVEL SECURITY;\n\n' ||
     E'CREATE POLICY user_documents ON documents\n' ||
     E'FOR ALL USING (user_id = current_user_id());\n' ||
     E'```\n\n' ||
     E'This policy ensures that users can only access documents where the user_id matches their own ID.\n\n' ||
     E'## Best Practices\n\n' ||
     E'1. Always enable RLS on tables containing user data\n' ||
     E'2. Write clear, simple policies that are easy to understand\n' ||
     E'3. Test your policies thoroughly\n' ||
     E'4. Consider performance implications for complex policies\n\n' ||
     E'Row Level Security is an essential tool for building secure applications. Start using it today!',
     current_date - interval '45 days',
     current_date - interval '50 days',
     current_date - interval '45 days')
    RETURNING id INTO post_1_id;

    -- Post 2: Published travel post by author 2
    INSERT INTO blog.posts (id, author_id, title, slug, content, published_at, created_at, updated_at) VALUES
    (gen_random_uuid(), author_2_id,
     'Hidden Gems of Kyoto: A Local''s Guide',
     'hidden-gems-of-kyoto-locals-guide',
     E'# Hidden Gems of Kyoto: A Local''s Guide\n\n' ||
     E'Kyoto is known for its stunning temples and traditional gardens, but beyond the tourist hotspots lie countless hidden treasures waiting to be discovered.\n\n' ||
     E'## 1. Fushimi Inari Early Morning\n\n' ||
     E'While Fushimi Inari is famous, most tourists don''t know the magic of visiting at 5 AM. The torii gates are practically empty, and you can hear the birds chirping as the sun rises.\n\n' ||
     E'## 2. Philosopher''s Path in Autumn\n\n' ||
     E'This canal-side path becomes a tunnel of red and gold leaves in November. Local cafes along the way serve the best matcha you''ll ever taste.\n\n' ||
     E'## 3. Nishiki Market Side Alleys\n\n' ||
     E'Everyone visits Nishiki Market, but the real treasures are in the tiny side alleys where local artisans sell handcrafted goods and traditional sweets.\n\n' ||
     E'## 4. Arashiyama Bamboo Grove at Dusk\n\n' ||
     E'Skip the crowded daytime visit and come at dusk when the grove is lit up and almost empty. The experience is surreal and peaceful.\n\n' ||
     E'Kyoto rewards those who venture off the beaten path. Take your time, explore slowly, and you''ll discover the true spirit of this ancient city.',
     current_date - interval '30 days',
     current_date - interval '35 days',
     current_date - interval '30 days')
    RETURNING id INTO post_2_id;

    -- Post 3: Published food post by author 1
    INSERT INTO blog.posts (id, author_id, title, slug, content, published_at, created_at, updated_at) VALUES
    (gen_random_uuid(), author_1_id,
     'Perfect Homemade Sourdough Bread Recipe',
     'perfect-homemade-sourdough-bread-recipe',
     E'# Perfect Homemade Sourdough Bread Recipe\n\n' ||
     E'After years of experimentation, I''ve finally perfected my sourdough bread recipe. The secret? Patience and understanding your starter.\n\n' ||
     E'## Ingredients\n\n' ||
     E'- 500g bread flour\n- 350g water (70% hydration)\n- 100g active sourdough starter\n- 10g salt\n\n' ||
     E'## Method\n\n' ||
     E'### Day 1 - Morning\n' ||
     E'1. Mix flour and water, let rest for 30 minutes (autolyse)\n' ||
     E'2. Add starter and salt, mix thoroughly\n' ||
     E'3. Perform 4 sets of stretch and folds every 30 minutes\n\n' ||
     E'### Day 1 - Evening\n' ||
     E'4. Shape the dough and place in a banneton\n' ||
     E'5. Refrigerate overnight (cold fermentation)\n\n' ||
     E'### Day 2 - Morning\n' ||
     E'6. Preheat Dutch oven to 500°F\n' ||
     E'7. Score the dough and bake covered for 20 minutes\n' ||
     E'8. Remove lid, reduce heat to 450°F, bake 25 more minutes\n\n' ||
     E'## Tips for Success\n\n' ||
     E'- Use a kitchen scale for accuracy\n- Room temperature affects fermentation time\n- A strong, active starter is crucial\n- Don''t skip the cold fermentation\n\n' ||
     E'The result is a crusty exterior with a chewy, tangy interior. Pure bliss!',
     current_date - interval '20 days',
     current_date - interval '22 days',
     current_date - interval '20 days')
    RETURNING id INTO post_3_id;

    -- Post 4: Published tech tutorial by author 1
    INSERT INTO blog.posts (id, author_id, title, slug, content, published_at, created_at, updated_at) VALUES
    (gen_random_uuid(), author_1_id,
     'Building a REST API with Node.js and Express',
     'building-rest-api-nodejs-express',
     E'# Building a REST API with Node.js and Express\n\n' ||
     E'Learn how to build a production-ready REST API from scratch using Node.js and Express.\n\n' ||
     E'## Setup\n\n' ||
     E'First, initialize your project:\n\n' ||
     E'```bash\n' ||
     E'npm init -y\n' ||
     E'npm install express dotenv cors helmet\n' ||
     E'npm install --save-dev nodemon\n' ||
     E'```\n\n' ||
     E'## Basic Server\n\n' ||
     E'```javascript\n' ||
     E'const express = require(''express'');\n' ||
     E'const app = express();\n\n' ||
     E'app.use(express.json());\n\n' ||
     E'app.get(''/api/health'', (req, res) => {\n' ||
     E'  res.json({ status: ''healthy'' });\n' ||
     E'});\n\n' ||
     E'app.listen(3000, () => {\n' ||
     E'  console.log(''Server running on port 3000'');\n' ||
     E'});\n' ||
     E'```\n\n' ||
     E'## CRUD Operations\n\n' ||
     E'Implement Create, Read, Update, and Delete operations:\n\n' ||
     E'```javascript\n' ||
     E'// GET all items\n' ||
     E'app.get(''/api/items'', async (req, res) => {\n' ||
     E'  // Implementation\n' ||
     E'});\n\n' ||
     E'// POST create item\n' ||
     E'app.post(''/api/items'', async (req, res) => {\n' ||
     E'  // Implementation\n' ||
     E'});\n' ||
     E'```\n\n' ||
     E'## Error Handling\n\n' ||
     E'Always implement proper error handling:\n\n' ||
     E'```javascript\n' ||
     E'app.use((err, req, res, next) => {\n' ||
     E'  console.error(err.stack);\n' ||
     E'  res.status(500).json({ error: ''Something went wrong!'' });\n' ||
     E'});\n' ||
     E'```\n\n' ||
     E'This is a foundation you can build upon for any API project!',
     current_date - interval '15 days',
     current_date - interval '18 days',
     current_date - interval '15 days')
    RETURNING id INTO post_4_id;

    -- Post 5: Draft post by author 2
    INSERT INTO blog.posts (id, author_id, title, slug, content, published_at, created_at, updated_at) VALUES
    (gen_random_uuid(), author_2_id,
     'Top 10 Productivity Apps for 2024',
     'top-10-productivity-apps-2024',
     E'# Top 10 Productivity Apps for 2024\n\n' ||
     E'*Draft - Work in progress*\n\n' ||
     E'In this post, I''ll review the best productivity apps that have helped me stay organized and efficient.\n\n' ||
     E'## 1. Notion\n- All-in-one workspace\n- Highly customizable\n\n' ||
     E'## 2. Todoist\n- Simple task management\n- Great mobile app\n\n' ||
     E'[More content to be added...]',
     NULL,
     current_date - interval '5 days',
     current_date - interval '2 days')
    RETURNING id INTO post_5_id;

    -- Post 6: Published lifestyle post by author 2
    INSERT INTO blog.posts (id, author_id, title, slug, content, published_at, created_at, updated_at) VALUES
    (gen_random_uuid(), author_2_id,
     'Morning Routines That Actually Work',
     'morning-routines-that-actually-work',
     E'# Morning Routines That Actually Work\n\n' ||
     E'I''ve tested dozens of morning routines over the past year. Here''s what actually made a difference.\n\n' ||
     E'## What Worked\n\n' ||
     E'### 1. No Phone for First Hour\n' ||
     E'This was hard but transformative. Instead of scrolling through social media, I:\n' ||
     E'- Meditate for 10 minutes\n- Journal 3 things I''m grateful for\n- Plan my top 3 priorities\n\n' ||
     E'### 2. Hydrate Before Caffeine\n' ||
     E'Drinking 16oz of water before coffee made a huge difference in my energy levels.\n\n' ||
     E'### 3. Move Your Body\n' ||
     E'Even just 15 minutes of stretching or a quick walk sets a positive tone.\n\n' ||
     E'## What Didn''t Work\n\n' ||
     E'- Waking up at 5 AM (I''m not a morning person, and that''s okay)\n' ||
     E'- Complex breakfast routines (simple is better)\n- Checking email first thing (recipe for stress)\n\n' ||
     E'## The Key Insight\n\n' ||
     E'Your morning routine should energize you, not stress you out. Start small, be consistent, and adjust based on what feels good.',
     current_date - interval '10 days',
     current_date - interval '12 days',
     current_date - interval '10 days')
    RETURNING id INTO post_6_id;

    -- Post 7: Published tech news by author 1
    INSERT INTO blog.posts (id, author_id, title, slug, content, published_at, created_at, updated_at) VALUES
    (gen_random_uuid(), author_1_id,
     'The Rise of Edge Computing in 2024',
     'rise-of-edge-computing-2024',
     E'# The Rise of Edge Computing in 2024\n\n' ||
     E'Edge computing is transforming how we process and analyze data, bringing computation closer to where data is generated.\n\n' ||
     E'## What is Edge Computing?\n\n' ||
     E'Edge computing refers to processing data near its source rather than in centralized data centers. This reduces latency and bandwidth usage.\n\n' ||
     E'## Key Benefits\n\n' ||
     E'1. **Lower Latency**: Critical for real-time applications like autonomous vehicles\n' ||
     E'2. **Reduced Bandwidth**: Less data transmitted to the cloud\n' ||
     E'3. **Enhanced Privacy**: Sensitive data can be processed locally\n' ||
     E'4. **Improved Reliability**: Less dependent on cloud connectivity\n\n' ||
     E'## Real-World Applications\n\n' ||
     E'- **IoT Devices**: Smart home devices processing data locally\n' ||
     E'- **Retail**: In-store analytics without sending video feeds to cloud\n' ||
     E'- **Healthcare**: Real-time patient monitoring\n' ||
     E'- **Manufacturing**: Predictive maintenance on factory floors\n\n' ||
     E'## Challenges\n\n' ||
     E'- Device management at scale\n- Security concerns with distributed systems\n- Standardization across platforms\n\n' ||
     E'Edge computing isn''t replacing cloud computingit''s complementing it. The future is hybrid.',
     current_date - interval '7 days',
     current_date - interval '8 days',
     current_date - interval '7 days')
    RETURNING id INTO post_7_id;

    -- Post 8: Published food post by author 2
    INSERT INTO blog.posts (id, author_id, title, slug, content, published_at, created_at, updated_at) VALUES
    (gen_random_uuid(), author_2_id,
     '15-Minute Weeknight Dinners',
     '15-minute-weeknight-dinners',
     E'# 15-Minute Weeknight Dinners\n\n' ||
     E'Busy weeknight? These quick recipes are healthy, delicious, and take just 15 minutes.\n\n' ||
     E'## 1. Garlic Shrimp Pasta\n\n' ||
     E'**Ingredients:**\n' ||
     E'- 8oz spaghetti\n- 1lb shrimp\n- 4 cloves garlic\n- Olive oil, lemon, parsley\n\n' ||
     E'**Method:** Cook pasta. Sauté garlic and shrimp. Toss together. Done!\n\n' ||
     E'## 2. Sheet Pan Chicken Fajitas\n\n' ||
     E'**Ingredients:**\n' ||
     E'- 1lb chicken breast, sliced\n- Bell peppers and onions\n- Fajita seasoning\n- Tortillas\n\n' ||
     E'**Method:** Toss everything on a sheet pan. Broil for 12 minutes. Serve in tortillas.\n\n' ||
     E'## 3. Fried Rice\n\n' ||
     E'**Ingredients:**\n' ||
     E'- 3 cups cooked rice (day-old is best)\n- 2 eggs\n- Mixed vegetables\n- Soy sauce\n\n' ||
     E'**Method:** Scramble eggs, add rice and veggies, season with soy sauce.\n\n' ||
     E'## Meal Prep Tips\n\n' ||
     E'- Keep pre-cooked rice in the freezer\n- Buy pre-cut vegetables\n- Batch cook proteins on weekends\n- Stock your pantry with basics\n\n' ||
     E'Quick doesn''t mean sacrificing flavor or nutrition!',
     current_date - interval '25 days',
     current_date - interval '27 days',
     current_date - interval '25 days')
    RETURNING id INTO post_8_id;

    -- Post 9: Draft post by author 1
    INSERT INTO blog.posts (id, author_id, title, slug, content, published_at, created_at, updated_at) VALUES
    (gen_random_uuid(), author_1_id,
     'Introduction to Docker Containers',
     'introduction-to-docker-containers',
     E'# Introduction to Docker Containers\n\n' ||
     E'*Draft*\n\n' ||
     E'Docker has revolutionized how we deploy applications. In this tutorial, we''ll cover the basics.\n\n' ||
     E'## What is Docker?\n\n' ||
     E'Docker is a platform for developing, shipping, and running applications in containers.\n\n' ||
     E'[Content in progress...]',
     NULL,
     current_date - interval '3 days',
     current_timestamp)
    RETURNING id INTO post_9_id;

    -- Post 10: Published travel post by author 2
    INSERT INTO blog.posts (id, author_id, title, slug, content, published_at, created_at, updated_at) VALUES
    (gen_random_uuid(), author_2_id,
     'Budget Travel: Europe on $50 a Day',
     'budget-travel-europe-50-per-day',
     E'# Budget Travel: Europe on $50 a Day\n\n' ||
     E'Yes, you can travel Europe on a budget! Here''s how I did it for 3 months.\n\n' ||
     E'## Accommodation ($15-20/night)\n\n' ||
     E'- **Hostels**: Book through HostelWorld or Booking.com\n' ||
     E'- **Couchsurfing**: Free and meet locals\n' ||
     E'- **House sitting**: Free accommodation in exchange for pet care\n\n' ||
     E'## Transportation ($10-15/day)\n\n' ||
     E'- **FlixBus**: Cheap intercity buses\n' ||
     E'- **BlaBlaCar**: Ridesharing across countries\n' ||
     E'- **Walking**: Best way to see cities\n\n' ||
     E'## Food ($15-20/day)\n\n' ||
     E'- **Supermarkets**: Make breakfast and lunch\n' ||
     E'- **Local markets**: Cheap, fresh produce\n' ||
     E'- **Happy hours**: Discounted dinners\n' ||
     E'- **Street food**: Authentic and affordable\n\n' ||
     E'## Activities ($5-10/day)\n\n' ||
     E'- **Free walking tours**: Tip-based\n' ||
     E'- **Museums**: Many have free days\n' ||
     E'- **Parks and beaches**: Always free\n' ||
     E'- **Student discounts**: Get an ISIC card\n\n' ||
     E'## Money-Saving Tips\n\n' ||
     E'1. Travel in shoulder season (April-May, Sept-Oct)\n' ||
     E'2. Book accommodation with kitchens\n' ||
     E'3. Use city passes for multiple attractions\n' ||
     E'4. Avoid tourist traps in city centers\n' ||
     E'5. Use travel credit cards with no foreign fees\n\n' ||
     E'Budget travel doesn''t mean missing outit means being smart and creative!',
     current_date - interval '40 days',
     current_date - interval '42 days',
     current_date - interval '40 days')
    RETURNING id INTO post_10_id;

    -- Associate posts with categories
    INSERT INTO blog.post_categories (post_id, category_id) VALUES
    -- Post 1: Tech + Tutorial
    (post_1_id, tech_cat_id),
    (post_1_id, tutorial_cat_id),

    -- Post 2: Travel
    (post_2_id, travel_cat_id),

    -- Post 3: Food
    (post_3_id, food_cat_id),

    -- Post 4: Tech + Tutorial
    (post_4_id, tech_cat_id),
    (post_4_id, tutorial_cat_id),

    -- Post 5: Tech + Lifestyle (draft)
    (post_5_id, tech_cat_id),
    (post_5_id, lifestyle_cat_id),

    -- Post 6: Lifestyle
    (post_6_id, lifestyle_cat_id),

    -- Post 7: Tech + News
    (post_7_id, tech_cat_id),
    (post_7_id, news_cat_id),

    -- Post 8: Food
    (post_8_id, food_cat_id),

    -- Post 9: Tech + Tutorial (draft)
    (post_9_id, tech_cat_id),
    (post_9_id, tutorial_cat_id),

    -- Post 10: Travel + Lifestyle
    (post_10_id, travel_cat_id),
    (post_10_id, lifestyle_cat_id);

    RAISE NOTICE 'Blog schema seed data inserted successfully';
    RAISE NOTICE 'Created % authors, % categories, and % posts', 2, 6, 10;
END $$;
