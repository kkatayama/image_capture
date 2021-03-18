// Set constraints for the video stream
var constraints = { video: { facingMode: "environment" }, audio: false };
var track = null;

// Define constants
const cameraView = document.querySelector("#camera--view"),
    cameraOutput = document.querySelector("#camera--output"),
    cameraSensor = document.querySelector("#camera--sensor"),
    cameraTrigger = document.querySelector("#camera--trigger");

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



/* TESTING SEND THE SELECTED IMAGE */
$(document).ready(function() {
    var cameraTriggerBtn = $("#camera--trigger");
    var cameraOutputData = $("#camera--output");
    var imageTriggerBtn = $("#image--trigger")

    cameraTriggerBtn.click(function () {
        imageTriggerBtn.show();
    });

    imageTriggerBtn.click(function () {
        $.post("/submit", {
            image_data: cameraOutputData.prop('src')
        }, function(data, status) {
            console.table(status);
            console.table(data);
        });
    });

});


// const video = document.getElementById('video');
// const button = document.getElementById('button');
// const select = document.getElementById('select');
// let currentStream;

// function stopMediaTracks(stream) {
//   stream.getTracks().forEach(track => {
//     track.stop();
//   });
// }

// function gotDevices(mediaDevices) {
//   select.innerHTML = '';
//   select.appendChild(document.createElement('option'));
//   let count = 1;
//   mediaDevices.forEach(mediaDevice => {
//     if (mediaDevice.kind === 'videoinput') {
//       const option = document.createElement('option');
//       option.value = mediaDevice.deviceId;
//       const label = mediaDevice.label || `Camera ${count++}`;
//       const textNode = document.createTextNode(label);
//       option.appendChild(textNode);
//       select.appendChild(option);
//     }
//   });
// }

// button.addEventListener('click', event => {
//   if (typeof currentStream !== 'undefined') {
//     stopMediaTracks(currentStream);
//   }
//   const videoConstraints = {};
//   if (select.value === '') {
//     videoConstraints.facingMode = 'environment';
//   } else {
//     videoConstraints.deviceId = { exact: select.value };
//   }
//   const constraints = {
//     video: videoConstraints,
//     audio: false
//   };
//   navigator.mediaDevices
//     .getUserMedia(constraints)
//     .then(stream => {
//       currentStream = stream;
//       video.srcObject = stream;
//       return navigator.mediaDevices.enumerateDevices();
//     })
//     .then(gotDevices)
//     .catch(error => {
//       console.error(error);
//     });
// });

// navigator.mediaDevices.enumerateDevices().then(gotDevices);
