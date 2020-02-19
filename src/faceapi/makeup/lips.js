import { drawLip,drawCloseLip } from '../../util/draw.js';
import Sobel from 'sobel';
//입술의 위치를 잡는 함수
function getLipsPosition(landmarks){
    let topLip=[0,1,2,3,4,5,6,16,15,14,13,12];
    let bottomLip=[7,8,9,10,11,12,0,19,18,17,16,6];

    
    let positions = {
        topLip:topLip.map((ele)=>{
            return {x:landmarks[ele+48].x,y:landmarks[ele+48].y}
        }),
        bottomLip:bottomLip.map((ele)=>{
            return {x:landmarks[ele+48].x,y:landmarks[ele+48].y}
        })
    }
    return positions;
}
function getPositionFineTunning2(canvas,landmarks){
    var ctx = canvas.getContext('2d');
//1차적으로 딥러닝으로 학습된 위치가 기본
//경계선을 찾아내고, 각 포인트에서 위치를 조정하는 방식.
//삐져 나온것을 내부로 이동하기

   let leftMouthCorner=landmarks[0+48];
    let rightMouthCorner=landmarks[6+48];

    let m = (leftMouthCorner.y-rightMouthCorner.y) / (leftMouthCorner.x - rightMouthCorner.x)   //입꼬리 기울기

    let leftTopX = (landmarks[4].x+leftMouthCorner.x)/2;
    let leftTopY = m<=0?leftMouthCorner.y-20:rightMouthCorner.y-20;
    let width =(rightMouthCorner.x + landmarks[12].x)/2-leftTopX; 
    let height = landmarks[57].y+20 - (landmarks[33].y+landmarks[50].y)/2;
    const imageData = ctx.getImageData(leftTopX, leftTopY, width, height);

    //edge 탐색 - sobel로 경계선 탐색
    var sobelData = Sobel(imageData);

    let sobelCheckData=[];
    for(let i=0;i<sobelData.length;i+=4){//0일 수록 어둡다
        let avg = (sobelData[i] + sobelData[i + 1] + sobelData[i + 2]) / 3;
        sobelData[i] = avg; // red
        sobelData[i + 1] = avg; // green
        sobelData[i + 2] = avg; // blue
        sobelCheckData.push(avg)
    }
    var checkData = [];
    for(let i=0;i<sobelCheckData.length;i+=Math.floor(width)){
        checkData.push(sobelCheckData.slice(i,i+Math.floor(width)));
    }
    //sobel 출력
        // var sobelImageData = sobelData.toImageData();
        // ctx.putImageData(sobelImageData, leftTopX, leftTopY);


    let edge=40;
    //각자 좌표별로 확인
    let isEdge=[];
    for(let i=48;i<68;i++){
        let x = Math.floor(landmarks[i].x-leftTopX);
        let y = Math.floor(landmarks[i].y-leftTopY);
        let tmp = checkData[y][x]
        isEdge.push(tmp)
    }
    //꼬리부분 무사한지 확인
    if(!(isEdge[0]>edge||isEdge[12]>edge)&&(isEdge[6]>edge||isEdge[16]>edge)){
        console.log("무사안함")
        //꼬리위치 조정 필요 - 0,12 or 6,16의 위치
    }

    let topLip=[0,1,2,3,4,5,6,16,15,14,13,12];
    let bottomLip=[7,8,9,10,11,12,0,19,18,17,16,6];

    //윗입술(49,50,51,52,53) 위아래로 이동
        // 61,62,63 - 내부
    //아랫입술(55,56,57,58,59) 위아래로 이동
        // 67,66,65 - 내부
    let positions = {
        topLip:topLip.map((ele)=>{
            if(ele>0&&ele<6) {
                let tmp = pointFineTuningDown(checkData,Math.floor(landmarks[ele+48].x-leftTopX),Math.floor(landmarks[ele+48].y-leftTopY),edge)
                return {x:tmp[0]+leftTopX,y:tmp[1]+leftTopY}
            }
            return {x:landmarks[ele+48].x,y:landmarks[ele+48].y}
        }),
        bottomLip:bottomLip.map((ele)=>{
            if(ele>6&&ele<12) {
                let tmp = pointFineTuningUp(checkData,Math.floor(landmarks[ele+48].x-leftTopX),Math.floor(landmarks[ele+48].y-leftTopY),edge)
                return {x:tmp[0]+leftTopX,y:tmp[1]+leftTopY}
            }
            return {x:landmarks[ele+48].x,y:landmarks[ele+48].y}
        })
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
function pointFineTuningDown(checkData,x,y,edge){

    if(checkData[y][x]<edge){
        //이미 입술의 내부로 들어왔을경우
        for(let i=0;i<y;i++){
            if(checkData[i][x]>edge){
                return [x,y]
            }
        }
        //입술 영역보다 벗어났을경우
        for(let i=y;i<checkData.length;i++){
            if(checkData[i][x]>edge){
                return [x,i]
            }
        }
    }
    return [x,y]
}

/**
 * 위 방향으로 이동 / 아랫입술의 겉영역
 * 
 * @param {*} edge가 있는 배열 
 * @param {*} 찾은 좌표 x
 * @param {*} 찾은 좌표 y
 * @param {*} edge기준치
 */
function pointFineTuningUp(checkData,x,y,edge){
    if(checkData[y][x]<edge){
        //이미 입술의 내부로 들어왔을경우
        for(let i=checkData.length-1;i>y;i--){
            if(checkData[i][x]>edge){
                return [x,y]
            }
        }
        //입술 영역보다 벗어났을경우
        for(let i=y;i>0;i--){
            if(checkData[i][x]>edge){
                return [x,i]
            }
        }
    }
    return [x,y]
}
function getPositionFineTunning3(canvas,input,landmarks){
    var ctx = canvas.getContext('2d');

    let leftMouthCorner=landmarks[0+48];
    let rightMouthCorner=landmarks[6+48];

    let m = (leftMouthCorner.y-rightMouthCorner.y) / (leftMouthCorner.x - rightMouthCorner.x)   //입꼬리 기울기

    let leftTopX = (landmarks[4].x+leftMouthCorner.x)/2;
    let leftTopY = m<=0?leftMouthCorner.y-20:rightMouthCorner.y-20;
    let width =(rightMouthCorner.x + landmarks[12].x)/2-leftTopX; 
    let height = landmarks[57].y+20 - (landmarks[33].y+landmarks[50].y)/2;

    const imageData = ctx.getImageData(leftTopX, leftTopY, width, height);
    let data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        var avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        avg = avg - avg%50
        data[i] = avg; // red
        data[i + 1] = avg; // green
        data[i + 2] = avg; // blue
    }
    ctx.putImageData(imageData, leftTopX, leftTopY);
}
export default function makeup(output,input,landmark){
    let color=document.querySelector(".lipscolor").value;
    let opacity=document.querySelector(".lipsOpacity").dataset.opacity;
    // let positions = getLipsPosition(landmark);    
    let positions = getPositionFineTunning2(output,landmark)
    // drawLip(output, {color,opacity}, positions)
    drawCloseLip(output, {color,opacity}, positions)
}