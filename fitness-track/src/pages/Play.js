import React, { useEffect, useState, useRef } from 'react';
import Webcam from 'react-webcam';
import Counter from '../components/Counter';
import { FilesetResolver, PoseLandmarker, DrawingUtils } from '@mediapipe/tasks-vision';
import { useParams } from 'react-router-dom';
import {calculateSetOfAngles} from '../helpers'


function Play(){
    const [userData, setUserData] = useState();
    const { exerciseName } = useParams();
    const [videoWidth, setVideoWidth] = useState(0);
    const [videoHeight, setvideoHeight] = useState(0);
    const [startCounter, setStartCounter] = useState(false);
    const [videoStream, setVideoStream] = useState();
    const [recordingStarted, setRecordingStarted] = useState(false);
    const [isExerciseFirstTime, setIsExerciseFirstTime] = useState(true);
    const [isTipClosed, setIsTipClosed] = useState(false);

    const reqPoseTrack = useRef();

    const exercises = JSON.parse(localStorage.getItem("exercises"));
    let exercise;
    let foundExercise;
    
    if (exercises && Array.isArray(exercises)) {
        foundExercise = exercises.find(ex => ex.name === exerciseName);
        if(!foundExercise){
            const exercises = JSON.parse(localStorage.getItem("routines"));
            foundExercise = exercises.find(ex => ex.name === exerciseName);
        }

        if (foundExercise) {
            exercise = Object.values(foundExercise);
            exercise = Object.values(exercise[1]);
            exercise = exercise[1];
            exercise = Object.values(exercise);
        
            console.log(exercise);

        } else {
            console.log("Exercise not found");
        }
    } else {
        console.log("No exercises found in localStorage");
    }

    const webcamRef = useRef(null);
    let poseLandmarker;
    let lastVideoTime = -1;
    let video = null;

    const maxPoseIndex = exercise.length;
    const possibleCorrectPoses = exercise.length;

    let currentPoseIndex = 0;
    let flagExerciseOver = false;
    let exerciseAccuracy = 0;
    let correctPoses = possibleCorrectPoses;
    let poseStartTimeReference = null;
    let elapsedTime = null;
    let lastPoseStatus = false;

    const setupPrediction = async () => {
        const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm");

        poseLandmarker = await PoseLandmarker.createFromOptions(
            vision,
            {
                baseOptions: {
                    // modelAssetPath: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/latest/pose_landmarker_full.task"
                    modelAssetPath: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task"
                    //pose_landmarker/pose_landmarker_heavy/float16/1/pose_landmarker_heavy.task<
                    // modelAssetPath: "../models/pose_landmarker_heavy.task"
                    // modelAssetPath: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/latest/pose_landmarker_full.task"
                },
                runningMode: "VIDEO"
        });
    };

    const setupCamera = () => {
        if (
            typeof webcamRef.current !== "undefined" &&
            webcamRef.current !== null &&
            webcamRef.current.video.readyState === 4
          ) {
          
            video = webcamRef.current.video;

            setVideoWidth(video.width);
            setvideoHeight(video.height);
            
            video.width = videoWidth;
            video.height = videoHeight;
            webcamRef.current.video.width = videoWidth;
            webcamRef.current.video.height = videoHeight;

            setVideoStream(video)
          }
          else{
            console.log("Some value is undefined");
          }
    }

    useEffect(() => {
        if(startCounter){
            setupPrediction();
        }
    }, [startCounter]);

    useEffect(() => {
        const storedUserData = JSON.parse(localStorage.getItem("userData"));
        if (storedUserData) {
            setUserData(storedUserData);
        }
    }, []);

    const startExercise = () => {
        console.log('Counter finished. Starting exercise.');
        if(isExerciseFirstTime){
            setIsExerciseFirstTime(false);
        }

        exerciseAccuracy = 0;
        correctPoses = possibleCorrectPoses;
        poseStartTimeReference = null;
        elapsedTime = null;
        lastPoseStatus = false;
        currentPoseIndex = 0;
        setStartCounter(false);
        setRecordingStarted(true);
        trackPose();
    }

    const handleExerciseFinish = () => {
        setStartCounter(false);
        setRecordingStarted(false);
        window.cancelAnimationFrame(reqPoseTrack.current);

        console.log('Exercise is finished.');

        if(currentPoseIndex !== maxPoseIndex){
            if(correctPoses + currentPoseIndex !== possibleCorrectPoses){
                correctPoses = possibleCorrectPoses - correctPoses - currentPoseIndex + 1;
            }
            else{
                correctPoses = possibleCorrectPoses - correctPoses - currentPoseIndex;
            }
        }

        exerciseAccuracy = Math.abs((correctPoses / possibleCorrectPoses) * 100).toFixed(2);
        console.log("Exercise accuracy: " + exerciseAccuracy + "%");
        
        setExerciseHistory();
    }

    const setExerciseHistory = () => {
        let calorieBurnRatePerHour = 270; // average calories burned for calisthenics for average person
        const millisecondsInHour = 3600000;
        const MET = 3; // avg for calisthenics
        const exerciseDuration = exercise[exercise.length - 1].timestamp - exercise[0].timestamp;
        const exerciseDurationInHours = exerciseDuration / millisecondsInHour;

        if(userData?.currentUserData?.weight){
            calorieBurnRatePerHour = ((3.5 * MET * userData?.currentUserData?.weight)/200) * 60;
        }

        const caloriesBurned = calorieBurnRatePerHour * exerciseDurationInHours;

        const historyDate = Date.now();
        const exerciseDone = {
            "date": historyDate,
            "name": exerciseName,
            "accuracy": exerciseAccuracy,
            "calories-burned": caloriesBurned
        }

        if (localStorage.getItem("history") === null) {
            const history = {
                [historyDate]: exerciseDone
            };

            localStorage.setItem("history", JSON.stringify(history));
        }
        else{
            const history = JSON.parse(localStorage.getItem("history"));
            history[historyDate] = exerciseDone;

            localStorage.setItem("history", JSON.stringify(history));
        }
    }


    const checkPoseMatch = (recordedAngles, correctAngles, threshold) => {
        let numberOfCorrectAngles = 13;

        for (let i = 0; i < recordedAngles.length; i++) {
            const recordedAngle = recordedAngles[i];
            const correctAngle = correctAngles[i];

            if (Math.abs(recordedAngle - correctAngle) > threshold) {
                numberOfCorrectAngles--;
            }
        }
        if(numberOfCorrectAngles < 8){
            return false;
        }
        else{
            console.log('Correct');
            return true;
        }
    };

    const trackPose = () => {
        if (!flagExerciseOver) {
            console.log('in function');
            console.log(currentPoseIndex);
    
            let startTimeMs = performance.now();
    
            if (videoStream) {
                if (!poseStartTimeReference) {
                    poseStartTimeReference = performance.now();
                }
    
                if (lastVideoTime !== videoStream.currentTime) {
                    lastVideoTime = videoStream.currentTime;
    
                    if (lastPoseStatus) {
                        poseStartTimeReference = performance.now();
                    }
    
                    if (elapsedTime >= 1) {
                        if (currentPoseIndex < maxPoseIndex - 1) {
                            elapsedTime = 0;
                            poseStartTimeReference = performance.now();
                            correctPoses--;
                            currentPoseIndex++;
                        } else {
                            flagExerciseOver = true;
                        }
                    }
    
                    poseLandmarker.detectForVideo(videoStream, startTimeMs, (pose) => {
                        let tempAnglesArray = [];
                        tempAnglesArray.push(calculateSetOfAngles(pose));
    
                        if (currentPoseIndex < maxPoseIndex) {
                            let matchResult = checkPoseMatch(tempAnglesArray[0], exercise[currentPoseIndex], 2);
    
                            if (matchResult) {
                                console.log('Correct');
                                if (currentPoseIndex < maxPoseIndex - 1) {
                                    currentPoseIndex++;
                                    lastPoseStatus = true;
                                    elapsedTime = 0;
                                } else {
                                    flagExerciseOver = true;
                                }
                            } else {
                                console.log('Wrong');
                                lastPoseStatus = false;
                            }
                        }
    
                        if (currentPoseIndex === maxPoseIndex) {
                            flagExerciseOver = true;
                        }
                    });
    
                    elapsedTime = (performance.now() - poseStartTimeReference) / 1000;
                }
            }
    
            reqPoseTrack.current = requestAnimationFrame(trackPose);
        } else {
            handleExerciseFinish();
        }
    }

    return (
        <>
            {!isTipClosed && (
                <div className='recording-tip'>
                    <div>
                        <div className='recording-tip__title'>Important Tip:</div>
                        <div className='recording-tip__message'>
                            For best results, position your camera on the floor, facing slightly upwards.
                        </div>
                        <button className='button recording-tip__close' onClick={() => {setIsTipClosed(true)}}>Close tip</button>
                    </div>
                </div>
            )}
            <header>{exerciseName}</header>

            {(!startCounter && !recordingStarted ) && (
                <div className='timer-placeholder'></div>
            )}

            {(startCounter || recordingStarted ) && (
                <Counter onTimerFinish={startExercise} />
            )}
            <div className='livefeed-wrapper'>
                <Webcam ref={webcamRef} className="webcam" onLoadedMetadata={setupCamera}/>
                <button className='button primary-button create-exercise__record-btn' onClick={() => {
                    if(!recordingStarted){
                        setStartCounter(true);
                    }
                    if(recordingStarted){
                        handleExerciseFinish();
                    }
                }}>
                    
                    {(!startCounter && !recordingStarted) && (
                        isExerciseFirstTime ? (
                            'Start exercise'
                        ):
                        ( 
                            'Restart exercise'
                        )
                    )}
                    {(startCounter && !recordingStarted) && (
                        '...'
                    )}
                    {(!startCounter && recordingStarted) && (
                        'Stop the exercise'
                    )}
                </button>
            </div>
        </>
    );
}

export default Play;