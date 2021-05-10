const pool = require("./mypool").pool

const getPrices = (request, response) => {
    const {} = request.headers;
    pool.query("SELECT * from prices", [], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
}


const getSponshorship = (request, response) => {
    const {restaurant_id} = request.headers;
    pool.query("SELECT * from sponsor where restaurant_id_sponsor = $1", [restaurant_id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
}

const updateSponshorship = (request, response) => {
    const {restaurant_id, clicks} = request.body;
    pool.query("UPDATE sponsor SET clicks = clicks + $2 where restaurant_id_sponsor = $1", [restaurant_id, clicks], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`updated sponsor: ${restaurant_id}`)
    })
}

const createSponshorship = (request, response) => {
    const {restaurant_id} = request.body;
    try{
    pool.query("INSERT INTO sponsor (restaurant_id_sponsor, clicks) VALUES($1, 0)", [restaurant_id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`Sponsor created: ${restaurant_id}`)
    })
  }
  catch(e){
    console.log("Sponsor already created")
  }
}

const getSponsored = (request, response) => {
  const {latitude, longitude, quantity} = request.headers;
  pool.query("select * from getSponsored($1, $2, $3);", [latitude, longitude, quantity], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}


const getPremium = (request, response) => {
    const {restaurant_id} = request.headers;
    pool.query("SELECT subscriptionId from premium where restaurant_id = $1", [restaurant_id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
}

const createPremium = (request, response) => {
    const {restaurant_id, subscriptionId} = request.body;
    pool.query("INSERT INTO premium (restaurant_id, subscriptionId) VALUES($1, $2)", [restaurant_id, subscriptionId], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`Premium created: ${restaurant_id}`)
    })
}

const updatePremium = (request, response) => {
    const {restaurant_id, subscriptionId} = request.body;
    pool.query("UPDATE premium SET subscriptionId = $2 where restaurant_id = $1", [restaurant_id, subscriptionId], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`Premium updated: ${restaurant_id}`)
    })
}


const getPayments = (request, response) => {
    const {restaurant_id} = request.headers;
    pool.query("SELECT * from payment where restaurant_id = $1", [restaurant_id], (error, results) => {
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
    updateSponshorship,
    getSponsored
}