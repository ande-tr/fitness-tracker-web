import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import Webcam from 'react-webcam';
import '@tensorflow/tfjs';
import * as posenet from '@tensorflow-models/posenet';


function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  let ctx;

  let previousEstTreshold = 5; // starting value
  let keypointMinConfidence = 0.85;

  const flipHorizontal = true;
  const imageScaleFactor = 0.75;
  const outputStride = 32;

  let previousEstX = [];
  let previousEstY = [];

  for(let i = 0; i < 17; i++){
      previousEstX.push([]);
      previousEstY.push([]);
  }

  let openTracking = true;
  let poses = [];

  let model = null;
  let video = null;

  const loadPosenet = async () => {
    await posenet.load({
      architecture: 'ResNet50',
      outputStride: 32,
      inputResolution: { width: 257, height: 200 },
      quantBytes: 2
    }).then((result) => {
        model = result;
        console.log(model);
        setupCamera(model);
        console.log("Model loaded!");
    });
  }

  loadPosenet();

  const setupCamera = async (modelVal) => {
    console.log(model);
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {

      ctx = canvasRef.current.getContext("2d");

      video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      updateTracker();
    }
    else{
      console.log("Some value is undefined");
    }
  };

  const drawKeypoint = (keypoint) => {
    if(keypoint.score >= keypointMinConfidence){
        ctx.beginPath();
        ctx.arc(keypoint.position.x, keypoint.position.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = 'red';
        ctx.fill();
        ctx.closePath();
    }
  }

  const calculateKeypointAverage = (keypoint, index) => {
    if(previousEstX[index].length === previousEstTreshold){
        previousEstX[index].shift();
    }
    if(previousEstY[index].length === previousEstTreshold){
        previousEstY[index].shift();
    }

    let tempHolderX = [];
    tempHolderX = previousEstX[index];
    tempHolderX.push(keypoint.position.x);
    previousEstX[index] = tempHolderX;

    let tempHolderY = [];
    tempHolderY = previousEstY[index];
    tempHolderY.push(keypoint.position.y);
    previousEstY[index] = tempHolderY;

    const tempX = calculateAverageOfArray(previousEstX[index]);
    const tempY = calculateAverageOfArray(previousEstY[index]);

    return {
        position:{
            x: tempX,
            y: tempY
        },
        score: keypoint.score
    }
  }

  const calculateAverageOfArray = (arr) => {
    return arr.reduce((sum, element, index) => sum + (element - sum) / (index + 1), 0);
  }

  const updateTracker = async () => {
    const poses = await model.estimateSinglePose(webcamRef.current.video);

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    poses.keypoints.forEach((keypoint, index) => {
      const keypointObj = calculateKeypointAverage(keypoint, index);
      drawKeypoint(keypointObj);
    });

    requestAnimationFrame(updateTracker);
  }

  return (
    <div className="App">
      <Webcam
          ref={webcamRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480
          }}
        />
        <canvas
          ref={canvasRef}
          width="640"
          height="480"
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480
          }}
        />
    </div>
  );
}

export default App;
