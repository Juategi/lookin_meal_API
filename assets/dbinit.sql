begin;

create table restaurant(restaurant_id serial PRIMARY KEY, ta_id integer unique, name VARCHAR (150) NOT NULL, address text NOT NULL, city VARCHAR (50) NOT NULL, country VARCHAR (50) NOT NULL, email VARCHAR (50), phone VARCHAR (50), website VARCHAR (150), weburl VARCHAR (300), types text[], images text[], dailymenu text[], schedule json, rating real not null, latitude real not null, longitude real not null, numRevta integer, sections text[], currency varchar(5), delivery text[]);

create table menuentry (entry_id serial PRIMARY KEY, restaurant_id integer not null, pos integer, name VARCHAR (150) NOT NULL, section VARCHAR (150) NOT NULL, price real, image VARCHAR (250), description text, allergens text[], CONSTRAINT restaurant_to_entry_fkey FOREIGN KEY (restaurant_id) REFERENCES restaurant (restaurant_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE CASCADE ); 

create table users(user_id varchar(50) unique primary key, name VARCHAR (80) NOT NULL, email unique VARCHAR (50) NOT NULL, service VARCHAR (10) NOT NULL, image VARCHAR (250) NOT NULL, username unique VARCHAR (50) NOT NULL, country VARCHAR (80) NOT NULL, recently int[]); 

create table favorite(user_id varchar(50) NOT NULL, restaurant_id integer NOT NULL, PRIMARY KEY (user_id, restaurant_id), CONSTRAINT favorites_restaurants_fkey FOREIGN KEY (restaurant_id) REFERENCES restaurant (restaurant_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE CASCADE, CONSTRAINT favorites_users_fkey FOREIGN KEY (user_id) REFERENCES users (user_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE CASCADE ); 

create table favoriteentry(user_id varchar(50) NOT NULL, entry_id integer NOT NULL, PRIMARY KEY (user_id, entry_id), CONSTRAINT favorites_entry_id_fkey FOREIGN KEY (entry_id) REFERENCES menuentry (entry_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE CASCADE, CONSTRAINT favorites_users_fkey FOREIGN KEY (user_id) REFERENCES users (user_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE CASCADE ); 

create table owner(user_id varchar(50)  NOT NULL, restaurant_id integer NOT NULL, PRIMARY KEY (user_id, restaurant_id), CONSTRAINT owner_restaurants_fkey FOREIGN KEY (restaurant_id) REFERENCES restaurant (restaurant_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE CASCADE, CONSTRAINT owner_users_fkey FOREIGN KEY (user_id) REFERENCES users (user_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE CASCADE); 

create table rating(user_id varchar(50)  NOT NULL, entry_id integer NOT NULL, rating real not null, ratedate DATE not null, PRIMARY KEY (user_id, entry_id), CONSTRAINT rating_menuentry_fkey FOREIGN KEY (entry_id) REFERENCES menuentry (entry_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE CASCADE, CONSTRAINT rating_users_fkey FOREIGN KEY (user_id) REFERENCES users (user_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE CASCADE); 

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

select r.name, distance(39.4693409, -0.3536466, r.latitude, r.longitude) as distance from restaurant r where to_tsvector('simple', r.name) @@ to_tsquery('simple', 'the:* & vu:*') and distance(39.4693409, -0.3536466, r.latitude, r.longitude) <= 5.0 order by distance asc limit 10 offset 0 rows;


-- ORDER BY RATINGS
select r.*, distance($2, $3, r.latitude, r.longitude) as distance from restaurant r, menuentry m, rating ra where distance($2, $3, r.latitude, r.longitude) <= $4 and to_tsvector('simple', r.name) @@ to_tsquery('simple', $1) and r.types && $6::text[] and m.restaurant_id = r.restaurant_id and ra.entry_id = m.entry_id order by count(ra) asc limit 10 offset $5 rows group by r.restaurant_id;

select r.name, distance(39.4693409, -0.3536466, r.latitude, r.longitude) as distance, (sum(ra.rating)*0.5/count(ra) + count(ra)*0.0025) from restaurant r inner join menuentry m on m.restaurant_id = r.restaurant_id inner join rating ra on ra.entry_id = m.entry_id where distance(39.4693409, -0.3536466, r.latitude, r.longitude) <= 5.0  and to_tsvector('simple', r.name) @@ to_tsquery('simple', 'La:*') group by r.restaurant_id order by (sum(ra.rating)*0.5/count(ra) + count(ra)*0.0025) desc limit 10 offset 0 rows;

--*5*0.5/1000 = 0.0025

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
