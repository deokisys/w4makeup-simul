import { drawLip, drawCloseLip, drawImg2Canvas } from '../../util/draw.js';
import Sobel from 'sobel';
//입술의 위치를 잡는 함수
function getLipsPosition(landmarks) {
    let topLip = [0, 1, 2, 3, 4, 5, 6, 16, 15, 14, 13, 12];
    let bottomLip = [7, 8, 9, 10, 11, 12, 0, 19, 18, 17, 16, 6];


    let positions = {
        topLip: topLip.map((ele) => {
            return { x: landmarks[ele + 48].x, y: landmarks[ele + 48].y }
        }),
        bottomLip: bottomLip.map((ele) => {
            return { x: landmarks[ele + 48].x, y: landmarks[ele + 48].y }
        })
    }
    return positions;
}
function getPositionFineTunning2(canvas, landmarks) {
    var ctx = canvas.getContext('2d');
    //1차적으로 딥러닝으로 학습된 위치가 기본
    //경계선을 찾아내고, 각 포인트에서 위치를 조정하는 방식.
    //삐져 나온것을 내부로 이동하기
    let edge = 40;

    let leftMouthCorner = landmarks[0 + 48];
    let rightMouthCorner = landmarks[6 + 48];

    let m = (leftMouthCorner.y - rightMouthCorner.y) / (leftMouthCorner.x - rightMouthCorner.x)   //입꼬리 기울기

    let leftTopX = (landmarks[4].x + leftMouthCorner.x) / 2;
    let leftTopY = ((landmarks[50].y > landmarks[52].y ? landmarks[52].y : landmarks[50].y) + landmarks[33].y) / 2
    let width = (rightMouthCorner.x + landmarks[12].x) / 2 - leftTopX;
    let height = (landmarks[57].y + landmarks[8].y) / 2 - (landmarks[33].y + landmarks[50].y) / 2;
    const imageData = ctx.getImageData(leftTopX, leftTopY, width, height);

    //edge 탐색 - sobel로 경계선 탐색
    var sobelData = Sobel(imageData);

    let sobelCheckData = [];
    for (let i = 0; i < sobelData.length; i += 4) {//0일 수록 어둡다
        let avg = (sobelData[i] + sobelData[i + 1] + sobelData[i + 2]) / 3;
        sobelData[i] = avg; // red
        sobelData[i + 1] = avg; // green
        sobelData[i + 2] = avg; // blue
        sobelCheckData.push(avg)
    }
    var checkData = [];
    for (let i = 0; i < sobelCheckData.length; i += Math.floor(width)) {
        checkData.push(sobelCheckData.slice(i, i + Math.floor(width)));
    }
    //sobel 출력
    // var sobelImageData = sobelData.toImageData();
    // ctx.putImageData(sobelImageData, leftTopX, leftTopY);


    //각자 좌표별로 확인
    let isEdge = [];
    for (let i = 48; i < 68; i++) {
        let x = Math.floor(landmarks[i].x - leftTopX);
        let y = Math.floor(landmarks[i].y - leftTopY);
        let tmp = checkData[y][x]
        isEdge.push(tmp)
    }
    //꼬리부분 무사한지 확인
    // if (!(isEdge[0] > edge || isEdge[12] > edge)) {
    //     console.log("왼쪽 무사안함")
    // }
    // if (!(isEdge[6] > edge || isEdge[16] > edge)) {
    //     console.log("오른쪽 무사안함")
    // }

    let topLip = [0, 1, 2, 3, 4, 5, 6, 16, 15, 14, 13, 12];
    let bottomLip = [7, 8, 9, 10, 11, 12, 0, 19, 18, 17, 16, 6];

    //윗입술(49,50,51,52,53) 위아래로 이동
    // 61,62,63 - 내부
    //아랫입술(55,56,57,58,59) 위아래로 이동
    // 67,66,65 - 내부
    let positions = {
        topLip: topLip.map((ele, i) => {
            if (i > 0 && i < 6) {
                let tmp = pointFineTuningDown(checkData, Math.floor(landmarks[ele + 48].x - leftTopX), Math.floor(landmarks[ele + 48].y - leftTopY), edge)
                return { x: tmp[0] + leftTopX, y: tmp[1] + leftTopY }
            }
            return { x: landmarks[ele + 48].x, y: landmarks[ele + 48].y }
        }),
        bottomLip: bottomLip.map((ele, i) => {
            // if(ele>6&&ele<12) {
            if (i > 0 && i < 6) {
                let tmp = pointFineTuningUp(checkData, Math.floor(landmarks[ele + 48].x - leftTopX), Math.floor(landmarks[ele + 48].y - leftTopY), edge)
                return { x: tmp[0] + leftTopX, y: tmp[1] + leftTopY }
            }
            return { x: landmarks[ele + 48].x, y: landmarks[ele + 48].y }
        })
    }
    positions = checkPositions(positions, landmarks, 12.5)
    return positions;

}
/**
 * sobel의 경계선으로부터 찾아낸 좌표를 
 * 딥러닝의 좌표와 비교
 * 1. limit 이상으로 차이나는 부분 딥러닝 좌표로 수정합니다.
 * 2. 아랫입술에 대해서는 경계선을통해 찾은 좌표가 완만한 언덕모양이 아닌경우, 딥러닝 좌표로 수정합니다.
 * @param {*} positions 
 * @param {*} landmarks 
 * @param {*} limit 
 */
