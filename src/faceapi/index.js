import * as faceapi from 'face-api.js';
import {blushMakeup,lipMakeup,fullMakeup} from './makeup';
import initComparisons from '../util/imageCompairon'
initComparisons();
const video = document.querySelector("#video")
const viewArea = document.querySelector(".viewer");

function startVideo(){
    let agent = navigator.userAgent.toLowerCase();
    let option = {};
    if(agent.indexOf("iphone") != -1){
        option = {
            width: { min: 1024, ideal: 1280, max: 1920 },
            height: { min: 776, ideal: 720, max: 1080 },
            facingMode: 'user'
        };
    }else{
        option = { 
            aspectRatio: { exact: 0.5625 },
            facingMode: 'user'
        };
    }
    navigator.mediaDevices.getUserMedia({
        video:option,
        audio:false
    })
  .then(stream => {
    video.srcObject = stream
    })
  .catch(e => 
    alert("지원되지 않는 단말입니다.")
    );
}
startVideo();

let imgUpload = document.querySelector("#myFileUpload");
imgUpload.onchange=async ()=>{
    const imgFile = document.getElementById('myFileUpload').files[0]
    // create an HTMLImageElement from a Blob
    const img = await faceapi.bufferToImage(imgFile)
    const input = document.getElementById('myImg')
    input.src = img.src
    input.width = img.width;
    input.height = img.height;


    //시작
    input.onload = async ()=>{
        const output = document.getElementById('output');

        //세로가 긴 경우
        if(input.height>viewArea.offsetHeight){
            let resize = viewArea.offsetHeight / input.height;
            input.height = input.height * resize;
            input.width = input.width * resize;
        }
        //가로가 긴 경우
        if(input.width>viewArea.offsetWidth){
            let resize = viewArea.offsetWidth / input.width;
            input.height = input.height * resize;
            input.width = input.width * resize;
        }
        output.style.left = `${(800 - input.width)/2}px`
        input.style.left = `${(800 - input.width)/2}px`
        output.style.top = `${(viewArea.offsetHeight- input.height)/2}px`
        input.style.top = `${(viewArea.offsetHeight- input.height)/2}px`

        const displaySize = {width:input.width,height:input.height}
        faceapi.matchDimensions(output, displaySize)
        //예측
        let landmarks = await predict(input,displaySize,output);
        if(!landmarks) return alert("얼굴을 찾지 못했습니다.")
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

    let makeupButton = document.querySelector("#modemakeup");
    let makeupModule = document.querySelector(".makeup");

    makeupButton.addEventListener("click",()=>{
        if(makeupModule.style.display==="none"){
            makeupModule.style.display = "flex";// 메이크업 ui 표시
            return;
        }
        makeupModule.style.display = "none";// 메이크업 ui 표시
    })

}

async function predict(input,displaySize,output){
    const detections = await faceapi.detectAllFaces(input,new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    const resizeDetections = faceapi.resizeResults(detections,displaySize)
    return resizeDetections.length?resizeDetections[0].landmarks.positions:false;
}

let canvasVideo = document.querySelector("#changeVideo");
let interval="";
canvasVideo.addEventListener("click",()=>{//loadedmetadata , play
    let imageArea = document.querySelector("._images");
    let videoArea = document.querySelector("._videos");
    if(imageArea.style.display==="none"){
        videoArea.style.display="none"
        imageArea.style.display="block"
        video.removeEventListener("play",videoPlay,false)
        clearInterval(interval);
    }else{
        videoArea.style.display="block"
        imageArea.style.display="none" 
            //video
        video.addEventListener("play",videoPlay, false)
    }
})
function videoPlay(){

    let canvasVideo = document.getElementById("videoOut");

    //
    let resize = viewArea.offsetHeight / video.videoHeight;
    video.width = video.videoWidth*resize;
    video.height = video.videoHeight*resize;
    video.style.left = `${(800 - video.width)/2}px`
    canvasVideo.style.left = `${(800 - video.width)/2}px`
    //
    const videoDisplaySize = {width:video.width,height:video.height}
    faceapi.matchDimensions(canvasVideo,videoDisplaySize)

    interval = setInterval(async()=>{
        let detectionVideo = await faceapi.detectAllFaces(video,new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        const resizeVideoDetections = faceapi.resizeResults(detectionVideo,videoDisplaySize)
        canvasVideo.getContext('2d').clearRect(0,0,videoDisplaySize.width,videoDisplaySize.height)
        if(resizeVideoDetections.length){
            let videoLandmark = resizeVideoDetections[0].landmarks.positions;
            fullMakeup(video,canvasVideo,videoLandmark)
        }            
    },100)
}
