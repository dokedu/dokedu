SET statement_timeout = 0;

CREATE EXTENSION fuzzystrmatch;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

CREATE TEXT SEARCH DICTIONARY german_simple (
    template = simple,
    StopWords = german,
    accept = false
    );


CREATE TEXT SEARCH DICTIONARY german_ispell (
    template = ispell,
    DictFile = de_de, -- if we didn't update the links these two
    AffFile = de_de, -- would have to be de_de instead
    StopWords = german
    );


CREATE TEXT SEARCH DICTIONARY german_stem (
    template = snowball,
    language = german
);

CREATE TEXT SEARCH CONFIGURATION pg_catalog.de_de ( COPY = german );

ALTER TEXT SEARCH CONFIGURATION pg_catalog.de_de ALTER MAPPING
FOR asciiword, asciihword, hword_asciipart, word, hword, hword_part
WITH unaccent, german_simple, german_ispell, german_stem;
