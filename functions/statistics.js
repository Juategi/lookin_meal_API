const pool = require("./mypool").pool

const addVisit = (request, response) => {
    const {user_id, restaurant_id} = request.body
    pool.query(
      'INSERT INTO visits (user_id, restaurant_id, visit) VALUES ($1, $2, CURRENT_TIMESTAMP)',
      [user_id, restaurant_id],
      (error, results) => {
        if (error) {
          throw error
        }
        response.status(201).send(`visited: ${restaurant_id}`)
      }
  )
}

const getVisits = (request, response) => {
    const {restaurant_id} = request.headers;
    pool.query("SELECT * FROM visits where restaurant_id = $1 order by visit desc", [restaurant_id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }


const addRate = (request, response) => {
    const {user_id, restaurant_id, entry_id, withcomment} = request.body
    pool.query(
      'INSERT INTO rates (user_id, restaurant_id, entry_id, withcomment, rate) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)',
      [user_id, restaurant_id, entry_id, withcomment],
      (error, results) => {
        if (error) {
          throw error
        }
        response.status(201).send(`rated: ${restaurant_id}`)
      }
  )
}

const getRate = (request, response) => {
    const {restaurant_id} = request.headers;
    pool.query("SELECT * FROM rates where restaurant_id = $1 order by rate desc", [restaurant_id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
}


module.exports = {
    addVisit,
    getVisits,
    addRate,
    getRate
}