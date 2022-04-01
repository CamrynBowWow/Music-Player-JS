import {hideSidebar} from './sideBarFunctions.js';


const playlistCreateButton = document.querySelector('.playlist-create');
const playlistDeleteButton = document.querySelector('.playlist-delete');
const playlistDisplay = document.querySelector('.playlists');
const modalContainer = document.querySelector('.modal-container');
const cancelIcon = document.querySelector('#cancel');
const submitButton = document.querySelector('#submit-button');
const cancelButton = document.querySelector('#cancel-button');
const modalContent = document.querySelector('.modal-content');

// If clicked outside of the modal-content div it will close the display
modalContainer.addEventListener('click', function(event){

    let isOutsideModal = modalContent.contains(event.target);
 
    if(!isOutsideModal){
       hideSidebar();
       hideModal();
    }
})

playlistCreateButton.addEventListener('click', () => {
    submitButton.value = 'Create Playlist';
    hideSidebar();
    displayModal();
})

function displayModal(){
    modalContainer.style.display = 'block';
}

export function hideModal(){
    modalContainer.style.display = 'none';
}

// Cancels any of the playlist features, Add or Delete or Display Playlist
cancelIcon.addEventListener('click', () =>{
    hideModal();
})