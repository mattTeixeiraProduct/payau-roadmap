-- Insert statuses
INSERT INTO statuses (name, color) VALUES
  ('Not started', '#6B7280'),
  ('In progress', '#3B82F6'),
  ('At risk', '#F59E0B'),
  ('Done', '#10B981'),
  ('Cancelled', '#EF4444')
ON CONFLICT (name) DO NOTHING;

-- Insert streams
INSERT INTO streams (name, color, icon) VALUES
  ('Payments', '#3B82F6', 'DollarSign'),
  ('Rewards', '#A855F7', 'TrendingUp'),
  ('Growth', '#10B981', 'Users'),
  ('US', '#EF4444', 'Globe'),
  ('Mobile', '#F97316', 'Smartphone')
ON CONFLICT (name) DO NOTHING;

-- Insert default user (Product Team)
INSERT INTO users (name, email) VALUES
  ('Product Team', 'product@pay.com.au')
ON CONFLICT (email) DO NOTHING;

-- Insert initiatives
INSERT INTO initiatives (name) VALUES
  ('Q4 2025 Initiative'),
  ('Q1 2026 Initiative'),
  ('Q2 2026 Initiative')
ON CONFLICT DO NOTHING;

-- Insert releases
INSERT INTO releases (name, quarter, year) VALUES
  ('Q4 2025', 'Q4', 2025),
  ('Q1 2026', 'Q1', 2026),
  ('Q2 2026', 'Q2', 2026)
ON CONFLICT DO NOTHING;

