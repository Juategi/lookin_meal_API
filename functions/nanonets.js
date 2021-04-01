const pool = require("./mypool").pool
const multer = require('multer');
const upload = multer();
var fs = require('fs');
var req = require('request')
var querystring = require('querystring')

const sendFile = (request, response) => {
    const {restaurant_id, user_id, file} = request.body
    //fs.writeFileSync(restaurant_id+".pdf", file.toString('utf8'))
    const form_data = {
        //file: fs.createReadStream('CARTALOTELITO.pdf'),
        file : file
    }
    
    const options = {
        url : "https://app.nanonets.com/api/v2/OCR/Model/92368006-2d25-4b9e-a188-17c5b837b0a2/LabelFile/",
        formData: form_data,
        headers: {
            'Authorization' : 'Basic ' + Buffer.from('1Np9aBp8m9j8WCnN6reOjZTpaRD96eF-' + ':').toString('base64')
        }
    }

    req.post(options, function(err, httpResponse, body) {
        //console.log(body)
        response.status(201).send(body)
    });

}

module.exports = {
    sendFile,
}