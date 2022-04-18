const colorChange = document.querySelector('#color-change');

export function startColorChange(){
    colorChange.classList.add("show");
}

export function stopColorChange(){
    colorChange.classList.replace("show", "hide");
}