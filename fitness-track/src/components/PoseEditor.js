import React, { useEffect, useRef } from 'react';
import { PoseLandmarker, DrawingUtils } from '@mediapipe/tasks-vision';

function PoseEditor({poseCoordinates}) {
    const canvasRef = useRef(null);
    let ctx;
    let drawingUtils;
    let index = 0;

    const calculateAngleThreePoints = (A, B, C) => {
        const angleAB = Math.atan2(B.y - A.y, B.x - A.x);
        const angleBC = Math.atan2(C.y - B.y, C.x - B.x);
    
        let angle = angleBC - angleAB;
    
        angle = (angle >= 0) ? angle : (2 * Math.PI + angle);
        angle = angle * (180 / Math.PI);
    
        return angle;
    }

    const calculateSetOfAngles = (pose) => {
        let anglesArray = [];
        anglesArray.push(calculateAngleThreePoints(pose.landmarks[0][0], pose.landmarks[0][11], pose.landmarks[0][12]));
        anglesArray.push(calculateAngleThreePoints(pose.landmarks[0][13], pose.landmarks[0][11], pose.landmarks[0][23]));
        anglesArray.push(calculateAngleThreePoints(pose.landmarks[0][15], pose.landmarks[0][13], pose.landmarks[0][11]));
        anglesArray.push(calculateAngleThreePoints(pose.landmarks[0][14], pose.landmarks[0][12], pose.landmarks[0][24]));
        anglesArray.push(calculateAngleThreePoints(pose.landmarks[0][12], pose.landmarks[0][14], pose.landmarks[0][16]));
        anglesArray.push(calculateAngleThreePoints(pose.landmarks[0][11], pose.landmarks[0][23], pose.landmarks[0][25]));
        anglesArray.push(calculateAngleThreePoints(pose.landmarks[0][12], pose.landmarks[0][24], pose.landmarks[0][26]));
        anglesArray.push(calculateAngleThreePoints(pose.landmarks[0][23], pose.landmarks[0][25], pose.landmarks[0][27]));
        anglesArray.push(calculateAngleThreePoints(pose.landmarks[0][24], pose.landmarks[0][26], pose.landmarks[0][28]));
        anglesArray.push(calculateAngleThreePoints(pose.landmarks[0][25], pose.landmarks[0][23], pose.landmarks[0][24]));
        anglesArray.push(calculateAngleThreePoints(pose.landmarks[0][23], pose.landmarks[0][24], pose.landmarks[0][26]));
        anglesArray.push(calculateAngleThreePoints(pose.landmarks[0][11], pose.landmarks[0][23], pose.landmarks[0][25]));
        anglesArray.push(calculateAngleThreePoints(pose.landmarks[0][12], pose.landmarks[0][24], pose.landmarks[0][26]));
        return anglesArray;
    }

    useEffect(() => {
        ctx = canvasRef.current.getContext("2d");
        drawingUtils = new DrawingUtils(ctx);
        console.log(poseCoordinates);
        drawPose();
    })

    const handleSaveExercise = () => {
        let tempAnglesArray =[];

        poseCoordinates.forEach(pose => {
            tempAnglesArray.push(calculateSetOfAngles(pose));
            //landmarks[0][point]
        })
        console.log(tempAnglesArray);
        localStorage.setItem('exercise', tempAnglesArray);
    }

    const drawPose = () => {
        const landmarks = poseCoordinates[index].landmarks;
        for (const landmark of landmarks) {
            
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            drawingUtils.drawLandmarks(landmark, {
                radius: (data) => DrawingUtils.lerp(data.from.z, -0.15, 0.1, 5, 1)
            });
            drawingUtils.drawConnectors(landmark, PoseLandmarker.POSE_CONNECTIONS);
        }
        if(index === poseCoordinates.length - 1){
            index = 0;
        }
        else{
            index++;
        }
        setTimeout(drawPose, 250);
    }

    return(
        <>
            <div className='pose-editor'>
                <div className='pose-editor__title'>Generated Movement</div>
                <div className='pose-editor__pose-video'>
                    <canvas width="200" height="200" ref={canvasRef}></canvas>
                </div>
            </div>
            <div className='pose-editor__save'>
                <button onClick={handleSaveExercise}>Save exercise</button>
            </div>
        </>
    );
}

export default PoseEditor;