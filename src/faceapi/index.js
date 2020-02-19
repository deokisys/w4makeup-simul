import {drawImg2Canvas} from '../util/draw.js';
import * as faceapi from 'face-api.js';
import {blushMakeup,lipMakeup,fullMakeup} from './makeup';

let imgUpload = document.querySelector("#myFileUpload");
imgUpload.onchange=async ()=>{
    const imgFile = document.getElementById('myFileUpload').files[0]
    // create an HTMLImageElement from a Blob
    const img = await faceapi.bufferToImage(imgFile)
    const input = document.getElementById('myImg')
    input.src = img.src


    //시작
    input.onload = async ()=>{
        let makeupModule = document.querySelector(".makeup");
        const canvas = document.getElementById('canvas2');//얼굴 특징 출력
        const output = document.getElementById('output');
        const displaySize = {width:input.width,height:input.height}
        faceapi.matchDimensions(canvas, displaySize)
        faceapi.matchDimensions(output, displaySize)
        //예측
        let landmarks = await predict(input,canvas,displaySize,output);
        if(!landmarks) return alert("얼굴을 찾지 못했습니다.")
        makeupModule.style.display = "block";// 메이크업 ui 표시
        //부위별 메이크업 수행
        lipMakeup(input,output,landmarks)
        blushMakeup(input,output,landmarks)

        fullMakeup(input,output,landmarks)
    }
    
}

Promise.all([
    faceapi.nets.faceLandmark68Net.loadFromUri('https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights'),//랜드마크를 찾는 모델
    faceapi.nets.tinyFaceDetector.loadFromUri('https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights')//얼굴인식 기본
]).then(start)

async function start(){
    let uploadModule = document.querySelector("#myFileUpload");
    uploadModule.style.display = "block";
    console.log("loadmodel");
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
    return resizeDetections.length?resizeDetections[0].landmarks.positions:false;
}

