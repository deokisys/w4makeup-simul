import { drawImg2Canvas, drawBlusher } from '../../util/draw.js';

export default class Blusher{
    constructor(input,output,landmarks){
        this.blusherColor="FF0000";
        this.blusherButton = document.querySelector(".blusherMakeButton");
        this.blusherButton.addEventListener("click", function(evt){
            drawImg2Canvas(output, input);
            this.blusherColor = evt.target.previousElementSibling.value;
            drawBlusher(output, this.blusherColor, landmarks)
        }.bind(this))
    }

    getColor(){
        return this.blusherColor;
    }
}

