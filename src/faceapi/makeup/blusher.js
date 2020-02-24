import {drawBlusher} from '../../util/draw.js';

//볼의 위치, 영역을 정리하는 함수
function getBlushPosition(landmarks){

    //양쪽 눈 을 이읏 선의 기울기 구하기
    let m = (landmarks[45].y-landmarks[36].y) / (landmarks[45].x - landmarks[36].x)
    //각 눈과 거리가 가까운 볼의 위치를 찾아냄'


    //위에서 구한 기울기 적용하고 볼의 점에서 직선으로 적용
    //y= mx - mx1+ y1
    let addition = -(m*landmarks[29].x)+landmarks[29].y
    //눈과 직각으로 만나는 부분을 볼로 정의
    let m2=-(1/m);

    // y2=m2x-m2x1+y1
    let addition2_1= -(m2*landmarks[36].x)+landmarks[36].y// 왼쪽
    let addition2_2= -(m2*landmarks[45].x)+landmarks[45].y// 오른쪽


    //볼의 좌표
    //왼쪽
    let leftX = (addition2_1-addition)/(m-m2);
    let leftY = m*(addition2_1-addition)/(m-m2) + addition;
    //오른쪽
    let rightX = (addition2_2-addition)/(m-m2);
    let rightY = m*(addition2_2-addition)/(m-m2) + addition;

    let leftRadius=Math.sqrt(Math.pow(leftX-landmarks[36].x,2)+Math.pow(leftY-landmarks[36].y,2));
    let rightRadius=Math.sqrt(Math.pow(rightX-landmarks[45].x,2)+Math.pow(rightY-landmarks[45].y,2));

    return {leftX,leftY,rightX,rightY,leftRadius,rightRadius};
}

export default function makeup(output,landmark){
    let color=document.querySelector("#blushValue").value;
    let opacity=document.querySelector(".blusherOpacity").value;
    opacity=opacity/100;
    let positions = getBlushPosition(landmark);    
    drawBlusher(output, {color,opacity}, positions)
}