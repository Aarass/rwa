import postgres from 'postgres';
import 'dotenv/config';

const sql = postgres({
  database: process.env.DATABASE_NAME,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
});

await sql`insert into "public"."location" ("id", "lat", "lng", "name") values ('R2728438', '44.8178131', '20.4568974', 'Belgrade Serbia'), ('R7247369', '42.9951304', '21.9464271', 'Leskovac Serbia'), ('R7247391', '43.01354', '21.974701', 'Bobiste Serbia'), ('R7247663', '43.025642', '21.917428', 'Vinarce Serbia'), ('W31804563', '44.8072234', '20.463671000059385', 'Beogradjanka Masarikova 5 Vracar Belgrade Serbia')`;
await sql`insert into "public"."user" ("biography", "birthDate", "id", "imageName", "locationId", "name", "passwordHash", "phoneNumber", "refreshTokenHash", "roles", "surname", "username") values ('', '1949-12-31', 5, NULL, 'R2728438', 'Admin', '$2b$10$TiLX6YRUY8MuiwPbwMnMLu0gMFugiiUHeE3NHKDAY53XibVB8lxFW', '0601234567', '$2b$10$6C1p4WGw4DVUvxEnZHIPl.1FG8gdWNH.gZWQxYA9m0n/PBBVQ8eJK', '{"user","admin"}', 'Adminovic', 'Admin'), ('', '2002-08-28', 6, NULL, 'R7247663', 'Aleksandar', '$2b$10$S7V/MAggdtdJE4QciSJAu.sPdmBHnzGXwK9ZC0D6wwcr06nqebZQy', '0621715606', '$2b$10$wnI39ODef402lS7/Vjr27OKRP8LSdYNMT7ovam5JAV2hyAV9PEew6', '{"user"}', 'Prokopovic', 'Aaras'), ('', '2004-04-22', 7, NULL, 'R2728438', 'Nikola', '$2b$10$2Ib7jpSA4WyUk1zq5sLO3elnzAeej.ItpkMLO9mJyRmKAH4/ZMqlm', '0621715610', '$2b$10$fKMbCrB19KF6NMP.abYttObdNDgZhidKbPndlbXRUcCk4yWSDHmFe', '{"user"}', 'Prokopovic', 'Nikola'), ('', '2002-11-19', 8, NULL, 'R7247369', 'Mihailo', '$2b$10$1MCq6EEgupJtSwyGHL1qIeN5VRo35OmOmTRMrxa8ZbM/rnsTUZ/xi', '0698765432', '$2b$10$NRW5V3uhSiwUhTP6H2L8r.tGPFc5bKssWTE8xDV38tcPK/aLHYBQe', '{"user"}', 'Petrovic', 'Mix')`;
await sql`insert into "public"."sport" ("id", "imageName", "name") values (1, '32c5dce9-ed0f-470b-91f1-b66e91443f4d.png', 'Handball'), (2, '7ec12cf5-ea12-447e-a32a-12c877f98044.jpeg', 'Volleyball'), (3, '34cd6860-652b-4d26-99a5-2973acefe248.jpg', 'Tenis'), (4, '7ae4001f-cda8-451e-a5ff-b041d3a107b8.jpg', 'Soccer'), (5, '0388c3c7-7771-49e7-b3a9-9b216213786b.jpg', 'Basketball')`;
await sql`insert into "public"."surface" ("id", "name") values (1, 'Wood'), (2, 'Asphalt'), (3, 'Grass'), (4, 'Rubber')`;
await sql`insert into "public"."user_plays_sport" ("id", "selfRatedSkillLevel", "sportId", "userId") values (1, 4, 4, 6), (2, 3, 3, 6), (3, 2, 5, 6), (4, 3, 2, 6), (5, 3, 3, 7), (6, 3, 5, 7), (7, 4, 4, 7), (8, 2, 3, 8), (9, 2, 4, 8), (10, 2, 5, 8)`;
await sql`insert into "public"."appointment" ("additionalInformation", "canceled", "date", "duration", "environment", "id", "locationId", "maxAge", "maxSkillLevel", "minAge", "minSkillLevel", "missingPlayers", "organizerId", "pricePerPlayer", "sportId", "startTime", "surfaceId", "totalPlayers") values ('Igracemo u skolskom dvoristu', false, '2025-03-28', '01:00:00', 0, 1, 'R7247663', 100, 5, 18, 2, 8, 6, 0, 4, '16:00:00', 2, 8), ('Ukljuciemo reflektore u skolskom dvoristu', false, '2025-03-28', '01:00:00', 0, 2, 'R7247663', 100, 5, 22, 2, 5, 6, 0, 5, '20:00:00', 2, 6), ('', false, '2025-03-27', '01:30:00', 1, 3, 'W31804563', 100, 5, 0, 1, 5, 7, 1, 5, '15:00:00', 1, 10), ('', false, '2025-03-28', '02:00:00', 0, 4, 'R7247391', 100, 5, 0, 1, 1, 7, 2, 3, '18:00:00', 2, 4)`;
await sql`insert into "public"."participation" ("appointmentId", "approved", "id", "userHasSeenChanges", "userId") values (1, true, 1, true, 7), (4, true, 2, true, 8), (2, true, 3, true, 8)`;
await sql`insert into "public"."rating" ("id", "userRatedId", "userRatingId", "value") values (1, 6, 7, 4), (2, 6, 8, 5)`;

await sql`SELECT setval('public.user_id_seq', 10); `;
await sql`SELECT setval('public.sport_id_seq', 10); `;
await sql`SELECT setval('public.surface_id_seq', 10); `;
await sql`SELECT setval('public.user_plays_sport_id_seq', 10); `;
await sql`SELECT setval('public.appointment_id_seq', 10); `;
await sql`SELECT setval('public.participation_id_seq', 10); `;
await sql`SELECT setval('public.rating_id_seq', 10); `;

process.exit();
