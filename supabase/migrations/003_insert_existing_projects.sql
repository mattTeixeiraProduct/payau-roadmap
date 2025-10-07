-- Insert existing roadmap projects into the database
-- This migration adds all the hardcoded projects from the app

-- Insert Payments stream projects
INSERT INTO projects (name, description, start_date, end_date, status_id, stream_id, owner_id, initiative_id, release_id, progress)
SELECT 
  'FX Pt 2: 4 Popular Currencies',
  'China, Japan, Thailand, Philippines with complicated requirements. Addressing customer requests and covering all popular currencies to increase use of FX.',
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '4 months',
  (SELECT id FROM statuses WHERE name = 'In progress'),
  (SELECT id FROM streams WHERE name = 'Payments'),
  (SELECT id FROM users WHERE name = 'Product Team'),
  (SELECT id FROM initiatives WHERE name = 'Q4 2025 Initiative'),
  (SELECT id FROM releases WHERE name = 'Q4 2025'),
  25;

INSERT INTO projects (name, description, start_date, end_date, status_id, stream_id, owner_id, initiative_id, release_id, progress)
SELECT 
  'Xero Improvements',
  'Implementing quick, high value wins such as allowing scheduling, showing bills that can''t be paid and improving UX. Consistently one of the most requested items from customers.',
  CURRENT_DATE + INTERVAL '1 month',
  CURRENT_DATE + INTERVAL '4 months',
  (SELECT id FROM statuses WHERE name = 'In progress'),
  (SELECT id FROM streams WHERE name = 'Payments'),
  (SELECT id FROM users WHERE name = 'Product Team'),
  (SELECT id FROM initiatives WHERE name = 'Q4 2025 Initiative'),
  (SELECT id FROM releases WHERE name = 'Q4 2025'),
  10;

INSERT INTO projects (name, description, start_date, end_date, status_id, stream_id, owner_id, initiative_id, release_id, progress)
SELECT 
  'Payout via PayID',
  'Speed up payments on the remittance end by allowing customers to add a PayID for a payee and get the payment to them same day. A quick win that improves the workflow for paying off AMEX cards.',
  CURRENT_DATE + INTERVAL '2 months',
  CURRENT_DATE + INTERVAL '4 months',
  (SELECT id FROM statuses WHERE name = 'Not started'),
  (SELECT id FROM streams WHERE name = 'Payments'),
  (SELECT id FROM users WHERE name = 'Product Team'),
  (SELECT id FROM initiatives WHERE name = 'Q4 2025 Initiative'),
  (SELECT id FROM releases WHERE name = 'Q4 2025'),
  0;

INSERT INTO projects (name, description, start_date, end_date, status_id, stream_id, owner_id, initiative_id, release_id, progress)
SELECT 
  'Confirmation of Payee',
  'Integrate confirmation of payee into the single payment flow to ensure that customers are paying the right account. Reduces the risk of invoice fraud and chargebacks.',
  CURRENT_DATE + INTERVAL '4 months',
  CURRENT_DATE + INTERVAL '6 months',
  (SELECT id FROM statuses WHERE name = 'Not started'),
  (SELECT id FROM streams WHERE name = 'Payments'),
  (SELECT id FROM users WHERE name = 'Product Team'),
  (SELECT id FROM initiatives WHERE name = 'Q1 2026 Initiative'),
  (SELECT id FROM releases WHERE name = 'Q1 2026'),
  0;

INSERT INTO projects (name, description, start_date, end_date, status_id, stream_id, owner_id, initiative_id, release_id, progress)
SELECT 
  'Import Payee',
  'Allow customers to upload a csv of payees through a generic import that accepts inputs from any other platform. Improves time to first payment and removes barriers for large businesses.',
  CURRENT_DATE + INTERVAL '6 months',
  CURRENT_DATE + INTERVAL '9 months',
  (SELECT id FROM statuses WHERE name = 'Not started'),
  (SELECT id FROM streams WHERE name = 'Payments'),
  (SELECT id FROM users WHERE name = 'Product Team'),
  (SELECT id FROM initiatives WHERE name = 'Q2 2026 Initiative'),
  (SELECT id FROM releases WHERE name = 'Q2 2026'),
  0;

-- Insert Rewards stream projects
INSERT INTO projects (name, description, start_date, end_date, status_id, stream_id, owner_id, initiative_id, release_id, progress)
SELECT 
  'Member Benefits Update',
  'Implementing updates to clearly show users the benefits of the PayRewards Points packages. This will deliver dynamic content to users based on the package they have taken up and display this to articulate clearly all the benefits a user can get taking up either the 1 or 2 PayReward Points options.',
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '2 months',
  (SELECT id FROM statuses WHERE name = 'In progress'),
  (SELECT id FROM streams WHERE name = 'Rewards'),
  (SELECT id FROM users WHERE name = 'Product Team'),
  (SELECT id FROM initiatives WHERE name = 'Q4 2025 Initiative'),
  (SELECT id FROM releases WHERE name = 'Q4 2025'),
  15;

