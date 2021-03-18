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
    <img src="https://raw.githubusercontent.com/kkatayama/image_capture/main/public/demo.gif" width="50%" height="50%">
</p>

## Running

```bash 
git clone https://github.com/kkatayama/image_capture.git

cd image_capture

npm init

npm start
```

Live server is running at [https://capture.hopto.org](https://capture.hopto.org)
