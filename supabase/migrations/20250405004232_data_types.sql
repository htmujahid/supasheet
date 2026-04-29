CREATE TYPE supasheet.FILE_OBJECT AS (
  name VARCHAR(255),
  type VARCHAR(100),
  size BIGINT,
  url TEXT,
  last_modified TIMESTAMP
);

CREATE DOMAIN supasheet.FILE AS supasheet.FILE_OBJECT[];

CREATE DOMAIN supasheet.EMAIL AS text;

CREATE DOMAIN supasheet.TEL AS text;

CREATE DOMAIN supasheet.RATING AS real CHECK (value >= 0 AND value <= 5);

CREATE DOMAIN supasheet.PERCENTAGE AS real;

CREATE DOMAIN supasheet.URL AS text;

CREATE DOMAIN supasheet.DURATION AS bigint;

CREATE DOMAIN supasheet.COLOR AS varchar(16);

CREATE DOMAIN supasheet.AVATAR AS supasheet.FILE_OBJECT;

CREATE DOMAIN supasheet.RICH_TEXT AS text;
