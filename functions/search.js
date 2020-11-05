const pool = require("./mypool").pool

const queryRestaurants = (request, response) => {
    const {query, maxDistance, latitude, longitude, valoration, offset, types} = request.headers;
    console.log(types)
    var statement = ""
    if(valoration == "false"){
      if(types == "null"){
        statement = "select *, distance($2, $3, latitude, longitude) as distance from restaurant where distance($2, $3, latitude, longitude) <= $4 and to_tsvector('simple', name) @@ to_tsquery('simple', $1) order by distance asc limit 10 offset $5 rows;"
      }
      else{
        statement = "select *, distance($2, $3, latitude, longitude) as distance from restaurant where distance($2, $3, latitude, longitude) <= $4 and to_tsvector('simple', name) @@ to_tsquery('simple', $1) and types && $6::text[] order by distance asc limit 10 offset $5 rows;"
      }
    }
    else{
      if(types == "null"){
        statement = "select r.name, distance($2, $3, r.latitude, r.longitude) as distance,  COALESCE((sum(ra.rating)*0.5/count(ra) + count(ra)*0.0025),0 ) from restaurant r LEFT OUTER join menuentry m on m.restaurant_id = r.restaurant_id LEFT OUTER join rating ra on ra.entry_id = m.entry_id where distance($2, $3, r.latitude, r.longitude) <= %4  and to_tsvector('simple', r.name) @@ to_tsquery('simple', $1) group by r.restaurant_id order by COALESCE((sum(ra.rating)*0.5/count(ra) + count(ra)*0.0025),0 ) desc limit 10 offset %5 rows;"
      }
      else{
        statement = "select r.name, distance($2, $3, r.latitude, r.longitude) as distance, COALESCE((sum(ra.rating)*0.5/count(ra) + count(ra)*0.0025),0 ) from restaurant r LEFT OUTER join menuentry m on m.restaurant_id = r.restaurant_id LEFT OUTER join rating ra on ra.entry_id = m.entry_id where distance($2, $3, r.latitude, r.longitude) <= %4  and r.types && $6::text[] and to_tsvector('simple', r.name) @@ to_tsquery('simple', $1) group by r.restaurant_id order by COALESCE((sum(ra.rating)*0.5/count(ra) + count(ra)*0.0025),0 ) desc limit 10 offset %5 rows;"
      }
    }
    if(types == "null"){
      pool.query(statement,[query, latitude, longitude, maxDistance, offset], (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).json(results.rows)
      })
    }
    else{
      pool.query(statement,[query, latitude, longitude, maxDistance, offset, types], (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).json(results.rows)
      })
    }
    
  }

  
const queryEntries = (request, response) => {
  const {query, locality, latitude, longitude, valoration, price} = request.headers;
  var statement = ""
  var price2 = price
  if(price == "0.0"){
    price2 = "Infinity"
  }
  if(valoration == "false"){
    statement = `SELECT m.*, m.name as mname, AVG(r.rating) as mrating, COUNT(r) as numreviews, re.*, distance($2, $3, re.latitude, re.longitude) as distance FROM restaurant re, menuentry m left join rating r on m.entry_id=r.entry_id WHERE re.restaurant_id = m.restaurant_id and m.name ILIKE $1 and m.price <= $4 group by m.entry_id, re.restaurant_id order by m.price asc limit 15`
  }
  else{
    statement = `SELECT m.*, m.name as mname, AVG(r.rating) as mrating, COUNT(r) as numreviews, re.*, distance($2, $3, re.latitude, re.longitude) as distance FROM restaurant re, menuentry m left join rating r on m.entry_id=r.entry_id WHERE re.restaurant_id = m.restaurant_id and m.name ILIKE $1 and m.price <= $4  group by m.entry_id, re.restaurant_id order by mrating desc limit 15`
  }
   
  pool.query(statement,[query, latitude, longitude, price2], (error, results) => {
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