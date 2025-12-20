
----------------------------------------------------------------
-- Seed Data
----------------------------------------------------------------

INSERT INTO data_type_samples (
  account_id,
  char_field, varchar_field, text_field,
  smallint_val, integer_val, bigint_val, real_val, double_val, numeric_val,
  money_val, bool_val,
  bit_val, varbit_val, bytea_val,
  date_val, time_val, timetz_val, timestamp_val,
  uuid_val, json_val, jsonb_val,
  text_array, int_array,
  status,
  email_val, tel_val, url_val, rating_val, percentage_val, color_val, duration_val, rich_text_val
) VALUES
  -- Row 1: Standard values
  (
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
    'ABCDE', 'Sample text value', 'This is a longer text field for testing purposes',
    100, 50000, 9223372036854775807, 3.14, 3.141592653589793, 12345.67,
    '$99.99', true,
    B'10101010', B'1100110011', E'\\xDEADBEEF',
    '2025-01-15', '14:30:00', '14:30:00-05', '2025-01-15 14:30:00',
    gen_random_uuid(), '{"key": "value", "nested": {"a": 1}}', '{"name": "test", "count": 42, "tags": ["alpha", "beta"]}',
    ARRAY['tag1', 'tag2', 'tag3'], ARRAY[1, 2, 3, 4, 5],
    'active',
    'john.doe@example.com', '+1-555-0101', 'https://example.com', 4.5, 75.5, '#3b82f6', 86400000, '<p>This is <strong>rich text</strong> content.</p>'
  ),
  -- Row 2: Edge case values (min/max)
  (
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
    'ZZZZZ', 'Edge case testing', 'Testing minimum and maximum values for various numeric types',
    -32768, -2147483648, -9223372036854775808, -1.5, -999.999, -99999.99,
    '$0.01', false,
    B'11111111', B'0011001100', E'\\xCAFEBABE',
    '2020-12-31', '23:59:59', '23:59:59+00', '2020-12-31 23:59:59',
    gen_random_uuid(), '{"empty": null, "zero": 0}', '{"min": true, "max": false}',
    ARRAY['min', 'max'], ARRAY[-1, 0, 1],
    'pending',
    'jane.smith@example.com', '+1-555-0202', 'https://test.example.com', 2.0, 25.0, '#ef4444', 3600000, '<h1>Heading</h1><p>Paragraph with <em>emphasis</em>.</p>'
  ),
  -- Row 3: Null values (sparse record)
  (
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
    null, 'Sparse record', null,
    null, null, null, null, null, null,
    null, null,
    null, null, null,
    null, null, null, null,
    null, null, null,
    null, null,
    'draft',
    null, null, null, null, null, null, null, null
  ),
  -- Row 4: Another active record
  (
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
    '12345', 'Product inventory item', 'Detailed description of the inventory item with specifications',
    500, 100000, 1234567890123, 9.99, 19.99, 499.95,
    '$249.99', true,
    B'01010101', B'1111000011110000', E'\\xBEEFCAFE',
    '2025-06-15', '09:00:00', '09:00:00-08', '2025-06-15 09:00:00',
    gen_random_uuid(), '{"category": "electronics", "brand": "TechCo"}', '{"inStock": true, "quantity": 150, "warehouse": "A1"}',
    ARRAY['electronics', 'sale', 'featured'], ARRAY[10, 20, 30, 40],
    'active',
    'inventory@example.com', '+1-800-555-1234', 'https://shop.example.com/item/123', 4.8, 90.0, '#10b981', 172800000, '<p>Premium quality product with <a href="#">warranty</a>.</p>'
  ),
  -- Row 5: Archived record
  (
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
    'ARCHV', 'Archived data sample', 'This record has been archived and is no longer active',
    1, 1, 1, 0.1, 0.001, 0.01,
    '$1.00', false,
    B'00000001', B'1', E'\\x00',
    '2023-01-01', '00:00:00', '00:00:00+00', '2023-01-01 00:00:00',
    gen_random_uuid(), '{"archived": true}', '{"reason": "outdated", "archivedBy": "system"}',
    ARRAY['archived', 'legacy'], ARRAY[0],
    'archived',
    'archive@example.com', '+1-555-0000', 'https://archive.example.com', 1.0, 0.0, '#6b7280', 0, '<p><s>Deprecated content</s></p>'
  );
