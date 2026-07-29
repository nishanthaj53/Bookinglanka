--
-- PostgreSQL database dump
--

\restrict u49eqmGGH1K2qQ1UXm3mwutMKRb2nf6VBj7SGgXYDQBle7gB2OGiMqMZmZLVyQW

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."User" (id, email, password, roles, "hotelIds", "createdAt", "avatarUrl", "displayName", phone) FROM stdin;
b23dbb55-3fd2-4aca-8025-1b8659bc8f02			{}	{}	2025-09-23 11:24:16.83	\N	\N	\N
5fd0ccfe-a421-44c0-9205-c036bf19def8	testuser@example.com	$2b$10$ntqxeDafgCDlM5bg1jkq1.My4dmSnhRcC/Z8zHjFkWYmklSQPZACq	{USER}	{}	2025-10-11 20:13:16.843	\N	\N	\N
ff96c8d0-59da-4f16-854b-5607ae0041b9	testuser@test.com	$2b$10$FjYXCVCt2e8xukhE2CeDSeUWQVRYJKu4rcn.XHg1RZrcOnJWiPHBm	{USER}	{}	2025-10-12 18:10:07.529	\N	\N	\N
0e0ebb25-d827-4d9a-bf18-bff3106dab9b	jerojj434@gmail.com	$2b$10$IeyGV9V5Wvl3DKo9Aa4tGe1hpOMkKZJA5/eGP9ndqsLsfaDD7k40m	{USER}	{}	2025-10-13 12:14:27.829	\N	\N	\N
d1cf38d8-6b1d-47cf-b616-4b2e86517b0c	newgmailtest@gmail.com	$2b$10$6pAaQEw1vtvbBotZoC6ELukgfp1eGd6bmuxPZhnMXRbkDJnzN1zwO	{USER}	{}	2025-10-15 12:33:35.578	\N	\N	\N
f1253988-35af-4622-bbf8-018c9eda7495	testmail@gamil.com	$2b$10$8XnjGiQzX0o/r/KAeRlSau2qavfdI1sYs8DZOmheFFpKQPvXr9Api	{USER}	{}	2025-10-15 13:31:28.17	\N	\N	\N
afe4d6a9-f6fb-457a-b91a-4e082e714efd	testmail@gmail.com	$2b$10$J3Q5VnCoRJQTEw.CO3NlH.ZgKA7Sx4AQWWk67sNY7gFka8yzR33xa	{USER}	{}	2025-10-15 17:31:43.488	\N	\N	\N
2290a8a0-bccc-497c-a26a-e3e79f9ecf3e	testmanager@test.com	$2b$10$fJ6gNHpfMUP5EuZHltt2hebfpv9wvUalzFcFyqCM2jmwUhpQ4c/7C	{MANAGER}	{}	2025-10-17 09:34:13.501	\N	\N	\N
30ab02ff-815c-4541-95d5-acabdee0f4ad	manager1@example.com	$2b$10$X/f3oSzN5nyYFxGt/YvVr.yg2l6P1t.6NFcK/TXUJaU3J8TnjUz2.	{MANAGER}	{}	2025-10-17 10:38:56.223	\N	\N	\N
2efac08d-3a26-4468-b18f-d01fdbe9abe1	testmanager1@example.com	$2b$10$/RrtvmjWEv.rC5xreT1SVu4ATajWWrSJVx7/R3thGfbbYLpJ4iu3C	{MANAGER}	{}	2025-10-18 14:15:11.381	\N	\N	\N
90ae0afa-aa44-4b1b-a33d-17e1dcd61a6c	usertest1234@gmail.com	$2b$10$WTXCn.Sd0cobWU6bQBHkwOatOTHsh0Wpz2aKIO0rxLqchhDKS8tBy	{USER}	{}	2025-10-18 15:22:23.702	\N	\N	\N
5c5ff55a-ecb2-48c3-b8ff-bd9ef3076f93	shangrila@gmail.com	$2b$10$uKsUK8RUUg0ChpH2Jze5U.rrtUc0Qy88OidaWcIdmb6/m9MJUMoWC	{MANAGER}	{}	2025-10-18 18:58:11.022	\N	\N	\N
514058b7-922f-441b-ac38-20af437a9854	testmanager@gmail.com	$2b$10$qY9x8V5hCh0uPsIGtQZAkOTrju2UIhZd8bb1WizFfYep1blVGiXd.	{MANAGER}	{}	2025-10-19 17:03:50.586	\N	\N	\N
246f7f59-5760-46ad-aac4-079b75d49f80	testuser@gmail.com	$2b$10$jeJNaP6EUaEiakhyhnnHPe9m29tJOICAC7bJ9okLTl2EvCEf1dGh2	{USER}	{}	2025-10-22 17:13:17.127	\N	\N	\N
5a0bc7e2-361f-4067-82f1-38bba919bd77	testadmin@gamil.com	$2b$10$h0yy4NwmMtDwg26g3bkIp.TS8KCqrOhxrx0JS77o23csrKmfwHGQq	{ADMIN}	{}	2025-10-24 18:44:56.2	\N	\N	\N
a46d547a-eb34-4715-ac86-26e5d03de204	manager@gmail.com	$2b$10$AKBjCs1yDWlWXwyon1XLEuGlM.X42AiYsOSOgrViA5V83FSl7x/EK	{MANAGER}	{}	2025-11-05 20:22:48.527	\N	\N	\N
3d35b783-7146-4866-ab9c-bd6714e9ae07	testing@gmail.com	$2b$10$zPxx0dlImBZ8TQm1HwtH6uMVhPSRL8YRi2V2f.OYFHo/pY7azQ3tC	{USER}	{}	2026-01-07 11:46:37.395	\N	\N	\N
d15fa760-bb7d-4cb8-9baf-4d5f720d2d61	nishanthatest@gmail.com	$2b$10$Y2ZUbsbmtocqzFK2YDpqoeXxHRa5HaR0AN3hVFVp8ZdLgxwWPmuSO	{USER}	{}	2026-01-29 10:08:31.566	\N	\N	\N
d1e4ee46-a334-4d1d-9e9a-f727f9a606f3	testingmail12@gmail.com	$2b$10$A8pNY1elu8OGfAwbMV0aO.VodeNB26QKdb60mBZUo.3.UlXbe4OI2	{USER}	{}	2026-01-29 13:06:30.356	\N	\N	\N
aaaa59ca-e7f2-495c-ba28-d1dd76a76132	ceyil62819@dwseal.com	$2b$10$oDprxnU8YLkU0BF4I30VS.JSqHl1Xn3d2h5JE57NCPpfAfuN32e2u	{MANAGER}	{}	2026-04-18 09:21:28.071	\N	\N	\N
bd47dfe3-7e05-4ed4-8fe5-b8ad738f6fd3	testingmanager@gmail.com	$2b$10$bLMiNtdn1u0xIRNVf5ZSl.YMmwk/MWzDV/SGt2buTOm/AafFvy3B.	{MANAGER}	{f1b9ab1a-0d01-4f24-a001-000000000101,f1b9ab1a-0d01-4f24-a001-000000000102,f1b9ab1a-0d01-4f24-a001-000000000103,f1b9ab1a-0d01-4f24-a001-000000000201,f1b9ab1a-0d01-4f24-a001-000000000202,f1b9ab1a-0d01-4f24-a001-000000000203,f1b9ab1a-0d01-4f24-a001-000000000301,f1b9ab1a-0d01-4f24-a001-000000000302,f1b9ab1a-0d01-4f24-a001-000000000401,f1b9ab1a-0d01-4f24-a001-000000000402}	2025-11-05 19:32:14.333	\N	\N	\N
ef48a2cb-9b63-4f38-88e5-c7a2b83674ec	nishanthac53@gmail.com	$2b$10$wwo9B.Zi1Q.M2fpN3Hh8Kuy1tkKmMr.H3leAAIaXVM/5n0v5rxju.	{USER}	{}	2026-04-19 20:03:11.776	\N	\N	\N
383985a7-4af9-401d-9dcc-bc828b76eb0b	abcd@gmail.coom	$2b$10$/L0xgj.He4M1flfaOLzyuu10bWIbQupfo.6ldcnR8Vga/joyuTvCi	{USER}	{}	2026-04-20 05:57:54.179	\N	\N	\N
\.


--
-- Data for Name: AuditEvent; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."AuditEvent" (id, "actorUserId", "entityType", "entityId", action, "snapshotJson", "createdAt") FROM stdin;
\.


