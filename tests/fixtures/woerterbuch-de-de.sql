-- Kleines Deutsch-Deutsch-Paket (de-de) für die Tests: einsprachig, Erklärungen,
-- Synonyme je Bedeutung (Tabelle uebersetzung, sprache 'de'), Wendungen MIT Bedeutung
-- (verweis.uebersetzung), Gegenwörter, Oberbegriffe, Wortfamilie, Herkunft.
INSERT INTO info VALUES
  ('schema_version', '1'), ('quelle_sprache', 'de'), ('ziel_sprache', 'de'), ('art', 'einsprachig'),
  ('stand', '2026-11-13'), ('umfang', 'mini'),
  ('quellen_text', 'Wörter, Bedeutungen, Erklärungen: Wiktionary (de.wiktionary.org), CC BY-SA 4.0.'),
  ('lizenz_text', 'Dieses Wörterbuch-Paket steht unter CC BY-SA 4.0.');

INSERT INTO eintrag VALUES
  (1, 'de', 'Vogel', 'Nomen', 'männlich', 'Vögel', 'Nomen, männlich, Mehrzahl: Vögel', 3, 1700, 'Vo-gel', 'ˈfoːɡl̩', NULL, NULL),
  (2, 'de', 'einen Vogel haben', 'Redewendung', NULL, NULL, 'Redewendung', 6, NULL, NULL, NULL, NULL, NULL),
  (3, 'de', 'spinnen', 'Verb', NULL, NULL, 'Verb, Präteritum: spann, Perfekt: hat gesponnen', 4, 3000, 'spin-nen', NULL, NULL, NULL),
  (4, 'de', 'schön', 'Adjektiv', NULL, NULL, 'Adjektiv, Mehrstufe: schöner, Meiststufe: am schönsten', 1, 197, 'schön', 'ʃøːn', NULL, NULL),
  (5, 'de', 'hässlich', 'Adjektiv', NULL, NULL, 'Adjektiv', 3, 1800, 'häss-lich', NULL, NULL, NULL),
  (6, 'de', 'hübsch', 'Adjektiv', NULL, NULL, 'Adjektiv', 3, 1900, 'hübsch', NULL, NULL, NULL),
  (7, 'de', 'Wirbeltier', 'Nomen', 'sächlich', 'Wirbeltiere', 'Nomen, sächlich, Mehrzahl: Wirbeltiere', 6, 9000, NULL, NULL, NULL, NULL),
  (8, 'de', 'Vogelnest', 'Nomen', 'sächlich', 'Vogelnester', 'Nomen, sächlich, Mehrzahl: Vogelnester', 6, 12000, NULL, NULL, NULL, NULL),
  (9, 'de', 'Jause', 'Nomen', 'weiblich', 'Jausen', 'Nomen, weiblich, Mehrzahl: Jausen', 1, 47044, 'Jau-se', NULL, NULL, NULL);

INSERT INTO bedeutung VALUES
  (1, 1, 1, 'Wirbeltier', 'Vertreter einer Tiergruppe der Wirbeltiere mit Flügeln und Federn', NULL, 'Biologie', NULL, 3),
  (2, 1, 2, 'Mensch', 'auffälliger Mensch', 'umgangssprachlich', NULL, NULL, 3),
  (3, 1, 3, 'Flugzeug', 'Flugzeug', 'umgangssprachlich', NULL, NULL, 4),
  (4, 2, 1, NULL, 'nicht so ganz bei Verstand sein; verrückt sein', 'umgangssprachlich', NULL, NULL, 6),
  (5, 3, 1, 'Fäden', 'Fäden herstellen', NULL, NULL, NULL, 4),
  (6, 4, 1, 'ästhetisch', 'eine angenehme Wirkung auf die Sinne habend', NULL, NULL, NULL, 1),
  (7, 4, 2, 'angenehm', 'angenehm, gut, anständig', NULL, NULL, NULL, 2),
  (8, 5, 1, NULL, 'nicht schön', NULL, NULL, NULL, 3),
  (9, 6, 1, NULL, 'nett anzusehen', NULL, NULL, NULL, 3),
  (10, 7, 1, NULL, 'Tier mit Wirbelsäule', NULL, NULL, NULL, 6),
  (11, 8, 1, NULL, 'Nest eines Vogels', NULL, NULL, NULL, 6),
  (12, 9, 1, 'Mahlzeit', 'kleine Mahlzeit am Vormittag oder Nachmittag', NULL, NULL, 'Österreich', 1);

INSERT INTO uebersetzung VALUES
  (1, 6, 1, 'hübsch', 'de', NULL, 6),
  (2, 6, 2, 'ansprechend', 'de', NULL, NULL),
  (3, 7, 1, 'angenehm', 'de', NULL, NULL),
  (4, 3, 1, 'Flugzeug', 'de', NULL, NULL);

INSERT INTO beispiel (bedeutung_id, eintrag_id, satz, uebersetzung, quelle, quelle_id) VALUES
  (1, 1, 'Ein Seeadler ist ein großer Vogel.', NULL, 'wiktionary', NULL),
  (NULL, 9, 'Als Jause isst sie Obst.', NULL, 'tatoeba', '123');

INSERT INTO form VALUES
  ('vogel', 'Vögel', 1, 'Mehrzahl, 1. Fall'),
  ('vogeln', 'Vögeln', 1, 'Mehrzahl, 3. Fall'),
  ('schoner', 'schöner', 4, 'Mehrstufe');

INSERT INTO schluessel VALUES
  ('vogel', 1), ('einen vogel haben', 2), ('vogel haben', 2), ('spinnen', 3), ('schon', 4), ('schoen', 4),
  ('hasslich', 5), ('haesslich', 5), ('hubsch', 6), ('huebsch', 6), ('wirbeltier', 7), ('vogelnest', 8), ('jause', 9);

INSERT INTO verweis VALUES
  (1, 'wendung', 'den Vogel abschießen', 'den größten Erfolg haben', NULL),
  (1, 'wendung', 'einen Vogel haben', 'nicht so ganz bei Verstand sein; verrückt sein', 2),
  (1, 'wendung', 'einen Vogel zeigen', 'sich an die Stirn tippen', NULL),
  (1, 'oberbegriff', 'Wirbeltier', NULL, 7),
  (1, 'verwandt', 'Vogelnest', NULL, 8),
  (1, 'herkunft', 'mittelhochdeutsch vogel, althochdeutsch fogal.', NULL, NULL),
  (4, 'gegenwort', 'hässlich', NULL, 5),
  (4, 'gegenwort', 'unschön', NULL, NULL);

INSERT INTO tabelle VALUES
  (1, 'Deklination', '["Fall","Einzahl","Mehrzahl"]', '[["1. Fall (Nominativ)","der Vogel","die Vögel"],["3. Fall (Dativ)","dem Vogel","den Vögeln"]]');
