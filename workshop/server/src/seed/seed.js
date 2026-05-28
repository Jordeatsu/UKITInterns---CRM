/**
 * Seed script — populates the database with realistic sample data.
 *
 * Run with:  npm run seed
 *
 * WARNING: This clears all existing data before inserting fresh records.
 */

require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

const bcrypt = require('bcryptjs');
const db     = require('../database');

console.log('Seeding database — all existing data will be cleared...\n');

db.pragma('foreign_keys = OFF');
db.exec(`
  DELETE FROM case_comment_codes;
  DELETE FROM case_notes;
  DELETE FROM case_products;
  DELETE FROM product_comment_codes;
  DELETE FROM cases;
  DELETE FROM contacts;
  DELETE FROM products;
  DELETE FROM comment_codes;
  DELETE FROM complaint_types;
  DELETE FROM advisors;
`);
db.pragma('foreign_keys = ON');

// ── Complaint Types ───────────────────────────────────────────────────────────
const insertComplaintType = db.prepare(
  'INSERT INTO complaint_types (value, label, priority) VALUES (?, ?, ?)'
);

const ctFaulty   = insertComplaintType.run('faulty_product',    'Faulty Product',                     'high').lastInsertRowid;
const ctDelivery = insertComplaintType.run('delivery_issue',    'Delivery Issue',                     'medium').lastInsertRowid;
const ctWrong    = insertComplaintType.run('wrong_item',        'Wrong Item Received',                'medium').lastInsertRowid;
const ctDamaged  = insertComplaintType.run('damaged_packaging', 'Damaged Packaging',                  'medium').lastInsertRowid;
const ctAllergic = insertComplaintType.run('allergic_reaction', 'Allergic Reaction / Health Concern', 'high').lastInsertRowid;
const ctBilling  = insertComplaintType.run('billing_dispute',   'Billing Dispute',                    'medium').lastInsertRowid;
const ctOther    = insertComplaintType.run('other',             'Other',                              'low').lastInsertRowid;

// ── Advisors ──────────────────────────────────────────────────────────────────
const passwordHash  = bcrypt.hashSync('password123', 10);
const insertAdvisor = db.prepare('INSERT INTO advisors (name, email, password_hash) VALUES (?, ?, ?)');

insertAdvisor.run('Alice Johnson', 'alice@crm.com', passwordHash);
insertAdvisor.run('Bob Smith',     'bob@crm.com',   passwordHash);
insertAdvisor.run('Carol White',   'carol@crm.com', passwordHash);

// ── Products ──────────────────────────────────────────────────────────────────
const insertProduct = db.prepare('INSERT INTO products (name, description) VALUES (?, ?)');

// Liquid
const pLiq500   = insertProduct.run('CleanWave Liquid 500ml', 'Fresh-scented laundry liquid, suitable for 10 washes.').lastInsertRowid;
const pLiq1L    = insertProduct.run('CleanWave Liquid 1L',    'Fresh-scented laundry liquid, suitable for 20 washes.').lastInsertRowid;
const pLiq2L    = insertProduct.run('CleanWave Liquid 2L',    'Fresh-scented laundry liquid, suitable for 40 washes.').lastInsertRowid;
const pLiq3L    = insertProduct.run('CleanWave Liquid 3L',    'Fresh-scented laundry liquid family size, suitable for 60 washes.').lastInsertRowid;

// Pods
const pPods12   = insertProduct.run('CleanWave Pods 12-Pack', 'Concentrated single-dose laundry pods, 12 washes.').lastInsertRowid;
const pPods24   = insertProduct.run('CleanWave Pods 24-Pack', 'Concentrated single-dose laundry pods, 24 washes.').lastInsertRowid;
const pPods40   = insertProduct.run('CleanWave Pods 40-Pack', 'Concentrated single-dose laundry pods, 40 washes.').lastInsertRowid;
const pPods60   = insertProduct.run('CleanWave Pods 60-Pack', 'Concentrated single-dose laundry pods bulk pack, 60 washes.').lastInsertRowid;

// Powder
const pPow500   = insertProduct.run('CleanWave Powder 500g',  'Original formula washing powder, suitable for 8 washes.').lastInsertRowid;
const pPow1kg   = insertProduct.run('CleanWave Powder 1kg',   'Original formula washing powder, suitable for 16 washes.').lastInsertRowid;
const pPow2_5kg = insertProduct.run('CleanWave Powder 2.5kg', 'Original formula washing powder, suitable for 40 washes.').lastInsertRowid;
const pPow5kg   = insertProduct.run('CleanWave Powder 5kg',   'Original formula washing powder family size, suitable for 80 washes.').lastInsertRowid;

