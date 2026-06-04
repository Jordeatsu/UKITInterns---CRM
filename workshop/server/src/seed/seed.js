/**
 * Seed script — populates the database with realistic sample data.
 *
 * Run with:  npm run seed
 *
 * This script:
 *   - Clears all existing data from the database
 *   - Creates 3 advisor accounts (Alice, Bob, Carol) with password 'password123'
 *   - Seeds 100 realistic test cases across multiple complaint types
 *   - Includes case assignments, products, comments, and notes
 *
 * IMPORTANT: Advisor IDs are captured dynamically (aAlice, aBob, aCarol) and used
 * throughout case definitions to ensure referential integrity. Do NOT use hardcoded IDs.
 *
 * WARNING: This clears all existing data before inserting fresh records.
 */

require("dotenv").config({ path: require("path").join(__dirname, "../../.env") });

const bcrypt = require("bcryptjs");
const db = require("../database");

console.log("Seeding database — all existing data will be cleared...\n");

db.pragma("foreign_keys = OFF");
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
db.pragma("foreign_keys = ON");

// ── Complaint Types ───────────────────────────────────────────────────────────
const insertComplaintType = db.prepare("INSERT INTO complaint_types (value, label, priority) VALUES (?, ?, ?)");

const ctFaulty = insertComplaintType.run("faulty_product", "Faulty Product", "high").lastInsertRowid;
const ctDelivery = insertComplaintType.run("delivery_issue", "Delivery Issue", "medium").lastInsertRowid;
const ctWrong = insertComplaintType.run("wrong_item", "Wrong Item Received", "medium").lastInsertRowid;
const ctDamaged = insertComplaintType.run("damaged_packaging", "Damaged Packaging", "medium").lastInsertRowid;
const ctAllergic = insertComplaintType.run("allergic_reaction", "Allergic Reaction / Health Concern", "high").lastInsertRowid;
const ctBilling = insertComplaintType.run("billing_dispute", "Billing Dispute", "medium").lastInsertRowid;
const ctOther = insertComplaintType.run("other", "Other", "low").lastInsertRowid;

// ── Advisors ──────────────────────────────────────────────────────────────────
// Advisor IDs are captured dynamically using .lastInsertRowid to ensure they
// match the auto-generated primary keys. These variables (aAlice, aBob, aCarol)
// are then used throughout the case definitions below to properly link cases to
// the correct advisor. This avoids hardcoding IDs which breaks when the database
// is re-seeded (SQLite auto-increment restarts from 1).
const passwordHash = bcrypt.hashSync("password123", 10);
const insertAdvisor = db.prepare("INSERT INTO advisors (name, email, password_hash) VALUES (?, ?, ?)");

const aAlice = insertAdvisor.run("Alice Smith", "alice@crm.com", passwordHash).lastInsertRowid;
const aBob = insertAdvisor.run("Bob Johnson", "bob@crm.com", passwordHash).lastInsertRowid;
const aCarol = insertAdvisor.run("Carol Williams", "carol@crm.com", passwordHash).lastInsertRowid;

// ── Products ──────────────────────────────────────────────────────────────────
const insertProduct = db.prepare("INSERT INTO products (name, description) VALUES (?, ?)");

// Liquid
const pLiq500 = insertProduct.run("CleanWave Liquid 500ml", "Fresh-scented laundry liquid, suitable for 10 washes.").lastInsertRowid;
const pLiq1L = insertProduct.run("CleanWave Liquid 1L", "Fresh-scented laundry liquid, suitable for 20 washes.").lastInsertRowid;
const pLiq2L = insertProduct.run("CleanWave Liquid 2L", "Fresh-scented laundry liquid, suitable for 40 washes.").lastInsertRowid;
const pLiq3L = insertProduct.run("CleanWave Liquid 3L", "Fresh-scented laundry liquid family size, suitable for 60 washes.").lastInsertRowid;

// Pods
const pPods12 = insertProduct.run("CleanWave Pods 12-Pack", "Concentrated single-dose laundry pods, 12 washes.").lastInsertRowid;
const pPods24 = insertProduct.run("CleanWave Pods 24-Pack", "Concentrated single-dose laundry pods, 24 washes.").lastInsertRowid;
const pPods40 = insertProduct.run("CleanWave Pods 40-Pack", "Concentrated single-dose laundry pods, 40 washes.").lastInsertRowid;
const pPods60 = insertProduct.run("CleanWave Pods 60-Pack", "Concentrated single-dose laundry pods bulk pack, 60 washes.").lastInsertRowid;

// Powder
const pPow500 = insertProduct.run("CleanWave Powder 500g", "Original formula washing powder, suitable for 8 washes.").lastInsertRowid;
const pPow1kg = insertProduct.run("CleanWave Powder 1kg", "Original formula washing powder, suitable for 16 washes.").lastInsertRowid;
const pPow2_5kg = insertProduct.run("CleanWave Powder 2.5kg", "Original formula washing powder, suitable for 40 washes.").lastInsertRowid;
const pPow5kg = insertProduct.run("CleanWave Powder 5kg", "Original formula washing powder family size, suitable for 80 washes.").lastInsertRowid;

// ── Comment Codes ─────────────────────────────────────────────────────────────
const insertCode = db.prepare("INSERT INTO comment_codes (code, description) VALUES (?, ?)");

const cLeak = insertCode.run("LEAK", "Product leaking — container seal broken or lid defective.").lastInsertRowid;
const cStan = insertCode.run("STAN", "Product causing staining or marks on clothing.").lastInsertRowid;
const cSkin = insertCode.run("SKIN", "Skin irritation or allergic reaction reported.").lastInsertRowid;
const cScnt = insertCode.run("SCNT", "Unexpected, missing, or off-putting scent noted.").lastInsertRowid;
const cDiss = insertCode.run("DISS", "Pods not dissolving fully during the wash cycle.").lastInsertRowid;
const cMeas = insertCode.run("MEAS", "Incorrect or unclear measurement markings on dosing cap.").lastInsertRowid;
const cClmp = insertCode.run("CLMP", "Powder clumping or hardening — affecting product quality.").lastInsertRowid;
const cSply = insertCode.run("SPLY", "Product quantity less than stated on packaging.").lastInsertRowid;
const cDlvr = insertCode.run("DLVR", "Delivery issue — damaged, late, or wrong item received.").lastInsertRowid;
const cSeal = insertCode.run("SEAL", "Packaging seal broken or tampered with on arrival.").lastInsertRowid;

// ── Product Comment Codes ─────────────────────────────────────────────────────
const insertPCC = db.prepare("INSERT INTO product_comment_codes (product_id, comment_code_id) VALUES (?, ?)");

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
// Expanded to 50 contacts for 100 cases
const insertContact = db.prepare("INSERT INTO contacts (name, email, phone) VALUES (?, ?, ?)");

