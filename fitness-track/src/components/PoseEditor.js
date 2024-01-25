import React, { useEffect, useState } from 'react';

function PoseEditor({poseCoordinates}) {
    useEffect(() => {
        // console.log(poseCoordinates);
    })

    return(
        <div className='pose-editor'>
            <div className='pose-editor__title'>Generated Movement</div>
            <div className='pose-editor__pose-video'>

            </div>
        </div>
    );
}

export default PoseEditor;