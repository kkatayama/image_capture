# image_capture
A NodeJS App that captures an image from a device's camera and delivers it to another web server.
> Successfully Tested on Android, Iphone, and Macbook Pro
* IOS 14 - Safari
* Android 11 - Chrome, Opera, Firefox
* BigSur - Opera, Chrome, Safari, Firefox

## Demo
> `Take a picture` - freeze the video stream, take a screenshot and render the base64 image.
> `Submit picture` - send the base64 string of the image to another web server for decoding and file extraction.

<p align="center">
    <img src="https://raw.githubusercontent.com/kkatayama/image_capture/main/public/demo.gif">
</p>

## Running

```bash 
git clone https://github.com/kkatayama/image_capture.git

cd image_capture

npm init

npm start
```

Live server is running at [https://capture.hopto.org](https://capture.hopto.org)

## Notes
* When the `Submit picture` button is pressed, the base64 image data string is sent to the NodeJS by a jQuery POST request
* The NodeJS server decodes the images to a locally stored capture.jpg file for testing purposes
* Once the NodeJS server receives the base64 image data, the server then sends the data to a PHP server via a POST request to [https://classify.hopto.org](https://classify.hopto.org)
* Source code for the PHP server is located at: [https://github.com/kkatayama/classify_image](https://github.com/kkatayama/classify_image)


## Sources
#### server.js

``` javascript
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
        res.json({status: 200, data: 'image received'});
    }, (error) => {
        console.log(error);
    });
})

var server = router.listen(3000, "0.0.0.0", function() {
    console.table(server.address());
})
```

#### public/index.html
``` html
<!DOCTYPE html>
<html lang=”en”>
	<head>
		<meta charset="utf-8">
		<meta http-equiv="x-ua-compatible" content="ie=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

		<!-- Name of the app -->
		<title>Camera App</title>

		<!-- Link to main style sheet -->
		<link rel="stylesheet" href="style.css">
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
	</head>
	<body>

		<!-- Camera -->
		<main id="camera">

			<!-- Camera sensor -->
			<canvas id="camera_sensor"></canvas>

			<!-- Camera view -->
			<video id="camera_view" autoplay playsinline></video>

			<!-- Camera output -->
			<img src="//:0" alt="" id="camera_output">

			<!-- Camera trigger -->
			<button id="camera_trigger">Take a picture</button>

			<!-- Submit Image trigger -->
			<button id="image_trigger" style="display: none;">Submit picture</button>

			<!-- Submitted Button Response -->
			<button id="submitted" style="display: none;">Submitted</button>
		</main>

		<!-- Reference to your JavaScript file -->
		<script src="app.js"></script>
	</body>
</html>
```

#### public/app.js
``` javascript
// Set constraints for the video stream
var constraints = { video: { facingMode: "environment" }, audio: false };
var track = null;

// Define constants
const cameraView = document.querySelector("#camera_view");
const cameraOutput = document.querySelector("#camera_output");
const cameraSensor = document.querySelector("#camera_sensor");
const cameraTrigger = document.querySelector("#camera_trigger");

// Access the device camera and stream to cameraView
function cameraStart() {
    navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function(stream) {
            track = stream.getTracks()[0];
            cameraView.srcObject = stream;
        })
        .catch(function(error) {
            console.error("Oops. Something is broken.", error);
        });
}

// Take a picture when cameraTrigger is tapped
cameraTrigger.onclick = function() {
    cameraSensor.width = cameraView.videoWidth;
    cameraSensor.height = cameraView.videoHeight;
    cameraSensor.getContext("2d").drawImage(cameraView, 0, 0);
    // cameraOutput.src = cameraSensor.toDataURL("image/webp");
    cameraOutput.src = cameraSensor.toDataURL("image/jpeg", 1.0);
    cameraOutput.classList.add("taken");
    // track.stop();

};

// Start the video stream when the window loads
window.addEventListener("load", cameraStart, false);


/* TESTING SUBMIT THE SELECTED IMAGE */
$(document).ready(function() {
    var cameraTriggerBtn = $("#camera_trigger");
    var cameraOutputData = $("#camera_output");
    var imageTriggerBtn = $("#image_trigger")
    var submittedBtn = $("#submitted");

    cameraTriggerBtn.click(function () {
        imageTriggerBtn.show();
    });

    imageTriggerBtn.click(function () {
        $.post("/submit", {
            image_data: cameraOutputData.prop('src')
        }, function(data, status) {
            //imageTriggerBtn.hide();
            submittedBtn.show().delay(500).fadeOut();
            console.table(status);
            console.table(data);
        });
    });

});
```

#### public/style.css

``` css
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}

#camera, #camera_view, #camera_sensor, #camera_output{
    position: fixed;
    height: 100%;
    width: 100%;
    object-fit: cover;
}

#camera_trigger {
    width: 200px;
    background-color: black;
    color: white;
    font-size: 16px;
    border-radius: 30px;
    border: none;
    padding: 15px 20px;
    text-align: center;
    box-shadow: 0 5px 10px 0 rgba(0,0,0,0.2);
    position: fixed;
    bottom: 30px;
    left: calc(50% - 100px);
}

#image_trigger {
    width: 200px;
    background-color: white;
    color: black;
    font-size: 16px;
    border-radius: 30px;
    border: none;
    padding: 15px 20px;
    text-align: center;
    box-shadow: 0 5px 10px 0 rgba(0,0,0,0.2);
    position: fixed;
    top: 150px;
    right: 20px;
}


.taken {
    height: 100px!important;
    width: 100px!important;
    transition: all 0.5s ease-in;
    border: solid 3px white;
    box-shadow: 0 5px 10px 0 rgba(0,0,0,0.2);
    top: 20px;
    right: 60px;
    z-index: 2;
}

#submitted {
    width: 200px;
    background-color: lime;
    color: black;
    font-size: 16px;
    border-radius: 30px;
    border: none;
    padding: 15px 20px;
    text-align: center;
    box-shadow: 0 5px 10px 0 rgba(0,0,0,0.2);
    position: fixed;
    top: 150px;
    right: 20px;
}
```
