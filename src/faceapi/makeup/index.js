import { drawImg2Canvas} from '../../util/draw.js';
import makeupblush from './blusher';
import makeuplip from './lips';


export function blushMakeup(input,output,landmark){
    //색 지정
    let blusherColor = document.querySelector("#blushValue");
    blusherColor.addEventListener("change",()=>{
        fullMakeup(input,output,landmark)
    })

    //투명도 지정
    let blusherOpacityButton = document.querySelector(".blusherOpacity");
    blusherOpacityButton.addEventListener("change",(evt)=>{
        fullMakeup(input,output,landmark)
    })
}

export function lipMakeup(input,output,landmark){
    //색 지정
    let lipsColor = document.querySelector("#lipValue");
    lipsColor.addEventListener("change",()=>{
        fullMakeup(input,output,landmark)
    })

    //투명도 지정
    let lipsOpacityButton = document.querySelector(".lipsOpacity");
    lipsOpacityButton.addEventListener("change",() =>{
        fullMakeup(input,output,landmark)
    })
}
export function fullMakeup(input,output,landmark){
    drawImg2Canvas(output, input);
    makeuplip(output,input,landmark)
    makeupblush(output,landmark)
}
