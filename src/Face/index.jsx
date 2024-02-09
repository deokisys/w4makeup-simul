import React, { useEffect, useRef } from "react";
import { blushMakeup, lipMakeup, fullMakeup } from "./makeup";
import * as faceapi from "face-api.js";
import { drawImg2Canvas, drawLip } from "../util/draw";
import getlandmark from "../util/landmark";

export default function Face() {
  const inputRef = useRef(null);
  const outputRef = useRef(null);

  useEffect(() => {
    Promise.all([
      faceapi.nets.faceLandmark68Net.loadFromUri(
        "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights"
      ), //랜드마크를 찾는 모델
      faceapi.nets.tinyFaceDetector.loadFromUri(
        "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights"
      ), //얼굴인식 기본
    ]).then(start);

    async function start() {
      console.log("loadmodel");
    }
  }, []);

  async function predict(input, displaySize) {
    console.log(input);
    const detections = await faceapi
      .detectAllFaces(input, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks();
    const resizeDetections = faceapi.resizeResults(detections, displaySize);
    return resizeDetections.length
      ? resizeDetections[0].landmarks.positions
      : false;
  }

  async function onChange(e) {
    const inputImg = inputRef.current;
    const imgFile = e.target.files[0];

    // create an HTMLImageElement from a Blob
    const img = await faceapi.bufferToImage(imgFile);
    alert("이미지 들어옴");
    inputImg.src = img.src;
    inputImg.width = img.width;
    inputImg.height = img.height;

    console.log(img.width);
    console.log(inputImg.width);
    console.log(inputImg);
  }

  async function imgLoad() {
    alert("모어쩔");
    const output = outputRef.current;
    const inputImg = inputRef.current;
    // //세로가 긴 경우
    // if (inputImg.height > viewArea.offsetHeight) {
    //   let resize = viewArea.offsetHeight / inputImg.height;
    //   inputImg.height = inputImg.height * resize;
    //   inputImg.width = inputImg.width * resize;
    // }
    // //가로가 긴 경우
    // if (inputImg.width > viewArea.offsetWidth) {
    //   let resize = viewArea.offsetWidth / inputImg.width;
    //   inputImg.height = inputImg.height * resize;
    //   inputImg.width = inputImg.width * resize;
    // }
    // output.style.left = `${(800 - inputImg.width) / 2}px`;
    // inputImg.style.left = `${(800 - inputImg.width) / 2}px`;
    // output.style.top = `${(viewArea.offsetHeight - inputImg.height) / 2}px`;
    // inputImg.style.top = `${(viewArea.offsetHeight - inputImg.height) / 2}px`;

    const displaySize = { width: inputImg.width, height: inputImg.height };
    faceapi.matchDimensions(output, displaySize);
    //예측
    let landmarks = await predict(inputImg, displaySize, output);
    if (!landmarks) return alert("얼굴을 찾지 못했습니다.");
    console.log(landmarks);
    drawImg2Canvas(output, inputImg);
    let positionsOpen = getLipsPosition(landmarks);
    drawLip(output, { color: "#2091FF", opacity: 0.5 }, positionsOpen);
    //부위별 메이크업 수행
    // lipMakeup(inputImg, output, landmarks);
    // blushMakeup(inputImg, output, landmarks);
    // fullMakeup(inputImg, output, landmarks);
  }

  function getLipsPosition(landmarks) {
    return {
      topLip: getlandmark.getTopLipPositions(landmarks),
      bottomLip: getlandmark.getBottomLipPositions(landmarks),
    };
  }
  return (
    <div>
      <input
        onChange={onChange}
        id="myFileUpload"
        type="file"
        accept=".jpg, .jpeg, .png"
      />
      <div>
        <div>
          <img
            onLoad={imgLoad}
            ref={inputRef}
            id="myImg"
            crossOrigin="anonymous"
          />
        </div>
        <div>
          <canvas ref={outputRef} id="output"></canvas>
        </div>
      </div>
    </div>
  );
}
