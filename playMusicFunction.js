import {playSong} from './musicPlayerControls.js';
import {fetchMusicLocalStorage, audio} from '/script.js';

const songNameHeader = document.querySelector(".container-play-music-area h1");
const artistNameHeader = document.querySelector(".container-play-music-area h3");

// Music selected to play

export async function musicFetched(id){

    if(audio != null){
        audio.pause();
    }

    let musicToPlay = id.target.id;

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
