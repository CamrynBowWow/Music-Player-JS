
/* The IndexedDb */
//createDatabase
import {setMusicValue, retrieveAllMusicInfo, getMusicToPlay, storeMusicIntoPlaylists, getFavoritesIDs, retrieveMusicFromPlaylist, removeMusicFromPlaylist, deleteMusicDb} from './database.js';
import {pauseSong, sourceTag, checkMusicPlayStatus} from './musicPlayerControls.js';
import {hideSidebar, containerClassDiv} from './sideBarFunctions.js';
import {createDivDisplay} from './playlistFunctions.js';
import {musicFetched, checkName} from './playMusicFunction.js';

let musicID;
export let audio;

window.onload = function() {
    //createDatabase();
    musicDisplay();

    // TODO : Please conisder removing this, rather only have a loader on the songs section while it is loading music
    const myTimeout = setTimeout(
        loaded,
        600
    );

}

export const asideDiv = document.querySelector('aside');
const loadingDiv = document.querySelector('.loading');

function loaded(){
    asideDiv.style.display = 'flex';
    containerClassDiv.style.display = 'flex';
    loadingDiv.style.display = 'none';
}

const musicDivDisplays = document.querySelector('.music-container')
export const headerPlaylistArea = document.querySelector('.header-playlist-area h1');

export async function musicDisplay(playlistNameCheck){
    musicID = localStorage.getItem('musicID');
    let allMusic;

    if(playlistNameCheck != null && playlistNameCheck != "All Music"){
        allMusic = await retrieveMusicFromPlaylist(playlistNameCheck); // Fetches music when a playlist or favorites is selected
        headerPlaylistArea.innerText = playlistNameCheck;
    } else {
        headerPlaylistArea.innerText = "All Music";
        allMusic = await retrieveAllMusicInfo();
    }
    
    if(allMusic != null && !(allMusic[0]?.length -1)){ // Creates divs on page load
        await createDivsToDisplay(allMusic, playlistNameCheck);
    }

}

async function createDivsToDisplay(allMusic, playlistNameCheck){
    
    for (let musicValues of allMusic) {
        
        let inFavoritePlaylist = await getFavoritesIDs(musicValues['id'])

        let nameOfMusic = musicValues['name'].replace(/.(mp3)$/, '');

        let mainTagTabs = document.createElement('div');

        mainTagTabs.setAttribute('class', 'main-tag-tabs');
        mainTagTabs.setAttribute('id', musicValues['id'] + "_div");

        // Creates button to play song
        let buttonPlay = document.createElement('button');
        buttonPlay.setAttribute('id', musicValues['id']);
        buttonPlay.innerText = nameOfMusic;
        buttonPlay.addEventListener('click', musicFetched);

        mainTagTabs.appendChild(buttonPlay);

        // Creates icon to add to playlist
        let spanAddBox = document.createElement('span');
        spanAddBox.setAttribute('id', musicValues['id'] + "_add");
        spanAddBox.setAttribute('class', 'material-icons md-36');
        spanAddBox.addEventListener('click', addToPlaylist);
        spanAddBox.innerText = 'add_box';

        mainTagTabs.appendChild(spanAddBox);

        if(playlistNameCheck != "Favorites" && playlistNameCheck != "All Music" && playlistNameCheck != null){
            // Creates remove icon for playlists that are selected
            let spanRemove = document.createElement('span');
            spanRemove.setAttribute('id', musicValues['id'] + "_remove");
            spanRemove.setAttribute('class', 'material-icons md-36');
            spanRemove.addEventListener('click', removeFromPlaylist);
            spanRemove.innerText = 'remove_circle_outline';

            mainTagTabs.appendChild(spanRemove);

        } else if(playlistNameCheck != "Favorites"){
            // Creates icon to delete music
            let spanDelete = document.createElement('span');
            spanDelete.setAttribute('id', musicValues['id'] + "_delete");
            spanDelete.setAttribute('class', 'material-icons md-36');
            spanDelete.addEventListener('click', deleteMusic);
            spanDelete.innerText = 'delete';

            mainTagTabs.appendChild(spanDelete);
        }

        // Creates icon to add to Favorite playlist
        let spanFavorite = document.createElement('span');
        spanFavorite.setAttribute('id', musicValues['id'] + "_heart");
        spanFavorite.setAttribute('class', 'material-icons heart');
        spanFavorite.innerText = 'favorite';

        if(inFavoritePlaylist) { // Gives hover color if in favorite playlist
            spanFavorite.style.color = 'var(--heart-icon-hover-color)';
        }

        spanFavorite.addEventListener('click', addToFavoritePlaylist);

        mainTagTabs.appendChild(spanFavorite);

        // Creates tooltip for music button play
        // let spanMusicNameTooltip = document.createElement('span');
        // spanMusicNameTooltip.setAttribute('class', 'tooltip-music-area');
        // spanMusicNameTooltip.innerText = 'Play';

        // spanFavorite.appendChild(spanMusicNameTooltip);

        musicDivDisplays.appendChild(mainTagTabs);

    }

    if(playlistNameCheck == null){
        await fetchMusicLocalStorage(musicID);
    }
}

