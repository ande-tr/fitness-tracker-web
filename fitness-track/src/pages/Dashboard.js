import React, { useEffect, useState, useRef } from 'react';
import Webcam from 'react-webcam';
import { FilesetResolver, PoseLandmarker, DrawingUtils } from '@mediapipe/tasks-vision';

function Dashboard(){
    let previousEstTreshold = 5; // starting value
    let keypointMinConfidence = 0.9;

    let previousEstX = [];
    let previousEstY = [];
  
    for(let i = 0; i < 17; i++){
        previousEstX.push([]);
        previousEstY.push([]);
    }

    const lastExercise = localStorage.getItem("lastExercise");
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);

    let poseLandmarker;
    let lastVideoTime = -1;

    let ctx;
    let drawingUtils;

    let video = null;

    const setupPrediction = async () => {
        const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm");

        poseLandmarker = await PoseLandmarker.createFromOptions(
            vision,
            {
                baseOptions: {
                    modelAssetPath: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task"
                    //pose_landmarker/pose_landmarker_heavy/float16/1/pose_landmarker_heavy.task<
                    // modelAssetPath: "../models/pose_landmarker_heavy.task"
                    // modelAssetPath: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/latest/pose_landmarker_full.task"
                },
                runningMode: "VIDEO"
        });

        if (
          typeof webcamRef.current !== "undefined" &&
          webcamRef.current !== null &&
          webcamRef.current.video.readyState === 4
        ) {
    
          ctx = canvasRef.current.getContext("2d");
          drawingUtils = new DrawingUtils(ctx);
    
          video = webcamRef.current.video;
          const videoWidth = webcamRef.current.video.videoWidth;
          const videoHeight = webcamRef.current.video.videoHeight;
    
          webcamRef.current.video.width = videoWidth;
          webcamRef.current.video.height = videoHeight;

          trackPose();
        }
        else{
          console.log("Some value is undefined");
        }
    };

    useEffect(() => {
        setupPrediction();
    });

    // const calculateKeypointAverage = (keypoint, index) => {
    //     console.log(keypoint);
    //     console.log(index);

    //     if(previousEstX[index].length === previousEstTreshold){
    //         previousEstX[index].shift();
    //     }
    //     if(previousEstY[index].length === previousEstTreshold){
    //         previousEstY[index].shift();
    //     }
    
    //     let tempHolderX = [];
    //     tempHolderX = previousEstX[index];
    //     tempHolderX.push(keypoint.x);
    //     previousEstX[index] = tempHolderX;
    
    //     let tempHolderY = [];
    //     tempHolderY = previousEstY[index];
    //     tempHolderY.push(keypoint.y);
    //     previousEstY[index] = tempHolderY;
    
    //     const tempX = calculateAverageOfArray(previousEstX[index]);
    //     const tempY = calculateAverageOfArray(previousEstY[index]);
    
    //     return {
    //         position:{
    //             x: tempX,
    //             y: tempY
    //         }
    //     }
    //   }
    
    // const calculateAverageOfArray = (arr) => {
    //     return arr.reduce((sum, element, index) => sum + (element - sum) / (index + 1), 0);
    // }

    const trackPose = async () => {
        let startTimeMs = performance.now();
        
        if (lastVideoTime !== video.currentTime) {
            lastVideoTime = video.currentTime;
            poseLandmarker.detectForVideo(video, startTimeMs, (result) => {
                // console.log(result);
                ctx.save();
                ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

                for (const landmark of result.landmarks) {
                    // const keypointObj = calculateKeypointAverage(landmark, index);

                    // console.log(keypointObj);

                    drawingUtils.drawLandmarks(landmark, {
                        radius: (data) => DrawingUtils.lerp(data.from.z, -0.15, 0.1, 5, 1)
                    });
                    drawingUtils.drawConnectors(landmark, PoseLandmarker.POSE_CONNECTIONS);
                }
                ctx.restore();
            });
        }

        requestAnimationFrame(trackPose);
    }

    return (
        <div className='Dashboard'>
            <header>Dashboard</header>

            <div className="content-wrapper">
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
                {/* <div className="exercise-reminder">
                    You haven't exercised in ... days.
                </div> */}
                <div className="exercise-history">
                    { lastExercise === null ? 'You have no workout history. Head to Routines and exercise today.' : (
                        <div>
                            Exercise name
                            Exercise duration
                            Exercise calories burned
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;