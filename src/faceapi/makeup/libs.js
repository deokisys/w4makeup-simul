import { drawImg2Canvas, drawLip } from '../../util/draw.js';

export default class Lib{
    constructor(input,output,landmarks){
        this.libColor="FF0000";
        this.opacity=1;
        this.lipPositions = landmarks.slice(48, 68);
        
        //색 지정
        this.libsButton = document.querySelector(".libsMakeButton");
        this.libsButton.addEventListener("click", function(evt){
            drawImg2Canvas(output, input);
            this.libColor=evt.target.previousElementSibling.value
            drawLip(output, this.libColor,this.opacity, this.lipPositions)
        }.bind(this))

        //투명도 지정
        this.libsOpacityButton = document.querySelector(".libsOpacity");
        this.libsOpacityButton.addEventListener("click", function(evt){
            if(evt.target.tagName==="BUTTON"){
                if(evt.target.classList.contains("heavy")){
                    this.opacity>=1?null:this.opacity+=0.1;
                }else if(evt.target.classList.contains("light")){
                    this.opacity<=0?null:this.opacity-=0.1;
                }
                drawImg2Canvas(output, input);
                drawLip(output, this.libColor,this.opacity, this.lipPositions)
            }
            return;
        }.bind(this))
    }

    getColor(){
        return [this.libColor,this.opacity];
    }
}
