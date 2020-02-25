import { drawLip, drawCloseLip, drawImg2Canvas } from '../../util/draw.js';
import getlandmark from '../../util/landmark';

import Sobel from 'sobel';
//입술의 위치를 잡는 함수
function getLipsPosition(landmarks) {
    return {
        topLip: getlandmark.getTopLipPositions(landmarks),
        bottomLip:getlandmark.getBottomLipPositions(landmarks),
    }
}
function getPositionFineTunning2(canvas, landmarks) {
    var ctx = canvas.getContext('2d');
    //1차적으로 딥러닝으로 학습된 위치가 기본
    //경계선을 찾아내고, 각 포인트에서 위치를 조정하는 방식.
    //삐져 나온것을 내부로 이동하기
    let edge = 40;
    let lipPositions = getlandmark.getLipPositions(landmarks);
    let lipTopPositions = getlandmark.getTopLipPositions(landmarks);
    let lipBottomPositions = getlandmark.getBottomLipPositions(landmarks);

    let jawPositions = getlandmark.getJawPositions(landmarks);
    let nosePositions = getlandmark.getNosePositions(landmarks);


    let leftMouthCorner = lipPositions[0];
    let rightMouthCorner = lipPositions[6];

    let m = (leftMouthCorner.y - rightMouthCorner.y) / (leftMouthCorner.x - rightMouthCorner.x)   //입꼬리 기울기

    let leftTopX = (jawPositions[4].x + leftMouthCorner.x) / 2;
    let leftTopY = ((lipPositions[2].y > lipPositions[4].y ? lipPositions[4].y : lipPositions[2].y) + landmarks[33].y) / 2
    let width = (rightMouthCorner.x + jawPositions[12].x) / 2 - leftTopX;
    let height = (lipPositions[9].y + jawPositions[8].y) / 2 - (nosePositions[6].y + lipPositions[2].y) / 2;
    const imageData = ctx.getImageData(leftTopX, leftTopY, width, height);

    //edge 탐색 - sobel로 경계선 탐색
    var sobelData = Sobel(imageData);

    let sobelGrayData = [];
    for (let i = 0; i < sobelData.length; i += 4) {//0일 수록 어둡다
        let avg = (sobelData[i] + sobelData[i + 1] + sobelData[i + 2]) / 3;
        sobelData[i] = avg; // red
        sobelData[i + 1] = avg; // green
        sobelData[i + 2] = avg; // blue
        sobelGrayData.push(avg)
    }
    var sobelData2D = [];
    for (let i = 0; i < sobelGrayData.length; i += Math.floor(width)) {
        sobelData2D.push(sobelGrayData.slice(i, i + Math.floor(width)));
    }
    //sobel 출력
    // var sobelImageData = sobelData.toImageData();
    // ctx.putImageData(sobelImageData, leftTopX, leftTopY);


    //각자 좌표별로 확인
    let isEdge = [];
    for (let i = 0; i < 20; i++) {
        let x = Math.floor(lipPositions[i].x - leftTopX);
        let y = Math.floor(lipPositions[i].y - leftTopY);
        let tmp = sobelData2D[y][x]
        isEdge.push(tmp)
    }

    //윗입술(49,50,51,52,53) 위아래로 이동
    // 61,62,63 - 내부
    //아랫입술(55,56,57,58,59) 위아래로 이동
    // 67,66,65 - 내부

    let positions = {
        topLip: lipTopPositions.map((ele, i) => {
            if (i > 0 && i < 6) {
                let tmp = pointFineTuningDown(sobelData2D, Math.floor(ele.x - leftTopX), Math.floor(ele.y - leftTopY), edge)
                return { x: tmp[0] + leftTopX, y: tmp[1] + leftTopY }
            }
            return { x: ele.x, y: ele.y }
        }),
        bottomLip: lipBottomPositions.map((ele, i) => {
            // if(ele>6&&ele<12) {
            if (i > 0 && i < 6) {
                let tmp = pointFineTuningUp(sobelData2D, Math.floor(ele.x - leftTopX), Math.floor(ele.y - leftTopY), edge)
                return { x: tmp[0] + leftTopX, y: tmp[1] + leftTopY }
            }
            return { x: ele.x, y: ele.y }
        })
    }

    lipTopPositions
    positions = makeSoftly(positions, lipPositions, 12.5)
    return positions;

}
/**
 * sobel의 경계선으로부터 찾아낸 좌표를 
 * 딥러닝의 좌표와 비교
 * 1. limit 이상으로 차이나는 부분 딥러닝 좌표로 수정합니다.
 * 2. 아랫입술에 대해서는 경계선을통해 찾은 좌표가 완만한 언덕모양이 아닌경우, 딥러닝 좌표로 수정합니다.
 * @param {*} positions 
 * @param {*} lipPositions 
 * @param {*} limit 
 */
