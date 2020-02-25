import { draw } from "face-api.js";
import equation from './equation.js';

/**
 * 이미지를 canvas에 옮겨 칠하기
 * 
 * @param {*} canvas 
 * @param {*} image 
 */
export function drawImg2Canvas(canvas,image){
    const {width, height} = image;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, width, height);
}
/**
 * 얼굴 영역 칠하기
 * 
 * @param {} canvas 
 * @param {*} image 
 * @param  {...any} area 
 */
export function drawFacearea(canvas,image,...area){
    drawImg2Canvas(canvas,image);
    const ctx = canvas.getContext('2d');
    ctx.globalAlpha = 0.2;
    ctx.fillRect(...area);
}
function drawEye(canvas,...position){
    const ctx = canvas.getContext('2d');
    ctx.globalAlpha = 0.2;
    ctx.fillStyle="red"
    let x=position[0]-10;
    let y=position[1]-10;
    let width=20
    let height=20
    ctx.fillRect(x,y,width,height);
}
/**
 * 양쪽 눈 그리기
 * 
 * @param {*} canvas 
 * @param  {...any} area 
 */
export function drawEyes(canvas,...positions){
    // drawImg2Canvas(canvas,image);
    drawEye(canvas,positions[0],positions[1])
    drawEye(canvas,positions[2],positions[3])
}

export function drawDot(canvas,...position){
    const ctx = canvas.getContext('2d');
    ctx.globalAlpha = 0.2;
    ctx.fillStyle="red"
    let x=position[0]-10;
    let y=position[1]-10;
    let width=20
    let height=20
    ctx.fillRect(x,y,width,height);
}
/**
 * 입술 그리기
 * @param {*} canvas 
 * @param {*} color 
 * @param {*} positions 
 */
export function drawLip(canvas,color,positions){
    const ctx = canvas.getContext('2d');
    ctx.filter = 'blur(4px)';

    ctx.fillStyle=`rgba(${convertHex2Rgb(color.color)},${color.opacity})`
    ctx.globalCompositeOperation = "multiply";
    ctx.beginPath();
    positions.topLip.map((ele,i)=>{
        if(i===0){
            ctx.moveTo(ele.x, ele.y);
            return;
        } 
        ctx.lineTo(ele.x, ele.y);
    })
    ctx.fill();

    ctx.beginPath();
    positions.bottomLip.map((ele,i)=>{
        if(i===0){
            ctx.moveTo(ele.x, ele.y);
            return;
        } 
        ctx.lineTo(ele.x, ele.y);
    })

    ctx.fill();
}
/**
 * 닫힌 입술 그리기
 * @param {*} canvas 
 * @param {*} color 
 * @param {*} positions 
 */
export function drawCloseLip(canvas,color,positions){
    const ctx = canvas.getContext('2d');
    ctx.save();
    let center = {
        x:(positions.topLip[3].x+positions.bottomLip[2].x)/2,
        y:(positions.topLip[3].y+positions.bottomLip[2].y)/2
    }
    let radiusX = equation.getDistant(positions.topLip[0].x,positions.topLip[0].y,positions.topLip[6].x,positions.topLip[6].y)/2;
    let radiusY = equation.getDistant(positions.topLip[3].x,positions.topLip[3].y,positions.bottomLip[2].x,positions.bottomLip[2].y)/2;

    let rgbcolor = convertHex2Rgb(color.color);
    let grd = ctx.createRadialGradient(center.x, center.y, 0, center.x, center.y,radiusX*0.8);

    grd.addColorStop(0, `rgb(${rgbcolor},${color.opacity})`);
    grd.addColorStop(0.4, `rgb(${rgbcolor},${color.opacity})`);
    grd.addColorStop(1, `rgba(${rgbcolor},0)`);
    ctx.fillStyle=grd
    ctx.globalCompositeOperation = "multiply";
    ctx.beginPath();
    positions.topLip.map((ele,i)=>{
        if(i===0){
            ctx.moveTo(ele.x, ele.y);
            return;
        } 
        if(i<=6) ctx.lineTo(ele.x, ele.y);
    })
    positions.bottomLip.map((ele,i)=>{
        if(i<5) ctx.lineTo(ele.x, ele.y);
    })
    ctx.transform(1,0,0,radiusY/radiusX,0,center.y-center.y*(radiusY/radiusX));
    ctx.fill();
    ctx.restore(); 
}
/**
 * 브러셔 - 중앙 영역
 * @param {*} 그리는 영역 
 * @param {*} 색,투명도 
 * @param {*} 위치 
 */
export function drawBlusher(canvas,color,positions){
    const ctx = canvas.getContext('2d');
    ctx.globalCompositeOperation = "multiply";
    let rightX=positions.rightX;
    let rightY=positions.rightY;
    let rightRadius=positions.rightRadius;
    let leftX=positions.leftX;
    let leftY=positions.leftY;
    let leftRadius=positions.leftRadius;
    let rgbcolor = convertHex2Rgb(color.color);

    // //가로줄
    // ctx.beginPath();
    // ctx.moveTo(0, m*0+addition);
    // ctx.lineTo(canvas.width, m*canvas.width+addition);
    // ctx.stroke();

    // //왼쪽 세로줄
    // ctx.beginPath();
    // ctx.moveTo(0, m2*0+addition2_1);
    // ctx.lineTo(1000, m2*1000+addition2_1);
    // ctx.stroke();

    // //오른쪽 세로줄
    // ctx.beginPath();
    // ctx.moveTo(0, m2*0+addition2_2);
    // ctx.lineTo(1000, m2*1000+addition2_2);
    // ctx.stroke();

    //중앙영역
    //오른쪽


    let blushDegree = 25;

    ctx.save();
    ctx.translate(rightX, rightY);
    ctx.rotate((Math.PI / 180) * -blushDegree);
    ctx.translate(-rightX, -rightY); // 예전 위치로 이동하기

    ctx.beginPath();
    ctx.arc(rightX, rightY, rightRadius, 0, 2 * Math.PI, false);
    let grdRight = ctx.createRadialGradient(rightX, rightY, rightRadius*0, rightX,rightY,rightRadius*0.7);
    grdRight.addColorStop(0, `rgb(${rgbcolor},${color.opacity})`);
    grdRight.addColorStop(1, `rgba(${rgbcolor},0)`);
    ctx.fillStyle=grdRight;
    ctx.transform(1,0,0,0.7,0,rightY-rightY*(0.7));
    ctx.fill();
    ctx.restore(); 


    // //왼쪽
    ctx.save();
    ctx.translate(leftX, leftY);
    ctx.rotate((Math.PI / 180) * blushDegree);
    ctx.translate(-leftX, -leftY); // 예전 위치로 이동하기

    ctx.beginPath();
    ctx.arc(leftX, leftY, leftRadius, 0, 2 * Math.PI, false);
    let grdLeft = ctx.createRadialGradient(leftX, leftY, leftRadius*0, leftX,leftY,leftRadius*0.7);
    grdLeft.addColorStop(0, `rgb(${rgbcolor},${color.opacity})`);
    grdLeft.addColorStop(1, `rgba(${rgbcolor},0)`);
    ctx.fillStyle=grdLeft;
    ctx.transform(1,0,0,0.7,0,leftY-leftY*(0.7));
    ctx.fill();    
    ctx.restore(); 

}

function convertHex2Rgb(hex){
    let regex = /([A-F\d]{2})([A-F\d]{2})([A-F\d]{2})$/;
    let result = regex.exec(hex);
    return result ? `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`: null;
}