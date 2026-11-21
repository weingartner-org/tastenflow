-- Kleine Test-Fixture für das Wörterbuch (App-Seite), nach werkzeuge/woerterbuch/schema.sql.
-- Wird NACH dem Schema ausgeführt (tests/woerterbuch-fixture.ts).

INSERT INTO info VALUES
 ('schema_version', '1'),
 ('quelle_sprache', 'de'),
 ('ziel_sprache', 'en'),
 ('stand', '2026-11-01'),
 ('quellen_text', 'Wörter aus Wiktionary, Beispielsätze aus Tatoeba.'),
 ('lizenz_text', 'Wiktionary: CC BY-SA 4.0. Tatoeba: CC BY 2.0 FR.');

-- Deutsch
INSERT INTO eintrag (id, sprache, wort, wortart, genus, mehrzahl, grammatik, stufe, rang, silben, ipa, ton_datei, ton_lizenz) VALUES
 (1, 'de', 'Haus', 'Nomen', 'sächlich', 'Häuser', 'Nomen, sächlich, Mehrzahl: Häuser', 1, 50, 'Haus', 'haʊ̯s', 'De-Haus.ogg', 'CC BY-SA 4.0, Urheber: Beispiel'),
 (2, 'de', 'gehen', 'Verb', NULL, NULL, 'Verb, unregelmäßig', 1, 30, 'ge-hen', 'ˈɡeːən', NULL, NULL),
 (3, 'de', 'Schloss', 'Nomen', 'sächlich', 'Schlösser', NULL, 3, 900, 'Schloss', 'ʃlɔs', NULL, NULL),
 (4, 'de', 'Bank', 'Nomen', 'weiblich', 'Bänke', NULL, 2, 400, 'Bank', NULL, NULL, NULL),
 (5, 'de', 'bekommen', 'Verb', NULL, NULL, NULL, 2, 200, 'be-kom-men', NULL, NULL, NULL),
 (6, 'de', 'Hausaufgabe', 'Nomen', 'weiblich', 'Hausaufgaben', NULL, 1, 300, 'Haus-auf-ga-be', NULL, NULL, NULL),
 (7, 'de', 'Hauptstadt', 'Nomen', 'weiblich', 'Hauptstädte', NULL, 2, 500, 'Haupt-stadt', NULL, NULL, NULL),
 (8, 'de', 'Haubitze', 'Nomen', 'weiblich', 'Haubitzen', NULL, 7, NULL, 'Hau-bit-ze', NULL, NULL, NULL),
 (9, 'de', 'Mädchen', 'Nomen', 'sächlich', 'Mädchen', NULL, 1, 100, 'Mäd-chen', NULL, NULL, NULL);

-- Englisch
INSERT INTO eintrag (id, sprache, wort, wortart, genus, mehrzahl, grammatik, stufe, rang, silben, ipa, ton_datei, ton_lizenz) VALUES
 (101, 'en', 'house', 'Nomen', NULL, 'houses', NULL, 1, 40, NULL, 'haʊs', 'En-us-house.ogg', NULL),
 (102, 'en', 'go', 'Verb', NULL, NULL, NULL, 1, 20, NULL, NULL, NULL, NULL),
 (103, 'en', 'lock', 'Nomen', NULL, NULL, NULL, 3, 1200, NULL, NULL, NULL, NULL),
 (104, 'en', 'castle', 'Nomen', NULL, NULL, NULL, 3, 1500, NULL, NULL, NULL, NULL),
 (105, 'en', 'bench', 'Nomen', NULL, NULL, NULL, 2, 1300, NULL, NULL, NULL, NULL),
 (106, 'en', 'bank', 'Nomen', NULL, NULL, NULL, 2, 600, NULL, NULL, NULL, NULL),
 (107, 'en', 'become', 'Verb', NULL, NULL, NULL, 2, 150, NULL, NULL, NULL, NULL),
 (108, 'en', 'get', 'Verb', NULL, NULL, NULL, 1, 25, NULL, NULL, NULL, NULL);

INSERT INTO bedeutung (id, eintrag_id, reihenfolge, wegweiser, erklaerung, sprachebene, fachgebiet, region, stufe) VALUES
 (1, 1, 1, 'Gebäude', 'Ein Gebäude, in dem Menschen wohnen.', NULL, NULL, NULL, 1),
 (2, 1, 2, 'Familie', 'Eine adelige Familie.', 'gehoben', NULL, NULL, 5),
 (3, 2, 1, 'sich bewegen', 'Zu Fuß von einem Ort zum anderen.', NULL, NULL, NULL, 1),
 (4, 3, 1, 'an der Tür', NULL, NULL, NULL, NULL, 3),
 (5, 3, 2, 'Gebäude', 'Ein großes Haus für Könige.', NULL, NULL, NULL, 4),
 (6, 4, 1, 'zum Sitzen', NULL, NULL, NULL, NULL, 2),
 (7, 4, 2, 'für Geld', NULL, NULL, NULL, NULL, 2),
 (8, 5, 1, 'erhalten', NULL, NULL, NULL, NULL, 2),
 (9, 6, 1, 'Schule', NULL, NULL, NULL, NULL, 1),
 (10, 7, 1, 'Stadt', NULL, NULL, NULL, NULL, 2),
 (11, 8, 1, 'Geschütz', NULL, NULL, 'Militär', NULL, 7),
 (12, 8, 2, 'Rausch', NULL, 'umgangssprachlich', NULL, 'Österreich', 7),
 (13, 9, 1, 'Kind', NULL, NULL, NULL, NULL, 1),
 (101, 101, 1, 'Gebäude', NULL, NULL, NULL, NULL, 1),
 (102, 102, 1, 'sich bewegen', NULL, NULL, NULL, NULL, 1),
 (103, 103, 1, 'an der Tür', NULL, NULL, NULL, NULL, 3),
 (104, 104, 1, 'Gebäude', NULL, NULL, NULL, NULL, 3),
 (105, 105, 1, 'zum Sitzen', NULL, NULL, NULL, NULL, 2),
 (106, 106, 1, 'für Geld', NULL, NULL, NULL, NULL, 2),
 (107, 107, 1, 'werden', NULL, NULL, NULL, NULL, 2),
 (108, 108, 1, 'erhalten', NULL, NULL, NULL, NULL, 1);

