const pool = require("./mypool").pool

const getPrices = (request, response) => {
    const {} = request.headers;
    pool.query("SELECT * from prices)", [], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
}


const getSponshorship = (request, response) => {
    const {restaurant_id} = request.headers;
    pool.query("SELECT * from sponsor where restaurant_id = $1)", [restaurant_id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
}

const updateSponshorship = (request, response) => {
    const {restaurant_id} = request.body;
    pool.query("UPDATE sponsor SET clicks = clicks - 1 where restaurant_id = $1)", [restaurant_id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`-1 click: ${restaurant_id}`)
    })
}

const createSponshorship = (request, response) => {
    const {restaurant_id} = request.body;
    pool.query("INSERT INTO sponsor (restaurant_id, clicks) VALUES($1, 0)", [restaurant_id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`Sponsor created: ${restaurant_id}`)
    })
}


const getPremium = (request, response) => {
    const {restaurant_id} = request.headers;
    pool.query("SELECT * from premium where restaurant_id = $1)", [restaurant_id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
}

const createPremium = (request, response) => {
    const {restaurant_id, date} = request.body;
    pool.query("INSERT INTO premium (restaurant_id, sponshorshiptime) VALUES($1, $2)", [restaurant_id, date], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`Premium created: ${restaurant_id}`)
    })
}

const updatePremium = (request, response) => {
    const {restaurant_id, date} = request.body;
    pool.query("UPDATE premium SET sponshorshiptime = $2 where restaurant_id = $1)", [restaurant_id, date], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`Premium updated: ${restaurant_id}`)
    })
}


const getPayments = (request, response) => {
    const {restaurant_id} = request.headers;
    pool.query("SELECT * from payment where restaurant_id = $1)", [restaurant_id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
}

const createPayment = (request, response) => {
    const {restaurant_id, user_id, paymentdate, price, service, description} = request.body;
    pool.query("INSERT INTO payment (restaurant_id, user_id, paymentdate, price, service, description) VALUES($1, $2, $3, $4, $5, $6)", [restaurant_id, user_id, paymentdate, price, service, description], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`Payment done: ${restaurant_id}`)
    })
}

module.exports = {
    createPayment,
    createSponshorship,
    createPremium,
    getPayments,
    getPremium,
    getPrices,
    getSponshorship,
    updatePremium,
    updateSponshorship
}