function checkPositions(positions, landmarks, limit) {
    let tmp = 0;
    for (let i = 1; i < 6; i++) {
        if (positions.topLip[i].y - landmarks[i + 48].y > limit) {
            positions.topLip[i].y = landmarks[i + 48].y;
        }
    }
    //bottom right 0<1<2
    tmp = positions.bottomLip[0].y
    for (let i = 2; i <= 3; i++) {
        if (positions.bottomLip[i - 1].y < tmp) {
            positions.bottomLip[i - 1].y = landmarks[i + 48 + 6].y;
        }
        tmp = positions.bottomLip[i - 1].y;
    }
    //button left 2>3>4
    tmp = positions.bottomLip[2].y
    for (let i = 3; i < 6; i++) {
        if (positions.bottomLip[i - 1].y > tmp) {
            positions.bottomLip[i - 1].y = landmarks[i + 48 + 6].y;
        }
        tmp = positions.bottomLip[i - 1].y;
    }
    //bottom left 4<3<2
    tmp = positions.bottomLip[4].y
    for (let i = 4; i > 2; i--) {
        if (positions.bottomLip[i - 1].y < tmp) {
            positions.bottomLip[i - 1].y = landmarks[i + 48 + 6].y;
        }
        tmp = positions.bottomLip[i - 1].y;
    }
    //button right 2>1>0
    tmp = positions.bottomLip[2].y
    for (let i = 2; i >0; i--) {
        if (positions.bottomLip[i - 1].y > tmp) {
            positions.bottomLip[i - 1].y = landmarks[i + 48 + 6].y;
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
function pointFineTuningDown(checkData, x, y, edge) {

    if (checkData[y][x] < edge) {
        //이미 입술의 내부로 들어왔을경우
        for (let i = 0; i < y; i++) {
            if (checkData[i][x] > edge) {
                return [x, y]
            }
        }
        //입술 영역보다 벗어났을경우
        for (let i = y; i < checkData.length; i++) {
            if (checkData[i][x] > edge) {
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
function pointFineTuningUp(checkData, x, y, edge) {
    if (checkData[y][x] < edge) {
        //이미 입술의 내부로 들어왔을경우
        for (let i = checkData.length - 1; i > y; i--) {
            if (checkData[i][x] > edge) {
                return [x, y]
            }
        }
        //입술 영역보다 벗어났을경우
        for (let i = y; i > 0; i--) {
            if (checkData[i][x] > edge) {
                return [x, i]
            }
        }
    }
    return [x, y]
}
function isClose(landmarks) {
    let topLip = landmarks[62].y - landmarks[51].y;
    let lipGap = landmarks[66].y - landmarks[62].y;
    let buttomLip = landmarks[57].y - landmarks[66].y;
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