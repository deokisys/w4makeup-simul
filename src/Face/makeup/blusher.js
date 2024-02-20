import equation from "../../util/equation";
import getlandmark from "../../util/landmark";

//볼의 위치, 영역을 정리하는 함수
export default function getBlushPosition(landmarks) {
  let leftEyeEdge = getlandmark.getLeftEyePositions(landmarks)[0];
  let rightEyeEdge = getlandmark.getRightEyePositions(landmarks)[3];
  let nosePositions = getlandmark.getNosePositions(landmarks);
  //양쪽 눈 을 이읏 선의 기울기 구하기
  let horizonGradient = equation.getGradient(
    rightEyeEdge.x,
    rightEyeEdge.y,
    leftEyeEdge.x,
    leftEyeEdge.y
  );

  //콧등을 얼굴의 중심으로 하여 가로의 기울기가 지나는 상수 구하기
  let horizonConstant = equation.getConstant(
    horizonGradient,
    nosePositions[2].x,
    nosePositions[2].y
  );

  //얼굴의 세로 기울기
  let verticalGradient = -(1 / horizonGradient);

  //왼쪽, 오른쪽 눈의 끝 좌표로부터 세로기울기의 상수 구하기.
  let leftEyeConstant = equation.getConstant(
    verticalGradient,
    leftEyeEdge.x,
    leftEyeEdge.y
  ); // 왼쪽
  let rightEyeConstant = equation.getConstant(
    verticalGradient,
    rightEyeEdge.x,
    rightEyeEdge.y
  ); // 오른쪽

  //볼의 좌표
  //왼쪽
  let leftPoint = equation.getIntersectPointLine(
    horizonGradient,
    horizonConstant,
    verticalGradient,
    leftEyeConstant
  );
  //오른쪽
  let rightPoint = equation.getIntersectPointLine(
    horizonGradient,
    horizonConstant,
    verticalGradient,
    rightEyeConstant
  );
  let leftX = leftPoint.x;
  let leftY = leftPoint.y;
  let rightX = rightPoint.x;
  let rightY = rightPoint.y;

  let leftRadius = equation.getDistant(
    leftPoint.x,
    leftPoint.y,
    leftEyeEdge.x,
    leftEyeEdge.y
  );
  let rightRadius = equation.getDistant(
    rightPoint.x,
    rightPoint.y,
    rightEyeEdge.x,
    rightEyeEdge.y
  );

  return { leftX, leftY, rightX, rightY, leftRadius, rightRadius };
}
