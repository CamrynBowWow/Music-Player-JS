
import { unmuteMusic, audio, previousVolume } from "./script.js";
import { getNextMusic } from './playMusicFunction.js';

// Global variables for checking function that can be used 
export let shuffleOnOff;

// For play and pause music
const playButton = document.querySelector('#play-button');
export const sourceTag = document.querySelector("#audioToPlay");

export async function pauseSong() {

    audio.pause();

    playButton.classList.remove('playing');

    playButton.querySelector('span.material-icons').innerText = 'play_arrow';

}

export async function playSong(value) {

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
    shuffleOnOff = true;

    shuffleButton.classList.remove('shuffle-off');

    shuffleButton.querySelector('span.material-icons').innerText = 'shuffle';
}

function shuffleOff(){
    shuffleOnOff - false;

    shuffleButton.classList.add('shuffle-off');

    shuffleButton.querySelector('span.material-icons').innerText = 'sync_alt';
}

shuffleButton.addEventListener('click', () => {

//   shuffleFunction();
    const isShuffle = shuffleButton.classList.contains('shuffle-off');

    if(isShuffle){
        shuffleSong();
    } else {
        shuffleOff();
    }
})

// Music area icon functions end

// Probably going to need some type of check all buttons to get proper functions
export function checkMusicPlayStatus(){
    getNextMusic();
    //shuffleOnOff;
}