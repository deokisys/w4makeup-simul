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
export function drawLip(canvas,color="FF0000",positions){
    const ctx = canvas.getContext('2d');
    let topLip=[0,1,2,3,4,5,6,13,14,15];
    let bottomLip=[7,8,9,10,11,12,19,18,17,16];

    ctx.fillStyle=`rgb(${convertHex2Rgb(color)})`

    ctx.beginPath();
    topLip.map((ele,i)=>{
        if(i===0){
            ctx.moveTo(positions[ele].x, positions[ele].y);
            return;
        } 
        ctx.lineTo(positions[ele].x, positions[ele].y);
    })
    ctx.fill();

    ctx.beginPath();
    bottomLip.map((ele,i)=>{
        if(i===0){
            ctx.moveTo(positions[ele].x, positions[ele].y);
            return;
        } 
        ctx.lineTo(positions[ele].x, positions[ele].y);
    })

    ctx.fill();
    return ctx;
}
/**
 * 브러셔 - 중앙 영역
 * @param {*} canvas 
 * @param {*} color 
 * @param {*} positions 
 */
export function drawBlusher(canvas,color="FF0000",positions){
    const ctx = canvas.getContext('2d');
    let rightX=0;
    let rightY=0;
    let rightRadius=0;
    let leftX=0;
    let leftY=0;
    let leftRadius=0;
    let rgbcolor = convertHex2Rgb(color);
    //중앙영역
    //오른쪽
    ctx.beginPath();
    //오른쪽 눈 기준
        //45번 x좌표 
    rightX=positions[45].x;
    //오른쪽 턱
        //y좌표는 13,14번 사이
    rightY=(positions[13].y+positions[14].y)/2;
    //크기
        //x좌표 부터 13번까지의 80%거리를 반지름으로 
    rightRadius=(positions[13].x - rightX)*0.8
    ctx.arc(rightX, rightY, rightRadius, 0, 2 * Math.PI, false);
    //색
    let grdRight = ctx.createRadialGradient(rightX, rightY, rightRadius/6, rightX,rightY,rightRadius);
    grdRight.addColorStop(0, `rgb(${rgbcolor})`);
    grdRight.addColorStop(1, `rgba(${rgbcolor},0)`);

    ctx.fillStyle=grdRight;

    ctx.fill();
    
    

    //왼쪽
    ctx.beginPath();
    //왼쪽 눈 기준
        //x좌표 36번
    leftX=positions[41].x;
    //왼쪽 볼
        //y좌표는 2,3번 사이
    leftY=(positions[2].y+positions[3].y)/2;
    //크기
        //x좌표 부터 3번까지의 80%거리를 반지름
    leftRadius=( leftX-positions[3].x)*0.8
    ctx.arc(leftX, leftY, leftRadius, 0, 2 * Math.PI, false);
    let grdLeft = ctx.createRadialGradient(leftX, leftY, leftRadius/6, leftX,leftY,leftRadius);
    grdLeft.addColorStop(0, `rgb(${rgbcolor})`);
    grdLeft.addColorStop(1, `rgba(${rgbcolor},0)`);

    ctx.fillStyle=grdLeft;

    ctx.fill();

    return "?";
}

function convertHex2Rgb(hex){
    let regex = /([A-F\d]{2})([A-F\d]{2})([A-F\d]{2})$/;
    let result = regex.exec(hex);
    return result ? `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`: null;
}