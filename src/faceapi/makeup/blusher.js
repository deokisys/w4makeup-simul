import { drawImg2Canvas, drawBlusher } from '../../util/draw.js';

export default class Blusher{
    constructor(input,output,landmarks){
        this.blusherColor="FF0000";
        this.opacity=1;

        //색 지정
        this.blusherButton = document.querySelector(".blusherMakeButton");
        this.blusherButton.addEventListener("click", function(evt){
            drawImg2Canvas(output, input);
            this.blusherColor = evt.target.previousElementSibling.value;
            drawBlusher(output, this.blusherColor,this.opacity, landmarks)
        }.bind(this))

        //투명도 지정
        this.blusherOpacityButton = document.querySelector(".blusherOpacity");
        this.blusherOpacityButton.addEventListener("click", function(evt){
            if(evt.target.tagName==="BUTTON"){
                if(evt.target.classList.contains("heavy")){
                    this.opacity>=1?null:this.opacity+=0.1;
                }else if(evt.target.classList.contains("light")){
                    this.opacity<=0?null:this.opacity-=0.1;
                }
                drawImg2Canvas(output, input);
                drawBlusher(output, this.blusherColor,this.opacity, landmarks)
            }
            return;
        }.bind(this))
    }

    getColor(){
        return [this.blusherColor,this.opacity];
    }
}

