let trackerWrapper;
let video;
let canvas, ctx;
let net;

let keypointMinConfidence = 0.85;

const flipHorizontal = true;
const imageScaleFactor = 0.75;
const outputStride = 32;

const setupTracker = async () => {
    net = await posenet.load({
        architecture: 'ResNet50',
        outputStride: 32,
        inputResolution: { width: 257, height: 200 },
        quantBytes: 2
    });
    console.log('Model loaded!');
    updateTracker();
}

const setupCamera = async (width, height, fps) => {
    const constraints = {
        audio: false,
        video: {
            facingMode: "user",
            width: width,
            height: height,
            frameRate: { max: fps }
        }
    }

    video.width = width;
    video.height = height;

    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = stream;

    return new Promise(resolve => {
        video.onloadedmetadata = () => { resolve(video) }
    });
}

window.addEventListener('resize', () => {
    canvas.width = trackerWrapper.getBoundingClientRect().width;
    canvas.height = trackerWrapper.getBoundingClientRect().height;

    setupCamera(trackerWrapper.getBoundingClientRect().width, trackerWrapper.getBoundingClientRect().height, 30).then(video => {
        video.play();
        video.addEventListener("loadeddata", event => {
            console.log("Camera is ready");
            setupTracker();
        });
    });
});

window.addEventListener("DOMContentLoaded", () => { 
    trackerWrapper = document.querySelector('.livefeed');

    video = document.getElementById("pose-video");

    canvas = document.getElementById("pose-canvas");
    ctx = canvas.getContext("2d");

    canvas.width = trackerWrapper.getBoundingClientRect().width;
    canvas.height = trackerWrapper.getBoundingClientRect().height;

    setupCamera(trackerWrapper.getBoundingClientRect().width, trackerWrapper.getBoundingClientRect().height, 30).then(video => {
        video.play();
        video.addEventListener("loadeddata", event => {
            console.log("Camera is ready");
            setupTracker();
        });
    });
});