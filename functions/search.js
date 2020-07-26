const pool = require("./mypool").pool

const queryRestaurants = (request, response) => {
    const {query, locality, latitude, longitude, valoration, types} = request.headers;
    console.log(types)
    var statement = ""
    if(valoration == "false"){
      if(types == "null"){
        statement = `select *, distance($2, $3, latitude, longitude) as distance from restaurant where name ILIKE $1 order by distance asc limit 10`
      }
      else{
        statement = `select *, distance($2, $3, latitude, longitude) as distance from restaurant where name ILIKE $1 and types && $4::text[] order by distance asc limit 10`
      }
    }
    else{
      if(types == "null"){
        statement = `select *, distance($2, $3, latitude, longitude) as distance from restaurant where name ILIKE $1 order by rating desc limit 10`
      }
      else{
        statement = `select *, distance($2, $3, latitude, longitude) as distance from restaurant where name ILIKE $1 and types && $4::text[] order by rating desc limit 10`
      }
    }
    pool.query(statement,[query, latitude, longitude, types], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }

  
const queryEntries = (request, response) => {
  const {query, locality, latitude, longitude, valoration, price} = request.headers;
   const statement = `SELECT m.*, AVG(r.rating) as rating, COUNT(r) as numreviews, re.*, distance($2, $3, re.latitude, re.longitude) as distance FROM restaurant re, menuentry m left join rating r on m.entry_id=r.entry_id WHERE re.restaurant_id = m.restaurant_id and m.name ILIKE $1 group by m.entry_id, re.restaurant_id`
  pool.query(statement,[query, latitude, longitude], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}


  module.exports={
      queryRestaurants,
      queryEntries
  }