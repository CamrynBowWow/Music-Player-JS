const snackbar = document.querySelector("#snack-bar");

export function makeSnackbarVisible(text){
    snackbar.innerText = text;
    snackbar.classList.add("show");
    
    setTimeout(
        makeInvisible,
        5400
    );
        
}

function makeInvisible(){
    snackbar.classList.replace("show", "hide");
}