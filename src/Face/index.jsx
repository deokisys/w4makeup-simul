import React, { useEffect } from "react";
import * as faceapi from "face-api.js";

export default function Face() {
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
      //   let uploadModule = document.querySelector("#myFileUpload");
      //   uploadModule.style.display = "block";
      alert("loadmodel");

      //   let makeupButton = document.querySelector("#modemakeup");
      //   let makeupModule = document.querySelector(".makeup");

      //   makeupButton.addEventListener("click", () => {
      //     if (makeupModule.style.display === "none") {
      //       makeupModule.style.display = "flex"; // 메이크업 ui 표시
      //       return;
      //     }
      //     makeupModule.style.display = "none"; // 메이크업 ui 표시
      //   });
    }
  }, []);
  return <div></div>;
}
