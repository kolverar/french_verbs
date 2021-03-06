const express = require('express');
const router = express.Router();
const axios = require('axios');

let setDifference = require('/util/set_operations').setDifference
let arrayToJson = require('/util/array_to_json').arrayToJson
let repo_api = require('/util/urls').repo_api

const Vocabulary = require('/models/vocabulary');

// GET /todo  - Get list of verbs left to add to database
router.get('/', function (req, res) {

    axios.get(repo_api + "/vocabulary")
        .then(response => {

                // Github Repo Set
                githubRepoSet = new Set(response.data.map((item) => item.download_url))
                console.log("Github size:" + githubRepoSet.size)

                // Local API
                Vocabulary.find({}, {'_id': false, 'imageURL': true}).sort({nameUTF8: 1}).exec(function (err, data) {

                    if (err)
                        res.status(500).json({mensaje: "error!"})
                    else {
                        // Create array of imageURLs and convert it to a Set
                        dbVerbsSet = new Set(data.map((item) => item.imageURL))
                        console.log("Local size:" + dbVerbsSet.size)

                        // Get difference between githubRepoSet and dbVerbsSet and convert it to
                        console.log("Difference: ")
                        console.log(setDifference(githubRepoSet, dbVerbsSet))
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