//0-16 턱선
//17-21 왼쪽 눈썹
//22-26 오른쪽 눈썹
//27-35 코
//36-41 왼쪽눈
//42-47 오른쪽눈
//48-67 입

/**
 * 입술 좌표
 * @param {*} landmark 
 */
function getLipPositions(landmark){
    return landmark.slice(48,68);
}

/**
 * 윗입술 좌표
 * @param {*} landmark 
 */
function getTopLipPositions(landmark){
    let topLip = [0, 1, 2, 3, 4, 5, 6, 16, 15, 14, 13, 12];
    let lipPositions=getLipPositions(landmark)
    
    return topLip.map((ele, i) => {
        return { x: lipPositions[ele].x, y: lipPositions[ele].y }
    })
}

/**
 * 아랫입술 좌표
 * @param {*} landmark 
 */
function getBottomLipPositions(landmark){
    let bottomLip = [7, 8, 9, 10, 11, 12, 0, 19, 18, 17, 16, 6];
    let lipPositions=getLipPositions(landmark)


    return bottomLip.map((ele, i) => {
        return { x: lipPositions[ele].x, y: lipPositions[ele].y }
    })
}

/**
 * 윤곽선 좌표
 * @param {*} landmark 
 */
function getJawPositions(landmark){
    return landmark.slice(0,17);
}

/**
 * 왼쪽 눈썹
 * @param {*} landmark 
 */
function getLeftEyebrowPositions(landmark){
    return landmark.slice(17,22);
}

/**
 * 오른쪽 눈썹
 * @param {*} landmark 
 */
function getRightEyebrowPositions(landmark){
    return landmark.slice(22,27);
}

/**
 * 코 좌표
 * @param {*} landmark 
 */
function getNosePositions(landmark){
    return landmark.slice(27,36);
}

/**
 * 왼쪽 눈 좌표
 * @param {*} landmark 
 */
function getLeftEyePositions(landmark){
    return landmark.slice(36,42);
}

/**
 * 오른쪽 눈 좌표
 * @param {*} landmark 
 */
function getRightEyePositions(landmark){
    return landmark.slice(42,48);
}

export default {getRightEyePositions,getLeftEyePositions,getNosePositions,getRightEyebrowPositions,getLeftEyebrowPositions,getJawPositions, getBottomLipPositions, getTopLipPositions, getLipPositions}