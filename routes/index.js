var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    if(req.headers['authorization'])
        val = 'present';
    else
        val = 'absent';
    //val = 'present';
    res.render('index.html',{status:val});
});

module.exports = router;
