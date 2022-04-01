import {hideSidebar} from './sideBarFunctions.js';


const playlistCreateButton = document.querySelector('.playlist-create');
const playlistDeleteButton = document.querySelector('.playlist-delete');
const playlistDisplay = document.querySelector('.playlists');
const modalContainer = document.querySelector('.modal-container');
const cancelIcon = document.querySelector('#cancel');

playlistCreateButton.addEventListener('click', () => {
    hideSidebar();
    displayModal();
})

function displayModal(){
    modalContainer.style.display = 'block';
}

function hideModal(){
    modalContainer.style.display = 'none';
}

// Cancels any of the playlist features, Add or Delete or Display Playlist
cancelIcon.addEventListener('click', () =>{
    hideModal();
})