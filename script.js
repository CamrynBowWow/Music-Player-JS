
/* The IndexedDb */

import {createDatabase, setMusicValue, retrieve, getMusicToPlay, storeMusicIntoPlaylists, getFavoritesIDs, retrieveMusicFromPlaylist} from './database.js'

let musicID;

window.onload = function() {
    createDatabase();
    musicDisplay();

    // TODO : Please conisder removing this, rather only have a loader on the songs section while it is loading music
    const myTimeout = setTimeout(
        loaded,
        600
    );

}


// TODO : Be more descriptive when naming variables
const peenDiv = document.querySelector('.container-class');
const asideDiv = document.querySelector('aside');
const loadingDiv = document.querySelector('.loading');
const musicContainer = document.querySelector('.music-container');

function loaded(){
    //loadingDiv.querySelector('h2').innerHTML = 'Loading Music Player';
    asideDiv.style.display = 'flex';
    peenDiv.style.display = 'flex';
    loadingDiv.style.display = 'none';
}

function loading(){// Still working on it
    //loadingDiv.querySelector('h2').innerText = 'Loading Music';
    musicContainer.querySelectorAll('.main-tag-tabs').zIndex = '-1';
    musicContainer.prependChild(loadingDiv);
    loadingDiv.style.display = 'block';
}

const musicDivDisplays = document.querySelector('.music-container')
//const playlistAreaSection = document.querySelector('#playlist-area'); Not in use yet # Look here for next and pre btn Cam
const headerPlaylistArea = document.querySelector('.header-playlist-area h1');

async function musicDisplay(playlistNameCheck){
    musicID = localStorage.getItem('musicID');
    let allMusic;

    if(playlistNameCheck != null && playlistNameCheck != "All Music"){
        allMusic = await retrieveMusicFromPlaylist(playlistNameCheck);
        headerPlaylistArea.innerText = playlistNameCheck;
    } else {
        headerPlaylistArea.innerText = "All Music";
        allMusic = await retrieve();
    }

    if(allMusic != null && allMusic.length-1){
        await createDivsToDisplay(allMusic, playlistNameCheck);
    }

}

async function createDivsToDisplay(allMusic, playlistNameCheck){
    for (let musicValues of allMusic) {

        let inFavoritePlaylist = await getFavoritesIDs(musicValues['id'])

        let nameOfMusic = musicValues['name'].replace(/.(mp3)$/, '');

        let mainTagTabs = document.createElement('div');

        mainTagTabs.setAttribute('class', 'main-tag-tabs');

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

        if(playlistNameCheck == null){
            // Creates icon to delete music
            let spanDelete = document.createElement('span');
            spanDelete.setAttribute('id', musicValues['id' + "_delete"]);
            spanDelete.setAttribute('class', 'material-icons md-36');
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

    if(playlistNameCheck == null){ // Needs work still
        await fetchMusicLocalStorage(musicID);
    }
}

/* The IndexedDb end */

// Removes children divs from playlist-area section
async function removeDivsChildren() {
    while(musicDivDisplays.firstChild){

        musicDivDisplays.removeChild(musicDivDisplays.firstChild);

    }
}

// Sidebar function

const menuDisplay = document.querySelector('#menu-items');
const headerSize = document.querySelector('aside');
const sideBarA = document.querySelector('aside a');
const sidebarMenu = document.querySelector('aside a span');

sidebarMenu.addEventListener('click', async () => {

    if(menuDisplay.className === 'hidden' ){

        headerSize.style.transform = 'translateX(0rem)';
        //sideBarA.style.boxShadow = 'var(--box-shadow-color)';
        sideBarA.style.width = "3rem";
        sideBarA.style.left = "9rem";
        menuDisplay.classList.remove('hidden');
        menuDisplay.classList.add('show');

    } else {
        headerSize.style.transform = 'translateX(-12rem)';
        menuDisplay.classList.remove('show');
        menuDisplay.classList.add('hidden');
        sideBarA.style.left = "12rem";
        sideBarA.style.width = "3.5rem";
        //sideBarA.style.boxShadow = 'var(--box-shadow-color)';

    }
})

// Sidebar function end

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

    await setMusicValue(fileData.name, binary, fileData.type)

}

addDirectory.addEventListener('click', async () => {

    const peen = await window.showDirectoryPicker();

    const matchFileSpecs = ".(mp3)$";
    let countMp3 = 0;

    for await (const entry of peen.values()) {

        if (entry.kind === 'file' && entry.name.match(matchFileSpecs)) {
            countMp3++;
            await makeBlobPutIntoDb(entry);

        }
    }

    // alert("Music Directory has been added.")
    //alert(countMp3 === 0 ? "No music file found." : "Music Directory has been added")
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
        await makeBlobPutIntoDb(filehandle);

        alert("Music has been added.")
        window.location.reload();
    } else {
        alert("Please select a music file only.");
    }

})

