-- Finance Schema Seed Data
-- This file contains seed data for the finance schema tables

-- First, let's get or create a test account
DO $$
DECLARE
    -- Hardcoded account ID
    test_account_id UUID := 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4';
    test_account_2_id UUID := 'c84fc04f-ac8b-535e-95ff-29f3892df1c5';
    salary_cat_id INTEGER;
    freelance_cat_id INTEGER;
    investment_cat_id INTEGER;
    groceries_cat_id INTEGER;
    restaurants_cat_id INTEGER;
    rent_cat_id INTEGER;
    utilities_cat_id INTEGER;
    transport_cat_id INTEGER;
    healthcare_cat_id INTEGER;
    entertainment_cat_id INTEGER;
    shopping_cat_id INTEGER;
    insurance_cat_id INTEGER;
    gas_cat_id INTEGER;
    transfer_cat_id INTEGER;
BEGIN
    -- Account IDs are already hardcoded above

    -- Get category IDs
    SELECT id INTO salary_cat_id FROM finance.categories WHERE name = 'Salary';
    SELECT id INTO freelance_cat_id FROM finance.categories WHERE name = 'Freelance';
    SELECT id INTO investment_cat_id FROM finance.categories WHERE name = 'Investment Returns';
    SELECT id INTO groceries_cat_id FROM finance.categories WHERE name = 'Groceries';
    SELECT id INTO restaurants_cat_id FROM finance.categories WHERE name = 'Restaurants';
    SELECT id INTO rent_cat_id FROM finance.categories WHERE name = 'Rent/Mortgage';
    SELECT id INTO utilities_cat_id FROM finance.categories WHERE name = 'Utilities';
    SELECT id INTO transport_cat_id FROM finance.categories WHERE name = 'Transportation';
    SELECT id INTO healthcare_cat_id FROM finance.categories WHERE name = 'Healthcare';
    SELECT id INTO entertainment_cat_id FROM finance.categories WHERE name = 'Entertainment';
    SELECT id INTO shopping_cat_id FROM finance.categories WHERE name = 'Shopping';
    SELECT id INTO insurance_cat_id FROM finance.categories WHERE name = 'Insurance';
    SELECT id INTO gas_cat_id FROM finance.categories WHERE name = 'Gas';
    SELECT id INTO transfer_cat_id FROM finance.categories WHERE name = 'Transfer';

    -- Seed Account Balances
    INSERT INTO finance.account_balances (account_id, balance, currency) VALUES
    (test_account_id, 15250.75, 'USD')
    ON CONFLICT (account_id) DO UPDATE 
    SET balance = EXCLUDED.balance, updated_at = CURRENT_TIMESTAMP;

    -- Seed Transactions (3 months of data)
    -- Income transactions
    INSERT INTO finance.transactions (account_id, category_id, amount, description, transaction_date, type, reference_number) VALUES
    -- Monthly salaries
    (test_account_id, salary_cat_id, 5500.00, 'Monthly Salary - January', CURRENT_DATE - INTERVAL '60 days', 'income', 'SAL-2024-01'),
    (test_account_id, salary_cat_id, 5500.00, 'Monthly Salary - February', CURRENT_DATE - INTERVAL '30 days', 'income', 'SAL-2024-02'),
    (test_account_id, salary_cat_id, 5500.00, 'Monthly Salary - March', CURRENT_DATE, 'income', 'SAL-2024-03'),
    
    -- Freelance income
    (test_account_id, freelance_cat_id, 1200.00, 'Website Development Project', CURRENT_DATE - INTERVAL '45 days', 'income', 'FR-001'),
    (test_account_id, freelance_cat_id, 800.00, 'Logo Design Project', CURRENT_DATE - INTERVAL '20 days', 'income', 'FR-002'),
    (test_account_id, freelance_cat_id, 1500.00, 'Mobile App Consultation', CURRENT_DATE - INTERVAL '5 days', 'income', 'FR-003'),
    
    -- Investment returns
    (test_account_id, investment_cat_id, 250.50, 'Dividend Payment - VTSAX', CURRENT_DATE - INTERVAL '35 days', 'income', 'DIV-001'),
    (test_account_id, investment_cat_id, 175.25, 'Interest Payment', CURRENT_DATE - INTERVAL '10 days', 'income', 'INT-001');

    -- Expense transactions
    INSERT INTO finance.transactions (account_id, category_id, amount, description, transaction_date, type, notes) VALUES
    -- Rent/Mortgage (monthly)
    (test_account_id, rent_cat_id, 2000.00, 'Monthly Rent Payment', CURRENT_DATE - INTERVAL '55 days', 'expense', 'Apartment rent for January'),
    (test_account_id, rent_cat_id, 2000.00, 'Monthly Rent Payment', CURRENT_DATE - INTERVAL '25 days', 'expense', 'Apartment rent for February'),
    (test_account_id, rent_cat_id, 2000.00, 'Monthly Rent Payment', CURRENT_DATE - INTERVAL '1 day', 'expense', 'Apartment rent for March'),
    
    -- Groceries (weekly)
    (test_account_id, groceries_cat_id, 125.50, 'Whole Foods', CURRENT_DATE - INTERVAL '56 days', 'expense', NULL),
    (test_account_id, groceries_cat_id, 87.25, 'Trader Joes', CURRENT_DATE - INTERVAL '49 days', 'expense', NULL),
    (test_account_id, groceries_cat_id, 145.80, 'Costco', CURRENT_DATE - INTERVAL '42 days', 'expense', 'Monthly bulk shopping'),
    (test_account_id, groceries_cat_id, 92.15, 'Safeway', CURRENT_DATE - INTERVAL '35 days', 'expense', NULL),
    (test_account_id, groceries_cat_id, 118.90, 'Whole Foods', CURRENT_DATE - INTERVAL '28 days', 'expense', NULL),
    (test_account_id, groceries_cat_id, 76.40, 'Local Market', CURRENT_DATE - INTERVAL '21 days', 'expense', 'Fresh produce'),
    (test_account_id, groceries_cat_id, 134.25, 'Target', CURRENT_DATE - INTERVAL '14 days', 'expense', NULL),
    (test_account_id, groceries_cat_id, 98.50, 'Trader Joes', CURRENT_DATE - INTERVAL '7 days', 'expense', NULL),
    (test_account_id, groceries_cat_id, 156.75, 'Costco', CURRENT_DATE - INTERVAL '2 days', 'expense', 'Monthly bulk shopping'),
    
    -- Restaurants
    (test_account_id, restaurants_cat_id, 45.80, 'Italian Restaurant', CURRENT_DATE - INTERVAL '50 days', 'expense', 'Date night'),
    (test_account_id, restaurants_cat_id, 28.50, 'Sushi Place', CURRENT_DATE - INTERVAL '43 days', 'expense', NULL),
    (test_account_id, restaurants_cat_id, 67.25, 'Steakhouse', CURRENT_DATE - INTERVAL '36 days', 'expense', 'Birthday dinner'),
    (test_account_id, restaurants_cat_id, 32.15, 'Thai Restaurant', CURRENT_DATE - INTERVAL '29 days', 'expense', NULL),
    (test_account_id, restaurants_cat_id, 54.90, 'Mexican Restaurant', CURRENT_DATE - INTERVAL '22 days', 'expense', 'Family dinner'),
    (test_account_id, restaurants_cat_id, 38.60, 'Pizza Place', CURRENT_DATE - INTERVAL '15 days', 'expense', NULL),
    (test_account_id, restaurants_cat_id, 42.75, 'Chinese Restaurant', CURRENT_DATE - INTERVAL '8 days', 'expense', NULL),
    (test_account_id, restaurants_cat_id, 58.30, 'French Bistro', CURRENT_DATE - INTERVAL '3 days', 'expense', 'Anniversary dinner'),
    
    -- Utilities
    (test_account_id, utilities_cat_id, 120.00, 'Electricity Bill', CURRENT_DATE - INTERVAL '52 days', 'expense', NULL),
    (test_account_id, utilities_cat_id, 45.00, 'Gas Bill', CURRENT_DATE - INTERVAL '51 days', 'expense', NULL),
    (test_account_id, utilities_cat_id, 80.00, 'Internet & Cable', CURRENT_DATE - INTERVAL '50 days', 'expense', NULL),
    (test_account_id, utilities_cat_id, 35.00, 'Water Bill', CURRENT_DATE - INTERVAL '49 days', 'expense', NULL),
    (test_account_id, utilities_cat_id, 125.00, 'Electricity Bill', CURRENT_DATE - INTERVAL '22 days', 'expense', NULL),
    (test_account_id, utilities_cat_id, 42.00, 'Gas Bill', CURRENT_DATE - INTERVAL '21 days', 'expense', NULL),
    (test_account_id, utilities_cat_id, 80.00, 'Internet & Cable', CURRENT_DATE - INTERVAL '20 days', 'expense', NULL),
    (test_account_id, utilities_cat_id, 38.00, 'Water Bill', CURRENT_DATE - INTERVAL '19 days', 'expense', NULL),
    
    -- Transportation/Gas
    (test_account_id, gas_cat_id, 45.50, 'Shell Gas Station', CURRENT_DATE - INTERVAL '48 days', 'expense', NULL),
    (test_account_id, gas_cat_id, 52.25, 'Chevron', CURRENT_DATE - INTERVAL '41 days', 'expense', NULL),
    (test_account_id, gas_cat_id, 48.75, 'Shell Gas Station', CURRENT_DATE - INTERVAL '34 days', 'expense', NULL),
    (test_account_id, gas_cat_id, 55.00, '76 Gas Station', CURRENT_DATE - INTERVAL '27 days', 'expense', NULL),
    (test_account_id, gas_cat_id, 50.50, 'Chevron', CURRENT_DATE - INTERVAL '20 days', 'expense', NULL),
    (test_account_id, gas_cat_id, 47.25, 'Shell Gas Station', CURRENT_DATE - INTERVAL '13 days', 'expense', NULL),
    (test_account_id, gas_cat_id, 53.75, 'Costco Gas', CURRENT_DATE - INTERVAL '6 days', 'expense', 'Cheapest gas in town'),
    
    -- Healthcare
    (test_account_id, healthcare_cat_id, 25.00, 'Prescription Medication', CURRENT_DATE - INTERVAL '45 days', 'expense', 'Monthly medication'),
    (test_account_id, healthcare_cat_id, 150.00, 'Doctor Visit Copay', CURRENT_DATE - INTERVAL '38 days', 'expense', 'Annual checkup'),
    (test_account_id, healthcare_cat_id, 25.00, 'Prescription Medication', CURRENT_DATE - INTERVAL '15 days', 'expense', 'Monthly medication'),
    (test_account_id, healthcare_cat_id, 75.00, 'Dental Cleaning', CURRENT_DATE - INTERVAL '10 days', 'expense', 'Bi-annual cleaning'),
    
    -- Entertainment
    (test_account_id, entertainment_cat_id, 15.99, 'Netflix Subscription', CURRENT_DATE - INTERVAL '50 days', 'expense', NULL),
    (test_account_id, entertainment_cat_id, 45.00, 'Movie Theater', CURRENT_DATE - INTERVAL '44 days', 'expense', 'Two tickets'),
    (test_account_id, entertainment_cat_id, 89.99, 'Concert Tickets', CURRENT_DATE - INTERVAL '37 days', 'expense', NULL),
    (test_account_id, entertainment_cat_id, 15.99, 'Netflix Subscription', CURRENT_DATE - INTERVAL '20 days', 'expense', NULL),
    (test_account_id, entertainment_cat_id, 12.99, 'Spotify Premium', CURRENT_DATE - INTERVAL '20 days', 'expense', NULL),
    (test_account_id, entertainment_cat_id, 35.00, 'Bowling Night', CURRENT_DATE - INTERVAL '12 days', 'expense', 'Team outing'),
    (test_account_id, entertainment_cat_id, 65.00, 'Theme Park', CURRENT_DATE - INTERVAL '5 days', 'expense', NULL),
    
    -- Shopping
    (test_account_id, shopping_cat_id, 125.50, 'Amazon - Electronics', CURRENT_DATE - INTERVAL '46 days', 'expense', 'New headphones'),
    (test_account_id, shopping_cat_id, 89.99, 'Target - Clothing', CURRENT_DATE - INTERVAL '39 days', 'expense', NULL),
    (test_account_id, shopping_cat_id, 245.00, 'Best Buy - Laptop Accessories', CURRENT_DATE - INTERVAL '32 days', 'expense', 'Monitor and keyboard'),
    (test_account_id, shopping_cat_id, 67.50, 'Amazon - Books', CURRENT_DATE - INTERVAL '25 days', 'expense', NULL),
    (test_account_id, shopping_cat_id, 156.75, 'Nike Store', CURRENT_DATE - INTERVAL '18 days', 'expense', 'Running shoes'),
    (test_account_id, shopping_cat_id, 43.25, 'Target - Home Goods', CURRENT_DATE - INTERVAL '11 days', 'expense', NULL),
    (test_account_id, shopping_cat_id, 78.90, 'Amazon - Kitchen', CURRENT_DATE - INTERVAL '4 days', 'expense', 'Air fryer'),
    
    -- Insurance
    (test_account_id, insurance_cat_id, 185.00, 'Auto Insurance', CURRENT_DATE - INTERVAL '55 days', 'expense', 'Monthly premium'),
    (test_account_id, insurance_cat_id, 250.00, 'Health Insurance', CURRENT_DATE - INTERVAL '55 days', 'expense', 'Monthly premium'),
    (test_account_id, insurance_cat_id, 185.00, 'Auto Insurance', CURRENT_DATE - INTERVAL '25 days', 'expense', 'Monthly premium'),
    (test_account_id, insurance_cat_id, 250.00, 'Health Insurance', CURRENT_DATE - INTERVAL '25 days', 'expense', 'Monthly premium');

    -- Transfer transactions
    INSERT INTO finance.transactions (account_id, category_id, amount, description, transaction_date, type, transfer_account_id, notes) VALUES
    (test_account_id, transfer_cat_id, 1000.00, 'Transfer to Savings', CURRENT_DATE - INTERVAL '45 days', 'transfer', NULL, 'Monthly savings'),
    (test_account_id, transfer_cat_id, 1000.00, 'Transfer to Savings', CURRENT_DATE - INTERVAL '15 days', 'transfer', NULL, 'Monthly savings');

    -- Seed Budgets
    INSERT INTO finance.budgets (name, category_id, amount, period, start_date, end_date, is_active) VALUES
    ('Grocery Budget', groceries_cat_id, 600.00, 'monthly', DATE_TRUNC('month', CURRENT_DATE), NULL, TRUE),
    ('Restaurant Budget', restaurants_cat_id, 300.00, 'monthly', DATE_TRUNC('month', CURRENT_DATE), NULL, TRUE),
    ('Entertainment Budget', entertainment_cat_id, 200.00, 'monthly', DATE_TRUNC('month', CURRENT_DATE), NULL, TRUE),
    ('Gas Budget', gas_cat_id, 250.00, 'monthly', DATE_TRUNC('month', CURRENT_DATE), NULL, TRUE),
    ('Shopping Budget', shopping_cat_id, 500.00, 'monthly', DATE_TRUNC('month', CURRENT_DATE), NULL, TRUE),
    ('Annual Insurance', insurance_cat_id, 5400.00, 'yearly', DATE_TRUNC('year', CURRENT_DATE), NULL, TRUE),
    ('Quarterly Utilities', utilities_cat_id, 900.00, 'quarterly', DATE_TRUNC('quarter', CURRENT_DATE), NULL, TRUE);

    -- Seed Recurring Transactions
    INSERT INTO finance.recurring_transactions (account_id, category_id, amount, description, type, frequency, start_date, end_date, next_due_date, is_active) VALUES
    (test_account_id, salary_cat_id, 5500.00, 'Monthly Salary', 'income', 'monthly', DATE_TRUNC('month', CURRENT_DATE - INTERVAL '3 months'), NULL, DATE_TRUNC('month', CURRENT_DATE + INTERVAL '1 month'), TRUE),
    (test_account_id, rent_cat_id, 2000.00, 'Monthly Rent', 'expense', 'monthly', DATE_TRUNC('month', CURRENT_DATE - INTERVAL '12 months'), NULL, DATE_TRUNC('month', CURRENT_DATE + INTERVAL '1 month') + INTERVAL '1 day', TRUE),
    (test_account_id, utilities_cat_id, 120.00, 'Electricity Bill', 'expense', 'monthly', DATE_TRUNC('month', CURRENT_DATE - INTERVAL '6 months'), NULL, DATE_TRUNC('month', CURRENT_DATE + INTERVAL '1 month') + INTERVAL '5 days', TRUE),
    (test_account_id, utilities_cat_id, 45.00, 'Gas Bill', 'expense', 'monthly', DATE_TRUNC('month', CURRENT_DATE - INTERVAL '6 months'), NULL, DATE_TRUNC('month', CURRENT_DATE + INTERVAL '1 month') + INTERVAL '6 days', TRUE),
    (test_account_id, utilities_cat_id, 80.00, 'Internet & Cable', 'expense', 'monthly', DATE_TRUNC('month', CURRENT_DATE - INTERVAL '12 months'), NULL, DATE_TRUNC('month', CURRENT_DATE + INTERVAL '1 month') + INTERVAL '10 days', TRUE),
    (test_account_id, utilities_cat_id, 35.00, 'Water Bill', 'expense', 'monthly', DATE_TRUNC('month', CURRENT_DATE - INTERVAL '12 months'), NULL, DATE_TRUNC('month', CURRENT_DATE + INTERVAL '1 month') + INTERVAL '8 days', TRUE),
    (test_account_id, insurance_cat_id, 185.00, 'Auto Insurance', 'expense', 'monthly', DATE_TRUNC('month', CURRENT_DATE - INTERVAL '24 months'), NULL, DATE_TRUNC('month', CURRENT_DATE + INTERVAL '1 month') + INTERVAL '15 days', TRUE),
    (test_account_id, insurance_cat_id, 250.00, 'Health Insurance', 'expense', 'monthly', DATE_TRUNC('month', CURRENT_DATE - INTERVAL '24 months'), NULL, DATE_TRUNC('month', CURRENT_DATE + INTERVAL '1 month') + INTERVAL '15 days', TRUE),
    (test_account_id, entertainment_cat_id, 15.99, 'Netflix Subscription', 'expense', 'monthly', DATE_TRUNC('month', CURRENT_DATE - INTERVAL '18 months'), NULL, DATE_TRUNC('month', CURRENT_DATE + INTERVAL '1 month') + INTERVAL '12 days', TRUE),
    (test_account_id, entertainment_cat_id, 12.99, 'Spotify Premium', 'expense', 'monthly', DATE_TRUNC('month', CURRENT_DATE - INTERVAL '24 months'), NULL, DATE_TRUNC('month', CURRENT_DATE + INTERVAL '1 month') + INTERVAL '5 days', TRUE),
    (test_account_id, transfer_cat_id, 1000.00, 'Monthly Savings Transfer', 'transfer', 'monthly', DATE_TRUNC('month', CURRENT_DATE - INTERVAL '6 months'), NULL, DATE_TRUNC('month', CURRENT_DATE + INTERVAL '1 month') + INTERVAL '25 days', TRUE),
    (test_account_id, healthcare_cat_id, 25.00, 'Prescription Medication', 'expense', 'monthly', DATE_TRUNC('month', CURRENT_DATE - INTERVAL '12 months'), NULL, DATE_TRUNC('month', CURRENT_DATE + INTERVAL '1 month') + INTERVAL '3 days', TRUE),
    (test_account_id, investment_cat_id, 250.00, 'Dividend Payment', 'income', 'quarterly', DATE_TRUNC('quarter', CURRENT_DATE - INTERVAL '12 months'), NULL, DATE_TRUNC('quarter', CURRENT_DATE + INTERVAL '3 months') + INTERVAL '15 days', TRUE);

    -- Seed Financial Goals
    INSERT INTO finance.financial_goals (name, description, target_amount, current_amount, target_date, priority, is_completed) VALUES
    ('Emergency Fund', 'Build 6 months of expenses emergency fund', 30000.00, 15000.00, CURRENT_DATE + INTERVAL '12 months', 5, FALSE),
    ('Vacation Fund', 'Save for European vacation', 5000.00, 1250.00, CURRENT_DATE + INTERVAL '8 months', 3, FALSE),
    ('New Car Down Payment', 'Save for 20% down payment on new car', 8000.00, 3200.00, CURRENT_DATE + INTERVAL '6 months', 4, FALSE),
    ('Home Down Payment', 'Save for house down payment', 60000.00, 25000.00, CURRENT_DATE + INTERVAL '24 months', 5, FALSE),
    ('Christmas Shopping', 'Holiday gift budget', 1500.00, 1500.00, CURRENT_DATE - INTERVAL '30 days', 2, TRUE),
    ('Debt Payoff', 'Pay off credit card debt', 3000.00, 2100.00, CURRENT_DATE + INTERVAL '4 months', 5, FALSE),
    ('Investment Goal', 'Increase investment portfolio', 10000.00, 4500.00, CURRENT_DATE + INTERVAL '10 months', 3, FALSE),
    ('Home Improvement', 'Kitchen renovation fund', 15000.00, 500.00, CURRENT_DATE + INTERVAL '18 months', 2, FALSE),
    ('Education Fund', 'Professional certification courses', 2000.00, 800.00, CURRENT_DATE + INTERVAL '3 months', 4, FALSE),
    ('Retirement Boost', 'Extra retirement contributions', 6000.00, 1500.00, CURRENT_DATE + INTERVAL '12 months', 4, FALSE);

    RAISE NOTICE 'Finance schema seed data inserted successfully';
END $$;