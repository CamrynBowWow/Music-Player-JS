const backgroundModalDialog = document.querySelector("#background-modal-dialog")
const confirmationDialog = document.querySelector('.dialog-confirmation');
const cancelConfirmation = document.querySelector('#cancel-confirmation');
const okConfirmation = document.querySelector('#ok-confirmation');

export function dialogOpen(text){
    let value

    document.querySelector('.dialog-confirmation p').innerText = text;
    confirmationDialog.style.visibility = 'visible';
    backgroundModalDialog.style.display = 'block';

    
    return value
}

function closeDialog(){
    backgroundModalDialog.style.display = "none";
    confirmationDialog.style.visibility = 'hidden';
}

okConfirmation.addEventListener('click', () => {
    closeDialog();
    return value = "false";
})

cancelConfirmation.addEventListener('click', () => {
    closeDialog();
})

