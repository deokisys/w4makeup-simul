import { drawLip } from '../../util/draw.js';

//입술의 위치를 잡는 함수
function getLipsPosition(landmarks){

    let topLip=[0,1,2,3,4,5,6,15,14,13];
    let bottomLip=[7,8,9,10,11,12,19,18,17,16];
    
    let positions = {
        topLip:topLip.map((ele)=>{
            return {x:landmarks[ele+48].x,y:landmarks[ele+48].y}
        }),
        bottomLip:bottomLip.map((ele)=>{
            return {x:landmarks[ele+48].x,y:landmarks[ele+48].y}
        })
    }
    return positions;
}



export default function makeup(output,landmark){
    let color=document.querySelector(".lipscolor").value;
    let opacity=document.querySelector(".lipsOpacity").dataset.opacity;
    let positions = getLipsPosition(landmark);    
    drawLip(output, {color,opacity}, positions)
}