const GetVal = createRemap()

var level_elements

var old_height = min
var new_height = min

document.addEventListener("DOMContentLoaded", async function (event) {
    level_elements = document.querySelectorAll("div.vial_fluid_masked > *");
    loop();
})

function createRemap() {
    return function remaper(x) {
        return (x - goalMin) * (max - min) / (goalMax - goalMin) + min;
    };
}

function lerp(value, from, to)
{
    return from + ((to - from) * value)
}

function remaper(x,fromMin,fromMax,toMin,toMax) {
    return (x - fromMin) * (toMax - toMin) / (fromMax - fromMin) + toMin;
}

function loop()
{
    if (CURRENT_VALUE == goalMax)
        return
    CURRENT_VALUE = Math.min(CURRENT_VALUE, goalMax)
    new Promise(r => setTimeout(r, 1000)).then(() => {
        loop()
    })
    old_height    = new_height
    target_height = GetVal(CURRENT_VALUE)
    level_elements.forEach(element => {
        element.counter = 0
        new Promise(r => setTimeout(r,16)).then( () => {
            animloop(element)
        });
    });
}


function animloop(element)
{
    element.counter = element.counter + 1 > 60 ? 1 : element.counter + 1
    delta = (1/60) * element.counter
    new_height = lerp(delta, old_height, target_height)
    if(element.counter < 60)
        new Promise(r => setTimeout(r,1/60)).then( () => {animloop(element);});
    element.style.bottom = "calc(-1700px * " + new_height +  ")";
}