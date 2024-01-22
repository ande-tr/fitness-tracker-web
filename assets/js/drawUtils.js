const drawKeypoint = (keypoint) => {
    if(keypoint.score >= keypointMinConfidence){
        ctx.beginPath();
        ctx.arc(keypoint.position.x, keypoint.position.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = 'red';
        ctx.fill();
        ctx.closePath();
    }
}

// const drawKeypoint = (score, posX, posY) => {
//     if(score >= keypointMinConfidence){
//         ctx.beginPath();
//         ctx.arc(posX, posY, 5, 0, 2 * Math.PI);
//         ctx.fillStyle = 'red';
//         ctx.fill();
//         ctx.closePath();
//     }
// }