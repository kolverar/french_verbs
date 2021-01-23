const express = require('express');
const router = express.Router();
const axios = require('axios');

let setDifference = require('/util/set_operations').setDifference
let arrayToJson = require('/util/array_to_json').arrayToJson

const Verb = require('/models/verb');

// GET /todo  - Get list of verbs left to add to database
router.get('/', function (req, res) {

    axios.get("https://api.github.com/repos/kolverar/french_verbs/contents/public/images")
        .then(response =>{

                // Github Repo Set
                githubRepoSet = new Set(response.data.map((item) => item.download_url))

                // Local API
                Verb.find({},{'_id': false,'imageURL': true}).sort({nameUTF8: 1}).exec(function (err, data) {

                    if(err)
                        res.status(500).json({mensaje: "error!"})
                    else{
                        // Create array of imageURLs and convert it to a Set
                        dbVerbsSet = new Set(data.map((item) => item.imageURL))

                        // Get difference between githubRepoSet and dbVerbsSet and convert it to JSON
                        jsonDifference = arrayToJson(Array.from(setDifference(githubRepoSet, dbVerbsSet)))

                        res.status(200).json(jsonDifference)
                    }
                });

            }
        )
        .catch(error => {
            res.status(200).json({message: "Can't get info from repo!"})
        })
})

module.exports = router;