INSERT INTO uebersetzung (id, bedeutung_id, reihenfolge, wort, sprache, genus, ziel_eintrag_id) VALUES
 (1, 1, 1, 'house', 'en', NULL, 101),
 (2, 1, 2, 'building', 'en', NULL, NULL),
 (3, 1, 3, 'home', 'en', NULL, NULL),
 (4, 2, 1, 'house', 'en', NULL, 101),
 (5, 2, 2, 'dynasty', 'en', NULL, NULL),
 (6, 3, 1, 'go', 'en', NULL, 102),
 (7, 3, 2, 'walk', 'en', NULL, NULL),
 (8, 4, 1, 'lock', 'en', NULL, 103),
 (9, 5, 1, 'castle', 'en', NULL, 104),
 (10, 5, 2, 'palace', 'en', NULL, NULL),
 (11, 6, 1, 'bench', 'en', NULL, 105),
 (12, 7, 1, 'bank', 'en', NULL, 106),
 (13, 8, 1, 'get', 'en', NULL, 108),
 (14, 8, 2, 'receive', 'en', NULL, NULL),
 (15, 9, 1, 'homework', 'en', NULL, NULL),
 (16, 10, 1, 'capital', 'en', NULL, NULL),
 (17, 11, 1, 'howitzer', 'en', NULL, NULL),
 (18, 11, 2, 'cannon', 'en', NULL, NULL),
 (19, 12, 1, 'hangover', 'en', NULL, NULL),
 (20, 13, 1, 'girl', 'en', NULL, NULL),
 (101, 101, 1, 'Haus', 'de', 'sächlich', 1),
 (102, 102, 1, 'gehen', 'de', NULL, 2),
 (103, 103, 1, 'Schloss', 'de', 'sächlich', 3),
 (104, 104, 1, 'Schloss', 'de', 'sächlich', 3),
 (105, 104, 2, 'Burg', 'de', 'weiblich', NULL),
 (106, 105, 1, 'Bank', 'de', 'weiblich', 4),
 (107, 106, 1, 'Bank', 'de', 'weiblich', 4),
 (108, 107, 1, 'werden', 'de', NULL, NULL),
 (109, 108, 1, 'bekommen', 'de', NULL, 5);

INSERT INTO beispiel (id, bedeutung_id, eintrag_id, satz, uebersetzung, quelle, quelle_id) VALUES
 (1, 1, 1, 'Das Haus ist groß.', 'The house is big.', 'tatoeba', '12345'),
 (2, 2, 1, 'Er stammt aus einem alten Haus.', 'He comes from an old family.', 'wiktionary', NULL),
 (3, 3, 2, 'Ich gehe nach Hause.', 'I am going home.', 'tatoeba', '23456');

INSERT INTO form (form_norm, form, eintrag_id, merkmale) VALUES
 ('ging', 'ging', 2, '1. Person Einzahl, Präteritum'),
 ('ging', 'ging', 2, '3. Person Einzahl, Präteritum'),
 ('gingst', 'gingst', 2, '2. Person Einzahl, Präteritum'),
 ('gehe', 'gehe', 2, '1. Person Einzahl, Präsens'),
 ('gegangen', 'gegangen', 2, 'Partizip Perfekt'),
 ('hauser', 'Häuser', 1, 'Mehrzahl'),
 ('bekam', 'bekam', 5, '1. Person Einzahl, Präteritum'),
 ('went', 'went', 102, 'Präteritum'),
 ('gone', 'gone', 102, 'Partizip Perfekt');

INSERT INTO schluessel (schluessel, eintrag_id) VALUES
 ('haus', 1), ('gehen', 2), ('schloss', 3), ('bank', 4), ('bekommen', 5),
 ('hausaufgabe', 6), ('hauptstadt', 7), ('haubitze', 8), ('madchen', 9), ('maedchen', 9),
 ('house', 101), ('go', 102), ('lock', 103), ('castle', 104), ('bench', 105), ('bank', 106),
 ('become', 107), ('get', 108);

INSERT INTO verweis (eintrag_id, art, text, uebersetzung, ziel_eintrag_id) VALUES
 (1, 'wendung', 'zu Hause', 'at home', NULL),
 (1, 'synonym', 'Gebäude', NULL, NULL),
 (5, 'falscher_freund', 'become', 'werden', 107),
 (107, 'falscher_freund', 'bekommen', 'get', 5);

INSERT INTO tabelle (eintrag_id, titel, kopf_json, zeilen_json) VALUES
 (1, 'Einzahl und Mehrzahl', '["Fall","Einzahl","Mehrzahl"]', '[["Nominativ","das Haus","die Häuser"],["Genitiv","des Hauses","der Häuser"]]'),
 (2, 'Präsens', NULL, '[["ich","gehe"],["du","gehst"],["er, sie, es","geht"]]'),
 (101, 'Einzahl und Mehrzahl', '["Zahl","Form"]', '[["Einzahl","house"],["Mehrzahl","houses"]]');
