
/* The IndexedDb */

import {doDatabaseStuff, set, retrieve} from './database.js'

window.onload = function() {
    doDatabaseStuff();
    musicDisplay();
}

async function musicDisplay(){
    let allMusic = await retrieve();

    for (let musicValues of allMusic) {

        
    //     <div id="all-songs-playlist" class="main-tag-tabs">
                  
    //     <button><span class="material-icons md-40">play_arrow</span>Song name here</button><span class="material-icons md-36">add_box</span><span class="material-icons md-36">delete</span><span class="material-icons heart">favorite</span>
        
    // </div>
    }

    console.log(allMusic);
}

/* The IndexedDb */


// Dark Mode toggle
let darkMode = localStorage.getItem('darkMode'); 
const toggleMode = document.querySelector('.toggle-change')

toggleMode.addEventListener('click', toggleChange);

const enabledDarkMode = () => {
    document.body.classList.add('darkmode');
    
    toggleMode.querySelector('span.material-icons').innerText = 'brightness_7';

    localStorage.setItem('darkMode', 'enabled');
}

const disableDarkMode = () => {
    document.body.classList.remove('darkmode');

    toggleMode.querySelector('span.material-icons').innerText = 'nightlight';

    localStorage.setItem('darkMode', null);
}

// Javascript way of checking for dark mode
let matched = window.matchMedia('(prefers-color-scheme: dark)').matches;

// if(darkMode === 'enabled'){
//     enabledDarkMode();
// } else if(darkMode === 'disabled'){
//     disableDarkMode();
// } else if(matched){
//     enabledDarkMode();
// }

if(matched){
    enabledDarkMode();
}

function toggleChange(){
    
    darkMode = localStorage.getItem('darkMode'); 
    
    if (darkMode !== 'enabled') {
        enabledDarkMode();
    } else {
        disableDarkMode();
    }
}

// End of Dark Mode toggle


// Sidebar function

const menuDisplay = document.querySelector('#menu-items');
const headerSize = document.querySelector('aside');
const sideBarA = document.querySelector('aside a');
const sidebarMenu = document.querySelector('aside a span');

sidebarMenu.addEventListener('click', async () => {

    if(menuDisplay.className === 'hidden' ){    
        
        headerSize.style.transform = 'translateX(0rem)';
        sideBarA.style.boxShadow = 'var(--box-shadow-color)';
        sideBarA.style.width = "3rem";
        menuDisplay.classList.remove('hidden');
        menuDisplay.classList.add('show');
    
    } else {
        headerSize.style.transform = 'translateX(-12rem)';
        menuDisplay.classList.remove('show');
        menuDisplay.classList.add('hidden');
        sideBarA.style.width = "3.5rem";
        sideBarA.style.boxShadow = 'var(--box-shadow-color)';
        
    }
})

// Sidebar function end

// Fetching music and populating the playlist-area section class

const addMusic = document.querySelector('.fetchDirectory')


addMusic.addEventListener('click', async () => {   

    const peen = await window.showDirectoryPicker();
    
    const matchFileSpecs = ".(mp3)$";
    
   for await (const entry of peen.values()) {

       if (entry.kind === 'file' && entry.name.match(matchFileSpecs)) {
           const fileData = await entry.getFile();
           await set(fileData.name, fileData.size, fileData.type)
       }
   }
    
})


// Fetching music and populating the playlist-area section class end

// Music area icon functions

// For play and pause music
const playButton = document.querySelector('#play-button');

function pauseSong() {
    playButton.classList.remove('play');

    playButton.querySelector('span.material-icons').innerText = 'play_arrow';

}

function playSong() {
    playButton.classList.add('play');
 
    playButton.querySelector('span.material-icons').innerText = 'pause';
    
}

playButton.addEventListener('click', () => {

    const isPlaying = playButton.classList.contains('play');

    if(isPlaying) {
        pauseSong();
    } else {
        playSong();
    }

})

// For repeat music
const repeatButton = document.querySelector('#repeat-song');

function repeatOff(){
    repeatButton.classList.remove('repeat_one');
    // repeatButton.classList.remove('repeat_off');
    // repeatButton.classList.remove('repeat_playlist');
    repeatButton.querySelector('span.material-icons').innerText = 'repeat';
    // repeatButton.style.opacity = "0.5";
}

function repeatSong(){
    repeatButton.classList.add('repeat_one');
    // repeatButton.classList.remove('repeat_off');
    // repeatButton.classList.add('repeat_playlist');
    repeatButton.querySelector('span.material-icons').innerText = 'repeat_one';
    repeatButton.style.opacity = "";
}

// function repeatPlaylist(){
//     repeatButton.classList.remove('repeat_one');
//     repeatButton.classList.remove('repeat_playlist');
//     repeatButton.classList.add('repeat_off');
//     repeatButton.querySelector('span.material-icons').innerText = 'repeat';
//     repeatButton.style.opacity = "1";
// }

repeatButton.addEventListener('click', () => {

    const isRepeating = repeatButton.classList.contains('repeat_one');

    // if(isRepeating === repeatButton.classList.contains('repeat_playlist')){
    //     repeatPlaylist();
    // } else if(isRepeating === repeatButton.classList.contains('repeat_one')){
    //     repeatSong();
    // } else {
    //     repeatOff();
    // }

    if(isRepeating){
        repeatOff();
    } else {
        repeatSong();
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