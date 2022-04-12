import {playSong} from './musicPlayerControls.js';
import {fetchMusicLocalStorage, audio, headerPlaylistArea} from '/script.js';
import {getNextId} from './database.js';

const songNameHeader = document.querySelector(".container-play-music-area h1");
const artistNameHeader = document.querySelector(".container-play-music-area h3");

let musicToPlay; // Store id of current song playing

// Music selected to play

export async function musicFetched(id){

    if(audio != null){
        audio.pause();
    }

    musicToPlay = id.target.id;

    await fetchMusicLocalStorage(musicToPlay);

    playSong(musicToPlay);

}

export async function checkName(nameOfMusic){

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

export async function getNextMusic(){

    // Does check to see if already in a playlist or not
    if(headerPlaylistArea.innerText === 'All Music'){
        await getNextId(musicToPlay, 'musicList');
    } else {
        await getNextId(musicToPlay, headerPlaylistArea.innerText);
    }

}