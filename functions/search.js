const pool = require("./mypool").pool

async function queryRestaurants (request, response) {
    const {query, distance, latitude, longitude, valoration, offset, types} = request.headers;
    var statement = ""
    /*
    console.log(query)
    console.log(distance)
    console.log(latitude)
    console.log(longitude)
    console.log(valoration)
    console.log(offset)
    console.log(types)
    */
    if(valoration != "Sort by relevance"){
        statement = "select *, distance($1, $2, latitude, longitude) as distance from restaurant where distance($1, $2, latitude, longitude) <= $3 and to_tsvector('simple', name) @@ to_tsquery('simple', $5) and types && $6::text[] order by distance asc limit 10 offset $4 rows;"
    }
    else{
        statement = "select r.*, distance($1, $2, r.latitude, r.longitude) as distance, COALESCE((sum(ra.rating)*0.5/count(ra) + count(ra)*0.0025),0 ) from restaurant r LEFT OUTER join menuentry m on m.restaurant_id = r.restaurant_id LEFT OUTER join rating ra on ra.entry_id = m.entry_id where distance($1, $2, r.latitude, r.longitude) <= $3  and r.types && $6::text[] and to_tsvector('simple', r.name) @@ to_tsquery('simple', $5) group by r.restaurant_id order by COALESCE((sum(ra.rating)*0.5/count(ra) + count(ra)*0.0025),0 ) desc limit 10 offset $4 rows;"
    }
    if(types == "{}"){
      statement = statement.replace("and r.types && $6::text[]", "and $6=$6")
      statement = statement.replace("and types && $6::text[]", "and $6=$6")
    }
    if(query == ":*"){
      statement = statement.replace("and to_tsvector('simple', r.name) @@ to_tsquery('simple', $5)", "and $5=$5")
      statement = statement.replace("and to_tsvector('simple', name) @@ to_tsquery('simple', $5)", "and $5=$5")
    }
    try {
      results = await pool.query(statement,[latitude, longitude, distance, offset,query, types])
    } catch (err) {
      console.log(err.stack)
    }
    response.status(200).json(results.rows)
    /*
    if(valoration != "Sort by relevance"){
      if(types == "{}"){
        console.log('aaaaa')
        statement = "select *, distance($2, $3, latitude, longitude) as distance from restaurant where distance($2, $3, latitude, longitude) <= $4 and to_tsvector('simple', name) @@ to_tsquery('simple', $1) order by distance asc limit 10 offset $5 rows;"
      }
      else{
        console.log('eeee')
        statement = "select *, distance($2, $3, latitude, longitude) as distance from restaurant where distance($2, $3, latitude, longitude) <= $4 and to_tsvector('simple', name) @@ to_tsquery('simple', $1) and types && $6::text[] order by distance asc limit 10 offset $5 rows;"
      }
    }
    else{
      if(types == "{}"){
        console.log('iiii')
        statement = "select r.*, distance($2, $3, r.latitude, r.longitude) as distance,  COALESCE((sum(ra.rating)*0.5/count(ra) + count(ra)*0.0025),0 ) from restaurant r LEFT OUTER join menuentry m on m.restaurant_id = r.restaurant_id LEFT OUTER join rating ra on ra.entry_id = m.entry_id where distance($2, $3, r.latitude, r.longitude) <= $4  and to_tsvector('simple', r.name) @@ to_tsquery('simple', $1) group by r.restaurant_id order by COALESCE((sum(ra.rating)*0.5/count(ra) + count(ra)*0.0025),0 ) desc limit 10 offset $5 rows;"
      }
      else{
        console.log('oooo')
        statement = "select r.*, distance($2, $3, r.latitude, r.longitude) as distance, COALESCE((sum(ra.rating)*0.5/count(ra) + count(ra)*0.0025),0 ) from restaurant r LEFT OUTER join menuentry m on m.restaurant_id = r.restaurant_id LEFT OUTER join rating ra on ra.entry_id = m.entry_id where distance($2, $3, r.latitude, r.longitude) <= $4  and r.types && $6::text[] and to_tsvector('simple', r.name) @@ to_tsquery('simple', $1) group by r.restaurant_id order by COALESCE((sum(ra.rating)*0.5/count(ra) + count(ra)*0.0025),0 ) desc limit 10 offset $5 rows;"
      }
    }
    if(types == "{}"){
      pool.query(statement,[query, latitude, longitude, distance, offset], (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).json(results.rows)
      })
    }
    else{
      pool.query(statement,[query, latitude, longitude, distance, offset, types], (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).json(results.rows)
      })
    }
    */
  }

  
  async function queryEntries (request, response) {
  var {latitude, longitude, valoration, query1, query2, query3, rating1 , rating2 , rating3 , price1, price2, price3, allergens1, allergens2, allergens3} = request.headers;
    console.log(latitude)
    console.log(longitude)
    console.log(valoration)
    console.log(query1)
    console.log(query2)
    console.log(query3)
    console.log(rating1)
    console.log(rating2)
    console.log(rating3)
    console.log(price1)
    console.log(price2)
    console.log(price3)
    console.log(allergens1)
    console.log(allergens2)
    console.log(allergens3)
    
  if(query3 != ""){
    var statement = "select re.*, e.entry_id as id1, w.entry_id as id2, x.entry_id as id3, distance($1, $2, re.latitude, re.longitude) as distance from menuentry e left join restaurant re on re.restaurant_id = e.restaurant_id left join menuentry w on w.restaurant_id = e.restaurant_id left join menuentry x on x.restaurant_id = e.restaurant_id left join rating r on r.entry_id = e.entry_id left join rating v on v.entry_id = w.entry_id left join rating y on y.entry_id = x.entry_id where $6=$6 and $7=$7 and $8=$8 and to_tsvector('simple', e.name) @@ to_tsquery('simple', $3) and to_tsvector('simple', w.name) @@ to_tsquery('simple', $4) and to_tsvector('simple', x.name) @@ to_tsquery('simple', $5) and (e.allergens && $12::text[] = False) and (w.allergens && $13::text[] = False) and (x.allergens && $14::text[] = False) and e.price <= $9 and w.price <= $10 and x.price <= $11 group by e.entry_id, re.restaurant_id, w.entry_id, x.entry_id having AVG(r.rating) > $6::real and AVG(v.rating) > $7::real and AVG(y.rating) > $8::real order by distance($1, $2, re.latitude, re.longitude) asc limit 12;"

    if(valoration == "Sort by price lower first"){
      statement = statement.replace("order by distance($1, $2, re.latitude, re.longitude) asc", "order by case when (e.price + w.price + x.price) != 0 then (e.price + w.price + x.price) end asc, case when (e.price + w.price + x.price) = 0 then (e.price + w.price + x.price) end desc")
    }
    else if(valoration == "Sort by relevance"){
      statement = statement.replace("order by distance($1, $2, re.latitude, re.longitude) asc", "order by (count(r) + count(v)  + count(y)) desc")
    }

    if(rating1 == "0.0" && rating2 == "0.0" && rating3 == "0.0"){
      statement = statement.replace("having AVG(r.rating) > $6::real and AVG(v.rating) > $7::real and AVG(y.rating) > $8::real", "")
    }
    if(rating1 == "0.0"){
      statement = statement.replace("AVG(r.rating) > $6::real and", "")
    }
    if(rating2 == "0.0"){
      statement = statement.replace("AVG(v.rating) > $7::real and", "")
    }
    if(rating3 == "0.0"){
      statement = statement.replace("AVG(y.rating) > $8::real", "")
    }

    if(price1 == "0.0"){
      statement = statement.replace("e.price <= $9 and", "$9=$9 and ")
    }
    if(price2 == "0.0"){
      statement = statement.replace("w.price <= $10 and", "$10=$10 and ")
    }
    if(price3 == "0.0"){
      statement = statement.replace("and x.price <= $11", " and $11=$11")
    }

    if(allergens1 == "{}"){
      statement = statement.replace("(e.allergens && $12::text[] = False) and", "$12=$12 and ")
    }
    if(allergens2 == "{}"){
      statement = statement.replace("(w.allergens && $12::text[] = False) and", "$13=$13 and ")
    }
    if(allergens3 == "{}"){
      statement = statement.replace("(x.allergens && $12::text[] = False) and", "$14=$14 and ")
    }
  }
  else if(query2 != ""){
    var statement = "select re.*, e.entry_id as id1, w.entry_id as id2, distance($1, $2, re.latitude, re.longitude) as distance from menuentry e left join restaurant re on re.restaurant_id = e.restaurant_id left join menuentry w on w.restaurant_id = e.restaurant_id left join rating r on r.entry_id = e.entry_id left join rating v on v.entry_id = w.entry_id where $6=$6 and $7=$7 and to_tsvector('simple', e.name) @@ to_tsquery('simple', $3) and to_tsvector('simple', w.name) @@ to_tsquery('simple', $4) and (e.allergens && $12::text[] = False) and (w.allergens && $13::text[] = False) and e.price <= $9 and w.price <= $10 and ($5=$5 and $8=$8 and $11=$11 and $14=$14) group by e.entry_id, re.restaurant_id, w.entry_id having AVG(r.rating) > $6::real and AVG(v.rating) > $7::real order by distance($1, $2, re.latitude, re.longitude) asc limit 12;"

    if(valoration == "Sort by price lower first"){
      statement = statement.replace("order by distance($1, $2, re.latitude, re.longitude) asc", "order by case when (e.price + w.price) != 0 then (e.price + w.price) end asc, case when (e.price + w.price) = 0 then (e.price + w.price) end desc")
    }
    else if(valoration == "Sort by relevance"){
      statement = statement.replace("order by distance($1, $2, re.latitude, re.longitude) asc", "order by (count(r) + count(v)) desc")
    } 

    if(rating1 == "0.0" && rating2 == "0.0"){
      statement = statement.replace("having AVG(r.rating) > $6::real and AVG(v.rating) > $7::real ", "")
    }
    if(rating1 == "0.0"){
      statement = statement.replace("AVG(r.rating) > $6::real and", "")
    }
    if(rating2 == "0.0"){
      statement = statement.replace("AVG(v.rating) > $7::real", "")
    }

    if(price1 == "0.0"){
      statement = statement.replace("e.price <= $9 and", "$9=$9 and ")
    }
    if(price2 == "0.0"){
      statement = statement.replace("w.price <= $10 and", "$10=$10 and ")
    }

    if(allergens1 == "{}"){
      statement = statement.replace("(e.allergens && $12::text[] = False) and", "$12=$12 and ")
    }
    if(allergens2 == "{}"){
      statement = statement.replace("(w.allergens && $12::text[] = False) and", "$13=$13 and ")
    }
  }
  else{
    var statement = "select re.*, e.entry_id as id1, distance($1, $2, re.latitude, re.longitude) as distance from menuentry e left join restaurant re on re.restaurant_id = e.restaurant_id left join rating r on r.entry_id = e.entry_id where $6=$6 and to_tsvector('simple', e.name) @@ to_tsquery('simple', $3) and (e.allergens && $12::text[] = False) and e.price <= $9 and ($4=$4 and $5=$5 and $7=$7 and $8=$8 and $10=$10 and $11=$11 and $13=$13 and $14=$14) group by e.entry_id, re.restaurant_id having AVG(r.rating) > $6::real order by distance($1, $2, re.latitude, re.longitude) asc limit 15;"

    if(valoration == "Sort by price lower first"){
      statement = statement.replace("order by distance($1, $2, re.latitude, re.longitude) asc", "order by case when e.price != 0 then e.price end asc, case when e.price = 0 then e.price end desc")
    }
    else if(valoration == "Sort by relevance"){
      statement = statement.replace("order by distance($1, $2, re.latitude, re.longitude) asc", "order by count(r) desc")
    } 

    if(rating1 == "0.0"){
      statement = statement.replace("having AVG(r.rating) > $6::real", "")
    }
    if(price1 == "0.0"){
      statement = statement.replace("e.price <= $9 and", "$9=$9 and ")
    }
    if(allergens1 == "{}"){
      statement = statement.replace("(e.allergens && $12::text[] = False) and", "$12=$12 and ")
    }
  }

  stop_words = ['a', 'al', 'con', 'de', 'del', 'e', 'el', 'en', 'la', 'las', 'lo', 'los', 'y', 'an', 'and', 'the', 'of', 'with', 'in', 'on']
  var select
  try {
    select = await pool.query(statement,[latitude, longitude, query1, query2, query3, rating1 , rating2 , rating3 , price1, price2, price3, allergens1, allergens2, allergens3])
  } catch (err) {
    console.log(err.stack)
  }
  var results = select.rows
  console.log(query1)
  var count = 0;
  for(var i in results) {
    count++;
  }
  if(count < 15){
    var queryVector1 = query1.split(" ")
    var finalQuery1 = ""
    if(queryVector1.length > 2){
      for(var i in queryVector1) {
        word = queryVector1[i]
        wordClean = word.replace(":*", "").replace("&", "")
        if(stop_words.indexOf(wordClean) > -1){
          queryVector1.splice(queryVector1.indexOf(word),1)
        }
      }
      for(var i in queryVector1){
        if(i == 0){
          finalQuery1 = finalQuery1 + " " + queryVector1[i].replace("&", "")
        }
        else{
          finalQuery1 = finalQuery1 + " " + queryVector1[i]
        } 
      }
      console.log(finalQuery1)
      try {
        select = await pool.query(statement,[latitude, longitude, finalQuery1, query2, query3, rating1 , rating2 , rating3 , price1, price2, price3, allergens1, allergens2, allergens3])
      } catch (err) {
        console.log(err.stack)
      }
      var results2 = select.rows
      results = results.concat(results2)
      var count = 0;
      for(var i in results) {
        count++;
      }
      if(count < 15){
        finalQuery1 = ""
        if(queryVector1.length < 3){
          for(var i in queryVector1){
            if(i == 0){
              word = queryVector1[i].replace("&", "")
            }
            else{
              word = queryVector1[i].replace("&", "|")
            }
            finalQuery1 = finalQuery1 + " " + word
          }
          console.log(finalQuery1)
          try {
            select = await pool.query(statement,[latitude, longitude, finalQuery1, query2, query3, rating1 , rating2 , rating3 , price1, price2, price3, allergens1, allergens2, allergens3])
          } catch (err) {
            console.log(err.stack)
          }
          var results2 = select.rows
          response.status(200).json(results.concat(results2)) 
        }
        else if (queryVector1.length == 3){
          for(var i in queryVector1){ 
            finalQuery1 += "("    
            var first = true; 
            for(var j in queryVector1){
              if(i != j){
                if(first){
                  finalQuery1 += queryVector1[j].replace("&", "")
                  first = false
                }
                else{
                  finalQuery1 += " " + queryVector1[j]
                }
              }
            }
            first = true
            if(i == queryVector1.length-1){
              finalQuery1 += ")" 
            } 
            else{
              finalQuery1 += ") | " 
            }
            
          }
          console.log(finalQuery1)
          try {
            select = await pool.query(statement,[latitude, longitude, finalQuery1, query2, query3, rating1 , rating2 , rating3 , price1, price2, price3, allergens1, allergens2, allergens3])
          } catch (err) {
            console.log(err.stack)
          }
          var results2 = select.rows
          response.status(200).json(results.concat(results2)) 
        }
        else{
          for(var i in queryVector1){ 
            finalQuery1 += "("    
            var first = true; 
            for(var j in queryVector1){
              if(i != j){
                if(first){
                  finalQuery1 += queryVector1[j].replace("&", "")
                  first = false
                }
                else{
                  finalQuery1 += " " + queryVector1[j]
                }
              }
            }
            first = true
            if(i == queryVector1.length-1){
              finalQuery1 += ")" 
            } 
            else{
              finalQuery1 += ") | " 
            }           
          }
          console.log(finalQuery1)
          try {
            select = await pool.query(statement,[latitude, longitude, finalQuery1, query2, query3, rating1 , rating2 , rating3 , price1, price2, price3, allergens1, allergens2, allergens3])
          } catch (err) {
            console.log(err.stack)
          }
          var results2 = select.rows
          var count = 0;
          for(var i in results) {
            count++;
          }
          if(count < 15){ //GRUPO 2
            finalQuery1 = ""
            for(var i = 0; i < queryVector1.length; i++){ 
              finalQuery1 += "("    
              var first = true; 
              for(var j = 0; j < queryVector1.length; j++){
                if(j != i && j != i+1){
                  if(first){
                    finalQuery1 += queryVector1[j].replace("&", "")
                    first = false
                  }
                  else{
                    finalQuery1 += " " + queryVector1[j]
                  }
                }
              }
              first = true
              if(i == queryVector1.length-1){
                finalQuery1 += ")" 
              } 
              else{
                finalQuery1 += ") | " 
              }           
            }
            console.log("nivel 2")
            console.log(finalQuery1)
            try {
              select = await pool.query(statement,[latitude, longitude, finalQuery1, query2, query3, rating1 , rating2 , rating3 , price1, price2, price3, allergens1, allergens2, allergens3])
            } catch (err) {
              console.log(err.stack)
            }
            var results2 = select.rows
            response.status(200).json(results.concat(results2)) 
          }
          else{
            response.status(200).json(results.concat(results2)) 
          }
        }
      }
      else{
        response.status(200).json(results) 
      }
    }
    else{
      finalQuery1 = ""
      for(var i in queryVector1){
        if(i == 0){
          word = queryVector1[i].replace("&", "")
        }
        else{
          word = queryVector1[i].replace("&", "|")
        }
        finalQuery1 = finalQuery1 + " " + word
      }
      console.log(finalQuery1)
      try {
        select = await pool.query(statement,[latitude, longitude, finalQuery1, query2, query3, rating1 , rating2 , rating3 , price1, price2, price3, allergens1, allergens2, allergens3])
      } catch (err) {
        console.log(err.stack)
      }
      var results2 = select.rows
      response.status(200).json(results.concat(results2)) 
    }
  }
  else{
    response.status(200).json(results) 
  } 
}


  module.exports={
      queryRestaurants,
      queryEntries
  }