import {drawImg2Canvas} from '../util/draw.js';
import * as faceapi from 'face-api.js';
import Lip from './makeup/lips';
import Blusher from './makeup/blusher';
import fullmake from './makeup/full';

let imgUpload = document.querySelector("#myFileUpload");
imgUpload.onchange=async ()=>{
    const imgFile = document.getElementById('myFileUpload').files[0]
    // create an HTMLImageElement from a Blob
    const img = await faceapi.bufferToImage(imgFile)
    const input = document.getElementById('myImg')
    input.src = img.src


    //시작
    input.onload = async ()=>{
        const canvas = document.getElementById('canvas2');//얼굴 특징 출력
        const output = document.getElementById('output');
        const displaySize = {width:input.width,height:input.height}
        faceapi.matchDimensions(canvas, displaySize)
        faceapi.matchDimensions(output, displaySize)
        //예측
        let landmarks = await predict(input,canvas,displaySize,output);
        //부위별 메이크업 수행
        let lip = new Lip(input,output,landmarks)
        let blusher = new Blusher(input,output,landmarks)

        //적용된 메이크업 모두 수행
        let fullmakeButton = document.querySelector(".fullMakeButton")
        fullmakeButton.addEventListener("click",()=>{
            fullmake(input,output,landmarks,...lip.getColor(),...blusher.getColor());
        })
    }
    
}

Promise.all([
    faceapi.nets.faceLandmark68Net.loadFromUri('https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights'),//랜드마크를 찾는 모델
    faceapi.nets.tinyFaceDetector.loadFromUri('https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights')//얼굴인식 기본
]).then(start)

async function start(){
    let uploadModule = document.querySelector("#myFileUpload");
    let makeupModule = document.querySelector(".makeup");
    uploadModule.style.display = "block";
    makeupModule.style.display = "block";

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
    return resizeDetections[0].landmarks.positions
}

