begin;

create table restaurant(restaurant_id serial PRIMARY KEY, ta_id integer unique, name VARCHAR (150) NOT NULL, address VARCHAR (150) NOT NULL, city VARCHAR (50) NOT NULL, country VARCHAR (50) NOT NULL, email VARCHAR (50), phone VARCHAR (50), website VARCHAR (150), weburl VARCHAR (300), types text[], images text[], schedule json, rating real not null, latitude real not null, longitude real not null, numRevta integer, sections text[], currency varchar(5));

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


ALTER TABLE users ADD CONSTRAINT uniqueemail UNIQUE (email);