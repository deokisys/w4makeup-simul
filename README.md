# 얼굴 화장 UI
`얼굴을 인식후, 화장 시뮬레이션을 구현합니다.`

# 진행
1. 얼굴인식 모델을 이용하여 얼굴 포인트 인식
    - blazeface
        - 6개의 랜드마크 표시가능 
            - 눈, 코, 입, 귀
    - face-api
        - 얼굴의 전체적인 윤곽선 확인 가능
        - 눈썹, 눈, 코, 입술, 턱선
2. 전체적인 UI구상
    - 이미지 입력
    - 화장할 부위, 색 선택
        - 눈, 입술, 볼터치, 눈썹 
3. 이미지위에 그림 그리는 모듈 구현
4. 정확도, 이슈 해결


# 참고
- 얼굴인식 API
    - https://github.com/justadudewhohacks/face-recognition.js
    - https://github.com/justadudewhohacks/face-api.js
    - https://github.com/tensorflow/tfjs-models/tree/master/blazeface

