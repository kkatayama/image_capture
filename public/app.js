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


