import {modalContainer} from './playlistFunctions.js';

const backgroundModalDialog = document.querySelector("#background-modal-dialog")
const confirmationDialog = document.querySelector('.dialog-confirmation');
const cancelConfirmation = document.querySelector('#cancel-confirmation');
export const okConfirmation = document.querySelector('#ok-confirmation');

let valueCheck;

export function dialogOpen(text, value){
    valueCheck = value;

    document.querySelector('.dialog-confirmation p').innerText = text;
    confirmationDialog.style.visibility = 'visible';
    backgroundModalDialog.style.display = 'block'; 
    
    // Does a check to see if the modal for deleting a playlist is visible
    if(valueCheck === 1){
        modalContainer.style.display = 'none';
    }
}

function closeDialog(){
    backgroundModalDialog.style.display = "none";
    confirmationDialog.style.visibility = 'hidden';
}

okConfirmation.addEventListener('click', () => {
    closeDialog();
})

cancelConfirmation.addEventListener('click', () => {
    closeDialog();

    if(valueCheck === 1){
        modalContainer.style.display = 'block';
    }
})

