import {drawImg2Canvas,drawLip} from '../util/draw.js';
import * as faceapi from 'face-api.js';

Promise.all([
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),//랜드마크를 찾는 모델
    faceapi.nets.tinyFaceDetector.loadFromUri('/models')//얼굴인식 기본
]).then(start)

async function start(){
    const input = document.getElementById('image')
    const canvas = document.getElementById('canvas2');
    const output = document.getElementById('output');
    const displaySize = {width:input.width,height:input.height}
    faceapi.matchDimensions(canvas, displaySize)
    faceapi.matchDimensions(output, displaySize)
    let landmarks = await predict(input,canvas,displaySize,output);
    let makeupLibs = libsSet(output,landmarks.slice(48,68))
    drawLip(output,"red",landmarks.slice(48,68))

    let libsButton = document.querySelector(".libsMakeButton");
    libsButton.addEventListener("click",(evt)=>{
        drawImg2Canvas(output,input);
        makeupLibs(evt.target.previousElementSibling.value)
    })
}

async function predict(input,canvas,displaySize,output){
    const detections = await faceapi.detectAllFaces(input,new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    const resizeDetections = faceapi.resizeResults(detections,displaySize)
    drawImg2Canvas(canvas,input);//얼굴 먼저 출력
    drawImg2Canvas(output,input);
    faceapi.draw.drawFaceLandmarks(canvas,resizeDetections)//얼굴 랜드마크들(눈썹, 눈, 코, 입, 턱선)출력
    //0-16 턱선
    //17-21 왼쪽 눈썹
    //22-26 오른쪽 눈썹
    //27-35 코
    //36-41 왼쪽눈
    //42-47 오른쪽눈
    //48-67 입
    return resizeDetections[0].landmarks.positions
}
//색을 제외하고 나머지 출력될 canvas와 위치를 입력한다.
function libsSet(output,lipPositions){
    return  (color)=>{
        drawLip(output,color,lipPositions)
    };
}