--
-- Data for Name: Hotel; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Hotel" (id, name, address, "createdAt", latitude, longitude, "ownerUserId", status, description, "overviewTitle", overview, "propertyType", "checkInTime", "checkOutTime", "basePrice", highlights, amenities, "roomAmenities", "mapEmbedUrl") FROM stdin;
f1b9ab1a-0d01-4f24-a001-000000000402	Kandy Cultural Retreat	Temple Road, Kandy, Sri Lanka	2026-04-19 11:37:01.365	7.2936	80.6413	bd47dfe3-7e05-4ed4-8fe5-b8ad738f6fd3	ACTIVE	Kandy Cultural Retreat: well-appointed rooms, clear map location, and amenities suited for leisure or business visits.	Hotel overview	Stay at Kandy Cultural Retreat — curated for travellers on Booking Lanka. Enjoy a strong location in Sri Lanka with dependable comfort and friendly service.	Resort	2:00 PM	11:00 AM	162	{"Free Wi-Fi","On-site dining","24-hour reception"}	{"Outdoor pool","Fitness centre","Spa services","Airport shuttle",Concierge}	{"Air conditioning","Smart TV","Tea & coffee","In-room safe","Daily housekeeping"}	https://maps.google.com/maps?q=7.2936,80.6413&z=15&output=embed
4f67e478-483d-48fa-b8c5-d5178133eee8	Dambulla  heritage	Freedom Village Hotel, 8th Canal, Kandy-Jaffna Road, Dambulla, Matale District, Central Province, 21100, Sri Lanka	2026-04-19 16:28:46.264	7.8692859	80.6537703	bd47dfe3-7e05-4ed4-8fe5-b8ad738f6fd3	ACTIVE	perfectly situated in the vibrant heart of the Cultural Triangle.\r\nSigiriya Rock Fortress: Just a 20-minute drive to the "Eighth Wonder of the World," \r\nWildlife Adventures: Minutes away from Minneriya and Kaudulla National Parks, \r\nHidden Gems: Easy access to the Ibbankatuwa Megalithic Tombs (2,700 years old) and the Rose Quartz Mountain Range, the largest in South Asia.\r\nAuthentic Local Life: Visit the country's largest Vegetable Distribution Center to see the colorful, bustling trade that feeds the nation.	Hotel Overview	perfectly situated in the vibrant heart of the Cultural Triangle.\r\nSigiriya Rock Fortress: Just a 20-minute drive to the "Eighth Wonder of the World," \r\nWildlife Adventures: Minutes away from Minneriya and Kaudulla National Parks, \r\nHidden Gems: Easy access to the Ibbankatuwa Megalithic Tombs (2,700 years old) and the Rose Quartz Mountain Range, the largest in South Asia.\r\nAuthentic Local Life: Visit the country's largest Vegetable Distribution Center to see the colorful, bustling trade that feeds the nation.	Villa	null	null	200	{"Air conditioning","High-speed Wi-Fi","Swimming pool","Private balcony","Hot water rain showers","En-suite bathroom","King-sized beds",Mini-fridge,"In-room safe","Tea and coffee maker","Flat-screen TV","Soundproof rooms","24-hour room service","Complimentary breakfast","Lush tropical garden","On-site restaurant","Traditional Ayurvedic spa"}	{"Climate Control: Whisper-quiet air conditioning","Ceiling fans.\r\nRest & Sleep: King-sized beds","High-thread-count linens","Blackout curtains","Choice of pillows.\r\nIn-Room Tech: Complimentary high-speed Wi-Fi","Universal power sockets","Smart TV with streaming services.\r\nConvenience"}	{}	https://maps.google.com/maps?q=7.8692859,80.6537703&z=16&output=embed
5fb41fbd-5484-4cb3-96d5-1d59aa81c9c7	Ella Rock hotel 	Ella Heritage, Ella - Passara Road, Ella, Badulla District, Uva Province, 90900, Sri Lanka	2026-04-19 17:08:06.611	6.8736023	81.0523558	bd47dfe3-7e05-4ed4-8fe5-b8ad738f6fd3	ACTIVE	Ella is the emerald of the Highlands. \r\nThe World’s Most Beautiful Train Ride: Ella is the star stop on the iconic Kandy-to-Ella rail route.\r\nHiking Paradise: Home to Little Adam’s Peak and the challenging Ella Rock, offering 360-degree views of the mist-covered valleys.\r\nArchitectural Wonder: The Nine Arch Bridge is just minutes away—a must-see marvel hidden in the jungle.\r\nCooler Climate: A refreshing escape from the tropical heat of the coast and the cultural triangle	Hotel Overview	Ella is the emerald of the Highlands. \r\nThe World’s Most Beautiful Train Ride: Ella is the star stop on the iconic Kandy-to-Ella rail route.\r\nHiking Paradise: Home to Little Adam’s Peak and the challenging Ella Rock, offering 360-degree views of the mist-covered valleys.\r\nArchitectural Wonder: The Nine Arch Bridge is just minutes away—a must-see marvel hidden in the jungle.\r\nCooler Climate: A refreshing escape from the tropical heat of the coast and the cultural triangle	\N	\N	\N	\N	{"Mountain views","Private balcony","Cozy blankets","Hot water showers","Large glass windows","Tea plantation walks","Outdoor fire pit",Hammocks}	{"Sunrise yoga deck","Guided hiking tours","Tuk-tuk arrangements","Raincoats provided","Local tea tasting","Vegan-friendly breakfast","High-speed Wi-Fi","Laundry service for hikers."}	{}	https://maps.google.com/maps?q=6.8736023,81.0523558&z=16&output=embed
c6becc9b-0441-40ee-a4ef-e44fc7a16587	Ocean View Resort & Spa	Galle, Sri Lanka	2025-10-17 10:41:30.947	6.035	80.215	30ab02ff-815c-4541-95d5-acabdee0f4ad	DRAFT	\N	Hotel Overview	\N	\N	\N	\N	\N	{}	{}	{}	\N
f1b9ab1a-0d01-4f24-a001-000000000203	Colombo Skyline Bay	Kollupitiya, Colombo, Sri Lanka	2026-04-19 11:37:01.282	6.9126	79.8506	bd47dfe3-7e05-4ed4-8fe5-b8ad738f6fd3	ACTIVE	Colombo Skyline Bay: well-appointed rooms, clear map location, and amenities suited for leisure or business visits.	Hotel overview	Stay at Colombo Skyline Bay — curated for travellers on Booking Lanka. Enjoy a strong location in Sri Lanka with dependable comfort and friendly service.	Guesthouse	2:00 PM	11:00 AM	134	{"Free Wi-Fi","On-site dining","24-hour reception"}	{"Outdoor pool","Fitness centre","Spa services","Airport shuttle",Concierge}	{"Air conditioning","Smart TV","Tea & coffee","In-room safe","Daily housekeeping"}	https://maps.google.com/maps?q=6.9126,79.8506&z=15&output=embed
f1b9ab1a-0d01-4f24-a001-000000000102	Galle Blue Horizon Resort	Dewata, Galle, Sri Lanka	2026-04-19 11:37:01.221	6.0211	80.2569	bd47dfe3-7e05-4ed4-8fe5-b8ad738f6fd3	ACTIVE	Galle Blue Horizon Resort: well-appointed rooms, clear map location, and amenities suited for leisure or business visits.	Hotel overview	Stay at Galle Blue Horizon Resort — curated for travellers on Booking Lanka. Enjoy a strong location in Sri Lanka with dependable comfort and friendly service.	City Hotel	2:00 PM	11:00 AM	106	{"Free Wi-Fi","On-site dining","24-hour reception"}	{"Outdoor pool","Fitness centre","Spa services","Airport shuttle",Concierge}	{"Air conditioning","Smart TV","Tea & coffee","In-room safe","Daily housekeeping"}	https://maps.google.com/maps?q=6.0211,80.2569&z=15&output=embed
b4a17c3b-8f21-43dc-b87f-aaaceb03f155		\N	2025-09-23 09:36:05.341	\N	\N	\N	DRAFT	\N	Hotel Overview	\N	\N	\N	\N	\N	{}	{}	{}	\N
9cdd8f0e-5b3a-4d13-9d0a-2209d8f3f101	Booking Lanka Demo Beach Resort	Unawatuna, Galle, Sri Lanka	2026-04-09 10:59:10.466	6.01	80.2485	\N	DRAFT	\N	Hotel Overview	\N	\N	\N	\N	\N	{}	{}	{}	\N
f1b9ab1a-0d01-4f24-a001-000000000202	Colombo City Central Hotel	Fort, Colombo, Sri Lanka	2026-04-19 11:37:01.263	6.9344	79.8428	bd47dfe3-7e05-4ed4-8fe5-b8ad738f6fd3	ACTIVE	Colombo City Central Hotel: well-appointed rooms, clear map location, and amenities suited for leisure or business visits.	Hotel overview	Stay at Colombo City Central Hotel — curated for travellers on Booking Lanka. Enjoy a strong location in Sri Lanka with dependable comfort and friendly service.	Villa	2:00 PM	11:00 AM	127	{"Free Wi-Fi","On-site dining","24-hour reception"}	{"Outdoor pool","Fitness centre","Spa services","Airport shuttle",Concierge}	{"Air conditioning","Smart TV","Tea & coffee","In-room safe","Daily housekeeping"}	https://maps.google.com/maps?q=6.9344,79.8428&z=15&output=embed
f1b9ab1a-0d01-4f24-a001-000000000301	Ella Mountain View Lodge	Passara Road, Ella, Sri Lanka	2026-04-19 11:37:01.302	6.8667	81.0466	bd47dfe3-7e05-4ed4-8fe5-b8ad738f6fd3	ACTIVE	Ella Mountain View Lodge: well-appointed rooms, clear map location, and amenities suited for leisure or business visits.	Hotel overview	Stay at Ella Mountain View Lodge — curated for travellers on Booking Lanka. Enjoy a strong location in Sri Lanka with dependable comfort and friendly service.	Resort	2:00 PM	11:00 AM	141	{"Free Wi-Fi","On-site dining","24-hour reception"}	{"Outdoor pool","Fitness centre","Spa services","Airport shuttle",Concierge}	{"Air conditioning","Smart TV","Tea & coffee","In-room safe","Daily housekeeping"}	https://maps.google.com/maps?q=6.8667,81.0466&z=15&output=embed
f1b9ab1a-0d01-4f24-a001-000000000302	Ella Peak Trail Hotel	Little Adam's Peak Road, Ella, Sri Lanka	2026-04-19 11:37:01.322	6.8592	81.0598	bd47dfe3-7e05-4ed4-8fe5-b8ad738f6fd3	ACTIVE	Ella Peak Trail Hotel: well-appointed rooms, clear map location, and amenities suited for leisure or business visits.	Hotel overview	Stay at Ella Peak Trail Hotel — curated for travellers on Booking Lanka. Enjoy a strong location in Sri Lanka with dependable comfort and friendly service.	City Hotel	2:00 PM	11:00 AM	148	{"Free Wi-Fi","On-site dining","24-hour reception"}	{"Outdoor pool","Fitness centre","Spa services","Airport shuttle",Concierge}	{"Air conditioning","Smart TV","Tea & coffee","In-room safe","Daily housekeeping"}	https://maps.google.com/maps?q=6.8592,81.0598&z=15&output=embed
f1b9ab1a-0d01-4f24-a001-000000000401	Kandy River Heritage Hotel	Mahaweli River Side, Kandy, Sri Lanka	2026-04-19 11:37:01.342	7.2906	80.6337	bd47dfe3-7e05-4ed4-8fe5-b8ad738f6fd3	ACTIVE	Kandy River Heritage Hotel: well-appointed rooms, clear map location, and amenities suited for leisure or business visits.	Hotel overview	Stay at Kandy River Heritage Hotel — curated for travellers on Booking Lanka. Enjoy a strong location in Sri Lanka with dependable comfort and friendly service.	Boutique	2:00 PM	11:00 AM	155	{"Free Wi-Fi","On-site dining","24-hour reception"}	{"Outdoor pool","Fitness centre","Spa services","Airport shuttle",Concierge}	{"Air conditioning","Smart TV","Tea & coffee","In-room safe","Daily housekeeping"}	https://maps.google.com/maps?q=7.2906,80.6337&z=15&output=embed
f1b9ab1a-0d01-4f24-a001-000000000101	Galle Ocean Pearl	Unawatuna Beach, Galle, Sri Lanka	2026-04-19 11:37:00.199	6.0095	80.2483	bd47dfe3-7e05-4ed4-8fe5-b8ad738f6fd3	ACTIVE	Galle Ocean Pearl: well-appointed rooms, clear map location, and amenities suited for leisure or business visits.	Hotel overview	Stay at Galle Ocean Pearl — curated for travellers on Booking Lanka. Enjoy a strong location in Sri Lanka with dependable comfort and friendly service.	Resort	2:00 PM	11:00 AM	99	{"Free Wi-Fi","On-site dining","24-hour reception"}	{"Outdoor pool","Fitness centre","Spa services","Airport shuttle",Concierge}	{"Air conditioning","Smart TV","Tea & coffee","In-room safe","Daily housekeeping"}	https://maps.google.com/maps?q=6.0095,80.2483&z=15&output=embed
f1b9ab1a-0d01-4f24-a001-000000000103	Galle Palm Breeze Hotel	Mahamodara, Galle, Sri Lanka	2026-04-19 11:37:01.236	6.0536	80.2067	bd47dfe3-7e05-4ed4-8fe5-b8ad738f6fd3	ACTIVE	Galle Palm Breeze Hotel: well-appointed rooms, clear map location, and amenities suited for leisure or business visits.	Hotel overview	Stay at Galle Palm Breeze Hotel — curated for travellers on Booking Lanka. Enjoy a strong location in Sri Lanka with dependable comfort and friendly service.	Boutique	2:00 PM	11:00 AM	113	{"Free Wi-Fi","On-site dining","24-hour reception"}	{"Outdoor pool","Fitness centre","Spa services","Airport shuttle",Concierge}	{"Air conditioning","Smart TV","Tea & coffee","In-room safe","Daily housekeeping"}	https://maps.google.com/maps?q=6.0536,80.2067&z=15&output=embed
f1b9ab1a-0d01-4f24-a001-000000000201	Colombo Marine Front	Marine Drive, Colombo, Sri Lanka	2026-04-19 11:37:01.251	6.8884	79.8518	bd47dfe3-7e05-4ed4-8fe5-b8ad738f6fd3	ACTIVE	Colombo Marine Front: well-appointed rooms, clear map location, and amenities suited for leisure or business visits.	Hotel overview	Stay at Colombo Marine Front — curated for travellers on Booking Lanka. Enjoy a strong location in Sri Lanka with dependable comfort and friendly service.	Eco Lodge	2:00 PM	11:00 AM	120	{"Free Wi-Fi","On-site dining","24-hour reception"}	{"Outdoor pool","Fitness centre","Spa services","Airport shuttle",Concierge}	{"Air conditioning","Smart TV","Tea & coffee","In-room safe","Daily housekeeping"}	https://maps.google.com/maps?q=6.8884,79.8518&z=15&output=embed
\.


