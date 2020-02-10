import {drawImg2Canvas} from '../util/draw.js';
import * as faceapi from 'face-api.js';

Promise.all([
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),//랜드마크를 찾는 모델
    faceapi.nets.tinyFaceDetector.loadFromUri('/models')//얼굴인식 기본
]).then(start)

function start(){
    const input = document.getElementById('image')
    const canvas = document.getElementById('canvas2');
    const displaySize = {width:input.width,height:input.height}
    faceapi.matchDimensions(canvas, displaySize)
    draw(input,canvas,displaySize);
}

async function draw(input,canvas,displaySize){
    const detections = await faceapi.detectAllFaces(input,new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    const resizeDetections = faceapi.resizeResults(detections,displaySize)
    console.log(resizeDetections)//
    drawImg2Canvas(canvas,input);//얼굴 먼저 출력
    faceapi.draw.drawFaceLandmarks(canvas,resizeDetections)//얼굴 랜드마크들(눈썹, 눈, 코, 입, 턱선)출력
    //0-16 턱선
    //17-21 왼쪽 눈썹
    //22-26 오른쪽 눈썹
    //27-35 코
    //36-41 왼쪽눈
    //42-47 오른쪽눈
    //48-67 입
}