

// Dark Mode toggle
let darkMode = localStorage.getItem('darkMode'); 
const toggleMode = document.querySelector('.toggle-change')

toggleMode.addEventListener('click', toggleChange);

const enabledDarkMode = () => {
    document.body.classList.add('darkmode');
    
    toggleMode.querySelector('i.fas').classList.remove('fa-moon');
    toggleMode.querySelector('i.fas').classList.add('fa-sun');

    localStorage.setItem('darkMode', 'enabled');
}

const disableDarkMode = () => {
    document.body.classList.remove('darkmode');

    toggleMode.querySelector('i.fas').classList.remove('fa-sun');
    toggleMode.querySelector('i.fas').classList.add('fa-moon');

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
        // headerSize.style.width = '12rem';
        // headerSize.style.height = '100%';
        // headerSize.style.borderBottomRightRadius = '0px';      
        
        headerSize.style.transform = 'translateX(0rem)';
        // headerSize.querySelector('i.fas').classList.remove('fa-bars');
        // headerSize.querySelector('i.fas').classList.add('fa-times');
        sideBarA.style.boxShadow = 'var(--box-shadow-color)';
        sideBarA.style.width = "3rem";
        // sideBarA.style.height = "";
        // sideBarA.style.left = "";
        menuDisplay.classList.remove('hidden');
        menuDisplay.classList.add('show');

        // menuDisplay.style.transform = 'translateX(0rem)';
        // let myTime = setTimeout(() => {
        // }, 100);      
    } else {
        headerSize.style.transform = 'translateX(-12rem)';
        menuDisplay.classList.remove('show');
        menuDisplay.classList.add('hidden');
        sideBarA.style.width = "3.5rem";
        // sideBarA.style.height = "3rem";
        // sideBarA.style.left = "12rem";
        sideBarA.style.boxShadow = 'var(--box-shadow-color)';
        
        // headerSize.querySelector('i.fas').classList.remove('fa-times');
        // headerSize.querySelector('i.fas').classList.add('fa-bars');
        // headerSize.style.width = '4rem';
        // headerSize.style.height = '4rem';
        // headerSize.style.borderBottomRightRadius = '15px';
        // let myTimeRemove = setTimeout(() => {
        // }, 500);
        
    }
}

// Sidebar function end

// Fetching music and populating the playlist-area section class

const addMusic = document.querySelector('.fetchMusic')

// const pickerOpts = {
//     types: [{
//         description: 'Music',
//         accept: {
//             'music/*': ['.mp3']
//         }
//     },],
//     //multiple: true
// };


addMusic.addEventListener('click', async (directoryHandle) => {   

    const [peen] = await self.showOpenFilePicker();

    if(!peen){
        return;
    }

    //console.log(peen.entries());
    
    const relativePaths = await directoryHandle.resolve(peen);
    
    console.log(peen);

    if(relativePaths === null){
        console.log('not here');
        console.log(relativePaths);
    } else {
        for(const name of relativePaths){
            console.log(name);
        }
    }

    console.log(peen);
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
    // repeatButton.querySelector('i.fa-solid').classList.add('fa-repeat');
    // repeatButton.querySelector('i.fa-solid').classList.remove('fa-repeat-1');
    repeatButton.querySelector('span.material-icons').innerText = 'repeat';
}

function repeatSong(){
    repeatButton.classList.add('repeat');
    // repeatButton.querySelector('i.fa-solid').classList.remove('fa-repeat');
    // repeatButton.querySelector('i.fa-solid').classList.add('fa-repeat-1');
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