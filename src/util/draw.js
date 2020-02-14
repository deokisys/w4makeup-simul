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

    ctx.fillStyle=`rgba(${convertHex2Rgb(color.color)},${color.opacity})`
    ctx.globalCompositeOperation = "overlay";
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
 * 브러셔 - 중앙 영역
 * @param {*} 그리는 영역 
 * @param {*} 색,투명도 
 * @param {*} 위치 
 */
export function drawBlusher(canvas,color,positions){
    const ctx = canvas.getContext('2d');
    ctx.globalCompositeOperation = "overlay";
    let rightX=positions.rightX;
    let rightY=positions.rightY;
    let rightRadius=positions.rightRadius;
    let leftX=positions.leftX;
    let leftY=positions.leftY;
    let leftRadius=positions.leftRadius;
    let rgbcolor = convertHex2Rgb(color.color);
    //중앙영역
    //오른쪽
    ctx.beginPath();
    ctx.arc(rightX, rightY, rightRadius, 0, 2 * Math.PI, false);
    //색
    let grdRight = ctx.createRadialGradient(rightX, rightY, rightRadius/6, rightX,rightY,rightRadius);
    grdRight.addColorStop(0, `rgb(${rgbcolor},${color.opacity})`);
    grdRight.addColorStop(1, `rgba(${rgbcolor},0)`);
    ctx.fillStyle=grdRight;
    ctx.fill();
    //왼쪽
    ctx.beginPath();
    ctx.arc(leftX, leftY, leftRadius, 0, 2 * Math.PI, false);
    //왼쪽 색지정
    let grdLeft = ctx.createRadialGradient(leftX, leftY, leftRadius/6, leftX,leftY,leftRadius);
    grdLeft.addColorStop(0, `rgb(${rgbcolor},${color.opacity})`);
    grdLeft.addColorStop(1, `rgba(${rgbcolor},0)`);
    ctx.fillStyle=grdLeft;
    ctx.fill();
}

function convertHex2Rgb(hex){
    let regex = /([A-F\d]{2})([A-F\d]{2})([A-F\d]{2})$/;
    let result = regex.exec(hex);
    return result ? `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`: null;
}