const cEmma = insertContact.run("Emma Thompson", "emma.thompson@example.com", "07700900001").lastInsertRowid;
const cLiam = insertContact.run("Liam Patel", "liam.patel@example.com", "07700900002").lastInsertRowid;
const cSophie = insertContact.run("Sophie Williams", "sophie.williams@example.com", "07700900003").lastInsertRowid;
const cNoah = insertContact.run("Noah Clarke", "noah.clarke@example.com", "07700900004").lastInsertRowid;
const cOlivia = insertContact.run("Olivia Hassan", "olivia.hassan@example.com", "07700900005").lastInsertRowid;
const cJack = insertContact.run("Jack Ahmed", "jack.ahmed@example.com", "07700900006").lastInsertRowid;
const cAmelia = insertContact.run("Amelia Johnson", "amelia.johnson@example.com", "07700900007").lastInsertRowid;
const cHarry = insertContact.run("Harry Singh", "harry.singh@example.com", "07700900008").lastInsertRowid;
const cIsla = insertContact.run("Isla Martin", "isla.martin@example.com", "07700900009").lastInsertRowid;
const cGeorge = insertContact.run("George Brown", "george.brown@example.com", "07700900010").lastInsertRowid;
const cCharlotte = insertContact.run("Charlotte Davies", "charlotte.davies@example.com", "07700900011").lastInsertRowid;
const cOliver = insertContact.run("Oliver Taylor", "oliver.taylor@example.com", "07700900012").lastInsertRowid;
const cMia = insertContact.run("Mia Wilson", "mia.wilson@example.com", "07700900013").lastInsertRowid;
const cEthan = insertContact.run("Ethan Moore", "ethan.moore@example.com", "07700900014").lastInsertRowid;
const cGrace = insertContact.run("Grace Khan", "grace.khan@example.com", "07700900015").lastInsertRowid;
const cOscar = insertContact.run("Oscar Nguyen", "oscar.nguyen@example.com", "07700900016").lastInsertRowid;
const cPoppy = insertContact.run("Poppy Roberts", "poppy.roberts@example.com", "07700900017").lastInsertRowid;
const cFreddie = insertContact.run("Freddie Jackson", "freddie.jackson@example.com", "07700900018").lastInsertRowid;
const cLily = insertContact.run("Lily White", "lily.white@example.com", "07700900019").lastInsertRowid;
const cArchie = insertContact.run("Archie Harris", "archie.harris@example.com", "07700900020").lastInsertRowid;
const cIsabella = insertContact.run("Isabella Lewis", "isabella.lewis@example.com", "07700900021").lastInsertRowid;
const cLeo = insertContact.run("Leo Walker", "leo.walker@example.com", "07700900022").lastInsertRowid;
const cFlorence = insertContact.run("Florence Hall", "florence.hall@example.com", "07700900023").lastInsertRowid;
const cHenry = insertContact.run("Henry Allen", "henry.allen@example.com", "07700900024").lastInsertRowid;
const cAva = insertContact.run("Ava Robinson", "ava.robinson@example.com", "07700900025").lastInsertRowid;
const cMason = insertContact.run("Mason Edwards", "mason.edwards@example.com", "07700900026").lastInsertRowid;
const cLucas = insertContact.run("Lucas Bennett", "lucas.bennett@example.com", "07700900027").lastInsertRowid;
const cCharlotte2 = insertContact.run("Charlotte Price", "charlotte.price@example.com", "07700900028").lastInsertRowid;
const cAmelie = insertContact.run("Amelie Wright", "amelie.wright@example.com", "07700900029").lastInsertRowid;
const cHarrison = insertContact.run("Harrison Scott", "harrison.scott@example.com", "07700900030").lastInsertRowid;
const cVictoria = insertContact.run("Victoria Green", "victoria.green@example.com", "07700900031").lastInsertRowid;
const cThomas = insertContact.run("Thomas Adams", "thomas.adams@example.com", "07700900032").lastInsertRowid;
const cSophie2 = insertContact.run("Sophie Nelson", "sophie.nelson@example.com", "07700900033").lastInsertRowid;
const cJacob = insertContact.run("Jacob Carter", "jacob.carter@example.com", "07700900034").lastInsertRowid;
const cEmily = insertContact.run("Emily Clark", "emily.clark@example.com", "07700900035").lastInsertRowid;
const cWilliam = insertContact.run("William Mitchell", "william.mitchell@example.com", "07700900036").lastInsertRowid;
const cOphelia = insertContact.run("Ophelia Perez", "ophelia.perez@example.com", "07700900037").lastInsertRowid;
const cDavid = insertContact.run("David Roberts", "david.roberts@example.com", "07700900038").lastInsertRowid;
const cRose = insertContact.run("Rose Phillips", "rose.phillips@example.com", "07700900039").lastInsertRowid;
const cJames = insertContact.run("James Campbell", "james.campbell@example.com", "07700900040").lastInsertRowid;
const cLucy = insertContact.run("Lucy Parker", "lucy.parker@example.com", "07700900041").lastInsertRowid;
const cAlexander = insertContact.run("Alexander Evans", "alexander.evans@example.com", "07700900042").lastInsertRowid;
const cGabriella = insertContact.run("Gabriella Edwards", "gabriella.edwards@example.com", "07700900043").lastInsertRowid;
const cBenjamin = insertContact.run("Benjamin Collins", "benjamin.collins@example.com", "07700900044").lastInsertRowid;
const cIsabelle = insertContact.run("Isabelle Stewart", "isabelle.stewart@example.com", "07700900045").lastInsertRowid;
const cEtienne = insertContact.run("Etienne Sanchez", "etienne.sanchez@example.com", "07700900046").lastInsertRowid;
const cMarcella = insertContact.run("Marcella Morris", "marcella.morris@example.com", "07700900047").lastInsertRowid;
const cJulien = insertContact.run("Julien Rogers", "julien.rogers@example.com", "07700900048").lastInsertRowid;
const cViola = insertContact.run("Viola Morgan", "viola.morgan@example.com", "07700900049").lastInsertRowid;
const cFelicien = insertContact.run("Felicien Bell", "felicien.bell@example.com", "07700900050").lastInsertRowid;

