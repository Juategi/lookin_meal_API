const pool = require("./mypool").pool

const createRestaurant = (request, response) => {
    const {taid, name, phone, website, webUrl, address, email, city, country, latitude, longitude,rating, numrevta, images, types, schedule, sections, currency} = request.body
    pool.query('INSERT INTO restaurant (ta_id, name, phone, website, webUrl, address, email, city, country, latitude, longitude, rating, numrevta, images, types, schedule, sections, currency) VALUES ($1, $2, $3, $4, $5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)',
     [taid, name, phone, website, webUrl, address, email, city, country, latitude, longitude,rating, numrevta, images, types, schedule, sections, currency], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`Restaurant added with name: ${name}`)
    })
  }

  const getRestaurants = (request, response) => {
    pool.query('SELECT * FROM restaurant LIMIT 10', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }

  const getRestaurantsFromDistance = (request, response) => {
    const {latitude, longitude, city} = request.headers;
    pool.query('select *, distance($1, $2, latitude, longitude) as distance from restaurant where city =$3 order by distance asc limit 10;',
    [latitude, longitude, city], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }

  const addMenuEntry = (request, response) => {
    const {restaurant_id, name, section, price, image, pos} = request.body
    pool.query('INSERT INTO menuentry (restaurant_id, name, section, price, image, pos) VALUES ($1, $2, $3, $4, $5, $6) RETURNING entry_id',
     [restaurant_id, name, section, price, image, pos], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }

  const updateMenuEntry = (request, response) => {
    const {entry_id, name, section, price, image, pos} = request.body
    pool.query('UPDATE menuentry SET name = $2, section = $3, price = $4, image = $5, pos = $6 WHERE entry_id = $1',
     [entry_id, name, section, price, image, pos], (error, results) => {
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

  const updateRestaurantData = (request, response) => {
    const {id,name,phone,website,address,types,schedule} = request.body
    pool.query('UPDATE restaurant SET name = $2, phone = $3, website = $4, address = $5, types = $6, schedule = $7 WHERE restaurant_id = $1',
     [id,name,phone,website,address,types,schedule], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`Updated restaurant: ${id}`)
    })
  }

  module.exports = {
    createRestaurant,
    getRestaurants,
    addMenuEntry,
    getMenu,
    addSection,
    getSections,
    updateSections,
    updateMenuEntry,
    deleteMenuEntry,
    getRestaurantsFromDistance,
    updateImages,
    updateRestaurantData
  }

