import {hideSidebar} from './sideBarFunctions.js';
import {storeMusicIntoPlaylists, getPlaylistNames} from './database.js';


const playlistCreateButton = document.querySelector('.playlist-create');
const playlistDeleteButton = document.querySelector('.playlist-delete');
const playlistDisplay = document.querySelector('.playlists');
const modalContainer = document.querySelector('.modal-container');
const cancelIcon = document.querySelector('#cancel');
const submitButton = document.querySelector('#submit-button');
const cancelButton = document.querySelector('#cancel-button');
const modalContent = document.querySelector('.modal-content');
const playlistNameInput = document.querySelector('#playlist-name');
const addPlaylistDiv = document.querySelector('.add-playlist');
const submitAreaDiv = document.querySelector('.submit-area');

// If clicked outside of the modal-content div it will close the display
modalContainer.addEventListener('click', function(event){

    let isOutsideModal = modalContent.contains(event.target);
 
    if(!isOutsideModal){
       hideSidebar();
       hideModal();
    }
})

// This will open up the modal container for the user to create a playlist
playlistCreateButton.addEventListener('click', () => {
    submitButton.value = 'Create';
    addPlaylistDiv.style.display = 'flex';
    submitAreaDiv.style.display = 'flex';
    document.querySelector('.modal-header h1').innerText = 'Create Playlist';
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
    addPlaylistDiv.style.display = 'none';
    submitAreaDiv.style.display = 'none';
}

// Cancels any of the playlist features, Add or Delete or Display Playlist
cancelIcon.addEventListener('click', () =>{
    hideModal();
})

// This will insert the new playlist into the database table playlists with an empty array as the value
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

playlistDisplay.addEventListener('click', async () => {

    let namesOfPlaylists = await getPlaylistNames();
    
    console.log(namesOfPlaylists)
    

    // for(let playlistValue of playlistName[0]){
    //     console.log(playlistValue);
    //     // let playlistDivDisplay = document.createElement('div');
    
    //     // playlistDivDisplay.setAttribute('class', 'playlist-names-display');
    
    //     // let buttonPlaylist = document.createElement('button');
    //     // buttonPlaylist.setAttribute('id', playlistValue)
    // }

        
  


})