// ── Cases ─────────────────────────────────────────────────────────────────────
// 100 realistic test cases spanning different complaint types (faulty products,
// delivery issues, allergic reactions, etc.) across various statuses (open,
// in_progress, closed, reopened) and priorities. Each case is linked to a contact
// and may be assigned to one of the three advisors (aAlice, aBob, aCarol) or left
// unassigned. Cases include relevant products and comment codes.
const insertCase = db.prepare(`
  INSERT INTO cases (reference_number, contact_id, status, priority, complaint_type_id, subject, description, assigned_to)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

// Single-case contacts (1–13)
const case01 = insertCase.run("CRM-20260103-L1K9M", cEmma, "open", "high", ctFaulty, "Liquid 1L bottle leaking on arrival", "My CleanWave Liquid 1L arrived with a cracked cap and has been leaking inside the bag. The entire bottle is now half empty.", null).lastInsertRowid;
const case02 = insertCase.run(
    "CRM-20260105-P2R8N",
    cLiam,
    "in_progress",
    "medium",
    ctFaulty,
    "Pods not dissolving during wash cycle",
    "I have used CleanWave Pods 24-Pack three times and each time the pod wrapper is sitting undissolved on top of my clothes at the end of the cycle.",
    2,
).lastInsertRowid;
const case03 = insertCase.run("CRM-20260107-W3S7O", cSophie, "open", "low", ctFaulty, "Powder heavily clumped inside sealed box", "Opened a new CleanWave Powder 1kg box and found the contents had formed hard solid lumps throughout. The powder is difficult to measure and use.", null).lastInsertRowid;
const case04 = insertCase.run(
    "CRM-20260108-L4T6P",
    cNoah,
    "open",
    "high",
    ctAllergic,
    "Severe skin rash after using laundry liquid",
    "After washing my clothes with CleanWave Liquid 2L I developed a severe rash across my arms and chest. I have never had this reaction to laundry detergent before.",
    null,
).lastInsertRowid;
const case05 = insertCase.run(
    "CRM-20260110-P5U5Q",
    cOlivia,
    "closed",
    "medium",
    ctWrong,
    "Received wrong size pods pack",
    "I ordered the CleanWave Pods 24-Pack but received the 12-Pack instead. My order invoice shows the correct item but the box in the parcel was the smaller size.",
    3,
).lastInsertRowid;
const case06 = insertCase.run("CRM-20260112-W6V4R", cJack, "closed", "medium", ctDelivery, "Powder bag arrived split and spilling", "The CleanWave Powder 500g bag was split open on arrival. Approximately a third of the powder had spilled inside the delivery box.", aBob).lastInsertRowid;
const case07 = insertCase.run(
    "CRM-20260115-L7W3S",
    cAmelia,
    "in_progress",
    "high",
    ctFaulty,
    "Liquid leaving dark stains on white laundry",
    "CleanWave Liquid 500ml is leaving dark stains on white shirts. I have followed the dosing instructions and measured using the cap provided.",
    aAlice,
).lastInsertRowid;
const case08 = insertCase.run("CRM-20260117-P8X2T", cHarry, "open", "medium", ctDamaged, "Pods pouch seal was open on arrival", "The resealable pouch on my CleanWave Pods 40-Pack was not sealed when I received it. I am concerned the pods have been exposed to moisture.", null).lastInsertRowid;
const case09 = insertCase.run("CRM-20260120-W9Y1U", cIsla, "open", "low", ctFaulty, "Powder box contents underweight", "My CleanWave Powder 2.5kg felt light. I weighed the contents and it measured only 2.1kg — approximately 400g short of the stated weight.", null).lastInsertRowid;
const case10 = insertCase.run(
    "CRM-20260122-L0Z0V",
    cGeorge,
    "in_progress",
    "low",
    ctFaulty,
    "Liquid has strong unexpected chemical odour",
    "The CleanWave Liquid 3L has an extremely strong chemical smell not matching the product description. The odour remains on clothes after a full wash cycle.",
    aAlice,
).lastInsertRowid;
const case11 = insertCase.run("CRM-20260124-P1A9W", cCharlotte, "closed", "medium", ctBilling, "Charged twice for same pods order", "I was billed twice for my CleanWave Pods 60-Pack. I can see two identical charges on my bank statement taken on the same date.", aCarol).lastInsertRowid;
const case12 = insertCase.run(
    "CRM-20260126-W2B8X",
    cOliver,
    "open",
    "medium",
    ctFaulty,
    "Powder has hardened into a solid unusable block",
    "CleanWave Powder 5kg contains powder that has hardened almost entirely into a solid block. The product is completely unusable in this condition.",
    null,
).lastInsertRowid;
const case13 = insertCase.run(
    "CRM-20260128-L3C7Y",
    cMia,
    "open",
    "high",
    ctDelivery,
    "Liquid bottle emptied inside delivery parcel",
    "The CleanWave Liquid 1L had completely emptied inside the delivery parcel. The lid had come loose in transit and the entire bottle drained into the packaging.",
    null,
).lastInsertRowid;

// Two-case contacts (14–20)
const case14 = insertCase.run("CRM-20260201-L4D6Z", cEthan, "open", "high", ctAllergic, "Hives developed after wearing washed clothes", "I have developed hives after wearing clothes washed with CleanWave Liquid 500ml. My doctor has suggested it may be a detergent reaction.", null).lastInsertRowid;
const case15 = insertCase.run(
    "CRM-20260201-P5E5A",
    cEthan,
    "in_progress",
    "high",
    ctFaulty,
    "Pods causing yellow staining on dark clothes",
    "CleanWave Pods 24-Pack is leaving yellow residue stains on dark garments. This has occurred across multiple washes using both hot and cold cycle settings.",
    aAlice,
).lastInsertRowid;

const case16 = insertCase.run(
    "CRM-20260203-W6F4B",
    cGrace,
    "open",
    "medium",
    ctDamaged,
    "Powder bag outer seal torn in delivery",
    "The outer seal of my CleanWave Powder 1kg bag was torn when I opened the delivery box. The inner contents were intact but the outer cardboard seal was ripped.",
    null,
).lastInsertRowid;
const case17 = insertCase.run(
    "CRM-20260203-L7G3C",
    cGrace,
    "in_progress",
    "low",
    ctFaulty,
    "Liquid dosing cap markings almost invisible",
    "The measurement markings on the dosing cap of my CleanWave Liquid 2L are barely visible. I cannot accurately measure the correct dose per wash.",
    3,
).lastInsertRowid;

const case18 = insertCase.run(
    "CRM-20260205-P8H2D",
    cOscar,
    "closed",
    "medium",
    ctFaulty,
    "Pods leaving white film residue on garments",
    "Every wash with CleanWave Pods 12-Pack leaves a white filmy coating on clothes. The pod itself dissolves but leaves this residue behind on fabrics.",
    aBob,
).lastInsertRowid;
const case19 = insertCase.run(
    "CRM-20260205-P9I1E",
    cOscar,
    "open",
    "medium",
    ctWrong,
    "Received standard pods instead of bio formula",
    "I ordered CleanWave Pods 40-Pack Bio formula but received the standard non-bio version. The packaging is near-identical but the formula is different.",
    null,
).lastInsertRowid;

const case20 = insertCase.run(
    "CRM-20260207-L0J0F",
    cPoppy,
    "open",
    "high",
    ctFaulty,
    "Liquid 3L bottle cracked and leaking slowly",
    "My CleanWave Liquid 3L has a crack running down the side of the bottle. It is leaking slowly and has already caused significant spillage in my laundry cupboard.",
    null,
).lastInsertRowid;
const case21 = insertCase.run(
    "CRM-20260207-W1K9G",
    cPoppy,
    "in_progress",
    "high",
    ctFaulty,
    "Powder bleaching colour from garments",
    "I used CleanWave Powder 500g on a standard coloured wash and my garments came out with visible bleach-like patches. I followed the usage instructions on the box exactly.",
    aAlice,
).lastInsertRowid;

const case22 = insertCase.run(
    "CRM-20260210-P2L8H",
    cFreddie,
    "open",
    "high",
    ctAllergic,
    "Allergic reaction — swollen eyes and itchy skin",
    "I experienced swollen eyes and severe itchy skin after handling CleanWave Pods 24-Pack and wearing clothes washed with them. Reaction began within hours of first use.",
    null,
).lastInsertRowid;
const case23 = insertCase.run(
    "CRM-20260210-L3M7I",
    cFreddie,
    "closed",
    "low",
    ctFaulty,
    "Liquid 1L dosing cap does not seat securely",
    "The measuring cap on my CleanWave Liquid 1L does not sit securely on the bottle neck. It falls off easily when the bottle is moved, creating a spill risk.",
    aCarol,
).lastInsertRowid;

const case24 = insertCase.run(
    "CRM-20260212-W4N6J",
    cLily,
    "closed",
    "medium",
    ctDelivery,
    "Powder order delivered two weeks late",
    "My CleanWave Powder 2.5kg was delivered fourteen days after the estimated delivery date. I had to purchase an alternative product in the interim.",
    aBob,
).lastInsertRowid;
const case25 = insertCase.run(
    "CRM-20260212-P5O5K",
    cLily,
    "open",
    "medium",
    ctDamaged,
    "Pods pouch torn — several pods exposed",
    "A tear in the CleanWave Pods 60-Pack pouch allowed several pods to fall out and become exposed to air. The exposed pods have partially dissolved and are unusable.",
    null,
).lastInsertRowid;

const case26 = insertCase.run(
    "CRM-20260214-L6P4L",
    cArchie,
    "open",
    "medium",
    ctWrong,
    "Received lavender scent instead of original",
    "I ordered CleanWave Liquid 2L Original scent but received the Lavender variant. My order confirmation shows Original, but the bottle delivered is clearly labelled Lavender.",
    null,
).lastInsertRowid;
const case27 = insertCase.run(
    "CRM-20260214-W7Q3M",
    cArchie,
    "closed",
    "medium",
    ctBilling,
    "Promotional discount code not applied",
    "I entered a promotional code when ordering CleanWave Powder 1kg but was charged the full price. The code was accepted at checkout but the discount is absent from my invoice.",
    aCarol,
).lastInsertRowid;

// Three-case contacts (21–23)
const case28 = insertCase.run(
    "CRM-20260217-P8R2N",
    cIsabella,
    "open",
    "medium",
    ctFaulty,
    "Pods 12-Pack only partially dissolving",
    "Two out of every three pods in my CleanWave Pods 12-Pack only partially dissolve per wash. I have adjusted temperature and cycle settings with no improvement.",
    null,
).lastInsertRowid;
const case29 = insertCase.run(
    "CRM-20260217-L9S1O",
    cIsabella,
    "in_progress",
    "high",
    ctFaulty,
    "Liquid 500ml cracked at base and leaking",
    "The base of my CleanWave Liquid 500ml has a crack causing it to leak. The bottle is two days old and has been stored upright on a flat surface throughout.",
    aAlice,
).lastInsertRowid;
const case30 = insertCase.run(
    "CRM-20260217-W0T0P",
    cIsabella,
    "closed",
    "low",
    ctFaulty,
    "Powder clumping within days of opening",
    "My CleanWave Powder 5kg began forming solid lumps within three days of opening, despite being kept in a dry cupboard with the lid resealed after every use.",
    aCarol,
).lastInsertRowid;

const case31 = insertCase.run(
    "CRM-20260220-L1U9Q",
    cLeo,
    "open",
    "high",
    ctAllergic,
    "Rash on wrists and neck after first wash",
    "I developed a noticeable rash on my wrists and neck following the first wash with CleanWave Liquid 1L. The rash has persisted for three days. No other products have changed.",
    null,
).lastInsertRowid;
const case32 = insertCase.run(
    "CRM-20260220-P2V8R",
    cLeo,
    "in_progress",
    "medium",
    ctFaulty,
    "Pods 24-Pack leaving white marks on dark items",
    "My CleanWave Pods 24-Pack leaves white powdery marks on dark clothing after every wash. Running an additional rinse cycle has not resolved the issue.",
    aBob,
).lastInsertRowid;
const case33 = insertCase.run(
    "CRM-20260220-L3W7S",
    cLeo,
    "open",
    "medium",
    ctDelivery,
    "Liquid 3L bottle damaged and leaking in parcel",
    "My CleanWave Liquid 3L arrived with a cracked and dented bottle, clearly damaged in transit. The parcel had no protective padding — only a standard envelope.",
    null,
).lastInsertRowid;

const case34 = insertCase.run("CRM-20260224-W4X6T", cFlorence, "open", "low", ctFaulty, "Powder 500g contents underweight by 70g", "I weighed my CleanWave Powder 500g on kitchen scales and the contents measured 430g — significantly below the 500g stated on the packaging.", null).lastInsertRowid;
const case35 = insertCase.run(
    "CRM-20260224-P5Y5U",
    cFlorence,
    "in_progress",
    "medium",
    ctFaulty,
    "Pods not dissolving fully on 30°C wash",
    "CleanWave Pods 40-Pack do not fully dissolve on cold washes. The packaging states they work from 30°C and my machine is set to 30°C, but pods remain partially intact after each cycle.",
    aBob,
).lastInsertRowid;
const case36 = insertCase.run(
    "CRM-20260224-L6Z4V",
    cFlorence,
    "open",
    "high",
    ctAllergic,
    "Breathing difficulties while using liquid",
    "I experienced shortness of breath and persistent coughing while using CleanWave Liquid 2L in a well-ventilated room. I am concerned this triggered an asthmatic episode.",
    null,
).lastInsertRowid;

// Four-case contact (24)
const case37 = insertCase.run(
    "CRM-20260301-L7A3W",
    cHenry,
    "closed",
    "high",
    ctFaulty,
    "Liquid 500ml safety seal cracked on first open",
    "The tamper-evident safety seal on my CleanWave Liquid 500ml cracked and fell away the moment I first tried to open the bottle. Liquid spilled immediately.",
    aAlice,
).lastInsertRowid;
const case38 = insertCase.run(
    "CRM-20260301-P8B2X",
    cHenry,
    "reopened_by_consumer",
    "high",
    ctFaulty,
    "Pods staining dark garments — issue recurring",
    "I previously raised a case about CleanWave Pods 12-Pack staining dark clothes. That case was closed but the same staining has continued with a new pack from a different retailer.",
    aAlice,
).lastInsertRowid;
const case39 = insertCase.run(
    "CRM-20260301-W9C1Y",
    cHenry,
    "open",
    "medium",
    ctWrong,
    "Received unscented powder instead of fresh scent",
    "I ordered CleanWave Powder 1kg Fresh Scent but received the Unscented variant. The packaging design is near-identical and easy to confuse at a glance.",
    null,
).lastInsertRowid;
const case40 = insertCase.run(
    "CRM-20260301-P0D0Z",
    cHenry,
    "in_progress",
    "medium",
    ctDamaged,
    "Pods 60-Pack resealable pouch seal has failed",
    "The resealable pouch on my CleanWave Pods 60-Pack failed after two openings. The seal strip has completely detached and the pouch can no longer be closed, exposing remaining pods to air and moisture.",
    aBob,
).lastInsertRowid;

// Additional 60 cases (41–100)
const case41 = insertCase.run("CRM-20260305-L1U2A", cAva, "open", "high", ctFaulty, "Liquid 500ml lid cracked immediately upon opening", "The plastic lid on my CleanWave Liquid 500ml cracked and broke as soon as I tried to open it for the first time. Liquid spilled everywhere.", null).lastInsertRowid;
const case42 = insertCase.run("CRM-20260305-P2V1B", cMason, "in_progress", "medium", ctFaulty, "Pods dissolving incompletely on eco cycle", "My washing machine's eco cycle runs at 30°C and the CleanWave Pods 12-Pack are not dissolving fully. The wrappers remain visible in the drum after the cycle completes.", aAlice).lastInsertRowid;
const case43 = insertCase.run("CRM-20260307-W3W0C", cLucas, "open", "low", ctFaulty, "Powder quantity less than stated", "I measured the CleanWave Powder 1kg and it only weighed 850g when placed on kitchen scales. This is significantly less than advertised.", null).lastInsertRowid;
const case44 = insertCase.run("CRM-20260308-L4X9D", cCharlotte2, "closed", "high", ctAllergic, "Itchy scalp after washing hair with water from clothes washed in this detergent", "After my partner washed his clothes with CleanWave Liquid 3L, the residue in the washing machine water caused my scalp to itch severely when I washed my hair.", aBob).lastInsertRowid;
const case45 = insertCase.run("CRM-20260310-P5Y8E", cAmelie, "open", "medium", ctWrong, "Received 2L bottle instead of ordered 3L", "I ordered the CleanWave Liquid 3L family size but the parcel contained a 2L bottle. The invoice clearly shows 3L was selected.", null).lastInsertRowid;
const case46 = insertCase.run("CRM-20260312-W6Z7F", cHarrison, "in_progress", "medium", ctDelivery, "Powder box corner crushed in transit", "The CleanWave Powder 2.5kg box arrived with a crushed corner but the contents were not damaged. However, the outer packaging is unsightly and not suitable for gifting.", aCarol).lastInsertRowid;
const case47 = insertCase.run("CRM-20260315-L7A6G", cVictoria, "open", "high", ctFaulty, "Liquid staining delicate fabrics unexpectedly", "CleanWave Liquid 1L is leaving permanent marks on delicate silk and chiffon garments despite pre-diluting the product and using the gentle wash cycle.", null).lastInsertRowid;
const case48 = insertCase.run("CRM-20260317-P8B5H", cThomas, "closed", "medium", ctDamaged, "Pods pack opened in transit with pods scattered", "The CleanWave Pods 24-Pack resealable pouch was completely open upon arrival. Pods were scattered throughout the delivery box and several were damaged.", aAlice).lastInsertRowid;
const case49 = insertCase.run("CRM-20260320-W9C4I", cSophie2, "open", "low", ctFaulty, "Powder consistency clumpy and gel-like", "The CleanWave Powder 500g has an unusual clumpy gel-like consistency instead of the normal fine powder. The product is difficult to scoop and measure.", null).lastInsertRowid;
const case50 = insertCase.run("CRM-20260322-L0D3J", cJacob, "in_progress", "low", ctFaulty, "Liquid has weak fragrance compared to previous batches", "The CleanWave Liquid 2L smells noticeably weaker than the previous pack I purchased. The scent barely lingers on clothes after washing.", aBob).lastInsertRowid;

const case51 = insertCase.run("CRM-20260325-P1E2K", cEmily, "closed", "medium", ctBilling, "Invoice shows wrong quantity", "My invoice for CleanWave Pods 40-Pack shows a quantity of 2 units, but I only ordered and received 1 pack. I was overcharged accordingly.", aCarol).lastInsertRowid;
const case52 = insertCase.run("CRM-20260327-W2F1L", cWilliam, "open", "medium", ctFaulty, "Powder leaving white residue on dark fabrics", "CleanWave Powder 1kg is leaving white streaks and residue on dark coloured clothing, even when I increase the rinse cycle.", null).lastInsertRowid;
const case53 = insertCase.run("CRM-20260330-L3G0M", cOphelia, "open", "high", ctAllergic, "Severe allergic reaction with facial swelling", "I experienced facial swelling and difficulty breathing within 30 minutes of using CleanWave Liquid 500ml. I required medical attention.", null).lastInsertRowid;
const case54 = insertCase.run("CRM-20260401-P4H9N", cDavid, "in_progress", "medium", ctDelivery, "Delivery address partially ignored", "My delivery address was incomplete on the label despite being correctly shown in the order. The parcel was delayed by 2 days due to this error.", aAlice).lastInsertRowid;
const case55 = insertCase.run("CRM-20260403-W5I8O", cRose, "open", "low", ctFaulty, "Bottle cap threads damaged", "The threads on the cap of my CleanWave Liquid 3L are stripped. The cap will not screw on properly and the bottle cannot be sealed.", null).lastInsertRowid;
const case56 = insertCase.run("CRM-20260405-L6J7P", cJames, "closed", "high", ctFaulty, "Leaking seal on brand new bottle", "My CleanWave Liquid 1L arrived with a faulty safety seal that was not properly applied at the factory. Liquid leaked throughout the shipping box.", aBob).lastInsertRowid;
const case57 = insertCase.run("CRM-20260408-P7K6Q", cLucy, "open", "medium", ctWrong, "Received unscented instead of mountain fresh", "I specifically ordered CleanWave Liquid 2L in Mountain Fresh scent but received the Unscented variant. The packaging design is nearly identical.", null).lastInsertRowid;
const case58 = insertCase.run("CRM-20260410-W8L5R", cAlexander, "in_progress", "medium", ctDamaged, "Powder bag moisture-damaged from shipping", "The CleanWave Powder 2.5kg arrived with visible moisture damage. The product has started to harden and form lumps due to moisture exposure.", aCarol).lastInsertRowid;
const case59 = insertCase.run("CRM-20260412-L9M4S", cGabriella, "open", "high", ctFaulty, "Pods coating tongue and mouth with bitter residue", "When handling CleanWave Pods 60-Pack, the coating leaves a bitter chemical residue on my hands that transfers to my mouth. This is a health concern.", null).lastInsertRowid;
const case60 = insertCase.run("CRM-20260415-P0N3T", cBenjamin, "closed", "medium", ctBilling, "Charged for item never ordered", "My account shows a charge for CleanWave Pods 24-Pack that I did not order. This may be a system error or fraudulent charge.", aAlice).lastInsertRowid;

const case61 = insertCase.run("CRM-20260418-W1O2U", cIsabelle, "open", "low", ctFaulty, "Powder box damaged by forklift during storage", "The CleanWave Powder 5kg box shows clear forklift damage with puncture holes. The product inside remains sealed but the packaging is severely compromised.", null).lastInsertRowid;
const case62 = insertCase.run("CRM-20260420-L2P1V", cEtienne, "in_progress", "high", ctAllergic, "Contact dermatitis from pod residue on clothes", "I have developed contact dermatitis on areas where washed clothes contact my skin after using CleanWave Pods 24-Pack. The rash is itchy and spreading.", aBob).lastInsertRowid;
const case63 = insertCase.run("CRM-20260422-P3Q0W", cMarcella, "open", "medium", ctDelivery, "Parcel left in unsecured location in heavy rain", "The courier left my CleanWave Liquid 3L parcel in an unsecured outdoor location where it was exposed to heavy rain. The cardboard box is water-damaged.", null).lastInsertRowid;
const case64 = insertCase.run("CRM-20260425-W4R9X", cJulien, "closed", "medium", ctFaulty, "Incorrect measurement markings on liquid cap", "The measurement markings on the cap of my CleanWave Liquid 2L do not align correctly with the actual 500ml and 1L volumes when tested with water.", aCarol).lastInsertRowid;
const case65 = insertCase.run("CRM-20260427-L5S8Y", cViola, "open", "high", ctFaulty, "Pods causing white residue on delicate silks", "CleanWave Pods 12-Pack leaves undissolved white coating on silk and wool garments. The residue does not rinse out and damages the fabric finish.", null).lastInsertRowid;
const case66 = insertCase.run("CRM-20260430-P6T7Z", cFelicien, "in_progress", "medium", ctWrong, "Wrong product variant sent (bio instead of non-bio)", "I ordered non-bio CleanWave Pods 40-Pack but received the bio formula variant instead. The order confirmation shows the correct non-bio option.", aAlice).lastInsertRowid;
const case67 = insertCase.run("CRM-20260502-W7U6A", cAva, "open", "low", ctFaulty, "Liquid bottle feels lighter than usual", "The CleanWave Liquid 500ml bottle I received feels significantly lighter than my previous purchases. I suspect the contents are underweight.", null).lastInsertRowid;
const case68 = insertCase.run("CRM-20260505-L8V5B", cMason, "closed", "high", ctFaulty, "Powder causing orange discoloration on whites", "My white garments have developed an orange-yellow discoloration after washing with CleanWave Powder 1kg. This appears to be a dye transfer issue.", aBob).lastInsertRowid;
const case69 = insertCase.run("CRM-20260507-P9W4C", cLucas, "open", "medium", ctDelivery, "Package held at depot for 5 days without notification", "My CleanWave Liquid 1L parcel was held at the courier depot for 5 days with no notification. I only discovered this when I checked the tracking after wondering where my order was.", null).lastInsertRowid;
const case70 = insertCase.run("CRM-20260510-W0X3D", cCharlotte2, "open", "medium", ctDamaged, "Pods 24-Pack pouch seal partially separated", "The seal on the CleanWave Pods 24-Pack pouch is partially separated, allowing air to enter. Several pods at the opening are beginning to harden.", null).lastInsertRowid;

const case71 = insertCase.run("CRM-20260512-L1Y2E", cAmelie, "in_progress", "low", ctFaulty, "Inconsistent foam production between batches", "CleanWave Liquid 2L from my latest purchase produces significantly less foam than the previous batch. The cleaning performance appears affected.", aCarol).lastInsertRowid;
const case72 = insertCase.run("CRM-20260515-P2Z1F", cHarrison, "open", "high", ctAllergic, "Respiratory irritation from powder inhalation", "When pouring CleanWave Powder 500g into the washing machine, I experienced respiratory irritation and coughing. This suggests a formulation change or increased dust levels.", null).lastInsertRowid;
const case73 = insertCase.run("CRM-20260517-W3A0G", cVictoria, "closed", "medium", ctBilling, "Promotional discount code failed to scan", "I purchased CleanWave Pods 60-Pack using a promotional code that failed to apply at the till. The retailer refused to apply the discount retroactively.", aAlice).lastInsertRowid;
const case74 = insertCase.run("CRM-20260520-L4B9H", cThomas, "open", "medium", ctFaulty, "Liquid 3L bottle bottom cracked along seam", "The bottom seam of my CleanWave Liquid 3L bottle is cracked and leaking. The bottle is brand new and was stored upright.", null).lastInsertRowid;
const case75 = insertCase.run("CRM-20260522-P5C8I", cSophie2, "in_progress", "medium", ctDelivery, "Delivery van collision damaged goods inside", "My CleanWave Powder 2.5kg was damaged when the courier's vehicle was involved in a minor collision. The customer service representative confirmed this.", aBob).lastInsertRowid;
const case76 = insertCase.run("CRM-20260525-W6D7J", cJacob, "open", "high", ctFaulty, "Strong chemical reaction when mixed with other cleaner", "When I accidentally used CleanWave Liquid 1L alongside another household cleaner, there was a chemical reaction producing toxic fumes.", null).lastInsertRowid;
const case77 = insertCase.run("CRM-20260527-L7E6K", cEmily, "closed", "medium", ctWrong, "Wrong scent variant delivered twice", "I ordered CleanWave Liquid 500ml Original scent twice and received the Lavender variant both times. This suggests a picker error at the warehouse.", aCarol).lastInsertRowid;
const case78 = insertCase.run("CRM-20260530-P8F5L", cWilliam, "open", "low", ctFaulty, "Pods 40-Pack contains noticeably fewer pods than usual", "I counted the pods in my CleanWave Pods 40-Pack and there are only 36 pods instead of the stated 40. The pouch is not full.", null).lastInsertRowid;
const case79 = insertCase.run("CRM-20260602-W9G4M", cOphelia, "in_progress", "medium", ctDelivery, "Delivery attempted without proper address matching", "The courier attempted to deliver my CleanWave Liquid 2L to the wrong apartment number despite correct postcode. Delayed delivery by one day.", aAlice).lastInsertRowid;
const case80 = insertCase.run("CRM-20260605-L0H3N", cDavid, "open", "high", ctAllergic, "Anaphylactic reaction to product", "I experienced signs of anaphylaxis after brief skin contact with CleanWave Liquid 500ml. This is an extremely serious allergic reaction requiring immediate medical intervention.", null).lastInsertRowid;

const case81 = insertCase.run("CRM-20260607-P1I2O", cRose, "closed", "medium", ctFaulty, "Powder cake formation in the box", "Large portions of CleanWave Powder 1kg have caked together into solid blocks within the box despite being in a sealed package.", aBob).lastInsertRowid;
const case82 = insertCase.run("CRM-20260610-W2J1P", cJames, "open", "medium", ctBilling, "Duplicate billing for single order", "I was billed twice for my single CleanWave Pods 24-Pack order. Two identical charges appear on my credit card.", null).lastInsertRowid;
const case83 = insertCase.run("CRM-20260612-L3K0Q", cLucy, "open", "low", ctFaulty, "Liquid 2L has separated into two distinct layers", "My CleanWave Liquid 2L has separated into a clear liquid layer and a white opaque layer. Shaking the bottle does not recombine the layers.", null).lastInsertRowid;
const case84 = insertCase.run("CRM-20260615-P4L9R", cAlexander, "in_progress", "high", ctFaulty, "Pods leaving yellow stains on white clothing", "CleanWave Pods 12-Pack is causing yellow staining on white garments even when used at double concentration and with extended rinsing.", aCarol).lastInsertRowid;
const case85 = insertCase.run("CRM-20260617-W5M8S", cGabriella, "open", "medium", ctDelivery, "Parcel opened and repacked by customs with visible damage", "My CleanWave Liquid 3L international delivery was opened and repacked by customs with visible damage to both the bottle and outer packaging.", null).lastInsertRowid;
const case86 = insertCase.run("CRM-20260620-L6N7T", cBenjamin, "closed", "medium", ctWrong, "Sent wrong quantity despite clear order confirmation", "I ordered 2 boxes of CleanWave Powder 500g but received 1 box and 1 box of a different brand entirely.", aAlice).lastInsertRowid;
const case87 = insertCase.run("CRM-20260622-P7O6U", cIsabelle, "open", "high", ctFaulty, "Liquid causing hair colour fade on coloured hair", "After washing my coloured hair with clothes washed in CleanWave Liquid 1L, my hair colour has noticeably faded. This suggests the detergent is too harsh.", null).lastInsertRowid;
const case88 = insertCase.run("CRM-20260625-W8P5V", cEtienne, "in_progress", "medium", ctDelivery, "Parcel misrouted to wrong postcode area", "My CleanWave Pods 60-Pack was delivered to a different postcode area entirely. It took 3 days to track down and retrieve from the correct depot.", aBob).lastInsertRowid;
const case89 = insertCase.run("CRM-20260627-L9Q4W", cMarcella, "open", "low", ctFaulty, "Bottle neck thread misaligned causing cap to leak", "The threads on the neck of my CleanWave Liquid 2L are misaligned, preventing the cap from sealing properly. The bottle leaks when tilted.", null).lastInsertRowid;
const case90 = insertCase.run("CRM-20260630-P0R3X", cJulien, "closed", "medium", ctFaulty, "Pods leaving blue specks on coloured clothing", "CleanWave Pods 40-Pack is leaving blue/purple specks and streaks on coloured clothing. These appear to be undissolved dye from the pod coating.", aCarol).lastInsertRowid;

const case91 = insertCase.run("CRM-20260702-W1S2Y", cViola, "open", "high", ctAllergic, "Severe eczema flare-up after using product", "I have severe eczema that flared dramatically after using CleanWave Liquid 500ml to wash my undergarments. The reaction took two weeks to subside.", null).lastInsertRowid;
const case92 = insertCase.run("CRM-20260705-L2T1Z", cFelicien, "open", "medium", ctFaulty, "Powder clumps blocking washing machine dispenser", "CleanWave Powder 1kg clumped so severely that it blocked my washing machine's powder dispenser. The machine could not complete the cycle.", null).lastInsertRowid;
const case93 = insertCase.run("CRM-20260707-P3U0A", cAva, "in_progress", "medium", ctDelivery, "Fragile sticker ignored, box severely crushed", "Despite fragile stickers on the CleanWave Liquid 3L box, the courier crushed it under other parcels. The bottle inside is severely dented.", aAlice).lastInsertRowid;
const case94 = insertCase.run("CRM-20260710-W4V9B", cMason, "open", "low", ctWrong, "Received different brand entirely", "I ordered CleanWave Powder 2.5kg and received a completely different brand's powder of the same size. This appears to be a major picking error.", null).lastInsertRowid;
const case95 = insertCase.run("CRM-20260712-L5W8C", cLucas, "closed", "high", ctFaulty, "Pods causing permanent staining on favourite dress", "My favourite dress was permanently stained by undissolved residue from CleanWave Pods 24-Pack. The stains did not wash out despite multiple attempts.", aBob).lastInsertRowid;
const case96 = insertCase.run("CRM-20260715-P6X7D", cCharlotte2, "open", "medium", ctDelivery, "Delivery to previous owner's address instead of new resident", "The courier delivered my CleanWave Liquid 1L to the previous owner's address instead of the new resident (me). I had to retrieve it from a neighbour.", null).lastInsertRowid;
const case97 = insertCase.run("CRM-20260717-W7Y6E", cAmelie, "in_progress", "medium", ctBilling, "Overcharged due to system error", "I was charged £45 for my CleanWave Pods 24-Pack order instead of the correct price of £8.99. The system charged me for 5 units at once.", aCarol).lastInsertRowid;
const case98 = insertCase.run("CRM-20260720-L8Z5F", cHarrison, "open", "high", ctFaulty, "Liquid 500ml has visible mould growth inside bottle", "My CleanWave Liquid 500ml contains visible mould or fungal growth inside the bottle. The product must have been contaminated during manufacturing.", null).lastInsertRowid;
const case99 = insertCase.run("CRM-20260722-P9A4G", cVictoria, "closed", "medium", ctWrong, "Sent bulk box when individual box was ordered", "I ordered a single CleanWave Powder 500g but received a bulk case of 12 boxes. I was not charged for the additional boxes but had no use for them.", aAlice).lastInsertRowid;
const case100 = insertCase.run("CRM-20260725-W0B3H", cThomas, "open", "medium", ctAllergic, "Itching and discomfort within hours of use", "CleanWave Liquid 2L causes itching and general skin discomfort within a few hours of wearing clothes washed with it. My skin is normally not sensitive to detergents.", null).lastInsertRowid;
const insertCP = db.prepare("INSERT INTO case_products (case_id, product_id) VALUES (?, ?)");

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

// Additional case products (41–100)
const cp41 = insertCP.run(case41, pLiq500).lastInsertRowid;
const cp42 = insertCP.run(case42, pPods12).lastInsertRowid;
const cp43 = insertCP.run(case43, pPow1kg).lastInsertRowid;
const cp44 = insertCP.run(case44, pLiq3L).lastInsertRowid;
const cp45 = insertCP.run(case45, pLiq2L).lastInsertRowid;
const cp46 = insertCP.run(case46, pPow2_5kg).lastInsertRowid;
const cp47 = insertCP.run(case47, pLiq1L).lastInsertRowid;
const cp48 = insertCP.run(case48, pPods24).lastInsertRowid;
const cp49 = insertCP.run(case49, pPow500).lastInsertRowid;
const cp50 = insertCP.run(case50, pLiq2L).lastInsertRowid;
const cp51 = insertCP.run(case51, pPods40).lastInsertRowid;
const cp52 = insertCP.run(case52, pPow1kg).lastInsertRowid;
const cp53 = insertCP.run(case53, pLiq500).lastInsertRowid;
const cp54 = insertCP.run(case54, pLiq1L).lastInsertRowid;
const cp55 = insertCP.run(case55, pLiq3L).lastInsertRowid;
const cp56 = insertCP.run(case56, pLiq1L).lastInsertRowid;
const cp57 = insertCP.run(case57, pLiq2L).lastInsertRowid;
const cp58 = insertCP.run(case58, pPow2_5kg).lastInsertRowid;
const cp59 = insertCP.run(case59, pPods60).lastInsertRowid;
const cp60 = insertCP.run(case60, pPods24).lastInsertRowid;
const cp61 = insertCP.run(case61, pPow5kg).lastInsertRowid;
const cp62 = insertCP.run(case62, pPods24).lastInsertRowid;
const cp63 = insertCP.run(case63, pLiq3L).lastInsertRowid;
const cp64 = insertCP.run(case64, pLiq2L).lastInsertRowid;
const cp65 = insertCP.run(case65, pPods12).lastInsertRowid;
const cp66 = insertCP.run(case66, pPods40).lastInsertRowid;
const cp67 = insertCP.run(case67, pLiq500).lastInsertRowid;
const cp68 = insertCP.run(case68, pPow1kg).lastInsertRowid;
const cp69 = insertCP.run(case69, pLiq1L).lastInsertRowid;
const cp70 = insertCP.run(case70, pPods24).lastInsertRowid;
const cp71 = insertCP.run(case71, pLiq2L).lastInsertRowid;
const cp72 = insertCP.run(case72, pPow500).lastInsertRowid;
const cp73 = insertCP.run(case73, pPods60).lastInsertRowid;
const cp74 = insertCP.run(case74, pLiq3L).lastInsertRowid;
const cp75 = insertCP.run(case75, pPow2_5kg).lastInsertRowid;
const cp76 = insertCP.run(case76, pLiq1L).lastInsertRowid;
const cp77 = insertCP.run(case77, pLiq500).lastInsertRowid;
const cp78 = insertCP.run(case78, pPods40).lastInsertRowid;
const cp79 = insertCP.run(case79, pLiq2L).lastInsertRowid;
const cp80 = insertCP.run(case80, pLiq500).lastInsertRowid;
const cp81 = insertCP.run(case81, pPow1kg).lastInsertRowid;
const cp82 = insertCP.run(case82, pPods24).lastInsertRowid;
const cp83 = insertCP.run(case83, pLiq2L).lastInsertRowid;
const cp84 = insertCP.run(case84, pPods12).lastInsertRowid;
const cp85 = insertCP.run(case85, pLiq3L).lastInsertRowid;
const cp86 = insertCP.run(case86, pPow500).lastInsertRowid;
const cp87 = insertCP.run(case87, pLiq1L).lastInsertRowid;
const cp88 = insertCP.run(case88, pPods60).lastInsertRowid;
const cp89 = insertCP.run(case89, pLiq2L).lastInsertRowid;
const cp90 = insertCP.run(case90, pPods40).lastInsertRowid;
const cp91 = insertCP.run(case91, pLiq500).lastInsertRowid;
const cp92 = insertCP.run(case92, pPow1kg).lastInsertRowid;
const cp93 = insertCP.run(case93, pLiq3L).lastInsertRowid;
const cp94 = insertCP.run(case94, pPow2_5kg).lastInsertRowid;
const cp95 = insertCP.run(case95, pPods24).lastInsertRowid;
const cp96 = insertCP.run(case96, pLiq1L).lastInsertRowid;
const cp97 = insertCP.run(case97, pPods24).lastInsertRowid;
const cp98 = insertCP.run(case98, pLiq500).lastInsertRowid;
const cp99 = insertCP.run(case99, pPow500).lastInsertRowid;
const cp100 = insertCP.run(case100, pLiq2L).lastInsertRowid;

// ── Case Comment Codes ────────────────────────────────────────────────────────
const insertCCC = db.prepare("INSERT INTO case_comment_codes (case_id, case_product_id, comment_code_id) VALUES (?, ?, ?)");

insertCCC.run(case01, cp01, cLeak);
insertCCC.run(case02, cp02, cDiss);
insertCCC.run(case03, cp03, cClmp);
insertCCC.run(case04, cp04, cSkin);
insertCCC.run(case05, cp05, cDlvr);
insertCCC.run(case06, cp06, cDlvr);
insertCCC.run(case06, cp06, cSeal);
insertCCC.run(case07, cp07, cStan);
insertCCC.run(case08, cp08, cSeal);
insertCCC.run(case09, cp09, cSply);
insertCCC.run(case10, cp10, cScnt);
// case11 billing — no product defect comment code applicable
insertCCC.run(case12, cp12, cClmp);
insertCCC.run(case13, cp13, cLeak);
insertCCC.run(case13, cp13, cDlvr);
insertCCC.run(case14, cp14, cSkin);
insertCCC.run(case15, cp15, cStan);
insertCCC.run(case16, cp16, cSeal);
insertCCC.run(case16, cp16, cDlvr);
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
insertCCC.run(case33, cp33, cDlvr);
insertCCC.run(case33, cp33, cLeak);
insertCCC.run(case34, cp34, cSply);
insertCCC.run(case35, cp35, cDiss);
insertCCC.run(case36, cp36, cSkin);
insertCCC.run(case37, cp37, cLeak);
insertCCC.run(case37, cp37, cSeal);
insertCCC.run(case38, cp38, cStan);
insertCCC.run(case39, cp39, cDlvr);
insertCCC.run(case40, cp40, cSeal);

// Additional case comment codes (41–100)
insertCCC.run(case41, cp41, cLeak);
insertCCC.run(case42, cp42, cDiss);
insertCCC.run(case43, cp43, cSply);
insertCCC.run(case44, cp44, cSkin);
insertCCC.run(case45, cp45, cDlvr);
insertCCC.run(case46, cp46, cDlvr);
insertCCC.run(case47, cp47, cStan);
insertCCC.run(case48, cp48, cSeal);
insertCCC.run(case49, cp49, cClmp);
insertCCC.run(case50, cp50, cScnt);
insertCCC.run(case51, cp51, cDlvr);
insertCCC.run(case52, cp52, cStan);
insertCCC.run(case53, cp53, cSkin);
insertCCC.run(case54, cp54, cDlvr);
insertCCC.run(case55, cp55, cMeas);
insertCCC.run(case56, cp56, cLeak);
insertCCC.run(case57, cp57, cDlvr);
insertCCC.run(case58, cp58, cSeal);
insertCCC.run(case59, cp59, cSkin);
// case60 billing — no product defect comment code applicable
insertCCC.run(case61, cp61, cClmp);
insertCCC.run(case62, cp62, cSkin);
insertCCC.run(case63, cp63, cDlvr);
insertCCC.run(case64, cp64, cMeas);
insertCCC.run(case65, cp65, cDiss);
insertCCC.run(case66, cp66, cDlvr);
insertCCC.run(case67, cp67, cSply);
insertCCC.run(case68, cp68, cStan);
insertCCC.run(case69, cp69, cDlvr);
insertCCC.run(case70, cp70, cSeal);
insertCCC.run(case71, cp71, cScnt);
insertCCC.run(case72, cp72, cSply);
insertCCC.run(case73, cp73, cDlvr);
insertCCC.run(case74, cp74, cLeak);
insertCCC.run(case75, cp75, cDlvr);
insertCCC.run(case76, cp76, cSkin);
insertCCC.run(case77, cp77, cDlvr);
insertCCC.run(case78, cp78, cSply);
insertCCC.run(case79, cp79, cDlvr);
insertCCC.run(case80, cp80, cSkin);
insertCCC.run(case81, cp81, cClmp);
// case82 billing — no product defect comment code applicable
insertCCC.run(case83, cp83, cDiss);
insertCCC.run(case84, cp84, cStan);
insertCCC.run(case85, cp85, cDlvr);
insertCCC.run(case86, cp86, cDlvr);
insertCCC.run(case87, cp87, cStan);
insertCCC.run(case88, cp88, cDlvr);
insertCCC.run(case89, cp89, cMeas);
insertCCC.run(case90, cp90, cDiss);
insertCCC.run(case91, cp91, cSkin);
insertCCC.run(case92, cp92, cClmp);
insertCCC.run(case93, cp93, cDlvr);
insertCCC.run(case94, cp94, cDlvr);
insertCCC.run(case95, cp95, cDiss);
insertCCC.run(case96, cp96, cDlvr);
// case97 billing — no product defect comment code applicable
insertCCC.run(case98, cp98, cSkin);
insertCCC.run(case99, cp99, cDlvr);
insertCCC.run(case100, cp100, cSkin);

// ── Case Notes ────────────────────────────────────────────────────────────────
const insertNote = db.prepare("INSERT INTO case_notes (case_id, author, content) VALUES (?, ?, ?)");

insertNote.run(case02, 2, "Spoke with customer. Pods are completely undissolved after cycle. Requested batch number from the packaging for quality team investigation.");
insertNote.run(case02, 2, "Batch number confirmed as B2601-07. Flagged to quality team — same batch referenced in two other cases. Replacement pack approved for dispatch.");
insertNote.run(case05, 3, "Confirmed pick error at fulfilment warehouse. Correct 24-Pack dispatched via next-day delivery. Customer advised of dispatch.");
insertNote.run(case05, 3, "Customer confirmed receipt of correct item. Case closed.");
insertNote.run(case06, 2, "Courier damage confirmed via transit photographs provided by customer. Replacement 500g dispatched. 10% goodwill voucher applied to account.");
insertNote.run(case06, 2, "Customer confirmed replacement received in good condition. Case closed.");
insertNote.run(case07, 1, "Customer sent photographs of stained garments. Staining pattern consistent with detergent overdosing. Reviewing correct dosage guidance with customer.");
insertNote.run(case07, 1, "Customer confirmed they were measuring a full cap on a half load. Advised correct dose for load size. Monitoring for improvement over next two washes.");
insertNote.run(case10, 1, "Requested batch number from customer. Strong chemical odour complaints across CleanWave Liquid 3L may indicate a formula or storage issue with this production run.");
insertNote.run(case11, 3, "Duplicate charge confirmed on account. Refund of second charge processed. Customer advised to allow 3–5 working days for credit to appear.");
insertNote.run(case11, 3, "Customer confirmed refund received. Case closed.");
insertNote.run(case15, 1, "Customer provided photographs. Yellow staining visible across multiple dark items. Product sample requested from customer for quality lab analysis.");
insertNote.run(case17, 3, "Dosing cap markings issue confirmed — product imagery shows markings are very faint on this production batch. Escalated to product quality team for review.");
insertNote.run(case18, 2, "White film is consistent with undissolved pod surfactant. Advised customer to place pods in the drum directly rather than the dispenser drawer.");
insertNote.run(case18, 2, "Customer confirmed issue fully resolved after changing pod placement. Case closed.");
insertNote.run(case21, 1, "Customer sent before-and-after photos showing colour loss. Investigating whether this powder batch contains optical brighteners not suitable for coloured wash cycles.");
insertNote.run(case23, 3, "Cap dimensions checked against QA specification — within manufacturing tolerance. Advised customer to press cap firmly until audible click. No defect confirmed. Case closed.");
insertNote.run(case24, 2, "Delivery delay confirmed by courier — parcel held at depot due to an incorrect postcode applied during dispatch. Compensation voucher issued.");
insertNote.run(case24, 2, "Customer confirmed parcel received and voucher applied. Case closed.");
insertNote.run(case27, 3, "Discount code verified — it was accepted at session level but not forwarded to the payment provider due to a checkout technical error. Manual refund of the discount amount processed.");
insertNote.run(case27, 3, "Customer confirmed refund received. Case closed.");
insertNote.run(case29, 1, "Customer sent photo of cracked bottle base. Crack appearance is consistent with a manufacturing defect rather than impact damage. Replacement bottle approved for dispatch.");
insertNote.run(case30, 3, "Clumping consistent with brief moisture exposure during storage or transit. Replacement box dispatched as goodwill. Customer advised on optimal storage conditions. Case closed.");
insertNote.run(case32, 2, "Customer confirms pods are placed in drum correctly. White residue likely undissolved pod casing. Investigating — batch may be from same production run as case02.");
insertNote.run(case35, 2, "Partial dissolution at 30°C confirmed internally with pods from same batch. Escalated to manufacturing. Customer advised to use 40°C temporarily while investigation continues.");
insertNote.run(case37, 1, "Defective tamper seal confirmed from customer photographs. Replacement product dispatched. Customer asked to retain faulty bottle for return and quality inspection.");
insertNote.run(case37, 1, "Faulty bottle returned. Defect logged with QA. Case closed.");
insertNote.run(case38, 1, "Same customer as case37 series — staining issue now recurring with a new pack from a different retailer. Escalating as possible systematic batch defect across the wider distribution network.");

// ── Done ──────────────────────────────────────────────────────────────────────
console.log("Database seeded successfully!\n");
console.log("Advisor login credentials (all use password: password123)");
console.log("  alice@crm.com");
console.log("  bob@crm.com");
console.log("  carol@crm.com");
console.log("\nSample reference numbers for the customer portal:");
console.log("  CRM-20260103-L1K9M  (open / high   — Liquid 1L leaking)");
console.log("  CRM-20260108-L4T6P  (open / high   — allergic reaction to liquid)");
console.log("  CRM-20260105-P2R8N  (in progress   — pods not dissolving)");
console.log("  CRM-20260301-P8B2X  (reopened      — pods staining dark garments)");
