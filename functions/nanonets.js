const pool = require("./mypool").pool
var req = require('request')
var querystring = require('querystring')

const sendFile = (request, response) => {
    const {restaurant_id, user_id, file} = request.body
    
    const form_data = {
        urls: file,
    }

    const options = {
        url : "https://app.nanonets.com/api/v2/OCR/Model/92368006-2d25-4b9e-a188-17c5b837b0a2/LabelUrls/",
        body: querystring.stringify(form_data),
        headers: {
            'Authorization' : 'Basic ' + Buffer.from('1Np9aBp8m9j8WCnN6reOjZTpaRD96eF-' + ':').toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }


    req.post(options, function(err, httpResponse, body) {
        //console.log(err)
        if(err){
            response.status(201).send("BAD")
        }
        else{
            pool.query('INSERT INTO pdfrequest (restaurant_id, user_id) VALUES ($1, $2)',
            [restaurant_id, user_id], (error, results) => {
             if (error) {
               throw error
             }
             response.status(201).send("OK") 
            })
        }
        
    });
}

const checkRequest = (request, response) => {
    const {restaurant_id, user_id} = request.headers;
    pool.query(
      `SELECT * from pdfrequest where restaurant_id = $1 and user_id = $2`,[restaurant_id, user_id],
      (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).json(results.rows)
      }
    )
}


module.exports = {
    sendFile,
    checkRequest
}