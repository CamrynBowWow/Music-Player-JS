import {hideSidebar} from './sideBarFunctions.js';
import {storeMusicIntoPlaylists, getPlaylistNames, deleteKey} from './database.js';
import {removeDivsChildren, musicDisplay, headerPlaylistArea} from './script.js';


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
const displayPlaylistDiv = document.querySelector('.display-playlists');

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
    displayPlaylistDiv.style.display = 'none';

    while(displayPlaylistDiv.firstChild){
        displayPlaylistDiv.removeChild(displayPlaylistDiv.firstChild);
    }
}

// Cancels any of the playlist features, Add or Delete or Display Playlist
cancelIcon.addEventListener('click', () =>{
    hideModal();
})

// This will insert the new playlist into the database table playlists with an empty array as the value
submitButton.addEventListener('click', () => {
   
    const alertValue = playlistNameInput.value.length > 30 ? 'is longer then 30 characters.' : playlistNameInput.value.length <= 0 ? 'is empty.' : isEmptyOrSpaces(playlistNameInput.value) ? 'can not be spaces or empty.' : 'has be added.';
    
    if(playlistNameInput.value.length > 30 || playlistNameInput.value.length <= 0 || isEmptyOrSpaces(playlistNameInput.value)){
        alert('Playlist Name ' + alertValue);
    } else {
        storeMusicIntoPlaylists(playlistNameInput.value);
        alert('Playlist has been created successfully.');
        hideModal();
    }
})

function isEmptyOrSpaces(string){
    return string === null || string.match(/^ *$/) !== null;
}

playlistDeleteButton.addEventListener('click', async () => {
    let valueDisplay = 2;
    await createDivDisplay(valueDisplay);
})

// When playlist button is selected
playlistDisplay.addEventListener('click', async () => {
    let valueDisplay = 1;
    await createDivDisplay(valueDisplay);
})

// Creates playlists menu to select playlist with music in it
export async function createDivDisplay(value){

    musicID = value;

    let namesOfPlaylists = await getPlaylistNames();
    
    document.querySelector('.modal-header h1').innerText = 'Playlists';
    displayPlaylistDiv.style.display = 'flex';

    for(let playlistValue of namesOfPlaylists){

        let playlistDivDisplay = document.createElement('div'); // Creates div for selecting playlist
    
        playlistDivDisplay.setAttribute('class', 'playlist-names-display');
        playlistDivDisplay.setAttribute('id', playlistValue[0]);
        playlistDivDisplay.addEventListener('click', value === 1 ? displayMusicFromPlaylist :  value === 2 ? deletePlaylist : addMusicToPlaylist);// Function to display music and functionality depending on what was selected
        playlistDivDisplay.innerText = playlistValue[0];

        let spanTagMusicTotal = document.createElement('span'); // Creates span on div to display all the music in the playlist

        spanTagMusicTotal.setAttribute('class', 'music-total-span');
        spanTagMusicTotal.innerText = playlistValue[1].toString();

        playlistDivDisplay.appendChild(spanTagMusicTotal);

        displayPlaylistDiv.appendChild(playlistDivDisplay);
        
    }
    
    hideSidebar();
    displayModal();
}

// Adds music to music-container div
async function displayMusicFromPlaylist(value){

    let playlistId = value.target.id;

    await removeDivsChildren();
    await musicDisplay(playlistId);
    hideModal();
}

let musicID;

// Adds to playlist
async function addMusicToPlaylist(playlistName){

    let valueId = musicID.split("_");
   
    let musicCheckInPlaylist = await storeMusicIntoPlaylists(playlistName.target.id, valueId[0]);
    
    if(musicCheckInPlaylist){
        alert('Music is already in playlist');
    } else {
        alert('Music has been added to playlist');
        hideModal();
    }
 
}
// Adds to playlist end

// Deletes playlist 
async function deletePlaylist(id){ 

    let answer = confirm('Are you sure you want to delete this playlist?');
    
    if(answer){
        await deleteKey(id.target.id);
        hideModal();
        await checkPlaylist(id.target.id);
    }

}

// Checks to see what playlist on and if on same playlist as one being deleted
// Will load all music playlist afterwards
async function checkPlaylist(headerText){

    if(headerText === headerPlaylistArea.textContent){
        await removeDivsChildren();
        await musicDisplay('All Music');
    }
}