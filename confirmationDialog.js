const backgroundModalDialog = document.querySelector("#background-modal-dialog")
const confirmationDialog = document.querySelector('.dialog-confirmation');
const cancelConfirmation = document.querySelector('#cancel-confirmation');
const okConfirmation = document.querySelector('#ok-confirmation');

export function dialogOpen(text){
    document.querySelector('.dialog-confirmation p').innerText = text;
    confirmationDialog.style.visibility = 'visible';
    backgroundModalDialog.style.display = 'block';

}

function closeDialog(){
    backgroundModalDialog.style.display = "none";
}

cancelConfirmation.addEventListener('click', () => {
    closeDialog();
    confirmationDialog.style.visibility = 'hidden';
})

okConfirmation.addEventListener('click', () => {
    closeDialog();
    confirmationDialog.style.visibility = 'hidden';
    return true;
})
