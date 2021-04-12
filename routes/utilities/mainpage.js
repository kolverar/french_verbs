var express = require('express');
var router = express.Router();

// GET / - Get mainpage of French verbs
router.get('/', function(req, res) {

    res.render('index', { title: 'Suffire | Verbes et vocabulaire française'});
});

module.exports = router;