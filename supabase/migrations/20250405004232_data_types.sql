CREATE TYPE FILE_OBJECT AS (
  name VARCHAR(255),
  type VARCHAR(100),
  size BIGINT,
  url TEXT,
  last_modified TIMESTAMP
);

create domain FILE as FILE_OBJECT[];

create domain EMAIL as text;

create domain TEL as text;

create domain RATING as real check (value >= 0 and value <= 5);

create domain PERCENTAGE as real;

create domain URL as text;

create domain DURATION as bigint;

create domain COLOR as varchar(16);

create domain AVATAR as FILE_OBJECT;

create domain RICH_TEXT as text;
