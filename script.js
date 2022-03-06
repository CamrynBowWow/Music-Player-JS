

// Dark Mode toggle
let darkMode = localStorage.getItem('darkMode'); 
const toggleMode = document.querySelector('.toggle-change')

toggleMode.addEventListener('click', toggleChange);

const enabledDarkMode = () => {
    document.body.classList.add('darkmode');
    
    // toggleMode.querySelector('i.fas').classList.remove('fa-moon');
    // toggleMode.querySelector('i.fas').classList.add('fa-sun');
    toggleMode.querySelector('span.material-icons').innerText = 'brightness_7';

    localStorage.setItem('darkMode', 'enabled');
}

const disableDarkMode = () => {
    document.body.classList.remove('darkmode');

    // toggleMode.querySelector('i.fas').classList.remove('fa-sun');
    // toggleMode.querySelector('i.fas').classList.add('fa-moon');
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

function sidebar() {

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
}

// Sidebar function end

// Fetching music and populating the playlist-area section class

const addMusic = document.querySelector('.fetchDirectory')


addMusic.addEventListener('click', async () => {   

    const peen = await window.showDirectoryPicker();
    
    const matchFileSpecs = ".(mp3)$";
    
   for await (const entry of peen.values()) {
       console.log(entry);

       if (entry.kind === 'file' && entry.name.match(matchFileSpecs)) {
           const fileData = await entry.getFile();
           console.log(fileData);
       }
   }
    
})


// Fetching music and populating the playlist-area section class end

// Music area icon functions

const playButton = document.querySelector('#play-button');

function pauseSong() {
    playButton.classList.remove('play');
    playButton.querySelector('i.fas').classList.add('fa-play');
    playButton.querySelector('i.fas').classList.remove('fa-pause');

}

function playSong() {
    playButton.classList.add('play');
    playButton.querySelector('i.fas').classList.remove('fa-play');
    playButton.querySelector('i.fas').classList.add('fa-pause');
    
}

playButton.addEventListener('click', () => {

    const isPlaying = playButton.classList.contains('play');

    if(isPlaying) {
        pauseSong();
    } else {
        playSong();
    }

})

const repeatButton = document.querySelector('#repeat-song');

function repeatOff(){
    repeatButton.classList.remove('repeat');
    repeatButton.querySelector('span.material-icons').innerText = 'repeat';
}

function repeatSong(){
    repeatButton.classList.add('repeat');
    repeatButton.querySelector('span.material-icons').innerText = 'repeat_one';
}

repeatButton.addEventListener('click', () => {

    const isRepeating = repeatButton.classList.contains('repeat')

    if(isRepeating){
        repeatOff();
    } else {
        repeatSong();
    }

})


// Music area icon functions end