INSERT INTO projects (name, description, start_date, end_date, status_id, stream_id, owner_id, initiative_id, release_id, progress)
SELECT 
  'Emirates & Turkish Airlines Integration',
  'Adding two more partners (Emirates and Turkish Airlines) to the PayRewards platform to support a broader offering of partners where users can redeem their points.',
  CURRENT_DATE + INTERVAL '1 month',
  CURRENT_DATE + INTERVAL '4 months',
  (SELECT id FROM statuses WHERE name = 'In progress'),
  (SELECT id FROM streams WHERE name = 'Rewards'),
  (SELECT id FROM users WHERE name = 'Product Team'),
  (SELECT id FROM initiatives WHERE name = 'Q4 2025 Initiative'),
  (SELECT id FROM releases WHERE name = 'Q4 2025'),
  5;

INSERT INTO projects (name, description, start_date, end_date, status_id, stream_id, owner_id, initiative_id, release_id, progress)
SELECT 
  'Personalised Content MVP',
  'Introduce rules based logic to display article/blog content to users based on their preferences set in Salesforce. This will show more relevant and up to date content to the users. The initial integration will focus on basic rules such as showing articles relevant to the page they are on (Rewards, Payments, Travel) and serving the most up to date content.',
  CURRENT_DATE + INTERVAL '2 months',
  CURRENT_DATE + INTERVAL '6 months',
  (SELECT id FROM statuses WHERE name = 'Not started'),
  (SELECT id FROM streams WHERE name = 'Rewards'),
  (SELECT id FROM users WHERE name = 'Product Team'),
  (SELECT id FROM initiatives WHERE name = 'Q1 2026 Initiative'),
  (SELECT id FROM releases WHERE name = 'Q1 2026'),
  0;

INSERT INTO projects (name, description, start_date, end_date, status_id, stream_id, owner_id, initiative_id, release_id, progress)
SELECT 
  'Rewards as a Service',
  'Complete the design and fully ticket the work. This will allow the BDM team to talk to prospective partners with clear flow of how this service will work and give them a confident indication on how long it will take to go live. Build to commence post signing of contract.',
  CURRENT_DATE + INTERVAL '4 months',
  CURRENT_DATE + INTERVAL '6 months',
  (SELECT id FROM statuses WHERE name = 'Not started'),
  (SELECT id FROM streams WHERE name = 'Rewards'),
  (SELECT id FROM users WHERE name = 'Product Team'),
  (SELECT id FROM initiatives WHERE name = 'Q1 2026 Initiative'),
  (SELECT id FROM releases WHERE name = 'Q1 2026'),
  0;

INSERT INTO projects (name, description, start_date, end_date, status_id, stream_id, owner_id, initiative_id, release_id, progress)
SELECT 
  'Social Proof MVP',
  'As users navigate the site, show them a feed of what previous users have used their points for. For example ''Someone in NSW just transferred enough QBR points to fly Business Class to Singapore''. This will show real world examples of what users are doing with their points and provide a nudge for them to redeem.',
  CURRENT_DATE + INTERVAL '6 months',
  CURRENT_DATE + INTERVAL '8 months',
  (SELECT id FROM statuses WHERE name = 'Not started'),
  (SELECT id FROM streams WHERE name = 'Rewards'),
  (SELECT id FROM users WHERE name = 'Product Team'),
  (SELECT id FROM initiatives WHERE name = 'Q2 2026 Initiative'),
  (SELECT id FROM releases WHERE name = 'Q2 2026'),
  0;

-- Insert Growth stream projects
INSERT INTO projects (name, description, start_date, end_date, status_id, stream_id, owner_id, initiative_id, release_id, progress)
SELECT 
  'Initiatives TBC',
  'Roadmap items to be confirmed for the growth stream',
  CURRENT_DATE + INTERVAL '2 months',
  CURRENT_DATE + INTERVAL '5 months',
  (SELECT id FROM statuses WHERE name = 'Not started'),
  (SELECT id FROM streams WHERE name = 'Growth'),
  (SELECT id FROM users WHERE name = 'Product Team'),
  (SELECT id FROM initiatives WHERE name = 'Q4 2025 Initiative'),
  (SELECT id FROM releases WHERE name = 'Q4 2025'),
  0;

-- Insert US stream projects
INSERT INTO projects (name, description, start_date, end_date, status_id, stream_id, owner_id, initiative_id, release_id, progress)
SELECT 
  'Initiatives TBC',
  'Roadmap items to be confirmed for the US expansion stream',
  CURRENT_DATE + INTERVAL '3 months',
  CURRENT_DATE + INTERVAL '7 months',
  (SELECT id FROM statuses WHERE name = 'Not started'),
  (SELECT id FROM streams WHERE name = 'US'),
  (SELECT id FROM users WHERE name = 'Product Team'),
  (SELECT id FROM initiatives WHERE name = 'Q1 2026 Initiative'),
  (SELECT id FROM releases WHERE name = 'Q1 2026'),
  0;

-- Insert Mobile stream projects
INSERT INTO projects (name, description, start_date, end_date, status_id, stream_id, owner_id, initiative_id, release_id, progress)
SELECT 
  'Initiatives TBC',
  'Roadmap items to be confirmed for the mobile stream',
  CURRENT_DATE + INTERVAL '1 month',
  CURRENT_DATE + INTERVAL '4 months',
  (SELECT id FROM statuses WHERE name = 'Not started'),
  (SELECT id FROM streams WHERE name = 'Mobile'),
  (SELECT id FROM users WHERE name = 'Product Team'),
  (SELECT id FROM initiatives WHERE name = 'Q4 2025 Initiative'),
  (SELECT id FROM releases WHERE name = 'Q4 2025'),
  0;

