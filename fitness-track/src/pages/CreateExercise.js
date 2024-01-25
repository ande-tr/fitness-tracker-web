import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { FilesetResolver, PoseLandmarker } from '@mediapipe/tasks-vision';
import Counter from '../components/Counter';
import SnapshotGallery from '../components/SnapshotGallery';
import PoseEditor from '../components/PoseEditor';

function CreateExercise(){
    const [poseSnapshots, setPoseSnapshots] = useState([]);
    let recordingStarted = false;
    const snapshotInterval = useRef();
    let maxSnapshots = 10;
    let startCounter = false;
    let videoWidth, videoHeight;

    const handleRecordingStart = () => {
        recordingStarted = true;
        console.log('Recording started');
        snapshotInterval.current = setInterval(() => {
                snapshotPose();
        }, 250);
    };

    const handleRecordingStop = () => {
        recordingStarted = false;
        window.clearInterval(snapshotInterval.current);
        console.log('Recording stopped');
    };

    const webcamRef = useRef(null);

    let poseLandmarker;
    let lastVideoTime = -1;
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
        

          video = webcamRef.current.video;
          videoWidth = video.width;
          videoHeight = video.height;
          
          if(window.innerHeight >= window.innerWidth || window.matchMedia("(orientation: portrait)").matches){
            videoWidth = document.querySelector('.livefeed-wrapper').getBoundingClientRect().width;
            videoHeight = videoWidth;
          }
          else{
            videoHeight = document.querySelector('.livefeed-wrapper').getBoundingClientRect().height;
            videoWidth = videoHeight;
          }
          video.width = videoWidth;
          video.height = videoHeight;
          webcamRef.current.video.width = videoWidth;
          webcamRef.current.video.height = videoHeight;

        }
        else{
          console.log("Some value is undefined");
        }
    };

    useEffect(() => {
        setupPrediction();
    }, [webcamRef]);

    useEffect(() => {
        if(poseSnapshots.length >= maxSnapshots){
            handleRecordingStop();
        }
    }, [poseSnapshots]);

    const snapshotPose = () => {
        let startTimeMs = performance.now();

        if(video){
            if (lastVideoTime !== video.currentTime) {
                lastVideoTime = video.currentTime;

                poseLandmarker.detectForVideo(video, startTimeMs, (result) => {
                    const snapshot = {
                        screenshot: webcamRef.current.getScreenshot(),
                        landmarks: result.landmarks,
                        timestamp: Date.now(),
                    };

                    // let tempArr = [...poseSnapshots];
                    // tempArr.push(snapshot);

                    setPoseSnapshots(prevSnapshots => [...prevSnapshots, snapshot]);
                    // console.log(poseSnapshots.length);
                });
            }
        }
    }

    return (
        <div>
            <header>Create Exercise</header>

            <div className='livefeed-wrapper'>
                <Webcam ref={webcamRef} className="webcam" />
            </div>

            <Counter onTimerFinish={handleRecordingStart} />

            {(poseSnapshots.length >= maxSnapshots) && (
                <PoseEditor poseCoordinates={poseSnapshots} />
            )}

            <SnapshotGallery poses={poseSnapshots} />
        </div>
    );
}

export default CreateExercise;