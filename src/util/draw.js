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