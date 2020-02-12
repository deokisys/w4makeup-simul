import { drawImg2Canvas, drawLip } from '../../util/draw.js';

export default class Lip{
    constructor(input,output,landmarks){
        this.lipColor="FF0000";
        this.opacity=1;
        this.lipPositions = landmarks.slice(48, 68);
        
        //색 지정
        this.lipsButton = document.querySelector(".lipsMakeButton");
        this.lipsButton.addEventListener("click", function(evt){
            drawImg2Canvas(output, input);
            this.lipColor=evt.target.previousElementSibling.value
            drawLip(output, this.lipColor,this.opacity, this.lipPositions)
        }.bind(this))

        //투명도 지정
        this.lipsOpacityButton = document.querySelector(".lipsOpacity");
        this.lipsOpacityButton.addEventListener("click", function(evt){
            if(evt.target.tagName==="BUTTON"){
                if(evt.target.classList.contains("heavy")){
                    this.opacity>=1?null:this.opacity+=0.1;
                }else if(evt.target.classList.contains("light")){
                    this.opacity<=0?null:this.opacity-=0.1;
                }
                drawImg2Canvas(output, input);
                drawLip(output, this.lipColor,this.opacity, this.lipPositions)
            }
            return;
        }.bind(this))
    }

    getColor(){
        return [this.lipColor,this.opacity];
    }
}
