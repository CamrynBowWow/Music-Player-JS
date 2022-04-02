import {hideSidebar} from './sideBarFunctions.js';
import {storeMusicIntoPlaylists} from './database.js';


const playlistCreateButton = document.querySelector('.playlist-create');
const playlistDeleteButton = document.querySelector('.playlist-delete');
const playlistDisplay = document.querySelector('.playlists');
const modalContainer = document.querySelector('.modal-container');
const cancelIcon = document.querySelector('#cancel');
const submitButton = document.querySelector('#submit-button');
const cancelButton = document.querySelector('#cancel-button');
const modalContent = document.querySelector('.modal-content');
const playlistNameInput = document.querySelector('#playlist-name');

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

cancelButton.addEventListener('click', () => {
    hideModal();
})

function displayModal(){
    modalContainer.style.display = 'block';
}

export function hideModal(){
    modalContainer.style.display = 'none';
    playlistNameInput.value = '';
}

// Cancels any of the playlist features, Add or Delete or Display Playlist
cancelIcon.addEventListener('click', () =>{
    hideModal();
})

submitButton.addEventListener('click', () => {
   
    const alertValue = playlistNameInput.value.length > 30 ? 'is longer then 30 characters.' : playlistNameInput.value.length <= 0 ? 'is empty.' : 'has be added.';

    if(playlistNameInput.value.length > 30 || playlistNameInput.value.length <= 0){
        alert('Playlist Name ' + alertValue);
    } else {
        storeMusicIntoPlaylists(playlistNameInput.value);
        alert('Playlist has been created successfully.');
        hideModal();
    }
})