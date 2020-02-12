import { drawImg2Canvas, drawLip,drawBlusher } from '../../util/draw.js';

export default function fullmakeup(input,output,landmarks,...colors){
    drawImg2Canvas(output, input);
    drawLip(output, colors[0],colors[1], landmarks.slice(48, 68))
    drawBlusher(output, colors[2],colors[3], landmarks)
}