/* The IndexedDb end */

// Removes children divs from playlist-area section
export async function removeDivsChildren() {
    while(musicDivDisplays.firstChild){

        musicDivDisplays.removeChild(musicDivDisplays.firstChild);

    }
}


// Fetching music and populating the playlist-area section class

const addDirectory = document.querySelector('.fetch-directory');
const addMusic = document.querySelector('.fetch-music');

function blobToArrayBuffer(blob){
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.addEventListener('loadend', (e) => {
            resolve(reader.result);
        });
        reader.addEventListener('error', reject);
        reader.readAsArrayBuffer(blob);
    })
}

async function makeBlobPutIntoDb(entry){

    const fileData = await entry.getFile();

    let byteSize = await blobToArrayBuffer(fileData); // Turns into blob

    let binary = new Uint8Array(byteSize); // Gets the bytes to use for the audio

    return await setMusicValue(fileData.name, binary, fileData.type);

}

// This will open up a dialog to search for a folder to sort through to get all the music files
addDirectory.addEventListener('click', async () => {

    const directoryFolder = await window.showDirectoryPicker();

    const matchFileSpecs = ".(mp3)$";
    let countMp3 = 0;

    for await (const entry of directoryFolder.values()) {

        if (entry.kind === 'file' && entry.name.match(matchFileSpecs)) {
            countMp3++;
            await makeBlobPutIntoDb(entry);

        }
    }

    if(countMp3 === 0){
        alert("No music file found.");
    } else {
        alert("Music Directory has been added.")
        window.location.reload();
    }
})

// Add music function
addMusic.addEventListener('click', async () => {

    const [filehandle] = await window.showOpenFilePicker();

    const matchFileSpecs = ".(mp3)$";

    if (filehandle.kind === 'file' && filehandle.name.match(matchFileSpecs)){
        const errorCheck = await makeBlobPutIntoDb(filehandle);

        if(errorCheck){
            alert("Music has been added.")
            window.location.reload();
        } else {
            alert("Music has already been downloaded.");
        }
    } else {
        alert("Please select a music file only.");
    }

})

// Fetching music and populating the playlist-area section class end

// Music area icon functions

export async function fetchMusicLocalStorage(id){

    let musicIdentifier = 0;

    if(id == null || id === "null"){
        musicIdentifier = 1;
    } else {
        musicIdentifier = id;
    }

    localStorage.setItem('musicID', musicIdentifier);

    let musicToPlay = await getMusicToPlay([musicIdentifier]);

    if(musicToPlay != null){
        let musicBlob = new Blob([musicToPlay.byteLength], {type: 'audio/mpeg'}) // Turn bytes into blob
        const url = URL.createObjectURL(musicBlob);

        sourceTag.src =  "data:audio/mpeg;base64," + url; // Used for the createObjectURL to store audio to play
        sourceTag.setAttribute('type', musicToPlay.type);

        await checkName(musicToPlay.name);

        audio = new Audio(url);
    }
}


// Volume control

const volumeControl = document.querySelector('#volume-control');
const volumeIcon = document.querySelector('#volume-icon');

export let previousVolume = 30;

volumeControl.addEventListener('input', async () => {

    let volumeLevel = await volumeControl.value;

    if(audio != undefined || audio != null) {
        let vol = volumeLevel / 100;
        audio.volume = vol;

    }

    volumeControl.style.background = `linear-gradient(90deg, var(--slider-background-color-fill) ${volumeLevel}%, var(--slider-background-color) 0%)`;

    await volumeCheck(volumeLevel);

})

async function volumeCheck(volumeLevel){

    if(volumeLevel < 1){

        volumeIcon.innerText = 'volume_off';
        previousVolume = volumeLevel;

    } else if(volumeLevel < 50){

        volumeIcon.innerText = 'volume_down';
        previousVolume = volumeLevel;

    } else {

        volumeIcon.innerText = 'volume_up';
        previousVolume = volumeLevel;

    }

}

// When the icon is clicked it will be muted
volumeIcon.addEventListener('click', async () => {

    if(volumeControl.value > 0){

        muteMusic(); // mute music

    } else {

        unmuteMusic(); // unmute music

    }

})

async function muteMusic(){

    volumeIcon.innerText = 'volume_off';
    volumeControl.value = 0;
    volumeControl.style.background = `linear-gradient(90deg, var(--slider-background-color-fill) 0%, var(--slider-background-color) 0%)`;

    if(audio != undefined || audio != null) {
        audio.muted = true; // mute method
    }

}

export async function unmuteMusic(){

    volumeControl.value = previousVolume;
    volumeControl.style.background = `linear-gradient(90deg, var(--slider-background-color-fill) ${previousVolume}%, var(--slider-background-color) 0%)`;
    await volumeCheck(previousVolume);

    if(audio != undefined || audio != null) {
        audio.muted = false; // mute method
    }

}

