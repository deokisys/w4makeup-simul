# 얼굴 화장 UI

`얼굴을 인식후, 화장 시뮬레이션을 구현합니다.`

# 데모 스크린샷

- 적용전 이미지 입력
  ![적용전](https://user-images.githubusercontent.com/24247768/197826824-de7af99c-6335-4f1c-bae0-4a54a28e1ac7.png)

- 얼굴인식 모델로 얼굴 인식
  ![얼굴인식](https://user-images.githubusercontent.com/24247768/197826900-0f135b7b-9fe4-4a4e-884c-9f1b51d36ecf.png)

- 화장 적용(볼, 입술)
  ![화장적용](https://user-images.githubusercontent.com/24247768/197826973-cb3588b2-4750-4027-a9e7-b53e9c4bda55.png)

- 화장 컨트롤러
  ![화장 컨트롤러](https://user-images.githubusercontent.com/24247768/197827445-fc4af318-35e8-4044-b10c-bf351318016a.png)

- 기울인 얼굴
  ![기울인얼굴](https://user-images.githubusercontent.com/24247768/197828784-ba334aec-fd11-486e-a4f0-50c427231947.png)

# 진행

1. 얼굴인식 모델을 이용하여 얼굴 포인트 인식
   - blazeface
     - 6개의 랜드마크 표시가능
       - 눈, 코, 입, 귀
   - face-api
     - 얼굴의 전체적인 윤곽선 확인 가능
     - 눈썹, 눈, 코, 입술, 턱선
       - 총 68개의 포인트를 찾아냅니다.
       - 이 포인트들로 눈의 윤곽, 눈썹의 윤곽, 입술, 턱선과 같은 선으로 표현이 가능합니다.
   - 비교 사진
     - ![입력사진,blazeface,faceapi](https://media.oss.navercorp.com/user/16793/files/a4c78580-4c2d-11ea-8832-33b8a5bb3648)
       - 좌측부터 입력사진,blazeface,faceapi로 각 api에서 추출할 수 있는 포인트를 출력해 보았습니다.
2. 전체적인 UI구상
   - 이미지 입력
   - 화장할 부위, 색 선택
     - 눈, 입술, 볼터치, 눈썹
3. 이미지위에 그림 그리는 모듈 구현
4. 정확도, 이슈 해결

## 버전

- node 19.9.0

## 업데이트

### 바닐라 javascript->react로 변경

- 기존의 javascript로 구축한 환경을 react로 수정

### 버전 업그레이드

- 기존의 12 버전에서 19버전으로 업그레이드
  - tensorflow를 업그레이드 하면서 버전 upgrade

### 색지정 라이브러리 변경

- 기존의 jscolor.js에서 react의 색지정 라이브러리인 react-colorful로 변경

# 참고

- 얼굴인식 API
  - https://github.com/justadudewhohacks/face-recognition.js
  - https://github.com/justadudewhohacks/face-api.js
  - https://github.com/tensorflow/tfjs-models/tree/master/blazeface
- 자동화장(DMT)
  - https://github.com/Honlan/DMT
  - https://arxiv.org/abs/1907.01144
  - https://www.semion.io/doc/disentangled-makeup-transfer-with-generative-adversarial-network
- 자동채색(pix2pix)
  - https://phillipi.github.io/pix2pix/
- 유저가이드 채색
  - https://richzhang.github.io/ideepcolor/
