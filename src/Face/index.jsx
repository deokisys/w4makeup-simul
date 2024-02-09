import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { drawImg2Canvas, drawLip } from "../util/draw";
import getlandmark from "../util/landmark";
import { HexColorPicker, HexColorInput } from "react-colorful";

export default function Face() {
  const [color, setColor] = useState("#FF5454"); //#2091FF
  //ff 21 62 rgb(255, 33, 98)
  const [faceLandMark, setFaceLandMark] = useState(undefined);
  const [lipPosition, setLipPosition] = useState(undefined);
  const inputRef = useRef(null);
  const outputRef = useRef(null);

  //색 변환
  useEffect(() => {
    if (!faceLandMark) return;
    lipMakeupTmp();
  }, [color]);

  //얼굴 인식후
  useEffect(() => {
    if (!faceLandMark) return;
    getLipsPosition(faceLandMark);
  }, [faceLandMark]);

  //입술 위치확인
  useEffect(() => {
    if (!lipPosition) return;
    lipMakeupTmp();
  }, [lipPosition]);

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
    inputImg.src = img.src;
    inputImg.width = img.width;
    inputImg.height = img.height;
  }

  async function imgLoad() {
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

    setFaceLandMark(landmarks);

    //부위별 메이크업 수행
    // lipMakeup(inputImg, output, landmarks);
    // blushMakeup(inputImg, output, landmarks);
    // fullMakeup(inputImg, output, landmarks);
  }
  function lipMakeupTmp() {
    const output = outputRef.current;
    const inputImg = inputRef.current;

    drawImg2Canvas(output, inputImg);
    drawLip(output, { color: color, opacity: 0.5 }, lipPosition);
  }
  function getLipsPosition(landmarks) {
    setLipPosition({
      topLip: getlandmark.getTopLipPositions(landmarks),
      bottomLip: getlandmark.getBottomLipPositions(landmarks),
    });
  }

  function lipChange(color) {
    setColor(color.toUpperCase());
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
      <HexColorPicker color={color} onChange={lipChange} />
      <HexColorInput color={color} onChange={lipChange} />
    </div>
  );
}