// ── Comment Codes ─────────────────────────────────────────────────────────────
const insertCode = db.prepare('INSERT INTO comment_codes (code, description) VALUES (?, ?)');

const cLeak = insertCode.run('LEAK', 'Product leaking — container seal broken or lid defective.').lastInsertRowid;
const cStan = insertCode.run('STAN', 'Product causing staining or marks on clothing.').lastInsertRowid;
const cSkin = insertCode.run('SKIN', 'Skin irritation or allergic reaction reported.').lastInsertRowid;
const cScnt = insertCode.run('SCNT', 'Unexpected, missing, or off-putting scent noted.').lastInsertRowid;
const cDiss = insertCode.run('DISS', 'Pods not dissolving fully during the wash cycle.').lastInsertRowid;
const cMeas = insertCode.run('MEAS', 'Incorrect or unclear measurement markings on dosing cap.').lastInsertRowid;
const cClmp = insertCode.run('CLMP', 'Powder clumping or hardening — affecting product quality.').lastInsertRowid;
const cSply = insertCode.run('SPLY', 'Product quantity less than stated on packaging.').lastInsertRowid;
const cDlvr = insertCode.run('DLVR', 'Delivery issue — damaged, late, or wrong item received.').lastInsertRowid;
const cSeal = insertCode.run('SEAL', 'Packaging seal broken or tampered with on arrival.').lastInsertRowid;

// ── Product Comment Codes ─────────────────────────────────────────────────────
const insertPCC = db.prepare('INSERT INTO product_comment_codes (product_id, comment_code_id) VALUES (?, ?)');

// Liquid: LEAK, STAN, SKIN, SCNT, MEAS, DLVR, SEAL
for (const pid of [pLiq500, pLiq1L, pLiq2L, pLiq3L]) {
  for (const cid of [cLeak, cStan, cSkin, cScnt, cMeas, cDlvr, cSeal]) {
    insertPCC.run(pid, cid);
  }
}

// Pods: DISS, STAN, SKIN, SCNT, SPLY, DLVR, SEAL
for (const pid of [pPods12, pPods24, pPods40, pPods60]) {
  for (const cid of [cDiss, cStan, cSkin, cScnt, cSply, cDlvr, cSeal]) {
    insertPCC.run(pid, cid);
  }
}

// Powder: CLMP, STAN, SKIN, SCNT, SPLY, DLVR, SEAL
for (const pid of [pPow500, pPow1kg, pPow2_5kg, pPow5kg]) {
  for (const cid of [cClmp, cStan, cSkin, cScnt, cSply, cDlvr, cSeal]) {
    insertPCC.run(pid, cid);
  }
}

// ── Contacts ──────────────────────────────────────────────────────────────────
// 13 contacts × 1 case, 7 contacts × 2 cases, 3 contacts × 3 cases, 1 contact × 4 cases = 40 cases
const insertContact = db.prepare('INSERT INTO contacts (name, email, phone) VALUES (?, ?, ?)');