function makeSoftly(positions, lipPositions, limit) {
    let tmp = 0;
    for (let i = 1; i < 6; i++) {
        if (positions.topLip[i].y - lipPositions[i].y > limit) {
            positions.topLip[i].y = lipPositions[i].y;
        }
    }
    //bottom right 0<1<2
    tmp = positions.bottomLip[0].y
    for (let i = 2; i <= 3; i++) {
        if (positions.bottomLip[i - 1].y < tmp) {
            positions.bottomLip[i - 1].y = lipPositions[i + 6].y;
        }
        tmp = positions.bottomLip[i - 1].y;
    }
    //button left 2>3>4
    tmp = positions.bottomLip[2].y
    for (let i = 3; i < 6; i++) {
        if (positions.bottomLip[i - 1].y > tmp) {
            positions.bottomLip[i - 1].y = lipPositions[i + 6].y;
        }
        tmp = positions.bottomLip[i - 1].y;
    }
    //bottom left 4<3<2
    tmp = positions.bottomLip[4].y
    for (let i = 4; i > 2; i--) {
        if (positions.bottomLip[i - 1].y < tmp) {
            positions.bottomLip[i - 1].y = lipPositions[i + 6].y;
        }
        tmp = positions.bottomLip[i - 1].y;
    }
    //button right 2>1>0
    tmp = positions.bottomLip[2].y
    for (let i = 2; i >0; i--) {
        if (positions.bottomLip[i - 1].y > tmp) {
            positions.bottomLip[i - 1].y = lipPositions[i + 6].y;
        }
        tmp = positions.bottomLip[i - 1].y;
    }
    return positions;
}
/**
 * 아래 방향으로 이동 / 윗입술 겉 영역
 * 
 * @param {*} edge가 있는 배열 
 * @param {*} 찾은 좌표 x
 * @param {*} 찾은 좌표 y
 * @param {*} edge기준치
 */
function pointFineTuningDown(sobelData2D, x, y, edge) {

    //현재 좌표가 경계선이 아닌 경우
    if (sobelData2D[y][x] < edge) {
        //이미 입술의 내부로 들어왔을경우
        for (let i = 0; i < y; i++) {
            if (sobelData2D[i][x] > edge) {
                return [x, y]
            }
        }
        //입술 영역보다 벗어났을경우
        for (let i = y; i < sobelData2D.length; i++) {
            if (sobelData2D[i][x] > edge) {
                return [x, i]
            }
        }
    }
    return [x, y]
}

/**
 * 위 방향으로 이동 / 아랫입술의 겉영역
 * 
 * @param {*} edge가 있는 배열 
 * @param {*} 찾은 좌표 x
 * @param {*} 찾은 좌표 y
 * @param {*} edge기준치
 */
function pointFineTuningUp(sobelData2D, x, y, edge) {
    if (sobelData2D[y][x] < edge) {
        //이미 입술의 내부로 들어왔을경우
        for (let i = sobelData2D.length - 1; i > y; i--) {
            if (sobelData2D[i][x] > edge) {
                return [x, y]
            }
        }
        //입술 영역보다 벗어났을경우
        for (let i = y; i > 0; i--) {
            if (sobelData2D[i][x] > edge) {
                return [x, i]
            }
        }
    }
    return [x, y]
}
function isClose(landmarks) {
    let lipPositions = getlandmark.getLipPositions(landmarks);
    let topLip = lipPositions[14].y - lipPositions[3].y;
    let lipGap = lipPositions[18].y - lipPositions[14].y;
    let buttomLip = lipPositions[9].y - lipPositions[18].y;
    if (buttomLip > lipGap || topLip > lipGap) {
        return true;
    }
    return false;
}
export default function makeup(output, input, landmark) {
    let color = document.querySelector("#lipValue").value;
    let opacity = document.querySelector(".lipsOpacity").value;
    opacity = opacity/100;
    let positionsOpen = getLipsPosition(landmark);
    let positionsClose = getPositionFineTunning2(output, landmark)
    drawImg2Canvas(output, input);
    if (isClose(landmark)) {
        drawCloseLip(output, { color, opacity }, positionsClose)
    } else {
        drawLip(output, { color, opacity }, positionsOpen)
    }
}