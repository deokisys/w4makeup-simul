import {drawBlusher } from '../../util/draw.js';

//볼의 위치, 영역을 정리하는 함수
function getBlushPosition(landmarks){
    let positions = {
        //오른쪽 눈 기준
        //45번 x좌표 
        rightX: landmarks[45].x,
        //오른쪽 턱
        //y좌표는 13,14번 사이
        rightY: (landmarks[13].y + landmarks[14].y) / 2,
        //크기
        //x좌표 부터 13번까지의 80%거리를 반지름으로 
        rightRadius: (landmarks[13].x - landmarks[45].x) * 0.8,
        //왼쪽 눈 기준
        //x좌표 36번
        leftX: landmarks[41].x,
        //왼쪽 볼
        //y좌표는 2,3번 사이
        leftY: (landmarks[2].y + landmarks[3].y) / 2,
        //크기
        //x좌표 부터 3번까지의 80%거리를 반지름
        leftRadius: (landmarks[41].x - landmarks[3].x) * 0.8
    }
    return positions;
}

export default function makeup(output,landmark){
    let color=document.querySelector(".blushcolor").value;
    let opacity=document.querySelector(".blusherOpacity").dataset.opacity;
    let positions = getBlushPosition(landmark);    
    drawBlusher(output, {color,opacity}, positions)
}