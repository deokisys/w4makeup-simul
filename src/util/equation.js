/**
 * 4개의 좌표의 교차점
 * 
 * @param {*} x1 
 * @param {*} y1 
 * @param {*} x2 
 * @param {*} y2 
 * @param {*} X1 
 * @param {*} Y1 
 * @param {*} X2 
 * @param {*} Y2 
 */
function getIntersectPoint(x1,y1,x2,y2,X1,Y1,X2,Y2){
    let m1 = getGradient(x1,y1,x2,y2);
    let c1 = getConstant(m1,x1,y1);
    let m2 = getGradient(X1,Y1,X2,Y2);
    let c2 = getConstant(m2,X1,Y1);
    return getIntersectPointLine(m1,c1,m2,c2)
}

/**
 * y=m1x+c1과 y=m2x+c2의 교점
 * 
 * @param {*} m1 
 * @param {*} c1 
 * @param {*} m2 
 * @param {*} c2 
 */
function getIntersectPointLine(m1,c1,m2,c2){
    let x = -(c1-c2)/(m1-m2)
    let y = m1*(-(c1-c2)/(m1-m2))+c1
    return {x,y}
}

/**
 * 두 직선의 기울기
 * 
 * @param {*} x1 
 * @param {*} y1 
 * @param {*} x2 
 * @param {*} y2 
 */
function getGradient(x1,y1,x2,y2){
    return (y1-y2) / (x1 - x2);
}

/**
 * 기울기와 x,y를 통해 상수c 구하기
 * y=mx+c
 * @param {*} m 
 * @param {*} x 
 * @param {*} y 
 */
function getConstant(m,x,y){
    return -(m*x)+ y;
}

/**
 * 두 직선의 거리 구하기
 * 
 * @param {*} x1 
 * @param {*} y1 
 * @param {*} x2 
 * @param {*} y2 
 */
function getDistant(x1,y1,x2,y2){
    return Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2));
}

export default {getIntersectPoint,getGradient, getConstant, getDistant, getIntersectPointLine}