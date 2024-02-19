import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { drawBlusher, drawImg2Canvas, drawLip } from "../util/draw";
import getlandmark from "../util/landmark";
import getBlushPosition from "./makeup/blusher";
import Controller from "./Controller";

export default function Face() {
  const [libColor, setLibColor] = useState("#FF5454");
  const [blushColor, setBlushColor] = useState("#FF5454");

  const [faceLandMark, setFaceLandMark] = useState(undefined);
  const inputRef = useRef(null);
  const outputRef = useRef(null);

  //입술 색 변환
  useEffect(() => {
    if (!faceLandMark) return;
    fullMakeupTmp();
  }, [libColor]);

  //볼 색 변환
  useEffect(() => {
    if (!faceLandMark) return;
    fullMakeupTmp();
  }, [blushColor]);

  //얼굴 인식후
  useEffect(() => {
    if (!faceLandMark) return;
    fullMakeupTmp();
  }, [faceLandMark]);

  /**
   * 모델 로딩
   */
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

  /**
   * 예측
   * @param {*} input
   * @param {*} displaySize
   * @returns
   */
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

  /**
   * 이미지 로딩
   * @returns
   */
  async function imgLoad() {
    const output = outputRef.current;
    const inputImg = inputRef.current;

    const displaySize = { width: inputImg.width, height: inputImg.height };
    faceapi.matchDimensions(output, displaySize);
    //예측
    let landmarks = await predict(inputImg, displaySize, output);
    if (!landmarks) return alert("얼굴을 찾지 못했습니다.");

    setFaceLandMark(landmarks);
  }

  /**
   * 메이크업 초기화
   */
  function resetMakeup() {
    const output = outputRef.current;
    const inputImg = inputRef.current;

    drawImg2Canvas(output, inputImg);
  }

  /**
   * 입술 영역에 색칠
   */
  function lipMakeupTmp() {
    const output = outputRef.current;

    drawLip(output, { color: libColor, opacity: 0.5 }, getLipsPosition());
  }

  /**
   * 볼 영역에 색칠
   */
  function blushMakeupTmp() {
    const output = outputRef.current;

    drawBlusher(
      output,
      { color: blushColor, opacity: 0.5 },
      getBlushPosition(faceLandMark)
    );
  }

  /**
   * 풀메이크업
   */
  function fullMakeupTmp() {
    resetMakeup();
    lipMakeupTmp();
    blushMakeupTmp();
  }

  function getLipsPosition() {
    return {
      topLip: getlandmark.getTopLipPositions(faceLandMark),
      bottomLip: getlandmark.getBottomLipPositions(faceLandMark),
    };
  }

  function libChange(color) {
    setLibColor(color.toUpperCase());
  }
  function blushChange(color) {
    setBlushColor(color.toUpperCase());
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
      {faceLandMark && (
        <div>
          <Controller color={libColor} onChange={libChange} name={"입술"} />
          <Controller color={blushColor} onChange={blushChange} name={"볼"} />
        </div>
      )}
    </div>
  );
}