// Fetching music and populating the playlist-area section class end

// Music area icon functions

// TODO : Consider moving all the things related to the currently playing song card to a seperate js file

// For play and pause music
const playButton = document.querySelector('#play-button');
const sourceTag = document.querySelector("#audioToPlay");
const songNameHeader = document.querySelector(".container-play-music-area h1");
const artistNameHeader = document.querySelector(".container-play-music-area h3");



let audio;

async function pauseSong() {

    audio.pause();

    playButton.classList.remove('playing');

    playButton.querySelector('span.material-icons').innerText = 'play_arrow';

}

async function playSong(value) {

    if(value === undefined || value === ''){
        alert('No music has been selected to play.')
        return;
    }

    unmuteMusic();

    audio.play();
    audio.volume = previousVolume / 100;

    playButton.classList.add('playing');
    playButton.querySelector('span.material-icons').innerText = 'pause';
}

playButton.addEventListener('click', () => {

    const isPlaying = playButton.classList.contains('playing');

    let valueToPlayOrPause = sourceTag.getAttribute('src');

    if(!isPlaying) {
        playSong(valueToPlayOrPause);
    } else {
        pauseSong();
    }

})

// For repeat music
const repeatButton = document.querySelector('#repeat-song');

function repeatOff(){
    repeatButton.classList.add('repeat-off');
    repeatButton.querySelector('span.material-icons').innerText = 'repeat';
    repeatButton.style.opacity = "0.5";
}

function repeatSong(){
    repeatButton.classList.remove('repeat_playlist');
    repeatButton.querySelector('span.material-icons').innerText = 'repeat_one';
    repeatButton.style.opacity = "1";
}

function repeatPlaylist(){
    repeatButton.classList.add('repeat_playlist');
    repeatButton.classList.remove('repeat-off');
    repeatButton.querySelector('span.material-icons').innerText = 'repeat';
    repeatButton.style.opacity = "1";
}

// For repeating the music that is playing or repeat whole playlist
repeatButton.addEventListener('click', () => {

    if(repeatButton.classList.contains('repeat-off')){
        repeatPlaylist();
    } else if(repeatButton.classList.contains('repeat_playlist')){
        repeatSong();
    } else {
        repeatOff();
    }

})

// For shuffle music
const shuffleButton = document.querySelector('#shuffle');

function shuffleSong(){
    shuffleButton.classList.remove('shuffle_off');

    shuffleButton.querySelector('span.material-icons').innerText = 'shuffle';
}

function shuffleOff(){
    shuffleButton.classList.add('shuffle_off');

    shuffleButton.querySelector('span.material-icons').innerText = 'sync_alt';
}

shuffleButton.addEventListener('click', () => {

    const isShuffle = shuffleButton.classList.contains('shuffle_off');

    if(isShuffle){
        shuffleSong();
    } else {
        shuffleOff();
    }

})

// Music area icon functions end
// TODO I must work on this function because plays music when goes to another playlist
async function fetchMusicLocalStorage(id){

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

// Music selected to play

async function musicFetched(id){

    if(audio != null){
        audio.pause();
    }

    let musicToPlay = id.target.id;

    await fetchMusicLocalStorage(musicToPlay);

    playSong(musicToPlay);

}

async function checkName(nameOfMusic){

    let songNameAndArtist = nameOfMusic.split("-");

    if(songNameAndArtist.length > 1){
        let musicName = songNameAndArtist[1].replace(/.(mp3)$/, '');

        songNameHeader.innerText = musicName.trim();
        artistNameHeader.innerText = songNameAndArtist[0].trim();

    } else {
        let musicName = nameOfMusic.replace(/.(mp3)$/, '');

        songNameHeader.innerText = musicName.trim();
        artistNameHeader.innerText = 'Unknown';
    }

}

// Music selected to play end

// Volume control

const volumeControl = document.querySelector('#volume-control');
const volumeIcon = document.querySelector('#volume-icon');

let previousVolume = 30;

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

async function unmuteMusic(){

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
            pauseSong();
            audio.currentTime = 0;
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
// TODO : Please change to camelCase as all your other functions are
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

/* For deleting music */

/* For deleting music end */

/* For adding music to playlist */

async function addToPlaylist(id){

    storeMusicIntoPlaylists("Vibe", id.target.id);

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

})

/* Favorite Playlist display end */


/* All Music display */

const allMusicButton = document.querySelector('.all-songs-playlist');

allMusicButton.addEventListener('click', async () => {
    await removeDivsChildren();
    await musicDisplay('All Music');
})

/* All Music display end */