--
-- Data for Name: RoomType; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."RoomType" (id, "hotelId", name, capacity, "createdAt", "pricePerNight", description, highlights, overview, "overviewTitle", viewpoint, "pricePerPerson", "totalUnits") FROM stdin;
4deb54cb-7f04-4aee-8c56-420618657fe2	4f67e478-483d-48fa-b8c5-d5178133eee8	Standard Garden Room	3	2026-04-19 16:39:52.855	150	Ideal for budget-conscious solo travelers	{}	Ideal for budget-conscious solo travelers or backpackers seeking comfort and essential amenities.\r\n\r\nAmenities: Queen-sized bed, Ceiling fan or basic A/C, Private bathroom, Garden view, Free Wi-Fi.	Room overview	\N	50	4
537f2f3d-fb76-4e1c-9e12-e84fa2daa89d	5fb41fbd-5484-4cb3-96d5-1d59aa81c9c7	Hiker’s Nest (Standard Room	5	2026-04-19 17:10:27.222	250	Description: Simple, cozy, and clean for active travelers who spend all day trekking	{}	Description: Simple, cozy, and clean for active travelers who spend all day trekking	Room overview	Mountain View	50	10
f71ce6a1-ae9e-47f8-af69-431a4f688001	9cdd8f0e-5b3a-4d13-9d0a-2209d8f3f101	Deluxe Ocean Room	2	2026-04-09 11:07:59.379	120	Spacious room with balcony, ocean view, king bed, and premium bathroom amenities.	{}	\N	Room overview	\N	\N	1
f71ce6a1-ae9e-47f8-af69-431a4f688002	9cdd8f0e-5b3a-4d13-9d0a-2209d8f3f101	Signature Suite	3	2026-04-09 11:07:59.383	180	Large suite with separate living area, bathtub, workspace, and sea-facing balcony.	{}	\N	Room overview	\N	\N	1
f71ce6a1-ae9e-47f8-af69-431a4f688003	9cdd8f0e-5b3a-4d13-9d0a-2209d8f3f101	Family Garden Room	4	2026-04-09 11:07:59.386	210	Family-friendly room with twin + queen bedding layout and garden-facing patio.	{}	\N	Room overview	\N	\N	1
4a56ee33-74db-44cf-82db-63afa6911365	4f67e478-483d-48fa-b8c5-d5178133eee8	Deluxe Balcony Room	4	2026-04-19 16:46:23.855	200	The most popular choice for couples and tourists	{}	tourists who want a balance of luxury and value.\r\nAmenities: King-sized bed, Powerful Air conditioning, Private balcony with mountain or forest views, Hot water rain shower, Mini-fridge.	Room overview	Sunset view	50	4
588ab018-92bf-4bc4-8371-0ef8cffbebc7	5fb41fbd-5484-4cb3-96d5-1d59aa81c9c7	Cloud-View Deluxe (Balcony Room)	5	2026-04-19 17:15:23.082	300	Description: Large glass windows and a private balcony facing the Ella Gap or tea	{}	Large glass windows and a private balcony	Room overview	Sky View	60	6
f2bd3012-9928-4db6-aa85-ed3f39f8a220	f1b9ab1a-0d01-4f24-a001-000000000101	Classic Double	2	2026-04-19 17:51:12.189	99	Comfortable double room for two guests.	{}	\N	Room overview	\N	\N	3
6bb7f684-425a-4cc6-a144-87b220490aa6	f1b9ab1a-0d01-4f24-a001-000000000101	Deluxe Triple	3	2026-04-19 17:51:12.197	159	Extra space for three guests with a work desk.	{}	\N	Room overview	\N	\N	3
2f4f1dcb-9735-43c2-876e-935ba614c2e6	f1b9ab1a-0d01-4f24-a001-000000000101	Family Suite	5	2026-04-19 17:51:12.233	239	Ideal for families; generous layout and sitting area.	{}	\N	Room overview	\N	\N	3
38512b29-8c5a-4d88-ab6d-c4b305d78aa4	f1b9ab1a-0d01-4f24-a001-000000000102	Classic Double	2	2026-04-19 17:51:12.275	106	Comfortable double room for two guests.	{}	\N	Room overview	\N	\N	3
944d2296-fc06-4192-b5ad-0e47bbe3afda	f1b9ab1a-0d01-4f24-a001-000000000102	Deluxe Triple	3	2026-04-19 17:51:12.28	166	Extra space for three guests with a work desk.	{}	\N	Room overview	\N	\N	3
5510b1ef-addb-40d8-b0aa-6c1fd2bc6b63	f1b9ab1a-0d01-4f24-a001-000000000102	Family Suite	5	2026-04-19 17:51:12.286	246	Ideal for families; generous layout and sitting area.	{}	\N	Room overview	\N	\N	3
a18d3a31-dd41-418f-a4ca-6f09963dd8f0	f1b9ab1a-0d01-4f24-a001-000000000103	Classic Double	2	2026-04-19 17:51:12.315	113	Comfortable double room for two guests.	{}	\N	Room overview	\N	\N	3
dd71bef5-d201-4392-828d-837c2fed3c55	f1b9ab1a-0d01-4f24-a001-000000000103	Deluxe Triple	3	2026-04-19 17:51:12.319	173	Extra space for three guests with a work desk.	{}	\N	Room overview	\N	\N	3
854f5c12-dd09-407c-9e74-796aca3db9b1	f1b9ab1a-0d01-4f24-a001-000000000103	Family Suite	5	2026-04-19 17:51:12.322	253	Ideal for families; generous layout and sitting area.	{}	\N	Room overview	\N	\N	3
c0a9a8db-fc36-405d-93b3-f32d95637973	f1b9ab1a-0d01-4f24-a001-000000000201	Classic Double	2	2026-04-19 17:51:12.342	120	Comfortable double room for two guests.	{}	\N	Room overview	\N	\N	3
73b561ff-378a-4712-af20-042c401ecfe5	f1b9ab1a-0d01-4f24-a001-000000000201	Deluxe Triple	3	2026-04-19 17:51:12.346	180	Extra space for three guests with a work desk.	{}	\N	Room overview	\N	\N	3
1c2bf57e-8917-4317-b1bb-149811f6eb5d	f1b9ab1a-0d01-4f24-a001-000000000201	Family Suite	5	2026-04-19 17:51:12.349	260	Ideal for families; generous layout and sitting area.	{}	\N	Room overview	\N	\N	3
a5d14234-d8fe-4643-9415-8ce95e57e350	f1b9ab1a-0d01-4f24-a001-000000000202	Classic Double	2	2026-04-19 17:51:12.372	127	Comfortable double room for two guests.	{}	\N	Room overview	\N	\N	3
5c5f16b4-bb93-4a4d-be9a-33f3be240e72	f1b9ab1a-0d01-4f24-a001-000000000202	Deluxe Triple	3	2026-04-19 17:51:12.376	187	Extra space for three guests with a work desk.	{}	\N	Room overview	\N	\N	3
fbf382c7-c6ea-4f2c-9a98-fb6c0db0407c	f1b9ab1a-0d01-4f24-a001-000000000202	Family Suite	5	2026-04-19 17:51:12.379	267	Ideal for families; generous layout and sitting area.	{}	\N	Room overview	\N	\N	3
b308848a-d5a2-4314-b963-a3a28bc52525	f1b9ab1a-0d01-4f24-a001-000000000203	Classic Double	2	2026-04-19 17:51:12.398	134	Comfortable double room for two guests.	{}	\N	Room overview	\N	\N	3
3d7306a0-ecbc-41da-8026-adbab73bd50e	f1b9ab1a-0d01-4f24-a001-000000000203	Deluxe Triple	3	2026-04-19 17:51:12.4	194	Extra space for three guests with a work desk.	{}	\N	Room overview	\N	\N	3
8bed9c03-8740-41b0-9919-fae020ecaee9	f1b9ab1a-0d01-4f24-a001-000000000203	Family Suite	5	2026-04-19 17:51:12.403	274	Ideal for families; generous layout and sitting area.	{}	\N	Room overview	\N	\N	3
d2b345a0-9bab-4af2-85c6-00a26a0e5a02	f1b9ab1a-0d01-4f24-a001-000000000301	Classic Double	2	2026-04-19 17:51:12.421	141	Comfortable double room for two guests.	{}	\N	Room overview	\N	\N	3
7401a133-3e1f-42d5-b904-410fb19144d7	f1b9ab1a-0d01-4f24-a001-000000000301	Deluxe Triple	3	2026-04-19 17:51:12.424	201	Extra space for three guests with a work desk.	{}	\N	Room overview	\N	\N	3
b46f9752-31b1-4cd0-a4ea-0afec9e6a1d3	f1b9ab1a-0d01-4f24-a001-000000000301	Family Suite	5	2026-04-19 17:51:12.427	281	Ideal for families; generous layout and sitting area.	{}	\N	Room overview	\N	\N	3
9233819b-93ba-48fc-992e-2fe00b945358	f1b9ab1a-0d01-4f24-a001-000000000302	Classic Double	2	2026-04-19 17:51:12.441	148	Comfortable double room for two guests.	{}	\N	Room overview	\N	\N	3
5893ce29-833b-42a1-81fe-088173a6c3f1	f1b9ab1a-0d01-4f24-a001-000000000302	Deluxe Triple	3	2026-04-19 17:51:12.443	208	Extra space for three guests with a work desk.	{}	\N	Room overview	\N	\N	3
1ee203fb-c918-432b-b094-a28a3273a68b	f1b9ab1a-0d01-4f24-a001-000000000302	Family Suite	5	2026-04-19 17:51:12.446	288	Ideal for families; generous layout and sitting area.	{}	\N	Room overview	\N	\N	3
5eaf6b9b-4a4d-46c7-8c67-d4c10a9d0a8c	f1b9ab1a-0d01-4f24-a001-000000000401	Classic Double	2	2026-04-19 17:51:12.46	155	Comfortable double room for two guests.	{}	\N	Room overview	\N	\N	3
f4c23441-5fa6-4af6-b713-994f8e231abc	f1b9ab1a-0d01-4f24-a001-000000000401	Deluxe Triple	3	2026-04-19 17:51:12.463	215	Extra space for three guests with a work desk.	{}	\N	Room overview	\N	\N	3
0c9830d7-f801-46eb-a8f6-d1b4791bbfa1	f1b9ab1a-0d01-4f24-a001-000000000401	Family Suite	5	2026-04-19 17:51:12.466	295	Ideal for families; generous layout and sitting area.	{}	\N	Room overview	\N	\N	3
3570357d-a3d2-4268-a8b9-3b99e04d3a17	f1b9ab1a-0d01-4f24-a001-000000000402	Classic Double	2	2026-04-19 17:51:12.48	162	Comfortable double room for two guests.	{}	\N	Room overview	\N	\N	3
b6c44f2d-9fc3-4ebe-af65-9e2203248cd6	f1b9ab1a-0d01-4f24-a001-000000000402	Deluxe Triple	3	2026-04-19 17:51:12.482	222	Extra space for three guests with a work desk.	{}	\N	Room overview	\N	\N	3
38aaed07-cbfb-4073-8b7c-01b4141aefed	f1b9ab1a-0d01-4f24-a001-000000000402	Family Suite	5	2026-04-19 17:51:12.486	302	Ideal for families; generous layout and sitting area.	{}	\N	Room overview	\N	\N	3
\.


--
-- Data for Name: Booking; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Booking" (id, "userId", "hotelId", "roomTypeId", "checkIn", "checkOut", "totalAmount", currency, "createdAt", status, guests, rooms, "cancelReason", "reminderAt", "reminderMessage", "reminderSeenAt") FROM stdin;
b12d6e77-7bfa-447a-a9ee-5efa305751db	246f7f59-5760-46ad-aac4-079b75d49f80	f1b9ab1a-0d01-4f24-a001-000000000203	b308848a-d5a2-4314-b963-a3a28bc52525	2026-04-29 00:00:00	2026-05-01 00:00:00	268	USD	2026-04-19 18:15:25.258	COMPLETED	2	1	\N	\N	\N	\N
2f1e3176-3ec9-4c2b-a797-3c93c9430ace	246f7f59-5760-46ad-aac4-079b75d49f80	5fb41fbd-5484-4cb3-96d5-1d59aa81c9c7	537f2f3d-fb76-4e1c-9e12-e84fa2daa89d	2026-04-27 00:00:00	2026-04-29 00:00:00	500	USD	2026-04-19 18:15:25.237	COMPLETED	2	1	\N	\N	\N	\N
b16d028b-95ed-4722-ad9f-3dd3ef4e63e3	246f7f59-5760-46ad-aac4-079b75d49f80	f1b9ab1a-0d01-4f24-a001-000000000103	a18d3a31-dd41-418f-a4ca-6f09963dd8f0	2026-04-21 00:00:00	2026-04-24 00:00:00	339	USD	2026-04-19 18:15:24.977	CHECKED_IN	2	1	\N	\N	\N	\N
188eec85-fbfa-4d9c-b192-198ac846e59e	246f7f59-5760-46ad-aac4-079b75d49f80	f1b9ab1a-0d01-4f24-a001-000000000402	3570357d-a3d2-4268-a8b9-3b99e04d3a17	2026-04-23 00:00:00	2026-04-24 00:00:00	324	USD	2026-04-19 19:00:22.822	CANCELLED	4	2	\N	\N	\N	\N
a7985db1-af0a-4657-9b63-17e026bc2aaf	383985a7-4af9-401d-9dcc-bc828b76eb0b	4f67e478-483d-48fa-b8c5-d5178133eee8	4deb54cb-7f04-4aee-8c56-420618657fe2	2026-04-23 00:00:00	2026-04-24 00:00:00	450	USD	2026-04-20 06:02:08.073	CANCELLED	2	3	\N	\N	\N	\N
82fd1f0e-c914-4fd3-9ca3-2da691bc2df1	246f7f59-5760-46ad-aac4-079b75d49f80	f1b9ab1a-0d01-4f24-a001-000000000103	a18d3a31-dd41-418f-a4ca-6f09963dd8f0	2026-04-22 00:00:00	2026-04-25 00:00:00	339	USD	2026-04-20 06:09:48.531	CANCELLED	2	1	\N	\N	\N	\N
f1d690bd-7b60-41a7-8f51-01039df1bda5	246f7f59-5760-46ad-aac4-079b75d49f80	5fb41fbd-5484-4cb3-96d5-1d59aa81c9c7	537f2f3d-fb76-4e1c-9e12-e84fa2daa89d	2026-04-28 00:00:00	2026-04-30 00:00:00	500	USD	2026-04-20 06:09:48.637	CANCELLED	2	1	\N	\N	\N	\N
1e091c12-fe19-4797-8d0f-251ca24f5688	246f7f59-5760-46ad-aac4-079b75d49f80	f1b9ab1a-0d01-4f24-a001-000000000203	b308848a-d5a2-4314-b963-a3a28bc52525	2026-04-30 00:00:00	2026-05-02 00:00:00	268	USD	2026-04-20 06:09:48.651	CANCELLED	2	1	\N	\N	\N	\N
f7397f33-707c-4e2d-8753-b03bb3daab34	383985a7-4af9-401d-9dcc-bc828b76eb0b	4f67e478-483d-48fa-b8c5-d5178133eee8	4deb54cb-7f04-4aee-8c56-420618657fe2	2026-04-22 00:00:00	2026-04-24 00:00:00	300	USD	2026-04-20 06:01:03.245	CANCELLED	2	1	\N	\N	\N	\N
fe071893-fecd-4119-beb5-8f060a6721da	246f7f59-5760-46ad-aac4-079b75d49f80	5fb41fbd-5484-4cb3-96d5-1d59aa81c9c7	588ab018-92bf-4bc4-8371-0ef8cffbebc7	2026-04-22 00:00:00	2026-04-23 00:00:00	900	USD	2026-04-19 18:59:00.916	COMPLETED	2	3	\N	\N	\N	\N
13a42bee-b18e-42bb-8356-80763b8de866	ef48a2cb-9b63-4f38-88e5-c7a2b83674ec	f1b9ab1a-0d01-4f24-a001-000000000103	a18d3a31-dd41-418f-a4ca-6f09963dd8f0	2026-04-16 00:00:00	2026-04-19 00:00:00	339	USD	2026-04-19 20:07:37.782	COMPLETED	2	1	\N	\N	\N	\N
7b1b941c-797c-4214-949d-0259051e2a81	ef48a2cb-9b63-4f38-88e5-c7a2b83674ec	f1b9ab1a-0d01-4f24-a001-000000000203	b308848a-d5a2-4314-b963-a3a28bc52525	2026-04-23 00:00:00	2026-04-25 00:00:00	268	USD	2026-04-19 20:07:38.122	CHECKED_IN	2	1	\N	\N	\N	\N
ac4465c5-b445-4638-b968-615406682036	ef48a2cb-9b63-4f38-88e5-c7a2b83674ec	5fb41fbd-5484-4cb3-96d5-1d59aa81c9c7	537f2f3d-fb76-4e1c-9e12-e84fa2daa89d	2026-04-21 00:00:00	2026-04-23 00:00:00	500	USD	2026-04-19 20:07:38.06	CHECKED_IN	2	1	\N	\N	\N	\N
88952070-6bf5-4fe4-a65b-a86854a09422	ef48a2cb-9b63-4f38-88e5-c7a2b83674ec	f1b9ab1a-0d01-4f24-a001-000000000103	a18d3a31-dd41-418f-a4ca-6f09963dd8f0	2026-04-23 00:00:00	2026-04-26 00:00:00	339	USD	2026-04-20 04:47:11.012	PAID	2	1	\N	\N	\N	\N
a17ee7d1-ee77-47df-a480-f5030746fb2b	ef48a2cb-9b63-4f38-88e5-c7a2b83674ec	5fb41fbd-5484-4cb3-96d5-1d59aa81c9c7	537f2f3d-fb76-4e1c-9e12-e84fa2daa89d	2026-04-29 00:00:00	2026-05-01 00:00:00	500	USD	2026-04-20 04:47:11.434	PAID	2	1	\N	\N	\N	\N
31cee0ab-6c18-49d3-8e1c-fee96dbcdb07	ef48a2cb-9b63-4f38-88e5-c7a2b83674ec	f1b9ab1a-0d01-4f24-a001-000000000203	b308848a-d5a2-4314-b963-a3a28bc52525	2026-05-01 00:00:00	2026-05-03 00:00:00	268	USD	2026-04-20 04:47:11.476	PAID	2	1	\N	\N	\N	\N
92c01207-566c-404c-9170-48c5e34eb12a	246f7f59-5760-46ad-aac4-079b75d49f80	5fb41fbd-5484-4cb3-96d5-1d59aa81c9c7	537f2f3d-fb76-4e1c-9e12-e84fa2daa89d	2026-05-07 00:00:00	2026-05-08 00:00:00	250	USD	2026-05-06 15:05:42.158	DRAFT	2	1	\N	\N	\N	\N
c67aa574-593d-4b7f-869c-badfd8ce1f21	246f7f59-5760-46ad-aac4-079b75d49f80	5fb41fbd-5484-4cb3-96d5-1d59aa81c9c7	537f2f3d-fb76-4e1c-9e12-e84fa2daa89d	2026-05-07 00:00:00	2026-05-08 00:00:00	250	USD	2026-05-06 15:05:42.832	DRAFT	2	1	\N	\N	\N	\N
8c779a95-182d-495f-8cc7-8dfcee62236e	246f7f59-5760-46ad-aac4-079b75d49f80	5fb41fbd-5484-4cb3-96d5-1d59aa81c9c7	537f2f3d-fb76-4e1c-9e12-e84fa2daa89d	2026-05-07 00:00:00	2026-05-08 00:00:00	250	USD	2026-05-06 15:12:49.363	PAID	2	1	\N	\N	\N	\N
\.


--
-- Data for Name: CommissionRule; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."CommissionRule" (id, "hotelId", "rateBps", "fixedFee", active, "createdAt") FROM stdin;
\.


--
-- Data for Name: Destination; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Destination" (id, name, slug, district, town, region, "bestFor", overview, "whyVisit", "mapEmbedUrl", "coverImageUrl", "galleryImages", faqs, "isActive", "sortOrder", "createdAt", "updatedAt", "cardImageUrl") FROM stdin;
830d9a2e-2257-4531-9561-1a0bee3bb0e8	Arugam Bay	arugam-bay	Ampara	Arugam Bay	Eastern Province	Surfing, beach, wildlife	Arugam Bay is one of Sri Lanka's most famous surf and beach destinations with a relaxed coastal atmosphere.	Ideal for surf breaks, laid-back cafes, and nature trips to lagoons and nearby parks.	\N	/uploads/destinations/arugam-bay.png	{}	\N	t	1	2026-04-14 16:06:11.252	2026-04-19 17:50:44.642	/uploads/destinations/arugam-bay.png
d78dd056-5b77-4dc9-a78d-b239b49f6a1f	Ella	ella	Badulla	Ella	Uva Province	Hiking, mountain views, rail journeys	Ella is a hill-country town known for tea plantation landscapes, cool weather, and viewpoints like Little Adam's Peak.	Travelers come for scenic train rides, hiking trails, and a relaxed mountain-town feel.	\N	/uploads/destinations/ella.png	{}	\N	t	2	2026-04-14 16:06:11.252	2026-04-19 17:50:44.647	/uploads/destinations/ella.png
957feac4-f370-43b2-bf81-a419afd0839d	Colombo	colombo	Colombo	Colombo	Western Province	City breaks, shopping, food	Colombo is Sri Lanka's commercial capital with beachfront promenades, malls, restaurants, and heritage neighborhoods.	Great for short city stays, business travel, and connecting to the rest of the country.	\N	/uploads/destinations/colombo.png	{}	\N	t	3	2026-04-14 16:06:11.252	2026-04-19 17:50:44.652	/uploads/destinations/colombo.png
c6d00921-d78b-44fd-885d-12bcac8ffdb9	Sigiriya	sigiriya	Matale	Sigiriya	Central Province	Ancient heritage, rock fortress	Sigiriya is a UNESCO-listed rock fortress and one of Sri Lanka's top cultural landmarks.	Climb the rock, visit nearby cave temples, and explore safari options in the cultural triangle.	\N	/uploads/destinations/sigiriya.png	{}	\N	t	4	2026-04-14 16:06:11.252	2026-04-19 17:50:44.656	/uploads/destinations/sigiriya.png
8e7c28ec-565c-42af-98e3-26b372624c53	Kandy	kandy	Kandy	Kandy	Central Province	Culture, temples, lake	Kandy is a cultural capital known for the Temple of the Tooth and scenic hill-country surroundings.	Perfect for spiritual heritage visits, local markets, and central highland day trips.	\N	/uploads/destinations/kandy.png	{}	\N	t	5	2026-04-14 16:06:11.252	2026-04-19 17:50:44.661	/uploads/destinations/kandy.png
42c1b5e3-f189-4de5-90db-58de8e579b7a	Nuwara Eliya	nuwara-eliya	Nuwara Eliya	Nuwara Eliya	Central Province	Tea country, cool climate	Nuwara Eliya is a highland town with tea estates, gardens, and colonial-era charm.	Visit tea factories, enjoy cooler weather, and explore nearby waterfalls and scenic roads.	\N	/uploads/destinations/nuwara-eliya.png	{}	\N	t	6	2026-04-14 16:06:11.252	2026-04-19 17:50:44.665	/uploads/destinations/nuwara-eliya.png
6c373365-a1b2-48ae-9d17-1f17e0d3d5f9	Jaffna	jaffna	Jaffna	Jaffna	Northern Province	Tamil heritage, islands, cuisine	Jaffna offers distinct northern culture, historic sites, and access to beautiful island day trips.	Experience unique food, temples, and coastal landscapes different from the south.	\N	/uploads/destinations/jaffna.png	{}	\N	t	7	2026-04-14 16:06:11.252	2026-04-19 17:50:44.671	/uploads/destinations/jaffna.png
67b4fc6d-dd68-4faa-9b77-d31ce2b20fce	Galle	galle	Galle	Galle	Southern Province	History, fort, beaches	Galle is a historic port city and home to the iconic Galle Fort. It is popular for colonial architecture, ocean views, and nearby beach towns.	Walk the ramparts at sunset, explore boutique streets inside the fort, and enjoy easy access to Unawatuna and southern coastal attractions.	\N	/uploads/destinations/galle.png	{}	\N	t	0	2026-04-14 16:06:11.252	2026-04-19 17:50:44.476	/uploads/destinations/galle.png
\.


--
-- Data for Name: HotelAmenityImage; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."HotelAmenityImage" (id, "hotelId", url, provider, key, "altText", "sortOrder", width, height, "sizeBytes", "mimeType", "createdAt") FROM stdin;
fadd3ea1-d35a-40a5-8cc5-152bfd89eda0	4f67e478-483d-48fa-b8c5-d5178133eee8	http://localhost:8080/uploads/1776616126179_negombo pool.jfif	local	1776616126179_negombo pool.jfif	Amenity 1	0	\N	\N	13731	image/jpeg	2026-04-19 16:28:48.823
c53e6670-8308-4c4a-a7bd-06423da60d21	4f67e478-483d-48fa-b8c5-d5178133eee8	http://localhost:8080/uploads/1776616126180_Sri-Lanka-Tourism.jpg	local	1776616126180_Sri-Lanka-Tourism.jpg	Amenity 2	1	\N	\N	302291	image/jpeg	2026-04-19 16:28:48.823
4491daca-19cd-4c70-b356-933145801fdd	f1b9ab1a-0d01-4f24-a001-000000000101	https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?auto=format&fit=crop&w=1000&q=80	url	\N	Pool & wellness	0	\N	\N	\N	\N	2026-04-19 17:51:12.17
fd36d05a-ab66-4bfb-a761-5498b636ad76	f1b9ab1a-0d01-4f24-a001-000000000101	https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80	url	\N	Restaurant & dining	1	\N	\N	\N	\N	2026-04-19 17:51:12.17
39cbc6d7-08cb-436b-a190-00a767b44295	f1b9ab1a-0d01-4f24-a001-000000000102	https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?auto=format&fit=crop&w=1000&q=80	url	\N	Pool & wellness	0	\N	\N	\N	\N	2026-04-19 17:51:12.269
914b0035-e2f8-4341-a9b3-5d48e7a3bf58	f1b9ab1a-0d01-4f24-a001-000000000102	https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80	url	\N	Restaurant & dining	1	\N	\N	\N	\N	2026-04-19 17:51:12.269
c0ea8080-b35b-4bff-8b43-03372a8ebb41	f1b9ab1a-0d01-4f24-a001-000000000103	https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?auto=format&fit=crop&w=1000&q=80	url	\N	Pool & wellness	0	\N	\N	\N	\N	2026-04-19 17:51:12.31
26bc8571-c175-4107-899b-41eb142ff9cf	f1b9ab1a-0d01-4f24-a001-000000000103	https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80	url	\N	Restaurant & dining	1	\N	\N	\N	\N	2026-04-19 17:51:12.31
a457ef33-fd2b-4d6f-ac1e-3abb94f3e848	f1b9ab1a-0d01-4f24-a001-000000000201	https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?auto=format&fit=crop&w=1000&q=80	url	\N	Pool & wellness	0	\N	\N	\N	\N	2026-04-19 17:51:12.34
97c64776-2774-4389-b9ca-e2a6f4045954	f1b9ab1a-0d01-4f24-a001-000000000201	https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80	url	\N	Restaurant & dining	1	\N	\N	\N	\N	2026-04-19 17:51:12.34
fc225f04-014f-47a7-bdf7-6c638e46902e	f1b9ab1a-0d01-4f24-a001-000000000202	https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?auto=format&fit=crop&w=1000&q=80	url	\N	Pool & wellness	0	\N	\N	\N	\N	2026-04-19 17:51:12.369
09cfe0d4-6e99-4c17-8034-df4bad1d6cd5	f1b9ab1a-0d01-4f24-a001-000000000202	https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80	url	\N	Restaurant & dining	1	\N	\N	\N	\N	2026-04-19 17:51:12.369
c994e896-6b81-47c2-8103-6fa6af8972c7	f1b9ab1a-0d01-4f24-a001-000000000203	https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?auto=format&fit=crop&w=1000&q=80	url	\N	Pool & wellness	0	\N	\N	\N	\N	2026-04-19 17:51:12.396
0b659bc6-07b5-4126-991e-2fbb36206fc6	f1b9ab1a-0d01-4f24-a001-000000000203	https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80	url	\N	Restaurant & dining	1	\N	\N	\N	\N	2026-04-19 17:51:12.396
dc559e32-4a8d-4217-a1d7-11445bc6e80a	f1b9ab1a-0d01-4f24-a001-000000000301	https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?auto=format&fit=crop&w=1000&q=80	url	\N	Pool & wellness	0	\N	\N	\N	\N	2026-04-19 17:51:12.417
6633f977-9f3a-4487-8b67-2f3ed9d886e2	f1b9ab1a-0d01-4f24-a001-000000000301	https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80	url	\N	Restaurant & dining	1	\N	\N	\N	\N	2026-04-19 17:51:12.417
ee612c8b-1997-415b-a7a9-a81a7946fa00	f1b9ab1a-0d01-4f24-a001-000000000302	https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?auto=format&fit=crop&w=1000&q=80	url	\N	Pool & wellness	0	\N	\N	\N	\N	2026-04-19 17:51:12.439
498efc73-d1a4-42e3-b916-a264ed569024	f1b9ab1a-0d01-4f24-a001-000000000302	https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80	url	\N	Restaurant & dining	1	\N	\N	\N	\N	2026-04-19 17:51:12.439
6c69b764-ea6c-49fe-a291-9afbe43a4cfc	f1b9ab1a-0d01-4f24-a001-000000000401	https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?auto=format&fit=crop&w=1000&q=80	url	\N	Pool & wellness	0	\N	\N	\N	\N	2026-04-19 17:51:12.458
156b29cf-7056-4944-812a-ddc5f8cf436c	f1b9ab1a-0d01-4f24-a001-000000000401	https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80	url	\N	Restaurant & dining	1	\N	\N	\N	\N	2026-04-19 17:51:12.458
52781761-bfaa-46a9-bf28-75c6dd2a694b	f1b9ab1a-0d01-4f24-a001-000000000402	https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?auto=format&fit=crop&w=1000&q=80	url	\N	Pool & wellness	0	\N	\N	\N	\N	2026-04-19 17:51:12.478
8c508ad8-2e40-438b-ae0c-956e7357c63f	f1b9ab1a-0d01-4f24-a001-000000000402	https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80	url	\N	Restaurant & dining	1	\N	\N	\N	\N	2026-04-19 17:51:12.478
\.


--
-- Data for Name: HotelImage; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."HotelImage" (id, "hotelId", url, provider, key, "altText", "isCover", "sortOrder", width, height, "sizeBytes", "mimeType", "createdAt") FROM stdin;
08928736-d24e-443a-83af-a4b30932ea78	f1b9ab1a-0d01-4f24-a001-000000000301	http://localhost:8080/uploads/1776621256803_Ella need hotel.jfif	local	1776621256803_Ella need hotel.jfif	Other	f	0	\N	\N	10491	image/jpeg	2026-04-19 17:54:17.632
c2e00985-e243-4368-b247-7c6a56b778b9	f1b9ab1a-0d01-4f24-a001-000000000302	http://localhost:8080/uploads/1776621306538_ella hotel.jpg	local	1776621306538_ella hotel.jpg	Other	f	0	\N	\N	100685	image/jpeg	2026-04-19 17:55:06.548
f99bfea8-3373-4170-9fb0-029311b175ac	9cdd8f0e-5b3a-4d13-9d0a-2209d8f3f101	https://images.unsplash.com/photo-1566073771259-6a8506099945	url	\N	Hotel cover	t	0	\N	\N	\N	\N	2026-04-09 11:07:59.354
68b296e7-96a8-445d-9573-38bd2137523d	9cdd8f0e-5b3a-4d13-9d0a-2209d8f3f101	https://images.unsplash.com/photo-1571896349842-33c89424de2d	url	\N	Lobby and lounge	f	1	\N	\N	\N	\N	2026-04-09 11:07:59.354
1258730a-aa80-47bb-8afc-90d7fa133167	9cdd8f0e-5b3a-4d13-9d0a-2209d8f3f101	https://images.unsplash.com/photo-1445019980597-93fa8acb246c	url	\N	Beachfront view	f	2	\N	\N	\N	\N	2026-04-09 11:07:59.354
b3cc0ac1-123a-4f9a-a947-b9d77235e7c3	9cdd8f0e-5b3a-4d13-9d0a-2209d8f3f101	https://images.unsplash.com/photo-1618773928121-c32242e63f39	url	\N	Hotel room interior	f	3	\N	\N	\N	\N	2026-04-09 11:07:59.354
22a5452c-15ee-43b0-b03e-98a9a5ecf074	f1b9ab1a-0d01-4f24-a001-000000000401	http://localhost:8080/uploads/1776621389035_puttalam hotel.jfif	local	1776621389035_puttalam hotel.jfif	Other	f	0	\N	\N	96925	image/jpeg	2026-04-19 17:56:29.064
84355501-abd3-4ad1-b850-2fc3ce3d8afa	f1b9ab1a-0d01-4f24-a001-000000000101	https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=80	url	\N	Galle Ocean Pearl 1	t	0	\N	\N	\N	\N	2026-04-19 17:51:12.161
a2057ad7-0649-43c0-8bf8-df5ffe2eae0b	f1b9ab1a-0d01-4f24-a001-000000000101	https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1400&q=80	url	\N	Galle Ocean Pearl 2	f	1	\N	\N	\N	\N	2026-04-19 17:51:12.161
70b15fd6-f0c5-4a6d-a609-6b93222c7e82	f1b9ab1a-0d01-4f24-a001-000000000101	https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80	url	\N	Galle Ocean Pearl 3	f	2	\N	\N	\N	\N	2026-04-19 17:51:12.161
6199ed79-6d77-41a3-83ff-a175b9cfbe98	f1b9ab1a-0d01-4f24-a001-000000000101	https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1400&q=80	url	\N	Galle Ocean Pearl 4	f	3	\N	\N	\N	\N	2026-04-19 17:51:12.161
5337601d-ac50-4b87-b04f-9d75cd59ccd4	f1b9ab1a-0d01-4f24-a001-000000000102	https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1400&q=80	url	\N	Galle Blue Horizon Resort 1	t	0	\N	\N	\N	\N	2026-04-19 17:51:12.264
ad88c5e4-72df-43a3-a0bb-a21db61c9f88	f1b9ab1a-0d01-4f24-a001-000000000102	https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1400&q=80	url	\N	Galle Blue Horizon Resort 2	f	1	\N	\N	\N	\N	2026-04-19 17:51:12.264
53178dd8-3ecc-4534-85d5-baf4eeab0e2d	f1b9ab1a-0d01-4f24-a001-000000000102	https://images.unsplash.com/photo-1455587734955-081b22074882?auto=format&fit=crop&w=1400&q=80	url	\N	Galle Blue Horizon Resort 3	f	2	\N	\N	\N	\N	2026-04-19 17:51:12.264
daeef842-9e1b-4f18-8e8c-b78aa159a215	f1b9ab1a-0d01-4f24-a001-000000000102	https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?auto=format&fit=crop&w=1400&q=80	url	\N	Galle Blue Horizon Resort 4	f	3	\N	\N	\N	\N	2026-04-19 17:51:12.264
5ba2ba65-002a-4be7-806f-e518158b4e12	4f67e478-483d-48fa-b8c5-d5178133eee8	http://localhost:8080/uploads/1776616125565_dambulla hotel.jfif	local	1776616125565_dambulla hotel.jfif	Cover	t	0	\N	\N	11469	image/jpeg	2026-04-19 16:28:48.096
23d23e2b-48ff-4414-be66-674640c76719	4f67e478-483d-48fa-b8c5-d5178133eee8	http://localhost:8080/uploads/1776616125566_Sigiriya.png	local	1776616125566_Sigiriya.png	Other	f	1	\N	\N	2135472	image/png	2026-04-19 16:28:48.096
5af6d110-6bbc-43bf-a968-b3f3e512075b	5fb41fbd-5484-4cb3-96d5-1d59aa81c9c7	http://localhost:8080/uploads/1776618486373_ella 4.jfif	local	1776618486373_ella 4.jfif	Cover	t	0	\N	\N	14297	image/jpeg	2026-04-19 17:08:06.685
3b10ac63-f95d-470a-9215-033f4c50250e	5fb41fbd-5484-4cb3-96d5-1d59aa81c9c7	http://localhost:8080/uploads/1776618486374_ekho-ella-header.webp	local	1776618486374_ekho-ella-header.webp	Other	f	1	\N	\N	125042	image/webp	2026-04-19 17:08:06.685
a040b9e5-e881-499d-bb42-99ca2f9588ee	5fb41fbd-5484-4cb3-96d5-1d59aa81c9c7	http://localhost:8080/uploads/1776618486377_ella hotel 1.jfif	local	1776618486377_ella hotel 1.jfif	Other	f	2	\N	\N	8972	image/jpeg	2026-04-19 17:08:06.685
22eb4c35-4d08-4b74-93b7-8c58f50c7b50	5fb41fbd-5484-4cb3-96d5-1d59aa81c9c7	http://localhost:8080/uploads/1776618486377_image_958b443e7a.jpg	local	1776618486377_image_958b443e7a.jpg	Other	f	3	\N	\N	188079	image/jpeg	2026-04-19 17:08:06.685
f80819bd-1321-4cc7-a4f2-94be4405cb79	5fb41fbd-5484-4cb3-96d5-1d59aa81c9c7	http://localhost:8080/uploads/1776618486570_image_4388e22bc2.jpg	local	1776618486570_image_4388e22bc2.jpg	Other	f	4	\N	\N	74087	image/jpeg	2026-04-19 17:08:06.685
a1bd795f-5b30-43e3-842e-3d255d7c2395	f1b9ab1a-0d01-4f24-a001-000000000103	https://images.unsplash.com/photo-1615460549969-36fa19521a4f?auto=format&fit=crop&w=1400&q=80	url	\N	Galle Palm Breeze Hotel 1	t	0	\N	\N	\N	\N	2026-04-19 17:51:12.307
0caef3c4-2e6f-4ead-9671-d0db16f485dc	f1b9ab1a-0d01-4f24-a001-000000000103	https://images.unsplash.com/photo-1501117716987-c8e1ecb210cf?auto=format&fit=crop&w=1400&q=80	url	\N	Galle Palm Breeze Hotel 2	f	1	\N	\N	\N	\N	2026-04-19 17:51:12.307
564506d6-9c26-4a4c-aa46-8ae9cc2ada4a	f1b9ab1a-0d01-4f24-a001-000000000103	https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1400&q=80	url	\N	Galle Palm Breeze Hotel 3	f	2	\N	\N	\N	\N	2026-04-19 17:51:12.307
00ca0ae7-ebc9-4b20-b22d-6d9edc82573d	f1b9ab1a-0d01-4f24-a001-000000000103	https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1400&q=80	url	\N	Galle Palm Breeze Hotel 4	f	3	\N	\N	\N	\N	2026-04-19 17:51:12.307
087f1ca5-9223-421c-a855-2e57b6cd28fa	f1b9ab1a-0d01-4f24-a001-000000000201	https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1400&q=80	url	\N	Colombo Marine Front 1	t	0	\N	\N	\N	\N	2026-04-19 17:51:12.337
9b49fbe6-ed47-4434-8440-5064159306bb	f1b9ab1a-0d01-4f24-a001-000000000201	https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1400&q=80	url	\N	Colombo Marine Front 2	f	1	\N	\N	\N	\N	2026-04-19 17:51:12.337
b356b040-24d7-4c83-948b-dae78274d9ad	f1b9ab1a-0d01-4f24-a001-000000000201	https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=1400&q=80	url	\N	Colombo Marine Front 3	f	2	\N	\N	\N	\N	2026-04-19 17:51:12.337
f755513e-8472-4995-910b-c3182f44e18b	f1b9ab1a-0d01-4f24-a001-000000000201	https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1400&q=80	url	\N	Colombo Marine Front 4	f	3	\N	\N	\N	\N	2026-04-19 17:51:12.337
5b9d9152-031f-4b39-8b49-52c360f22a07	f1b9ab1a-0d01-4f24-a001-000000000202	https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1400&q=80	url	\N	Colombo City Central Hotel 1	t	0	\N	\N	\N	\N	2026-04-19 17:51:12.365
cb3e5d22-f555-40ee-97dd-0c8896ee3c94	f1b9ab1a-0d01-4f24-a001-000000000202	https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80	url	\N	Colombo City Central Hotel 2	f	1	\N	\N	\N	\N	2026-04-19 17:51:12.365
4c05dd8f-9df2-404a-9859-0e069cff29c0	f1b9ab1a-0d01-4f24-a001-000000000202	https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1400&q=80	url	\N	Colombo City Central Hotel 3	f	2	\N	\N	\N	\N	2026-04-19 17:51:12.365
0d28cf58-6009-44ad-980e-8bdd7c684077	f1b9ab1a-0d01-4f24-a001-000000000202	https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1400&q=80	url	\N	Colombo City Central Hotel 4	f	3	\N	\N	\N	\N	2026-04-19 17:51:12.365
36bdd24d-e725-493e-877a-5e08341c0cde	f1b9ab1a-0d01-4f24-a001-000000000203	https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=80	url	\N	Colombo Skyline Bay 1	t	0	\N	\N	\N	\N	2026-04-19 17:51:12.393
6a388732-dec3-4874-89d8-671ba76171d4	f1b9ab1a-0d01-4f24-a001-000000000203	https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1400&q=80	url	\N	Colombo Skyline Bay 2	f	1	\N	\N	\N	\N	2026-04-19 17:51:12.393
1fc0d9dc-c617-4c93-9948-5918a8cbefb0	f1b9ab1a-0d01-4f24-a001-000000000203	https://images.unsplash.com/photo-1455587734955-081b22074882?auto=format&fit=crop&w=1400&q=80	url	\N	Colombo Skyline Bay 3	f	2	\N	\N	\N	\N	2026-04-19 17:51:12.393
a560fe8a-2844-43ed-b361-2729340de3b9	f1b9ab1a-0d01-4f24-a001-000000000203	https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1400&q=80	url	\N	Colombo Skyline Bay 4	f	3	\N	\N	\N	\N	2026-04-19 17:51:12.393
26af2a2a-fe96-4b1a-988a-f8d431f610c5	f1b9ab1a-0d01-4f24-a001-000000000402	https://images.unsplash.com/photo-1576675784201-0e142b423952?auto=format&fit=crop&w=1400&q=80	url	\N	Kandy Cultural Retreat 1	t	0	\N	\N	\N	\N	2026-04-19 17:51:12.476
d1dc35f6-db64-45dc-bf36-1beb43438ca9	f1b9ab1a-0d01-4f24-a001-000000000402	https://images.unsplash.com/photo-1535827841776-24afc1e255ac?auto=format&fit=crop&w=1400&q=80	url	\N	Kandy Cultural Retreat 2	f	1	\N	\N	\N	\N	2026-04-19 17:51:12.476
5d5c240f-7327-43b3-a43a-e009f5023138	f1b9ab1a-0d01-4f24-a001-000000000402	https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?auto=format&fit=crop&w=1400&q=80	url	\N	Kandy Cultural Retreat 3	f	2	\N	\N	\N	\N	2026-04-19 17:51:12.476
ea83e3ac-2904-407a-9a7e-8e9ed8556a93	f1b9ab1a-0d01-4f24-a001-000000000402	https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80	url	\N	Kandy Cultural Retreat 4	f	3	\N	\N	\N	\N	2026-04-19 17:51:12.476
\.


--
-- Data for Name: Place; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Place" (id, name, category, latitude, longitude, source, "sourceId", rating, address, "createdAt") FROM stdin;
94c104b2-9c9a-4946-90c6-5e474ed6351c	Galle Face Green	attraction	6.9271	79.8449	\N	\N	4.5	Colombo	2025-09-26 09:40:22.91
e3ce6ff2-bac7-4101-8bb2-11c65a5dbb54	Independence Square	landmark	6.9067	79.8706	\N	\N	4.6	Colombo 07	2025-09-26 09:40:22.91
54c15969-f9ee-481f-a2b8-05ae91b38e1f	Gangaramaya Temple	temple	6.9164	79.8568	\N	\N	4.7	Colombo	2025-09-23 11:25:01.994
\.


--
-- Data for Name: HotelNearbyPlace; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."HotelNearbyPlace" ("hotelId", "placeId", "distanceMeters", "cachedAt") FROM stdin;
\.


--
-- Data for Name: Payment; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Payment" (id, "bookingId", provider, "gatewayRef", amount, fee, net, "capturedAt", "createdAt", "applicationFee", "destinationAccountId", status) FROM stdin;
\.


--
-- Data for Name: Payout; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Payout" (id, "userId", "periodFrom", "periodTo", gross, fees, commission, net, status, "createdAt", "paidAt") FROM stdin;
\.


--
-- Data for Name: PayoutAccount; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."PayoutAccount" (id, "userId", provider, "accountId", status, "detailsJson", "createdAt", "updatedAt") FROM stdin;
00e916a0-0fe0-4a09-a0f1-4c3ffe56325a	bd47dfe3-7e05-4ed4-8fe5-b8ad738f6fd3	bank	5151191	PENDING	{"bankName": "Commercial Bank", "accountHolder": "Kuberan"}	2026-04-10 08:59:34.822	2026-04-10 08:59:57.979
\.


--
-- Data for Name: RoomAmenityImage; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."RoomAmenityImage" (id, "roomTypeId", label, url, provider, key, "altText", "sortOrder", width, height, "sizeBytes", "mimeType", "createdAt") FROM stdin;
e67e167a-cad8-40e0-8eca-c68ecccf3557	4deb54cb-7f04-4aee-8c56-420618657fe2	Pool	http://localhost:8080/uploads/1776616792664_LK1500F05B-01-E.webp	local	1776616792664_LK1500F05B-01-E.webp	Pool	0	\N	\N	273976	image/webp	2026-04-19 16:39:53.489
2623ce82-1864-4b11-82ba-84c73ca666c3	4deb54cb-7f04-4aee-8c56-420618657fe2	Lobby	http://localhost:8080/uploads/1776616792667_images (3).jfif	local	1776616792667_images (3).jfif	Lobby	1	\N	\N	10096	image/jpeg	2026-04-19 16:39:53.489
d3a2e718-cb3e-42aa-9bea-24edfdd2b95d	4a56ee33-74db-44cf-82db-63afa6911365	Balcony	http://localhost:8080/uploads/1776617183836_images (3).jfif	local	1776617183836_images (3).jfif	Balcony	0	\N	\N	10096	image/jpeg	2026-04-19 16:46:23.864
78c234ed-82f8-4a7c-b47f-020afa837b6f	537f2f3d-fb76-4e1c-9e12-e84fa2daa89d	Mountain View	http://localhost:8080/uploads/1776618627112_ella hotel 1.jfif	local	1776618627112_ella hotel 1.jfif	Mountain View	0	\N	\N	8972	image/jpeg	2026-04-19 17:10:27.233
78232182-b80c-4601-b2c3-c39f6ca9bb44	588ab018-92bf-4bc4-8371-0ef8cffbebc7	private pool	http://localhost:8080/uploads/1776618923046_ella hotel 1.jfif	local	1776618923046_ella hotel 1.jfif	private pool	0	\N	\N	8972	image/jpeg	2026-04-19 17:15:23.24
0d4dbfb7-d4b1-4aec-9793-972fa24ecde8	588ab018-92bf-4bc4-8371-0ef8cffbebc7	clear tea estate	http://localhost:8080/uploads/1776618923046_image.jpg	local	1776618923046_image.jpg	clear tea estate	1	\N	\N	91144	image/jpeg	2026-04-19 17:15:23.24
\.


--
-- Data for Name: RoomBookingBlock; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."RoomBookingBlock" (id, "roomTypeId", "startDate", "endDate", reason, "createdAt") FROM stdin;
\.


--
-- Data for Name: RoomImage; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."RoomImage" (id, "roomTypeId", url, provider, key, "altText", "sortOrder", width, height, "sizeBytes", "mimeType", "createdAt", "isCover") FROM stdin;
f302fc3f-5f5b-4e63-8ea0-ec65ea7a2e03	f71ce6a1-ae9e-47f8-af69-431a4f688001	https://images.unsplash.com/photo-1631049307264-da0ec9d70304	url	\N	Deluxe room cover	0	\N	\N	\N	\N	2026-04-09 11:07:59.379	t
7e195ee7-a09a-44d4-9025-0adbd1350105	f71ce6a1-ae9e-47f8-af69-431a4f688001	https://images.unsplash.com/photo-1590490360182-c33d57733427	url	\N	Deluxe room angle	1	\N	\N	\N	\N	2026-04-09 11:07:59.379	f
038e9b30-aa89-4ac4-9474-79d6fa16c0cc	f71ce6a1-ae9e-47f8-af69-431a4f688002	https://images.unsplash.com/photo-1582719478250-c89cae4dc85b	url	\N	Suite cover	0	\N	\N	\N	\N	2026-04-09 11:07:59.383	t
02985f31-0821-456c-84fe-14e135ee6c67	f71ce6a1-ae9e-47f8-af69-431a4f688002	https://images.unsplash.com/photo-1566665797739-1674de7a421a	url	\N	Suite interior	1	\N	\N	\N	\N	2026-04-09 11:07:59.383	f
9754bc0f-d5ca-4cc6-9592-b99d1844e908	f71ce6a1-ae9e-47f8-af69-431a4f688003	https://images.unsplash.com/photo-1611892440504-42a792e24d32	url	\N	Family room cover	0	\N	\N	\N	\N	2026-04-09 11:07:59.386	t
627ce6b2-58f5-48c3-8169-7ac4dd956116	f71ce6a1-ae9e-47f8-af69-431a4f688003	https://images.unsplash.com/photo-1522708323590-d24dbb6b0267	url	\N	Family room alternate	1	\N	\N	\N	\N	2026-04-09 11:07:59.386	f
e106e1ed-10b8-4385-9d2c-e7c3426d0c42	f2bd3012-9928-4db6-aa85-ed3f39f8a220	https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80	url	\N	Classic Double 1	0	\N	\N	\N	\N	2026-04-19 17:51:12.189	t
d60e0db0-f081-44cf-942c-cfedcf4439da	f2bd3012-9928-4db6-aa85-ed3f39f8a220	https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80	url	\N	Classic Double 2	1	\N	\N	\N	\N	2026-04-19 17:51:12.189	f
1a6c419e-1d1b-4b07-84c0-4310b36516d9	6bb7f684-425a-4cc6-a144-87b220490aa6	https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80	url	\N	Deluxe Triple 1	0	\N	\N	\N	\N	2026-04-19 17:51:12.197	t
c8a7f83b-f717-4ccc-a3fd-02feca650a03	6bb7f684-425a-4cc6-a144-87b220490aa6	https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80	url	\N	Deluxe Triple 2	1	\N	\N	\N	\N	2026-04-19 17:51:12.197	f
3d7fc651-c613-498b-af06-f1a8b85e1465	2f4f1dcb-9735-43c2-876e-935ba614c2e6	https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80	url	\N	Family Suite 1	0	\N	\N	\N	\N	2026-04-19 17:51:12.233	t
a8b6f0dd-0678-4589-b859-4d63ebb725aa	2f4f1dcb-9735-43c2-876e-935ba614c2e6	https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80	url	\N	Family Suite 2	1	\N	\N	\N	\N	2026-04-19 17:51:12.233	f
a7fda206-bc0d-414f-81d5-9d91c196faa7	38512b29-8c5a-4d88-ab6d-c4b305d78aa4	https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80	url	\N	Classic Double 1	0	\N	\N	\N	\N	2026-04-19 17:51:12.275	t
84070c9d-89b5-443e-8384-e22c6e6d6049	38512b29-8c5a-4d88-ab6d-c4b305d78aa4	https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80	url	\N	Classic Double 2	1	\N	\N	\N	\N	2026-04-19 17:51:12.275	f
b68a209f-f82f-4b51-a76a-9172147ce5e5	944d2296-fc06-4192-b5ad-0e47bbe3afda	https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80	url	\N	Deluxe Triple 1	0	\N	\N	\N	\N	2026-04-19 17:51:12.28	t
9846e752-ee35-4d73-881f-f5633c9593fc	944d2296-fc06-4192-b5ad-0e47bbe3afda	https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80	url	\N	Deluxe Triple 2	1	\N	\N	\N	\N	2026-04-19 17:51:12.28	f
42dfad59-968f-41de-b111-ffe4a53b6038	5510b1ef-addb-40d8-b0aa-6c1fd2bc6b63	https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80	url	\N	Family Suite 1	0	\N	\N	\N	\N	2026-04-19 17:51:12.286	t
061818b8-e22c-495c-9ed5-5809c43fbde1	5510b1ef-addb-40d8-b0aa-6c1fd2bc6b63	https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80	url	\N	Family Suite 2	1	\N	\N	\N	\N	2026-04-19 17:51:12.286	f
849c85be-d6dd-4e67-a813-5a459476f835	a18d3a31-dd41-418f-a4ca-6f09963dd8f0	https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80	url	\N	Classic Double 1	0	\N	\N	\N	\N	2026-04-19 17:51:12.315	t
f0211351-393b-4a15-9707-f096a648efe0	a18d3a31-dd41-418f-a4ca-6f09963dd8f0	https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80	url	\N	Classic Double 2	1	\N	\N	\N	\N	2026-04-19 17:51:12.315	f
ee41a9a1-2b2f-45d9-851b-0b3d632079b3	dd71bef5-d201-4392-828d-837c2fed3c55	https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80	url	\N	Deluxe Triple 1	0	\N	\N	\N	\N	2026-04-19 17:51:12.319	t
dceed51e-d242-4528-84c7-035749e7e034	dd71bef5-d201-4392-828d-837c2fed3c55	https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80	url	\N	Deluxe Triple 2	1	\N	\N	\N	\N	2026-04-19 17:51:12.319	f
d313c358-8fed-42b4-bfc3-edfd6c393b5f	854f5c12-dd09-407c-9e74-796aca3db9b1	https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80	url	\N	Family Suite 1	0	\N	\N	\N	\N	2026-04-19 17:51:12.322	t
fc81216e-23ff-4a6a-b84a-e291d8429a02	854f5c12-dd09-407c-9e74-796aca3db9b1	https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80	url	\N	Family Suite 2	1	\N	\N	\N	\N	2026-04-19 17:51:12.322	f
9ce5aafd-27e5-4a3c-90be-3cd4103cd376	c0a9a8db-fc36-405d-93b3-f32d95637973	https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80	url	\N	Classic Double 1	0	\N	\N	\N	\N	2026-04-19 17:51:12.342	t
e11ffd9f-9e50-4086-8483-3e55850839d7	c0a9a8db-fc36-405d-93b3-f32d95637973	https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80	url	\N	Classic Double 2	1	\N	\N	\N	\N	2026-04-19 17:51:12.342	f
ffb54d98-7850-4a0e-b9b8-7a2bc63c40f2	73b561ff-378a-4712-af20-042c401ecfe5	https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80	url	\N	Deluxe Triple 1	0	\N	\N	\N	\N	2026-04-19 17:51:12.346	t
92160a28-bb72-479b-9a05-4a8f69a59740	73b561ff-378a-4712-af20-042c401ecfe5	https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80	url	\N	Deluxe Triple 2	1	\N	\N	\N	\N	2026-04-19 17:51:12.346	f
4fe22741-5c45-464c-a62b-f8c64b24afd6	1c2bf57e-8917-4317-b1bb-149811f6eb5d	https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80	url	\N	Family Suite 1	0	\N	\N	\N	\N	2026-04-19 17:51:12.349	t
f1dcaa56-2ecb-4753-aca9-1e592b4e7aa1	1c2bf57e-8917-4317-b1bb-149811f6eb5d	https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80	url	\N	Family Suite 2	1	\N	\N	\N	\N	2026-04-19 17:51:12.349	f
9cb6f8c0-6e03-4c66-8d91-00ae8b86daa3	a5d14234-d8fe-4643-9415-8ce95e57e350	https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80	url	\N	Classic Double 1	0	\N	\N	\N	\N	2026-04-19 17:51:12.372	t
6e207d8d-866a-43e4-8cc0-5c8aaa2985e8	a5d14234-d8fe-4643-9415-8ce95e57e350	https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80	url	\N	Classic Double 2	1	\N	\N	\N	\N	2026-04-19 17:51:12.372	f
e5d1d79b-af54-42c9-8304-d878a5f973e5	5c5f16b4-bb93-4a4d-be9a-33f3be240e72	https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80	url	\N	Deluxe Triple 1	0	\N	\N	\N	\N	2026-04-19 17:51:12.376	t
debf196e-4f51-41c2-a160-877a9af9447d	5c5f16b4-bb93-4a4d-be9a-33f3be240e72	https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80	url	\N	Deluxe Triple 2	1	\N	\N	\N	\N	2026-04-19 17:51:12.376	f
2f1da49a-21c6-4006-b683-54e005842492	fbf382c7-c6ea-4f2c-9a98-fb6c0db0407c	https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80	url	\N	Family Suite 1	0	\N	\N	\N	\N	2026-04-19 17:51:12.379	t
67b1a457-4ec3-4724-85be-6d09d16d56ee	fbf382c7-c6ea-4f2c-9a98-fb6c0db0407c	https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80	url	\N	Family Suite 2	1	\N	\N	\N	\N	2026-04-19 17:51:12.379	f
456f0541-f1f2-4632-83d8-650a23701e51	b308848a-d5a2-4314-b963-a3a28bc52525	https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80	url	\N	Classic Double 1	0	\N	\N	\N	\N	2026-04-19 17:51:12.398	t
f8654880-10c7-4f47-939b-5be49d051394	b308848a-d5a2-4314-b963-a3a28bc52525	https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80	url	\N	Classic Double 2	1	\N	\N	\N	\N	2026-04-19 17:51:12.398	f
329b5744-616e-43e9-b926-70e6128a2c8e	3d7306a0-ecbc-41da-8026-adbab73bd50e	https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80	url	\N	Deluxe Triple 1	0	\N	\N	\N	\N	2026-04-19 17:51:12.4	t
024a6d4d-d661-4e75-9bc6-f54a1c1776cf	3d7306a0-ecbc-41da-8026-adbab73bd50e	https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80	url	\N	Deluxe Triple 2	1	\N	\N	\N	\N	2026-04-19 17:51:12.4	f
4a64f4e8-6a38-4036-8c21-abbf5238de34	8bed9c03-8740-41b0-9919-fae020ecaee9	https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80	url	\N	Family Suite 1	0	\N	\N	\N	\N	2026-04-19 17:51:12.403	t
824103ec-39b0-45aa-85f1-0c6079d8126b	8bed9c03-8740-41b0-9919-fae020ecaee9	https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80	url	\N	Family Suite 2	1	\N	\N	\N	\N	2026-04-19 17:51:12.403	f
19fefa3f-6097-49bd-9724-171057143bfd	d2b345a0-9bab-4af2-85c6-00a26a0e5a02	https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80	url	\N	Classic Double 1	0	\N	\N	\N	\N	2026-04-19 17:51:12.421	t
caa1ab52-2f82-44d7-88c5-392736c4efee	d2b345a0-9bab-4af2-85c6-00a26a0e5a02	https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80	url	\N	Classic Double 2	1	\N	\N	\N	\N	2026-04-19 17:51:12.421	f
8996a207-f58d-4b80-8eb0-251015097d6a	7401a133-3e1f-42d5-b904-410fb19144d7	https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80	url	\N	Deluxe Triple 1	0	\N	\N	\N	\N	2026-04-19 17:51:12.424	t
21cc6c44-5507-4c8c-9b0b-dccf0f5bb801	7401a133-3e1f-42d5-b904-410fb19144d7	https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80	url	\N	Deluxe Triple 2	1	\N	\N	\N	\N	2026-04-19 17:51:12.424	f
8b8d0207-8542-436c-a7e4-5e356181b5b4	b46f9752-31b1-4cd0-a4ea-0afec9e6a1d3	https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80	url	\N	Family Suite 1	0	\N	\N	\N	\N	2026-04-19 17:51:12.427	t
60b0ef74-b9a6-461c-b693-007f6b6bc9e8	b46f9752-31b1-4cd0-a4ea-0afec9e6a1d3	https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80	url	\N	Family Suite 2	1	\N	\N	\N	\N	2026-04-19 17:51:12.427	f
fc53cda8-cd36-4484-b626-fb88ce085195	9233819b-93ba-48fc-992e-2fe00b945358	https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80	url	\N	Classic Double 1	0	\N	\N	\N	\N	2026-04-19 17:51:12.441	t
e94d601e-3c64-4d72-a7b8-2ac5ea7af8dd	9233819b-93ba-48fc-992e-2fe00b945358	https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80	url	\N	Classic Double 2	1	\N	\N	\N	\N	2026-04-19 17:51:12.441	f
7c00b5e8-0eeb-446e-8990-f326418d9204	5893ce29-833b-42a1-81fe-088173a6c3f1	https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80	url	\N	Deluxe Triple 1	0	\N	\N	\N	\N	2026-04-19 17:51:12.443	t
631db120-0471-4bfc-a1e2-d35fe995e56b	5893ce29-833b-42a1-81fe-088173a6c3f1	https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80	url	\N	Deluxe Triple 2	1	\N	\N	\N	\N	2026-04-19 17:51:12.443	f
65e59bba-8080-4521-9e72-7251e64f07f8	1ee203fb-c918-432b-b094-a28a3273a68b	https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80	url	\N	Family Suite 1	0	\N	\N	\N	\N	2026-04-19 17:51:12.446	t
0ac1f8bd-d8e5-4923-826d-b4dc28c2be78	4deb54cb-7f04-4aee-8c56-420618657fe2	http://localhost:8080/uploads/1776616792667_images (1).jfif	local	1776616792667_images (1).jfif	Room photo 1	0	\N	\N	9942	image/jpeg	2026-04-19 16:39:53.115	t
6238b627-3dc2-49c9-aa31-ac979bc751f7	4a56ee33-74db-44cf-82db-63afa6911365	http://localhost:8080/uploads/1776617183837_images (2).jfif	local	1776617183837_images (2).jfif	Room photo 1	0	\N	\N	7984	image/jpeg	2026-04-19 16:46:23.863	t
35ea2cd5-0345-4772-9c3f-b85ad55bb81e	537f2f3d-fb76-4e1c-9e12-e84fa2daa89d	http://localhost:8080/uploads/1776618627112_rangiri-rooms-in-dambulla-sri-lanka-700x430.jpg	local	1776618627112_rangiri-rooms-in-dambulla-sri-lanka-700x430.jpg	Room photo 1	0	\N	\N	53319	image/jpeg	2026-04-19 17:10:27.228	t
a7390272-26db-49de-abbe-566f2d1a1951	588ab018-92bf-4bc4-8371-0ef8cffbebc7	http://localhost:8080/uploads/1776618923047_86474202.jpg	local	1776618923047_86474202.jpg	Room photo 1	0	\N	\N	26141	image/jpeg	2026-04-19 17:15:23.089	t
6b7a4aab-e218-4871-a9a8-ad1442a2719f	1ee203fb-c918-432b-b094-a28a3273a68b	https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80	url	\N	Family Suite 2	1	\N	\N	\N	\N	2026-04-19 17:51:12.446	f
a1b9f697-4066-4d0e-aedc-b4dfac6ea0df	5eaf6b9b-4a4d-46c7-8c67-d4c10a9d0a8c	https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80	url	\N	Classic Double 1	0	\N	\N	\N	\N	2026-04-19 17:51:12.46	t
8bae259e-2c19-4dc0-ab13-a4f715f2c720	5eaf6b9b-4a4d-46c7-8c67-d4c10a9d0a8c	https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80	url	\N	Classic Double 2	1	\N	\N	\N	\N	2026-04-19 17:51:12.46	f
8c26d2f6-cfbe-4ba0-a636-ed2d884c6ae3	f4c23441-5fa6-4af6-b713-994f8e231abc	https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80	url	\N	Deluxe Triple 1	0	\N	\N	\N	\N	2026-04-19 17:51:12.463	t
9031026a-f46b-4b23-99e1-79ea9969c0d3	f4c23441-5fa6-4af6-b713-994f8e231abc	https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80	url	\N	Deluxe Triple 2	1	\N	\N	\N	\N	2026-04-19 17:51:12.463	f
bcbe5cb9-eb9d-443b-8325-5ca4cc363252	0c9830d7-f801-46eb-a8f6-d1b4791bbfa1	https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80	url	\N	Family Suite 1	0	\N	\N	\N	\N	2026-04-19 17:51:12.466	t
c503407b-4178-42ce-ab44-4df2dec0a501	0c9830d7-f801-46eb-a8f6-d1b4791bbfa1	https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80	url	\N	Family Suite 2	1	\N	\N	\N	\N	2026-04-19 17:51:12.466	f
b7bbf961-a58d-411c-93f1-77b78660e59b	3570357d-a3d2-4268-a8b9-3b99e04d3a17	https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80	url	\N	Classic Double 1	0	\N	\N	\N	\N	2026-04-19 17:51:12.48	t
36b59957-3add-48e9-ac9d-27498f486ab0	3570357d-a3d2-4268-a8b9-3b99e04d3a17	https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80	url	\N	Classic Double 2	1	\N	\N	\N	\N	2026-04-19 17:51:12.48	f
9b15411e-0034-4dac-80f2-2875415ac410	b6c44f2d-9fc3-4ebe-af65-9e2203248cd6	https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80	url	\N	Deluxe Triple 1	0	\N	\N	\N	\N	2026-04-19 17:51:12.482	t
a09e002e-e6e3-4c3f-99e3-b945c66bf4dc	b6c44f2d-9fc3-4ebe-af65-9e2203248cd6	https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80	url	\N	Deluxe Triple 2	1	\N	\N	\N	\N	2026-04-19 17:51:12.482	f
df1c78ec-9c02-407c-b202-9b4629084971	38aaed07-cbfb-4073-8b7c-01b4141aefed	https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80	url	\N	Family Suite 1	0	\N	\N	\N	\N	2026-04-19 17:51:12.486	t
c650a47a-f1c8-4377-89b2-63ac5629c1ba	38aaed07-cbfb-4073-8b7c-01b4141aefed	https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80	url	\N	Family Suite 2	1	\N	\N	\N	\N	2026-04-19 17:51:12.486	f
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
6f237bad-41d2-433a-8430-67621a5fc5b8	d3985e50612bf48d7d58b2a54527731d2d8e4e067c4baf57cac2e90e05df5377	2026-04-18 12:51:39.846198+05:30	20260418120000_destination_card_image	\N	\N	2026-04-18 12:51:39.421268+05:30	1
15531d45-bc74-4da3-ba11-df720cad9a65	adb0342ee2da812aa5088a32747a4f402a2f6dfcc983f5da61df17ed4706a1d0	2025-09-09 16:04:41.596895+05:30	20250909103441_init	\N	\N	2025-09-09 16:04:41.435452+05:30	1
d564364d-02a7-4a67-87b7-be0cd2a51958	f89dfcab7f816b64d9c43fd884188f35714872d7ec88f93cdba432aa2989af25	2025-09-09 16:40:13.200837+05:30	20250909111012_add_manager_images_places_payouts	\N	\N	2025-09-09 16:40:13.021818+05:30	1
7ea7ec65-c15f-407c-91de-a97355a45fa6	ccb7e8d6bdc42e5b23179e887c5a77d1982165fc62a5889c1f5a7dd98d3bb9e3	2025-09-26 15:51:15.677389+05:30	20250926102115_add_price_to_roomtype	\N	\N	2025-09-26 15:51:15.536337+05:30	1
25cdcd16-619b-4029-8dde-126fe6714add	000fb34be5289965826b7646d8e919eed5de23e275afdc6ff1f60f20f061b749	2025-10-12 23:56:29.959619+05:30	20251012182629_add_guests_and_rooms_to_booking	\N	\N	2025-10-12 23:56:29.842103+05:30	1
eeb7642e-7106-4164-82f0-ae9e3ff6b798	53bd4e528eace7476aa314177a45701581e16e4bb4ace4f8be020c7aa5ff0a37	2025-11-15 23:11:34.321286+05:30	20251115174134_add_is_cover_to_room_image	\N	\N	2025-11-15 23:11:34.173207+05:30	1
9f58b704-32f8-4a12-bc44-13adfd869b60	eb87de1f8b06274612672957a9e6504a6c83848ca09235a77a69acc84440c99e	2026-04-09 15:07:03.295199+05:30	20260409120000_add_hotel_and_roomtype_detail_fields	\N	\N	2026-04-09 15:07:02.728659+05:30	1
c46fbd50-738e-47d1-b2e6-5e3ff24a428e	0e9539e42b53807ccc6571be88e9480ae4330e42d0ab41c062ffbbfcffd30c3c	2026-04-09 22:55:59.905602+05:30	20260409172558_add_hotel_amenity_images	\N	\N	2026-04-09 22:55:59.029083+05:30	1
c51a7014-3ee2-4634-8520-e3070467154e	51d261f025829c143e57830fafe1790cbe99269a038c7670e6d3458af2875ace	2026-04-12 16:43:10.714623+05:30	20260412104055_room_destination_fields	\N	\N	2026-04-12 16:43:09.625602+05:30	1
a4e1dbb1-53ba-4dec-89df-e52cc46a9a73	56c63f9a8d6bc9723d07880f140f1a5ea026985f6b5a9a9be7f847074beb08a1	2026-04-12 16:43:10.719806+05:30	20260412120000_room_price_per_person	\N	\N	2026-04-12 16:43:10.716207+05:30	1
b64ba859-0a88-4ab3-aea6-cd0cc81b5942	394bf9aff90c21247c4aac2725acb07ec78c83361d4756a14230a0b171a119be	2026-04-13 14:20:26.839374+05:30	20260413085026_add_room_booking_blocks	\N	\N	2026-04-13 14:20:26.581145+05:30	1
75ad305e-fb40-46dd-acae-639f04c4e2c5	eefd47cdad2ff93f8c073174099bdc1c4925decb46299dd8ed9dd36dacfc12ac	2026-04-13 16:54:06.730825+05:30	20260413112406_add_booking_reminder_fields	\N	\N	2026-04-13 16:54:06.710412+05:30	1
261264bb-1168-4bc0-b42a-639af80b3d33	4759c82c5837c1a95d30a3a71d5572fee07b309e9cea9562afb802211e55a1ae	2026-04-14 20:55:40.111609+05:30	20260414152539_add_destinations_and_nearby_hotels	\N	\N	2026-04-14 20:55:39.450976+05:30	1
\.


--
-- PostgreSQL database dump complete
--

\unrestrict u49eqmGGH1K2qQ1UXm3mwutMKRb2nf6VBj7SGgXYDQBle7gB2OGiMqMZmZLVyQW