const cEmma      = insertContact.run('Emma Thompson',    'emma.thompson@example.com',    '07700900001').lastInsertRowid;
const cLiam      = insertContact.run('Liam Patel',       'liam.patel@example.com',       '07700900002').lastInsertRowid;
const cSophie    = insertContact.run('Sophie Williams',  'sophie.williams@example.com',  '07700900003').lastInsertRowid;
const cNoah      = insertContact.run('Noah Clarke',      'noah.clarke@example.com',      '07700900004').lastInsertRowid;
const cOlivia    = insertContact.run('Olivia Hassan',    'olivia.hassan@example.com',    '07700900005').lastInsertRowid;
const cJack      = insertContact.run('Jack Ahmed',       'jack.ahmed@example.com',       '07700900006').lastInsertRowid;
const cAmelia    = insertContact.run('Amelia Johnson',   'amelia.johnson@example.com',   '07700900007').lastInsertRowid;
const cHarry     = insertContact.run('Harry Singh',      'harry.singh@example.com',      '07700900008').lastInsertRowid;
const cIsla      = insertContact.run('Isla Martin',      'isla.martin@example.com',      '07700900009').lastInsertRowid;
const cGeorge    = insertContact.run('George Brown',     'george.brown@example.com',     '07700900010').lastInsertRowid;
const cCharlotte = insertContact.run('Charlotte Davies', 'charlotte.davies@example.com', '07700900011').lastInsertRowid;
const cOliver    = insertContact.run('Oliver Taylor',    'oliver.taylor@example.com',    '07700900012').lastInsertRowid;
const cMia       = insertContact.run('Mia Wilson',       'mia.wilson@example.com',       '07700900013').lastInsertRowid;
const cEthan     = insertContact.run('Ethan Moore',      'ethan.moore@example.com',      '07700900014').lastInsertRowid;
const cGrace     = insertContact.run('Grace Khan',       'grace.khan@example.com',       '07700900015').lastInsertRowid;
const cOscar     = insertContact.run('Oscar Nguyen',     'oscar.nguyen@example.com',     '07700900016').lastInsertRowid;
const cPoppy     = insertContact.run('Poppy Roberts',    'poppy.roberts@example.com',    '07700900017').lastInsertRowid;
const cFreddie   = insertContact.run('Freddie Jackson',  'freddie.jackson@example.com',  '07700900018').lastInsertRowid;
const cLily      = insertContact.run('Lily White',       'lily.white@example.com',       '07700900019').lastInsertRowid;
const cArchie    = insertContact.run('Archie Harris',    'archie.harris@example.com',    '07700900020').lastInsertRowid;
const cIsabella  = insertContact.run('Isabella Lewis',   'isabella.lewis@example.com',   '07700900021').lastInsertRowid;
const cLeo       = insertContact.run('Leo Walker',       'leo.walker@example.com',       '07700900022').lastInsertRowid;
const cFlorence  = insertContact.run('Florence Hall',    'florence.hall@example.com',    '07700900023').lastInsertRowid;
const cHenry     = insertContact.run('Henry Allen',      'henry.allen@example.com',      '07700900024').lastInsertRowid;

