
import { unmuteMusic, audio, previousVolume, fetchMusicLocalStorage, musicID } from "./script.js";
import { getNextMusic } from './playMusicFunction.js';
import { makeSnackbarVisible } from './snackbar.js';

// Global variables for checking function that can be used 
let shuffleOnOff = false;
let repeatValue = "repeatOff"; // add value here

// For play and pause music
const playButton = document.querySelector('#play-button');
export const sourceTag = document.querySelector("#audioToPlay");
const nextButton = document.querySelector("#forward-song");
const previousButton = document.querySelector("#backward-song");

// Will get the next song in the playlist
nextButton.addEventListener('click', async () => {
    audio.pause();
    let musicId = await getNextMusic(shuffleOnOff, 'next');

    await fetchPlayMusic(musicId);
})

// Will get the previous song in the playlist
previousButton.addEventListener('click', async () => {
    audio.pause();
    let musicId = await getNextMusic(shuffleOnOff, 'prev');

    await fetchPlayMusic(musicId);
})

export async function pauseSong() {

    audio.pause();

    playButton.classList.remove('playing');

    playButton.querySelector('span.material-icons').innerText = 'play_arrow';
    playButton.querySelector('span.tooltip-music-control').innerText = 'Play';

}

export async function playSong(value) {
    
    if(value === undefined || value === ''){
        makeSnackbarVisible("No music has been selected to play.");
        return;
    }

    unmuteMusic();

    audio.play();
    audio.volume = previousVolume / 100;

    playButton.classList.add('playing');
    playButton.querySelector('span.material-icons').innerText = 'pause';
    playButton.querySelector('span.tooltip-music-control').innerText = 'Pause';

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
    repeatButton.querySelector('span.tooltip-music-control').innerText = 'Repeat off';
    repeatButton.style.opacity = "0.5";
    repeatValue = 'repeatOff';
}

function repeatSong(){
    repeatButton.classList.remove('repeat_playlist');
    repeatButton.querySelector('span.material-icons').innerText = 'repeat_one';
    repeatButton.querySelector('span.tooltip-music-control').innerText = 'Repeat One';
    repeatButton.style.opacity = "1";
    repeatValue = 'repeatOne';
}

function repeatPlaylist(){
    repeatButton.classList.add('repeat_playlist');
    repeatButton.classList.remove('repeat-off');
    repeatButton.querySelector('span.material-icons').innerText = 'repeat';
    repeatButton.querySelector('span.tooltip-music-control').innerText = 'Repeat';
    repeatButton.style.opacity = "1";
    repeatValue = 'repeatPlaylist';
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
    shuffleOnOff = true;

    shuffleButton.classList.remove('shuffle-off');

    shuffleButton.querySelector('span.material-icons').innerText = 'shuffle';
    shuffleButton.querySelector('span.tooltip-music-control').innerText = 'Shuffle';
}

function shuffleOff(){
    shuffleOnOff = false;
    
    shuffleButton.classList.add('shuffle-off');
    
    shuffleButton.querySelector('span.material-icons').innerText = 'sync_alt';
    shuffleButton.querySelector('span.tooltip-music-control').innerText = 'Play in order';
}

shuffleButton.addEventListener('click', () => {

    const isShuffle = shuffleButton.classList.contains('shuffle-off');

    if(isShuffle){
        shuffleSong();
    } else {
        shuffleOff();
    }
})

// Music area icon functions end

// Probably going to need some type of check all buttons to get proper functions
export async function checkMusicPlayStatus(){
    let musicIdValue;
    
    if(repeatValue === "repeatOne"){
        playSong(musicID);
    } else {
        musicIdValue = await getNextMusic(shuffleOnOff, 'normal', repeatValue);        
    
        if(musicIdValue === parseInt(musicID) && !shuffleOnOff){
            audio.currentTime = 0;
        } else {
            await fetchPlayMusic(musicIdValue);
        }
    }
    
}

async function fetchPlayMusic(id){
    await fetchMusicLocalStorage(id);
    playSong(id);
}