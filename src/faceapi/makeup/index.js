import { drawImg2Canvas} from '../../util/draw.js';
import makeup from './blusher';

export function blushMakeup(input,output,landmark){
    //색 지정
    let blusherButton = document.querySelector(".blusherMakeButton");
    blusherButton.addEventListener("click", function () {
        drawImg2Canvas(output, input);
        makeup(output,landmark)
    })

    //투명도 지정
    let blusherOpacityButton = document.querySelector(".blusherOpacity");
    blusherOpacityButton.addEventListener("click", function (evt) {
        if (evt.target.tagName === "BUTTON") {
            let opacity = Number(blusherOpacityButton.dataset.opacity);
            if (evt.target.classList.contains("heavy")) {
                opacity >= 1 ? null : opacity += 0.1;
            } else if (evt.target.classList.contains("light")) {
                opacity <= 0 ? null : opacity -= 0.1;
            }
            blusherOpacityButton.dataset.opacity = opacity;
            drawImg2Canvas(output, input);
            makeup(output,landmark)
        }
        return;
    })
}
