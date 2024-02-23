import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { drawBlusher, drawImg2Canvas, drawLip } from "../util/draw";
import getlandmark from "../util/landmark";
import getBlushPosition from "./makeup/blusher";
import Controller from "./Controller";
import styled from "styled-components";
import initComparisons from "../util/imageCompairon";
import Layout from "../Layout";

const Wrap = styled.div`
  display: flex;
  width: 300px;
`;
const Facewrap = styled.div`
  display: flex;
  height: 400px;
`;
const Content = styled.div`
  width: 300px;
  height: 400px;
`;

export default function Face() {
  const [libColor, setLibColor] = useState("#FF5454");
  const [blushColor, setBlushColor] = useState("#FF5454");

  const [faceLandMark, setFaceLandMark] = useState(undefined);
  const [compInit, setCompInit] = useState(false);
  const inputRef = useRef(null);
  const outputRef = useRef(null);
  const landmarkRef = useRef(null);

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
    if (!compInit) {
      initComparisons();
      setCompInit(true);
    }
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
    // landmarkPrint(input, resizeDetections);
    return resizeDetections.length
      ? resizeDetections[0].landmarks.positions
      : false;
  }

  /**
   * 이미지 입력
   * @param {*} e
   */
  async function onChange(e) {
    const inputImg = inputRef.current;
    const imgFile = e.target.files[0];

    // create an HTMLImageElement from a Blob
    const img = await faceapi.bufferToImage(imgFile);
    inputImg.src = img.src;
    inputImg.width = 300;
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

  function landmarkPrint(input, resizeDetections) {
    const landmark = landmarkRef.current;

    //랜드마크 출력
    drawImg2Canvas(landmark, input);
    faceapi.draw.drawFaceLandmarks(landmark, resizeDetections);
    //----
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
    <Layout>
      <div>
        <input
          onChange={onChange}
          id="myFileUpload"
          type="file"
          accept=".jpg, .jpeg, .png"
        />
        <Facewrap>
          <Wrap className="img-comp-container">
            <Content className="img-comp-img">
              <img
                onLoad={imgLoad}
                ref={inputRef}
                id="myImg"
                crossOrigin="anonymous"
              />
            </Content>
            <Content className="img-comp-img img-comp-overlay">
              <canvas ref={outputRef} id="output"></canvas>
            </Content>
          </Wrap>
          {faceLandMark && (
            <div>
              <Controller color={libColor} onChange={libChange} name={"입술"} />
              <Controller
                color={blushColor}
                onChange={blushChange}
                name={"볼"}
              />
            </div>
          )}
        </Facewrap>
        {/* <Content>
        <canvas ref={landmarkRef}></canvas>
      </Content> */}
      </div>
    </Layout>
  );
}
