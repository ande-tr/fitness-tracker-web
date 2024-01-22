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