/* Slider to show length of music */

const rangeDisplaySlider = document.querySelector('#range-duration');
const timeDisplayText = document.querySelector('#timer-display');
const timeDuration = document.querySelector('#time-duration');

// Function for moving the slider value
sourceTag.ontimeupdate = function() {progressTimeUpdate()};

function progressTimeUpdate() {
    // Every update in music time this function will fire
    audio.addEventListener("timeupdate", () => {
        let currentTime = audio.currentTime;
        let duration = audio.duration;

        const progressBar = (currentTime / duration) * 100;

        rangeDisplaySlider.value = Math.round(progressBar);

        rangeDisplaySlider.style.background = `linear-gradient(90deg, var(--slider-background-color-fill) ${Math.round(progressBar)}%, var(--slider-background-color) 0%)`;


        currentTimeClock(currentTime);

        if(currentTime === duration){
            checkMusicPlayStatus();
            pauseSong();
            //audio.currentTime = 0;
        }
    })

    // Displays the song duration
    audio.addEventListener("loadeddata", () => {
        let durationEnd = audio.duration;

        let totalMinEnd = Math.floor(durationEnd / 60);
        let totalSecEnd = Math.floor(durationEnd % 60);

        if(totalSecEnd < 10){
            totalSecEnd = `0${totalSecEnd}`;
        }

        timeDuration.innerText = `${totalMinEnd}:${totalSecEnd}`;
    })
}

function currentTimeClock(currentTime){

    let currentMinute = Math.floor(currentTime / 60);
    let currentSecond = Math.floor(currentTime % 60);

    if(currentSecond < 10){
        currentSecond = `0${currentSecond}`;
    }

    timeDisplayText.innerText = `${currentMinute}:${currentSecond}`;
}

// For the progressBar to update song when clicked

rangeDisplaySlider.addEventListener('click', (value) => {


    let widthOfSlider = rangeDisplaySlider.clientWidth;
    let valueOffset = value.offsetX;

    let duration = audio.duration;

    audio.currentTime = (valueOffset / widthOfSlider ) * duration;

})

// For when mouse moves the thumb of the range slider
rangeDisplaySlider.addEventListener('input', (value) => {

    rangeDisplaySlider.style.background = `linear-gradient(90deg, var(--slider-background-color-fill) ${value.target.value}%, var(--slider-background-color) 0%)`;

})

/* Slider to show length of music end */

/* For Removing music from playlist */

// When user confirms that they want to remove the music from the playlist it will
// remove it from database first and then remove the div from the playlist in the music-container div
async function removeFromPlaylist(id){
    let answer = confirm('Are you sure you want to remove the music from the playlist?');
    
    let valueId = id.target.id.split("_");
   
    if(answer){ 
        await removeMusicFromPlaylist(valueId[0], headerPlaylistArea.textContent);

        await removeDiv(valueId[0]);
    }
}

/* For Removing music from playlist end */


/* For adding music to playlist */
async function addToPlaylist(id){

    createDivDisplay(id.target.id);

}
/* For adding music to playlist end */


/* For adding to Favorite playlist */
async function addToFavoritePlaylist(id) {
    let valueId = id.target.id.split("_");

    // Will return a true or false depending if music is in Favorite playlist
    let spanHeart = await storeMusicIntoPlaylists("Favorites", valueId[0]);

    let spanFavoriteID = document.querySelector("[id='" + id.target.id + "']")

    if(spanHeart){
        spanFavoriteID.style.color  = "var(--heart-icon-hover-color)";
    } else{
        spanFavoriteID.style.color  = "var(--heart-icon-color)";
    }
}
/* For adding to Favorite playlist end */


/* Favorite Playlist display */
const favoritePlaylistButton = document.querySelector('.favourite-playlist');

favoritePlaylistButton.addEventListener('click', async () => {
    await removeDivsChildren();
    await musicDisplay('Favorites');
    hideSidebar();
})
/* Favorite Playlist display end */


/* All Music display */
const allMusicButton = document.querySelector('.all-songs-playlist');

allMusicButton.addEventListener('click', async () => {
    await removeDivsChildren();
    await musicDisplay('All Music');
    hideSidebar();
})
/* All Music display end */


/* Delete Music from Database */
async function deleteMusic(id){
    let valueId = id.target.id.split('_');

    let answer = confirm('Are you sure you want to permanently delete this?');
    
    if(answer){
        //TODO
        //await deleteKey('musicList', valueId[0]);// Not working might have to do transaction
        await deleteMusicDb(valueId[0])
        await removeDiv(valueId[0]);
        alert("Music has been permanently deleted.");
    }

}
/* Delete Music from Database end */


// This removes div from music-container on both remove from playlist function and 
// delete music from database function
async function removeDiv(id){

    let divRemove = document.querySelector("[id='" + id + "_div']");
        
    musicDivDisplays.removeChild(divRemove);
}