import React, { useEffect, useRef } from 'react';
import { PoseLandmarker, DrawingUtils } from '@mediapipe/tasks-vision';

function PoseEditor({poseCoordinates}) {
    const canvasRef = useRef(null);
    let ctx;
    let drawingUtils;
    let index = 0;

    useEffect(() => {
        ctx = canvasRef.current.getContext("2d");
        drawingUtils = new DrawingUtils(ctx);

        drawPose();
    })

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
        <div className='pose-editor'>
            <div className='pose-editor__title'>Generated Movement</div>
            <div className='pose-editor__pose-video'>
                <canvas width="200" height="200" ref={canvasRef}></canvas>
            </div>
        </div>
    );
}

export default PoseEditor;