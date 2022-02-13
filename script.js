

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

if(darkMode === 'enabled'){
    enabledDarkMode();
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

const menuDisplay = document.querySelector('.menu-items');
const headerSize = document.querySelector('aside');

function sidebar() {

    if(menuDisplay.style.display === 'none'){
        menuDisplay.style.display = 'grid';
        headerSize.style.width = '12rem';
        headerSize.style.height = '100vh';
        headerSize.style.borderBottomRightRadius = '0px';
        headerSize.style.boxShadow = 'rgb(0 0 0 / 1) 1.95px 1.95px 2.6px';
    } else {
        menuDisplay.style.display = 'none';
        headerSize.style.width = '4rem';
        headerSize.style.height = '4rem';
        headerSize.style.borderBottomRightRadius = '15px';
        headerSize.style.boxShadow = 'rgb(0 0 0 / 51%) 1.95px 1.95px 2.6px';
    }
}

// Sidebar function end