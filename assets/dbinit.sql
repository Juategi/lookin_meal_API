begin;

create table restaurant(restaurant_id serial PRIMARY KEY, ta_id integer unique, name VARCHAR (150) NOT NULL, address text NOT NULL, city VARCHAR (50) NOT NULL, country VARCHAR (50) NOT NULL, email VARCHAR (50), phone VARCHAR (50), website VARCHAR (150), weburl VARCHAR (300), types text[], images text[], schedule json, rating real not null, latitude real not null, longitude real not null, numRevta integer, sections text[], currency varchar(5));

create table menuentry (entry_id serial PRIMARY KEY, restaurant_id integer not null, pos integer, name VARCHAR (150) NOT NULL, section VARCHAR (150) NOT NULL, price real, image VARCHAR (250), CONSTRAINT restaurant_to_entry_fkey FOREIGN KEY (restaurant_id) REFERENCES restaurant (restaurant_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE CASCADE ); 

create table users(user_id varchar(50) unique primary key, name VARCHAR (80) NOT NULL, email unique VARCHAR (50) NOT NULL, service VARCHAR (10) NOT NULL, image VARCHAR (250) NOT NULL); 

create table favorite(user_id varchar(50) NOT NULL, restaurant_id integer NOT NULL, PRIMARY KEY (user_id, restaurant_id), CONSTRAINT favorites_restaurants_fkey FOREIGN KEY (restaurant_id) REFERENCES restaurant (restaurant_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE CASCADE, CONSTRAINT favorites_users_fkey FOREIGN KEY (user_id) REFERENCES users (user_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE CASCADE ); 

create table owner(user_id varchar(50)  NOT NULL, restaurant_id integer NOT NULL, PRIMARY KEY (user_id, restaurant_id), CONSTRAINT owner_restaurants_fkey FOREIGN KEY (restaurant_id) REFERENCES restaurant (restaurant_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE CASCADE, CONSTRAINT owner_users_fkey FOREIGN KEY (user_id) REFERENCES users (user_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE CASCADE); 

create table rating(user_id varchar(50)  NOT NULL, entry_id integer NOT NULL, rating real not null, ratedate DATE not null, PRIMARY KEY (user_id, entry_id), CONSTRAINT rating_menuentry_fkey FOREIGN KEY (entry_id) REFERENCES menuentry (entry_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE CASCADE, CONSTRAINT rating_users_fkey FOREIGN KEY (user_id) REFERENCES users (user_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE CASCADE); 

commit;

CREATE OR REPLACE FUNCTION distance(lat1 FLOAT, lon1 FLOAT, lat2 FLOAT, lon2 FLOAT) RETURNS FLOAT AS $$ DECLARE x float = 111.12 * (lat2 - lat1); y float = 111.12 * (lon2 - lon1) * cos(lat1 / 92.215); BEGIN RETURN sqrt(x * x + y * y); END $$ LANGUAGE plpgsql;

curl http://localhost:5000/users -X POST -d "id=11a" -d "name=Elaine" -d "email=elaine@example.com" -d "service=GM" -d "image=myimage" 
curl -X GET http://localhost:5000/users -d "id=1"

select name,latitude,longitude, distance(39.4534311, -0.3741785, latitude, longitude) as dist from restaurant where city ='Valencia' order by dist asc limit 10;
select *, distance(39.4534311, -0.3741785, latitude, longitude) as dist from restaurant where city ='Valencia' order by dist asc limit 10;

select array_agg(c) as alltypes from (select distinct unnest(types) from restaurant) as dt(c);


SELECT m.*, AVG(r.rating) as rating, COUNT(r) as numreviews, re.*, distance(39.4534311, -0.3741785, re.latitude, re.longitude) as distance FROM restaurant re, menuentry m left join rating r on m.entry_id=r.entry_id WHERE re.restaurant_id = m.restaurant_id and m.name ILIKE '%a%' group by m.entry_id, re.restaurant_id;

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
Bangladeshi
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
