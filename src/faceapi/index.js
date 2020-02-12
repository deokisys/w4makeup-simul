import {drawImg2Canvas} from '../util/draw.js';
import * as faceapi from 'face-api.js';
import Lip from './makeup/lips';
import Blusher from './makeup/blusher';
import fullmake from './makeup/full';

//video
const video = document.querySelector("#video")
function startVideo(){
    navigator.getUserMedia(
        {video:{}},
        stream => video.srcObject = stream,
        err=>console.err(err)
    )
}

Promise.all([
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),//랜드마크를 찾는 모델
    faceapi.nets.tinyFaceDetector.loadFromUri('/models')//얼굴인식 기본
]).then(start)

async function start(){
    const input = document.getElementById('image')
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

    //video
    startVideo();
    video.addEventListener("play",()=>{
        let canvasVideo = document.getElementById("videoOut");
        const videoDisplaySize = {width:video.offsetWidth,height:video.offsetHeight}
        faceapi.matchDimensions(canvasVideo,videoDisplaySize)
        setInterval(async()=>{
            let detectionVideo = await faceapi.detectAllFaces(video,new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            const resizeVideoDetections = faceapi.resizeResults(detectionVideo,videoDisplaySize)
            canvasVideo.getContext('2d').clearRect(0,0,canvasVideo.width,canvasVideo.height)
            faceapi.draw.drawFaceLandmarks(canvasVideo,resizeVideoDetections)
            console.log(video)
            let lipV = new Lip(video,canvasVideo,landmarks)
            let blusherV = new Blusher(video,canvasVideo,landmarks)
        },100)
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

