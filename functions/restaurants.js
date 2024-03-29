const pool = require("./mypool").pool

const createRestaurant = (request, response) => {
    const {taid, name, phone, website, webUrl, address, email, city, country, latitude, longitude,rating, numrevta, images, types, schedule, sections, currency, delivery} = request.body
    if(taid == -1){
      pool.query('INSERT INTO restaurant (name, phone, website, webUrl, address, email, city, country, latitude, longitude, rating, numrevta, images, types, schedule, sections, currency, delivery) VALUES ($1, $2, $3, $4, $5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18) RETURNING restaurant_id',
      [name, phone, website, webUrl, address, email, city, country, latitude, longitude,rating, numrevta, images, types, schedule, sections, currency, delivery], (error, results) => {
       if (error) {
         throw error
       }
       response.status(200).json(results.rows)
     })
    }
    else{
      pool.query('INSERT INTO restaurant (ta_id, name, phone, website, webUrl, address, email, city, country, latitude, longitude, rating, numrevta, images, types, schedule, sections, currency, delivery) VALUES ($1, $2, $3, $4, $5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19) RETURNING restaurant_id',
      [taid, name, phone, website, webUrl, address, email, city, country, latitude, longitude,rating, numrevta, images, types, schedule, sections, currency, delivery], (error, results) => {
       if (error) {
         throw error
       }
       response.status(200).json(results.rows)
     })
    }
    
  }

  const getRestaurantsById = (request, response) => {
    const {ids, latitude, longitude} = request.headers;
    console.log(ids)
    pool.query("SELECT r.*, distance($2, $3, latitude, longitude) as distance FROM restaurant r where r.restaurant_id = ANY($1::int[])", [ids, latitude, longitude], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }

  const getRecently = (request, response) => {
    const {user_id, latitude, longitude} = request.headers;
    pool.query("SELECT r.*, distance($2, $3, latitude, longitude) as distance FROM restaurant r, users u where u.user_id = $1 and r.restaurant_id = ANY(u.recently::int[])", [user_id, latitude, longitude], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }

  const updateRecently = (request, response) => {
    const {user_id, recently} = request.body
    pool.query('UPDATE users SET recently = $2 WHERE user_id = $1',
     [user_id, recently], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`Recently updated: ${user_id}`)
    })
  }

  const getPopular = (request, response) => {
    const {latitude, longitude} = request.headers;
    pool.query("select re.*, e.entry_id, distance($1, $2, re.latitude, re.longitude) as distance, AVG(r.rating) as rating, COUNT(r) as numreviews from restaurant re, menuentry e, rating r where distance($1, $2, re.latitude, re.longitude) < 8.0 and re.restaurant_id = e.restaurant_id and r.entry_id = e.entry_id and r.ratedate > current_date - 7 group by e.entry_id, re.restaurant_id order by count(*) desc limit 16", [latitude, longitude], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }

  const getTopRestaurants = (request, response) => {
    const {latitude, longitude} = request.headers;
    pool.query("select re.*, distance($1, $2, re.latitude, re.longitude) from restaurant re, menuentry e, rating r where distance($1, $2, re.latitude, re.longitude) < 20.0 and re.restaurant_id = e.restaurant_id and r.entry_id = e.entry_id group by re.restaurant_id order by (COUNT(r)*5*0.5/1000 + AVG(r.rating)*0.5) desc limit 16", [latitude, longitude], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }

  const getTopEntries = (request, response) => {
    const {latitude, longitude} = request.headers;
    pool.query("select re.*, e.entry_id, distance($1, $2, re.latitude, re.longitude) as distance, AVG(r.rating) as rating, COUNT(r) as numreviews from restaurant re, menuentry e, rating r where distance($1, $2, re.latitude, re.longitude) < 20.0 and re.restaurant_id = e.restaurant_id and r.entry_id = e.entry_id group by e.entry_id, re.restaurant_id order by (COUNT(r)*5*0.5/1000 + AVG(r.rating)*0.5) desc limit 8", [latitude, longitude], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }

  const getRestaurantsFromDistance = (request, response) => {
    const {latitude, longitude, quantity} = request.headers;
    pool.query('select *, distance($1, $2, latitude, longitude) as distance from restaurant order by distance asc limit $3;',
    [latitude, longitude, quantity], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }

  const getRestaurantsFromSquare = (request, response) => {
    const {latitude, longitude, la1, la2, lo1, lo2} = request.headers;
    pool.query('select *, distance($1, $2, latitude, longitude) as distance from restaurant where latitude >= $3 and latitude <= $4 and longitude >= $5 and longitude <= $6',
    [latitude, longitude, la1, la2, lo1, lo2], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }

  const getRecommended = (request, response) => {
    const {latitude, longitude, user_id} = request.headers;
    pool.query("select re.*, distance($1, $2, re.latitude, re.longitude) as distance from restaurant re left join menuentry e on re.restaurant_id = e.restaurant_id left join rating r on r.entry_id = e.entry_id where distance($1, $2, re.latitude, re.longitude) < 20.0  and re.types && array(select distinct unnest(re.types) from restaurant re left join menuentry e on re.restaurant_id = e.restaurant_id left join rating r on r.entry_id = e.entry_id where r.user_id = $3 and r.ratedate > current_date - 30) and not re.restaurant_id =ANY(array(select distinct re.restaurant_id from restaurant re left join menuentry e on re.restaurant_id = e.restaurant_id left join rating r on r.entry_id = e.entry_id where r.user_id = $3 and r.ratedate > current_date - 30)) group by re.restaurant_id order by (COUNT(r)*5*0.5/1000 + AVG(r.rating)*0.5) desc limit 12", [latitude, longitude, user_id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }

  const addMenuEntry = (request, response) => {
    const {restaurant_id, name, section, price, image, pos, description, hide, allergens} = request.body
    pool.query('INSERT INTO menuentry (restaurant_id, name, section, price, image, pos, description, hide, allergens) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING entry_id',
     [restaurant_id, name, section, price, image, pos, description, hide, allergens], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }

  const updateMenuEntry = (request, response) => {
    const {entry_id, name, section, price, image, pos, description, hide, allergens} = request.body
    pool.query('UPDATE menuentry SET name = $2, section = $3, price = $4, image = $5, pos = $6, description = $7, allergens = $9, hide = $8 WHERE entry_id = $1',
     [entry_id, name, section, price, image, pos, description, hide, allergens], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`Menu entry updated with name: ${name}`)
    })
  }

  const deleteMenuEntry = (request, response) => {
    const {entry_id} = request.headers
  
    pool.query(
      `DELETE FROM menuentry WHERE entry_id = $1`,[entry_id],
      (error, results) => {
        if (error) {
          throw error
        }
        response.status(201).send(`Menu entry deleted with id: ${entry_id}`)
      }
    )
  }

  const getMenu = (request, response) => {
    const {restaurant_id} = request.headers;

    pool.query(
      `SELECT m.*, AVG(r.rating) as rating, COUNT(r) as numreviews FROM menuentry m left join rating r on m.entry_id=r.entry_id WHERE m.restaurant_id = $1 group by m.entry_id; `,[restaurant_id],
      (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).json(results.rows)
      }
    )
  }

  const getDailyMenu = (request, response) => {
    const {restaurant_id} = request.headers;
    pool.query(
      `SELECT dailymenu from restaurant where restaurant_id = $1`,[restaurant_id],
      (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).json(results.rows)
      }
    )
  }

  const updateDailyMenu = (request, response) => {
    var {restaurant_id, dailymenu} = request.body
    dailymenu = dailymenu.split(', ');
    pool.query(`UPDATE restaurant SET dailymenu = $2 WHERE restaurant_id = $1`,
     [restaurant_id, dailymenu], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`Dailymenu added in: ${restaurant_id}`)
    })
  }

  const addSection = (request, response) => {
    const {restaurant_id, sections} = request.body
    pool.query('UPDATE restaurant SET sections = sections || ARRAY[$2] WHERE restaurant_id = $1',
     [restaurant_id, sections], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`Section added in: ${restaurant_id}`)
    })
  }

  const updateSections = (request, response) => {
    var {restaurant_id, sections} = request.body
    sections = sections.split(', ');
    pool.query(`UPDATE restaurant SET sections = $2 WHERE restaurant_id = $1`,
     [restaurant_id, sections], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`Sections added in: ${restaurant_id}`)
    })
  }

  const getSections = (request, response) => {
    const {restaurant_id} = request.headers;

    pool.query(
      `SELECT sections FROM restaurant WHERE restaurant_id = $1 `,[restaurant_id],
      (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).json(results.rows)
      }
    )
  }

  const updateImages = (request, response) => {
    const {id,images} = request.body
    pool.query('UPDATE restaurant SET images = $2 WHERE restaurant_id = $1',
     [id,images], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`Images updated from restaurant: ${id}`)
    })
  }

  const updateMealTime = (request, response) => {
    const {id, mealtime} = request.body
    pool.query('UPDATE restaurant SET mealtime = $2 WHERE restaurant_id = $1',
     [id, mealtime], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`Mealtime updated from restaurant: ${id}`)
    })
  }

  const updateRestaurantData = (request, response) => {
    const {id,name,phone,website,address,types,schedule, delivery, currency} = request.body
    pool.query('UPDATE restaurant SET name = $2, phone = $3, website = $4, address = $5, types = $6, schedule = $7, delivery = $8, currency = $9 WHERE restaurant_id = $1',
     [id,name,phone,website,address,types,schedule, delivery, currency], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`Updated restaurant: ${id}`)
    })
  }

  const getEntriesByIds = (request, response) => {
    const {ids, latitude, longitude} = request.headers;
  
    pool.query(
      `select re.*, e.entry_id, distance($2, $3, re.latitude, re.longitude) as distance from restaurant re left join menuentry e on re.restaurant_id = e.restaurant_id where e.entry_id = ANY($1::integer[])`,[ids, latitude, longitude],
      (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).json(results.rows)
      }
    )
  }

  const getEntryRatings = (request, response) => {
    const {entry_id} = request.headers;
    pool.query(
      `SELECT r.*, u.* FROM rating r left join users u on u.user_id = r.user_id WHERE r.entry_id = $1 order by r.ratedate desc limit 50`,[entry_id],
      (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).json(results.rows)
      }
    )
  }


  const getOwned = (request, response) => {
    const {user_id, latitude, longitude} = request.headers;
    pool.query("SELECT r.*, distance($2, $3, latitude, longitude) as distance FROM restaurant r, owner o where o.user_id = $1 and r.restaurant_id = o.restaurant_id", [user_id, latitude, longitude], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }

  const getFollowingFeed = (request, response) => {
    const {user_id, offset} = request.headers;
    pool.query(
      `SELECT  r.*, u.*, e.name as entryname, e.description, e.price, e.image as entryimage, e.allergens, e.restaurant_id FROM menuentry e left join rating r on r.entry_id = e.entry_id left join users u on u.user_id = r.user_id WHERE u.user_id =ANY(array(select distinct followerid from followers where user_id = $1)) order by r.ratedate desc limit 10 offset $2;`,[user_id, offset],
      (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).json(results.rows)
      }
    )
  }



  module.exports = {
    createRestaurant,
    getRestaurantsById,
    addMenuEntry,
    getMenu,
    addSection,
    getSections,
    updateSections,
    updateMenuEntry,
    deleteMenuEntry,
    getRestaurantsFromDistance,
    updateImages,
    updateRestaurantData,
    getRestaurantsFromSquare,
    getDailyMenu,
    updateDailyMenu,
    getRecently,
    updateRecently,
    getPopular,
    getEntriesByIds,
    getEntryRatings,
    updateMealTime,
    getOwned,
    getTopEntries,
    getTopRestaurants,
    getRecommended,
    getFollowingFeed
  }

