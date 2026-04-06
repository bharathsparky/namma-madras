/** Bundled seed — expand quarterly per PRD. Executed when DB is empty. */
export const SEED_SQL = `
INSERT OR REPLACE INTO categories (id, slug, label_en, label_ta, icon_name, color_hex, sort_order) VALUES
(1,'food','Food','உணவு','food-variant','#E67E22',1),
(2,'stay','Stay','தங்குமிடம்','bed','#2980B9',2),
(3,'medical','Medical','மருத்துவம்','hospital-box','#27AE60',3),
(5,'work','Work','வேலை','briefcase','#F39C12',5),
(7,'learn','Learn','கற்றல்','book-open-variant','#16A085',7),
(8,'emergency','Emergency','அவசரகாலம்','phone-alert','#E24B4A',8);

INSERT INTO emergency_contacts (label_en,label_ta,phone,is_toll_free,category,sort_order) VALUES
('Police','காவல்துறை','100',1,'police',1),
('Ambulance','ஆம்புலன்ஸ்','108',1,'medical',2),
('Fire','தீயணைப்பு','101',1,'other',3),
('Women Helpline','பெண்கள் உதவி','181',1,'other',4),
('Child Helpline','குழந்தை உதவி','1098',1,'other',5),
('Disaster Management','பேரிடர் மேலாண்மை','1077',1,'other',6),
('GCC Disaster Control','GCC பேரிடர் கட்டுப்பாடு','1913',1,'other',7),
('iCall (Suicide Prevention)','iCall (தற்கொலை தடுப்பு)','9152987821',0,'mental_health',8),
('SNEHI Mental Health','SNEHI மன ஆரோக்கியம்','04424640050',0,'mental_health',9),
('Vandrevala Foundation (24/7)','வந்தரேவாலா அறக்கட்டளை','18602662345',1,'mental_health',10),
('Bonded Labour Rescue','பிணை தொழிலாளர் மீட்பு','18004252255',1,'legal',11);

INSERT OR IGNORE INTO app_config (key, value) VALUES
('language', 'ta'),
('persona', ''),
('onboarding_complete', '0'),
('last_sync_at', ''),
('tamil_numerals', '0');

INSERT INTO places (name_en,name_ta,category_id,sub_category,area,full_address,latitude,longitude,cost_type,frequency,timing_en,timing_ta,contact_phone,description_en,description_ta,gender_access,capacity_note,documents_required,is_verified) VALUES
('SHELTER Trust Night Shelter — Adambakkam','SHELTER அறக்கட்டளை இரவு தங்குமிடம் — அடம்பாக்கம்',2,'emergency_shelter','Adambakkam','Adambakkam, Chennai – 600088',12.9889,80.2067,'free','daily','Check-in: 7:00 PM – 9:00 PM','சேர்க்கை: இரவு 7–9','04422231234','Emergency night shelter for men. Call before visiting.','ஆண்கள் இரவு தங்குமிடம். முன் அழைக்கவும்.','men','~40 beds','No documents strictly required. Aadhaar preferred.',1),
('Gurudwara Sahib T. Nagar — Free Stay','குருத்வாரா சாஹிப் டி.நகர் — இலவச தங்குமிடம்',2,'gurudwara_stay','T. Nagar','14, G.N. Chetty Road, T. Nagar, Chennai – 600017',13.0418,80.2341,'free','daily',NULL,NULL,'04428340026','Free accommodation — speak to management on arrival.','இலவச தங்குமிடம் — நிர்வாகத்தை அணுகவும்.','all',NULL,'Any ID document',1),
('GCC Night Shelter — Royapuram (sample)','GCC இரவு தங்குமிடம் — ராயபுரம்',2,'night_shelter','Royapuram','Royapuram, Chennai',13.1100,80.2900,'free','daily','Evening check-in','மாலை சேர்க்கை',NULL,'Government night shelter — call GCC 1913 for updated list.','அரசு இரவு தங்குமிடம் — புதுப்பிப்புக்கு 1913.','men',NULL,'Contact to confirm',0),
('Budget Lodge near Central (sample)','மைய நிலையம் அருகில் பட்ஜெட் லாட்ஜ்',2,'budget_lodge','Park Town','Near Chennai Central',13.0825,80.2750,'paid','daily',NULL,NULL,NULL,'Verified budget stay under ₹200 — confirm current rates by phone.','₹200 கீழ் — தொலைபேசியில் உறுதிப்படுத்தவும்.','all',NULL,NULL,0);

INSERT INTO places (name_en,name_ta,category_id,sub_category,area,full_address,latitude,longitude,cost_type,frequency,timing_en,timing_ta,contact_phone,description_en,description_ta,gender_access,is_verified) VALUES
('Koyambedu Labour Market','கோயம்பேடு தொழிலாளர் சந்தை',5,'labour_mandi','Koyambedu','CMBT vicinity, Koyambedu',13.0670,80.1950,'free','daily','6:00 AM – 8:00 AM peak','காலை 6–8 மணி',NULL,'Day labour for construction and loading. Wages vary daily.','கட்டிடம் மற்றும் ஏற்றுதல் வேலை.','all',1),
('Aminjikarai Labour Point','அமின்ஜிகரை தொழிலாளர் புள்ளி',5,'labour_mandi','Aminjikarai','Aminjikarai, Chennai',13.0840,80.2250,'free','daily','Early morning','அதிகாலை',NULL,'Domestic and cleaning day labour — verify employers.','வீட்டு வேலை — முதலாளியை உறுதிப்படுத்தவும்.','all',0),
('TN Employment Exchange — Chennai','தமிழ்நாடு வேலைவாய்ப்பு அலுவலகம்',5,'employment_exchange','Guindy','Guindy, Chennai',13.0060,80.2206,'free','daily','Office hours','அலுவலக நேரம்',NULL,'Register for government job listings. Realistic expectations.','அரசு வேலை பதிவு.','all',1);

INSERT INTO places (name_en,name_ta,category_id,sub_category,area,full_address,latitude,longitude,cost_type,cost_note_en,cost_note_ta,frequency,timing_en,timing_ta,contact_phone,description_en,description_ta,gender_access,is_verified) VALUES
('Connemara Public Library','கானமரா பொது நூலகம்',7,'govt_library','Egmore','Egmore, Chennai',13.0780,80.2560,'free',NULL,NULL,'daily','8:00 AM – 8:00 PM','காலை 8 – இரவு 8',NULL,'Free membership, reading rooms.','இலவச உறுப்பினர், வாசக அறை.','all',1),
('Anna Centenary Library','அண்ணா நூற்றாண்டு நூலகம்',7,'govt_library','Kotturpuram','Kotturpuram, Chennai',13.0170,80.2410,'free',NULL,NULL,'daily','Regular hours','வழக்கமான நேரம்',NULL,'Large public library with free Wi‑Fi when available.','இலவச Wi‑Fi (கிடைக்கும்போது).','all',1);

`;
