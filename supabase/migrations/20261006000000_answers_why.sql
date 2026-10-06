-- "What decided it?": the reason index or the candidate's own words, stored with each decide or rank answer.
-- Null for write items and for answers given before the Why step.
alter table proof.answers add column why jsonb;