// ── Cases ─────────────────────────────────────────────────────────────────────
const insertCase = db.prepare(`
  INSERT INTO cases (reference_number, contact_id, status, priority, complaint_type_id, subject, description, assigned_to)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

// Single-case contacts (1–13)
const case01 = insertCase.run('CRM-20260103-L1K9M', cEmma,      'open',                 'high',   ctFaulty,   'Liquid 1L bottle leaking on arrival',         'My CleanWave Liquid 1L arrived with a cracked cap and has been leaking inside the bag. The entire bottle is now half empty.', null).lastInsertRowid;
const case02 = insertCase.run('CRM-20260105-P2R8N', cLiam,      'in_progress',          'medium', ctFaulty,   'Pods not dissolving during wash cycle',        'I have used CleanWave Pods 24-Pack three times and each time the pod wrapper is sitting undissolved on top of my clothes at the end of the cycle.', 'Bob Smith').lastInsertRowid;
const case03 = insertCase.run('CRM-20260107-W3S7O', cSophie,    'open',                 'low',    ctFaulty,   'Powder heavily clumped inside sealed box',     'Opened a new CleanWave Powder 1kg box and found the contents had formed hard solid lumps throughout. The powder is difficult to measure and use.', null).lastInsertRowid;
const case04 = insertCase.run('CRM-20260108-L4T6P', cNoah,      'open',                 'high',   ctAllergic, 'Severe skin rash after using laundry liquid',  'After washing my clothes with CleanWave Liquid 2L I developed a severe rash across my arms and chest. I have never had this reaction to laundry detergent before.', null).lastInsertRowid;
const case05 = insertCase.run('CRM-20260110-P5U5Q', cOlivia,    'closed',               'medium', ctWrong,    'Received wrong size pods pack',                'I ordered the CleanWave Pods 24-Pack but received the 12-Pack instead. My order invoice shows the correct item but the box in the parcel was the smaller size.', 'Carol White').lastInsertRowid;
const case06 = insertCase.run('CRM-20260112-W6V4R', cJack,      'closed',               'medium', ctDelivery, 'Powder bag arrived split and spilling',        'The CleanWave Powder 500g bag was split open on arrival. Approximately a third of the powder had spilled inside the delivery box.', 'Bob Smith').lastInsertRowid;
const case07 = insertCase.run('CRM-20260115-L7W3S', cAmelia,    'in_progress',          'high',   ctFaulty,   'Liquid leaving dark stains on white laundry',  'CleanWave Liquid 500ml is leaving dark stains on white shirts. I have followed the dosing instructions and measured using the cap provided.', 'Alice Johnson').lastInsertRowid;
const case08 = insertCase.run('CRM-20260117-P8X2T', cHarry,     'open',                 'medium', ctDamaged,  'Pods pouch seal was open on arrival',          'The resealable pouch on my CleanWave Pods 40-Pack was not sealed when I received it. I am concerned the pods have been exposed to moisture.', null).lastInsertRowid;
const case09 = insertCase.run('CRM-20260120-W9Y1U', cIsla,      'open',                 'low',    ctFaulty,   'Powder box contents underweight',              'My CleanWave Powder 2.5kg felt light. I weighed the contents and it measured only 2.1kg — approximately 400g short of the stated weight.', null).lastInsertRowid;
const case10 = insertCase.run('CRM-20260122-L0Z0V', cGeorge,    'in_progress',          'low',    ctFaulty,   'Liquid has strong unexpected chemical odour',  'The CleanWave Liquid 3L has an extremely strong chemical smell not matching the product description. The odour remains on clothes after a full wash cycle.', 'Alice Johnson').lastInsertRowid;
const case11 = insertCase.run('CRM-20260124-P1A9W', cCharlotte, 'closed',               'medium', ctBilling,  'Charged twice for same pods order',            'I was billed twice for my CleanWave Pods 60-Pack. I can see two identical charges on my bank statement taken on the same date.', 'Carol White').lastInsertRowid;
const case12 = insertCase.run('CRM-20260126-W2B8X', cOliver,    'open',                 'medium', ctFaulty,   'Powder has hardened into a solid unusable block','CleanWave Powder 5kg contains powder that has hardened almost entirely into a solid block. The product is completely unusable in this condition.', null).lastInsertRowid;
const case13 = insertCase.run('CRM-20260128-L3C7Y', cMia,       'open',                 'high',   ctDelivery, 'Liquid bottle emptied inside delivery parcel', 'The CleanWave Liquid 1L had completely emptied inside the delivery parcel. The lid had come loose in transit and the entire bottle drained into the packaging.', null).lastInsertRowid;

// Two-case contacts (14–20)
const case14 = insertCase.run('CRM-20260201-L4D6Z', cEthan,     'open',                 'high',   ctAllergic, 'Hives developed after wearing washed clothes', 'I have developed hives after wearing clothes washed with CleanWave Liquid 500ml. My doctor has suggested it may be a detergent reaction.', null).lastInsertRowid;
const case15 = insertCase.run('CRM-20260201-P5E5A', cEthan,     'in_progress',          'high',   ctFaulty,   'Pods causing yellow staining on dark clothes', 'CleanWave Pods 24-Pack is leaving yellow residue stains on dark garments. This has occurred across multiple washes using both hot and cold cycle settings.', 'Alice Johnson').lastInsertRowid;

const case16 = insertCase.run('CRM-20260203-W6F4B', cGrace,     'open',                 'medium', ctDamaged,  'Powder bag outer seal torn in delivery',       'The outer seal of my CleanWave Powder 1kg bag was torn when I opened the delivery box. The inner contents were intact but the outer cardboard seal was ripped.', null).lastInsertRowid;
const case17 = insertCase.run('CRM-20260203-L7G3C', cGrace,     'in_progress',          'low',    ctFaulty,   'Liquid dosing cap markings almost invisible',  'The measurement markings on the dosing cap of my CleanWave Liquid 2L are barely visible. I cannot accurately measure the correct dose per wash.', 'Carol White').lastInsertRowid;

const case18 = insertCase.run('CRM-20260205-P8H2D', cOscar,     'closed',               'medium', ctFaulty,   'Pods leaving white film residue on garments',  'Every wash with CleanWave Pods 12-Pack leaves a white filmy coating on clothes. The pod itself dissolves but leaves this residue behind on fabrics.', 'Bob Smith').lastInsertRowid;
const case19 = insertCase.run('CRM-20260205-P9I1E', cOscar,     'open',                 'medium', ctWrong,    'Received standard pods instead of bio formula','I ordered CleanWave Pods 40-Pack Bio formula but received the standard non-bio version. The packaging is near-identical but the formula is different.', null).lastInsertRowid;

const case20 = insertCase.run('CRM-20260207-L0J0F', cPoppy,     'open',                 'high',   ctFaulty,   'Liquid 3L bottle cracked and leaking slowly',  'My CleanWave Liquid 3L has a crack running down the side of the bottle. It is leaking slowly and has already caused significant spillage in my laundry cupboard.', null).lastInsertRowid;
const case21 = insertCase.run('CRM-20260207-W1K9G', cPoppy,     'in_progress',          'high',   ctFaulty,   'Powder bleaching colour from garments',        'I used CleanWave Powder 500g on a standard coloured wash and my garments came out with visible bleach-like patches. I followed the usage instructions on the box exactly.', 'Alice Johnson').lastInsertRowid;

const case22 = insertCase.run('CRM-20260210-P2L8H', cFreddie,   'open',                 'high',   ctAllergic, 'Allergic reaction — swollen eyes and itchy skin','I experienced swollen eyes and severe itchy skin after handling CleanWave Pods 24-Pack and wearing clothes washed with them. Reaction began within hours of first use.', null).lastInsertRowid;
const case23 = insertCase.run('CRM-20260210-L3M7I', cFreddie,   'closed',               'low',    ctFaulty,   'Liquid 1L dosing cap does not seat securely',  'The measuring cap on my CleanWave Liquid 1L does not sit securely on the bottle neck. It falls off easily when the bottle is moved, creating a spill risk.', 'Carol White').lastInsertRowid;

const case24 = insertCase.run('CRM-20260212-W4N6J', cLily,      'closed',               'medium', ctDelivery, 'Powder order delivered two weeks late',        'My CleanWave Powder 2.5kg was delivered fourteen days after the estimated delivery date. I had to purchase an alternative product in the interim.', 'Bob Smith').lastInsertRowid;
const case25 = insertCase.run('CRM-20260212-P5O5K', cLily,      'open',                 'medium', ctDamaged,  'Pods pouch torn — several pods exposed',       'A tear in the CleanWave Pods 60-Pack pouch allowed several pods to fall out and become exposed to air. The exposed pods have partially dissolved and are unusable.', null).lastInsertRowid;

const case26 = insertCase.run('CRM-20260214-L6P4L', cArchie,    'open',                 'medium', ctWrong,    'Received lavender scent instead of original',  'I ordered CleanWave Liquid 2L Original scent but received the Lavender variant. My order confirmation shows Original, but the bottle delivered is clearly labelled Lavender.', null).lastInsertRowid;
const case27 = insertCase.run('CRM-20260214-W7Q3M', cArchie,    'closed',               'medium', ctBilling,  'Promotional discount code not applied',        'I entered a promotional code when ordering CleanWave Powder 1kg but was charged the full price. The code was accepted at checkout but the discount is absent from my invoice.', 'Carol White').lastInsertRowid;

// Three-case contacts (21–23)
const case28 = insertCase.run('CRM-20260217-P8R2N', cIsabella,  'open',                 'medium', ctFaulty,   'Pods 12-Pack only partially dissolving',       'Two out of every three pods in my CleanWave Pods 12-Pack only partially dissolve per wash. I have adjusted temperature and cycle settings with no improvement.', null).lastInsertRowid;
const case29 = insertCase.run('CRM-20260217-L9S1O', cIsabella,  'in_progress',          'high',   ctFaulty,   'Liquid 500ml cracked at base and leaking',     'The base of my CleanWave Liquid 500ml has a crack causing it to leak. The bottle is two days old and has been stored upright on a flat surface throughout.', 'Alice Johnson').lastInsertRowid;
const case30 = insertCase.run('CRM-20260217-W0T0P', cIsabella,  'closed',               'low',    ctFaulty,   'Powder clumping within days of opening',       'My CleanWave Powder 5kg began forming solid lumps within three days of opening, despite being kept in a dry cupboard with the lid resealed after every use.', 'Carol White').lastInsertRowid;

const case31 = insertCase.run('CRM-20260220-L1U9Q', cLeo,       'open',                 'high',   ctAllergic, 'Rash on wrists and neck after first wash',     'I developed a noticeable rash on my wrists and neck following the first wash with CleanWave Liquid 1L. The rash has persisted for three days. No other products have changed.', null).lastInsertRowid;
const case32 = insertCase.run('CRM-20260220-P2V8R', cLeo,       'in_progress',          'medium', ctFaulty,   'Pods 24-Pack leaving white marks on dark items','My CleanWave Pods 24-Pack leaves white powdery marks on dark clothing after every wash. Running an additional rinse cycle has not resolved the issue.', 'Bob Smith').lastInsertRowid;
const case33 = insertCase.run('CRM-20260220-L3W7S', cLeo,       'open',                 'medium', ctDelivery, 'Liquid 3L bottle damaged and leaking in parcel','My CleanWave Liquid 3L arrived with a cracked and dented bottle, clearly damaged in transit. The parcel had no protective padding — only a standard envelope.', null).lastInsertRowid;

const case34 = insertCase.run('CRM-20260224-W4X6T', cFlorence,  'open',                 'low',    ctFaulty,   'Powder 500g contents underweight by 70g',      'I weighed my CleanWave Powder 500g on kitchen scales and the contents measured 430g — significantly below the 500g stated on the packaging.', null).lastInsertRowid;
const case35 = insertCase.run('CRM-20260224-P5Y5U', cFlorence,  'in_progress',          'medium', ctFaulty,   'Pods not dissolving fully on 30°C wash',       'CleanWave Pods 40-Pack do not fully dissolve on cold washes. The packaging states they work from 30°C and my machine is set to 30°C, but pods remain partially intact after each cycle.', 'Bob Smith').lastInsertRowid;
const case36 = insertCase.run('CRM-20260224-L6Z4V', cFlorence,  'open',                 'high',   ctAllergic, 'Breathing difficulties while using liquid',    'I experienced shortness of breath and persistent coughing while using CleanWave Liquid 2L in a well-ventilated room. I am concerned this triggered an asthmatic episode.', null).lastInsertRowid;

// Four-case contact (24)
const case37 = insertCase.run('CRM-20260301-L7A3W', cHenry,     'closed',               'high',   ctFaulty,   'Liquid 500ml safety seal cracked on first open','The tamper-evident safety seal on my CleanWave Liquid 500ml cracked and fell away the moment I first tried to open the bottle. Liquid spilled immediately.', 'Alice Johnson').lastInsertRowid;
const case38 = insertCase.run('CRM-20260301-P8B2X', cHenry,     'reopened_by_consumer', 'high',   ctFaulty,   'Pods staining dark garments — issue recurring', 'I previously raised a case about CleanWave Pods 12-Pack staining dark clothes. That case was closed but the same staining has continued with a new pack from a different retailer.', 'Alice Johnson').lastInsertRowid;
const case39 = insertCase.run('CRM-20260301-W9C1Y', cHenry,     'open',                 'medium', ctWrong,    'Received unscented powder instead of fresh scent','I ordered CleanWave Powder 1kg Fresh Scent but received the Unscented variant. The packaging design is near-identical and easy to confuse at a glance.', null).lastInsertRowid;
const case40 = insertCase.run('CRM-20260301-P0D0Z', cHenry,     'in_progress',          'medium', ctDamaged,  'Pods 60-Pack resealable pouch seal has failed', 'The resealable pouch on my CleanWave Pods 60-Pack failed after two openings. The seal strip has completely detached and the pouch can no longer be closed, exposing remaining pods to air and moisture.', 'Bob Smith').lastInsertRowid;

// ── Case Products ─────────────────────────────────────────────────────────────
const insertCP = db.prepare('INSERT INTO case_products (case_id, product_id) VALUES (?, ?)');

const cp01 = insertCP.run(case01, pLiq1L).lastInsertRowid;
const cp02 = insertCP.run(case02, pPods24).lastInsertRowid;
const cp03 = insertCP.run(case03, pPow1kg).lastInsertRowid;
const cp04 = insertCP.run(case04, pLiq2L).lastInsertRowid;
const cp05 = insertCP.run(case05, pPods24).lastInsertRowid;
const cp06 = insertCP.run(case06, pPow500).lastInsertRowid;
const cp07 = insertCP.run(case07, pLiq500).lastInsertRowid;
const cp08 = insertCP.run(case08, pPods40).lastInsertRowid;
const cp09 = insertCP.run(case09, pPow2_5kg).lastInsertRowid;
const cp10 = insertCP.run(case10, pLiq3L).lastInsertRowid;
const cp11 = insertCP.run(case11, pPods60).lastInsertRowid;
const cp12 = insertCP.run(case12, pPow5kg).lastInsertRowid;
const cp13 = insertCP.run(case13, pLiq1L).lastInsertRowid;
const cp14 = insertCP.run(case14, pLiq500).lastInsertRowid;
const cp15 = insertCP.run(case15, pPods24).lastInsertRowid;
const cp16 = insertCP.run(case16, pPow1kg).lastInsertRowid;
const cp17 = insertCP.run(case17, pLiq2L).lastInsertRowid;
const cp18 = insertCP.run(case18, pPods12).lastInsertRowid;
const cp19 = insertCP.run(case19, pPods40).lastInsertRowid;
const cp20 = insertCP.run(case20, pLiq3L).lastInsertRowid;
const cp21 = insertCP.run(case21, pPow500).lastInsertRowid;
const cp22 = insertCP.run(case22, pPods24).lastInsertRowid;
const cp23 = insertCP.run(case23, pLiq1L).lastInsertRowid;
const cp24 = insertCP.run(case24, pPow2_5kg).lastInsertRowid;
const cp25 = insertCP.run(case25, pPods60).lastInsertRowid;
const cp26 = insertCP.run(case26, pLiq2L).lastInsertRowid;
const cp27 = insertCP.run(case27, pPow1kg).lastInsertRowid;
const cp28 = insertCP.run(case28, pPods12).lastInsertRowid;
const cp29 = insertCP.run(case29, pLiq500).lastInsertRowid;
const cp30 = insertCP.run(case30, pPow5kg).lastInsertRowid;
const cp31 = insertCP.run(case31, pLiq1L).lastInsertRowid;
const cp32 = insertCP.run(case32, pPods24).lastInsertRowid;
const cp33 = insertCP.run(case33, pLiq3L).lastInsertRowid;
const cp34 = insertCP.run(case34, pPow500).lastInsertRowid;
const cp35 = insertCP.run(case35, pPods40).lastInsertRowid;
const cp36 = insertCP.run(case36, pLiq2L).lastInsertRowid;
const cp37 = insertCP.run(case37, pLiq500).lastInsertRowid;
const cp38 = insertCP.run(case38, pPods12).lastInsertRowid;
const cp39 = insertCP.run(case39, pPow1kg).lastInsertRowid;
const cp40 = insertCP.run(case40, pPods60).lastInsertRowid;

// ── Case Comment Codes ────────────────────────────────────────────────────────
const insertCCC = db.prepare(
  'INSERT INTO case_comment_codes (case_id, case_product_id, comment_code_id) VALUES (?, ?, ?)'
);

insertCCC.run(case01, cp01, cLeak);
insertCCC.run(case02, cp02, cDiss);
insertCCC.run(case03, cp03, cClmp);
insertCCC.run(case04, cp04, cSkin);
insertCCC.run(case05, cp05, cDlvr);
insertCCC.run(case06, cp06, cDlvr); insertCCC.run(case06, cp06, cSeal);
insertCCC.run(case07, cp07, cStan);
insertCCC.run(case08, cp08, cSeal);
insertCCC.run(case09, cp09, cSply);
insertCCC.run(case10, cp10, cScnt);
// case11 billing — no product defect comment code applicable
insertCCC.run(case12, cp12, cClmp);
insertCCC.run(case13, cp13, cLeak); insertCCC.run(case13, cp13, cDlvr);
insertCCC.run(case14, cp14, cSkin);
insertCCC.run(case15, cp15, cStan);
insertCCC.run(case16, cp16, cSeal); insertCCC.run(case16, cp16, cDlvr);
insertCCC.run(case17, cp17, cMeas);
insertCCC.run(case18, cp18, cDiss);
insertCCC.run(case19, cp19, cDlvr);
insertCCC.run(case20, cp20, cLeak);
insertCCC.run(case21, cp21, cStan);
insertCCC.run(case22, cp22, cSkin);
insertCCC.run(case23, cp23, cMeas);
insertCCC.run(case24, cp24, cDlvr);
insertCCC.run(case25, cp25, cSeal);
insertCCC.run(case26, cp26, cDlvr);
// case27 billing — no product defect comment code applicable
insertCCC.run(case28, cp28, cDiss);
insertCCC.run(case29, cp29, cLeak);
insertCCC.run(case30, cp30, cClmp);
insertCCC.run(case31, cp31, cSkin);
insertCCC.run(case32, cp32, cStan);
insertCCC.run(case33, cp33, cDlvr); insertCCC.run(case33, cp33, cLeak);
insertCCC.run(case34, cp34, cSply);
insertCCC.run(case35, cp35, cDiss);
insertCCC.run(case36, cp36, cSkin);
insertCCC.run(case37, cp37, cLeak); insertCCC.run(case37, cp37, cSeal);
insertCCC.run(case38, cp38, cStan);
insertCCC.run(case39, cp39, cDlvr);
insertCCC.run(case40, cp40, cSeal);

// ── Case Notes ────────────────────────────────────────────────────────────────
const insertNote = db.prepare(
  'INSERT INTO case_notes (case_id, author, content) VALUES (?, ?, ?)'
);

insertNote.run(case02, 'Bob Smith',    'Spoke with customer. Pods are completely undissolved after cycle. Requested batch number from the packaging for quality team investigation.');
insertNote.run(case02, 'Bob Smith',    'Batch number confirmed as B2601-07. Flagged to quality team — same batch referenced in two other cases. Replacement pack approved for dispatch.');
insertNote.run(case05, 'Carol White',  'Confirmed pick error at fulfilment warehouse. Correct 24-Pack dispatched via next-day delivery. Customer advised of dispatch.');
insertNote.run(case05, 'Carol White',  'Customer confirmed receipt of correct item. Case closed.');
insertNote.run(case06, 'Bob Smith',    'Courier damage confirmed via transit photographs provided by customer. Replacement 500g dispatched. 10% goodwill voucher applied to account.');
insertNote.run(case06, 'Bob Smith',    'Customer confirmed replacement received in good condition. Case closed.');
insertNote.run(case07, 'Alice Johnson','Customer sent photographs of stained garments. Staining pattern consistent with detergent overdosing. Reviewing correct dosage guidance with customer.');
insertNote.run(case07, 'Alice Johnson','Customer confirmed they were measuring a full cap on a half load. Advised correct dose for load size. Monitoring for improvement over next two washes.');
insertNote.run(case10, 'Alice Johnson','Requested batch number from customer. Strong chemical odour complaints across CleanWave Liquid 3L may indicate a formula or storage issue with this production run.');
insertNote.run(case11, 'Carol White',  'Duplicate charge confirmed on account. Refund of second charge processed. Customer advised to allow 3–5 working days for credit to appear.');
insertNote.run(case11, 'Carol White',  'Customer confirmed refund received. Case closed.');
insertNote.run(case15, 'Alice Johnson','Customer provided photographs. Yellow staining visible across multiple dark items. Product sample requested from customer for quality lab analysis.');
insertNote.run(case17, 'Carol White',  'Dosing cap markings issue confirmed — product imagery shows markings are very faint on this production batch. Escalated to product quality team for review.');
insertNote.run(case18, 'Bob Smith',    'White film is consistent with undissolved pod surfactant. Advised customer to place pods in the drum directly rather than the dispenser drawer.');
insertNote.run(case18, 'Bob Smith',    'Customer confirmed issue fully resolved after changing pod placement. Case closed.');
insertNote.run(case21, 'Alice Johnson','Customer sent before-and-after photos showing colour loss. Investigating whether this powder batch contains optical brighteners not suitable for coloured wash cycles.');
insertNote.run(case23, 'Carol White',  'Cap dimensions checked against QA specification — within manufacturing tolerance. Advised customer to press cap firmly until audible click. No defect confirmed. Case closed.');
insertNote.run(case24, 'Bob Smith',    'Delivery delay confirmed by courier — parcel held at depot due to an incorrect postcode applied during dispatch. Compensation voucher issued.');
insertNote.run(case24, 'Bob Smith',    'Customer confirmed parcel received and voucher applied. Case closed.');
insertNote.run(case27, 'Carol White',  'Discount code verified — it was accepted at session level but not forwarded to the payment provider due to a checkout technical error. Manual refund of the discount amount processed.');
insertNote.run(case27, 'Carol White',  'Customer confirmed refund received. Case closed.');
insertNote.run(case29, 'Alice Johnson','Customer sent photo of cracked bottle base. Crack appearance is consistent with a manufacturing defect rather than impact damage. Replacement bottle approved for dispatch.');
insertNote.run(case30, 'Carol White',  'Clumping consistent with brief moisture exposure during storage or transit. Replacement box dispatched as goodwill. Customer advised on optimal storage conditions. Case closed.');
insertNote.run(case32, 'Bob Smith',    'Customer confirms pods are placed in drum correctly. White residue likely undissolved pod casing. Investigating — batch may be from same production run as case02.');
insertNote.run(case35, 'Bob Smith',    'Partial dissolution at 30°C confirmed internally with pods from same batch. Escalated to manufacturing. Customer advised to use 40°C temporarily while investigation continues.');
insertNote.run(case37, 'Alice Johnson','Defective tamper seal confirmed from customer photographs. Replacement product dispatched. Customer asked to retain faulty bottle for return and quality inspection.');
insertNote.run(case37, 'Alice Johnson','Faulty bottle returned. Defect logged with QA. Case closed.');
insertNote.run(case38, 'Alice Johnson','Same customer as case37 series — staining issue now recurring with a new pack from a different retailer. Escalating as possible systematic batch defect across the wider distribution network.');

// ── Done ──────────────────────────────────────────────────────────────────────
console.log('Database seeded successfully!\n');
console.log('Advisor login credentials (all use password: password123)');
console.log('  alice@crm.com');
console.log('  bob@crm.com');
console.log('  carol@crm.com');
console.log('\nSample reference numbers for the customer portal:');
console.log('  CRM-20260103-L1K9M  (open / high   — Liquid 1L leaking)');
console.log('  CRM-20260108-L4T6P  (open / high   — allergic reaction to liquid)');
console.log('  CRM-20260105-P2R8N  (in progress   — pods not dissolving)');
console.log('  CRM-20260301-P8B2X  (reopened      — pods staining dark garments)');
