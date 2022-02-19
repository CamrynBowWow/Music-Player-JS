

// Dark Mode toggle
let darkMode = localStorage.getItem('darkmode'); 
const toggleMode = document.querySelector('.toggle-change')

toggleMode.addEventListener('click', toggleChange);

const enabledDarkMode = (e) => {
    document.body.classList.add('darkmode');
    
    toggleMode.querySelector('i.fas').classList.remove('fa-moon');
    toggleMode.querySelector('i.fas').classList.add('fa-sun');

    localStorage.setItem('darkmode', 'enabled');
}

const disableDarkMode = () => {
    document.body.classList.remove('darkmode');

    toggleMode.querySelector('i.fas').classList.remove('fa-sun');
    toggleMode.querySelector('i.fas').classList.add('fa-moon');

    localStorage.setItem('darkmode', null);
}

// Javascript way of checking for dark mode
let matched = window.matchMedia('(prefers-color-scheme: dark)').matches;

if(darkMode === 'enabled'){
    enabledDarkMode();
} else if(matched){
    disableDarkMode();
}

function toggleChange(){
    
    darkMode = localStorage.getItem('darkmode'); 
    
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