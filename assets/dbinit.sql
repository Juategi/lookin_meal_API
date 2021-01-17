begin;

create table restaurant(restaurant_id serial PRIMARY KEY, ta_id integer unique, name VARCHAR (150) NOT NULL, address text NOT NULL, city VARCHAR (50) NOT NULL, country VARCHAR (50) NOT NULL, email VARCHAR (50), phone VARCHAR (50), website VARCHAR (150), weburl VARCHAR (300), types text[], images text[], dailymenu text[], schedule json, rating real not null, latitude real not null, longitude real not null, numRevta integer, sections text[], currency varchar(5), delivery text[]);

create table menuentry (entry_id serial PRIMARY KEY, restaurant_id integer not null, pos integer, name VARCHAR (150) NOT NULL, section VARCHAR (150) NOT NULL, price real, image VARCHAR (250), hide VARCHAR(10), description text, allergens text[], CONSTRAINT restaurant_to_entry_fkey FOREIGN KEY (restaurant_id) REFERENCES restaurant (restaurant_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE CASCADE ); 

create table users(user_id varchar(50) unique primary key, name VARCHAR (80) NOT NULL, email unique VARCHAR (50) NOT NULL, service VARCHAR (10) NOT NULL, image VARCHAR (250) NOT NULL, username unique VARCHAR (50) NOT NULL, country VARCHAR (80) NOT NULL, recently int[]); 

create table favorite(user_id varchar(50) NOT NULL, restaurant_id integer NOT NULL, PRIMARY KEY (user_id, restaurant_id), CONSTRAINT favorites_restaurants_fkey FOREIGN KEY (restaurant_id) REFERENCES restaurant (restaurant_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE CASCADE, CONSTRAINT favorites_users_fkey FOREIGN KEY (user_id) REFERENCES users (user_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE CASCADE ); 

create table favoriteentry(user_id varchar(50) NOT NULL, entry_id integer NOT NULL, PRIMARY KEY (user_id, entry_id), CONSTRAINT favorites_entry_id_fkey FOREIGN KEY (entry_id) REFERENCES menuentry (entry_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE CASCADE, CONSTRAINT favorites_users_fkey FOREIGN KEY (user_id) REFERENCES users (user_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE CASCADE ); 

create table owner(user_id varchar(50)  NOT NULL, restaurant_id integer NOT NULL, PRIMARY KEY (user_id, restaurant_id), CONSTRAINT owner_restaurants_fkey FOREIGN KEY (restaurant_id) REFERENCES restaurant (restaurant_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE CASCADE, CONSTRAINT owner_users_fkey FOREIGN KEY (user_id) REFERENCES users (user_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE CASCADE); 

create table rating(user_id varchar(50)  NOT NULL, entry_id integer NOT NULL, rating real not null, ratedate DATE not null, comment text, PRIMARY KEY (user_id, entry_id), CONSTRAINT rating_menuentry_fkey FOREIGN KEY (entry_id) REFERENCES menuentry (entry_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE CASCADE, CONSTRAINT rating_users_fkey FOREIGN KEY (user_id) REFERENCES users (user_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE CASCADE); 

commit;

CREATE OR REPLACE FUNCTION distance(lat1 FLOAT, lon1 FLOAT, lat2 FLOAT, lon2 FLOAT) RETURNS FLOAT AS $$ DECLARE x float = 111.12 * (lat2 - lat1); y float = 111.12 * (lon2 - lon1) * cos(lat1 / 92.215); BEGIN RETURN sqrt(x * x + y * y); END $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION totalRating(rating float, votes integer) RETURN FLOAT AS $$ DECLARE x float = 

select name from restaurant where regexp_split_to_array(lower(name), '\s+') @> array['bar', 'food'];
select name from restaurant where to_tsvector('simple', name) @@ to_tsquery('simple', 'platero:* &utopi:* &fo:*');
--select name from restaurant where to_tsvector('simple', name) @@ to_tsquery('simple', 'platero:*');
select name from restaurant where to_tsvector('simple', name) @@ to_tsquery('simple', 'platero:* | utopi:* | fo:*'); 

--ORDER BY DISTANCE
select *, distance($2, $3, latitude, longitude) as distance from restaurant where distance($2, $3, latitude, longitude) <= $4 and to_tsvector('simple', name) @@ to_tsquery('simple', $1) order by distance asc limit 10 offset $5 rows;

select *, distance($2, $3, latitude, longitude) as distance from restaurant where distance($2, $3, latitude, longitude) <= $4 and to_tsvector('simple', name) @@ to_tsquery('simple', $1) and types && $6::text[] order by distance asc limit 10 offset $5 rows;

select r.name, distance(39.4693409, -0.3536466, r.latitude, r.longitude) as distance from restaurant r where to_tsvector('simple', r.name) @@ to_tsquery('simple', '') and distance(39.4693409, -0.3536466, r.latitude, r.longitude) <= 20.0 and types && `{"'Street Food'"}`::text[] order by distance asc limit 10 offset 0 rows;


-- ORDER BY RATINGS
select r.name, distance($2, $3, r.latitude, r.longitude) as distance, COALESCE((sum(ra.rating)*0.5/count(ra) + count(ra)*0.0025),0 ) from restaurant r LEFT OUTER join menuentry m on m.restaurant_id = r.restaurant_id LEFT OUTER join rating ra on ra.entry_id = m.entry_id where distance($2, $3, r.latitude, r.longitude) <= %4  and r.types && $6::text[] and to_tsvector('simple', r.name) @@ to_tsquery('simple', $1) group by r.restaurant_id order by COALESCE((sum(ra.rating)*0.5/count(ra) + count(ra)*0.0025),0 ) desc limit 10 offset %5 rows;

select r.name, distance($2, $3, r.latitude, r.longitude) as distance,  COALESCE((sum(ra.rating)*0.5/count(ra) + count(ra)*0.0025),0 ) from restaurant r LEFT OUTER join menuentry m on m.restaurant_id = r.restaurant_id LEFT OUTER join rating ra on ra.entry_id = m.entry_id where distance($2, $3, r.latitude, r.longitude) <= %4  and to_tsvector('simple', r.name) @@ to_tsquery('simple', $1) group by r.restaurant_id order by COALESCE((sum(ra.rating)*0.5/count(ra) + count(ra)*0.0025),0 ) desc limit 10 offset %5 rows;

select r.name, distance(39.4693409, -0.3536466, r.latitude, r.longitude) as distance, COALESCE((sum(ra.rating)*0.5/count(ra) + count(ra)*0.0025),0 ) from restaurant r LEFT OUTER join menuentry m on m.restaurant_id = r.restaurant_id LEFT OUTER join rating ra on ra.entry_id = m.entry_id where distance(39.4693409, -0.3536466, r.latitude, r.longitude) <= 5.0  and to_tsvector('simple', r.name) @@ to_tsquery('simple', 'la:*') group by r.restaurant_id order by COALESCE((sum(ra.rating)*0.5/count(ra) + count(ra)*0.0025),0 ) desc limit 10 offset 0 rows;

--*5*0.5/1000 = 0.0025

select re.name, e.name, w.name from menuentry e left join restaurant re on re.restaurant_id = e.restaurant_id left join menuentry w on w.restaurant_id = e.restaurant_id where  to_tsvector('simple', w.name) @@ to_tsquery('simple', 'Lote:*') and to_tsvector('simple', e.name) @@ to_tsquery('simple', 'Mej:*')  group by e.entry_id, re.restaurant_id, w.entry_id limit 3;

select re.name, e.name, w.name, distance(39.4693409, -0.3536466, re.latitude, re.longitude) as distance, AVG(r.rating) as rating, COUNT(r) as numreviews  from menuentry e left join restaurant re on re.restaurant_id = e.restaurant_id left join menuentry w on w.restaurant_id = e.restaurant_id  left join rating r on r.entry_id = e.entry_id where to_tsvector('simple', w.name) @@ to_tsquery('simple', 'Lote:*') and to_tsvector('simple', e.name) @@ to_tsquery('simple', 'Mej:*')  group by e.entry_id, re.restaurant_id, w.entry_id order by distance(39.4693409, -0.3536466, re.latitude, re.longitude) limit 3;

--having
select re.name, e.name, w.name, distance(39.4693409, -0.3536466, re.latitude, re.longitude) as distance from menuentry e left join restaurant re on re.restaurant_id = e.restaurant_id left join menuentry w on w.restaurant_id = e.restaurant_id left join rating r on r.entry_id = e.entry_id left join rating v on v.entry_id = w.entry_id where to_tsvector('simple', w.name) @@ to_tsquery('simple', 'L:*') and to_tsvector('simple', e.name) @@ to_tsquery('simple', 'E:*')  group by e.entry_id, re.restaurant_id, w.entry_id having AVG(r.rating) > 1 and AVG(v.rating) > 1 order by distance(39.4693409, -0.3536466, re.latitude, re.longitude) limit 3;

select re.name, r.entry_id, distance(39.4693409, -0.3536466, re.latitude, re.longitude) as distance, r.ratedate from restaurant re left join menuentry e on re.restaurant_id = e.restaurant_id left join rating r on r.entry_id = e.entry_id where r.entry_id = ANY('{22211,22212}'::integer[]) and r.user_id = 'OhrHLQyJYeUTNWj70AjO3mZCepr2' order by r.ratedate asc limit 50 offset 0 rows;


Café
Afghan
Afghani
African
American
Argentinean
Armenian
Asian
Asian Fusion
Australian
Austrian
Bagels
Bahamian
Bakery
Balti
BangladeshiW
Bar
Barbeque
Basque
Belgian
Bistro
Brasserie
Brazilian
Brew Pub
British
Burmese
Cajun & Creole
Californian
Cambodian
Canadian
Caribbean
Central American
Central European
Chicken Wings
Chilean
Chinese
Chowder
Coffee Shop
Colombian
Contemporary
Continental
Costa Rican
Creperie
Croatian
Cuban
Czech
Danish
Delicatessen
Dessert
Dim Sum
Diner
Donuts
Dutch
Eastern European
Eclectic
Ecuadorean
Egyptian
English
Ethiopian
European
Family Fare
Fast Food
Filipino
Fish & Chips
Fondue
French
Fusion
Gastropub
German
Greek
Grill
Guatemalan
Halal
Hamburgers
Hawaiian
Healthy
Hot Dogs
Hunan
Hungarian
Ice Cream
Indian
Indonesian
International
Irish
Israeli
Italian
Jamaican
Japanese
Korean
Kosher
Latin
Latvian
Lebanese
Malaysian
Mediterranean
Mexican
Middle Eastern
Mongolian
Moroccan
Native American
Nepali
New Zealand
Nonya
Noodle
Noodle Shop
Norwegian
Organic
Oyster Bar
Pacific Rim
Pakistani
Pan-Asian
Pasta
Peruvian
Philippine
Pizza
Pizza & Pasta
Polish
Polynesian
Portuguese
Pub
Puerto Rican
Romanian
Russian
Salvadoran
Sandwiches
Scandinavian
Scottish
Seafood
Singaporean
Slovenian
Soups
South American
Southwestern
Spanish
Sri Lankan
Steakhouse
Street Food
Sushi
Swedish
Swiss
Szechuan
Taiwanese
Tapas
Tea Room
Thai
Tibetan
Tunisian
Turkish
Ukrainian
Vegan
Vegetarian
Venezuelan
Vietnamese
Welsh
Wine Bar
Winery
Yugoslavian
