import { drawImg2Canvas, drawLip } from '../../util/draw.js';

export default class Lib{
    constructor(input,output,landmarks){
        this.libColor="FF0000";
        this.lipPositions = landmarks.slice(48, 68);
        this.libsButton = document.querySelector(".libsMakeButton");
        this.libsButton.addEventListener("click", function(evt){
            drawImg2Canvas(output, input);
            this.libColor=evt.target.previousElementSibling.value
            drawLip(output, this.libColor, this.lipPositions)
        }.bind(this))
    }

    getColor(){
        return this.libColor;
    }
}
