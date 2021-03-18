const compression = require('compression');
const express = require("express");
const path = require('path');
const bodyParser = require('body-parser');
const axios = require('axios');
const fs = require('fs');

var urlencodedParser = bodyParser.urlencoded({ extended: false });
var router = express();

// router.use(bodyParser({limit: '50mb'}));
router.use(compression());
router.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }))
router.use(express.static(path.resolve(__dirname, 'public')));

router.post('/submit', urlencodedParser, function(req, res) {
    var image_data = req.body.image_data;
    console.log('base64 length: ' + image_data.length);
    fs.writeFile('capture.jpg', image_data.replace(/^data:image\/jpeg;base64,/, ""), 'base64', function (err) {
        console.log(err);
    });

    axios.post('https://classify.hopto.org', {
        image_data: image_data
    }).then((response) => {
        console.log(response.data);
        res.json({'image received': true});
    }, (error) => {
        console.log(error);
    });
})

var server = router.listen(3000, "0.0.0.0", function() {
    console.table(server.address());
})
