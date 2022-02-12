

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
const headerSize = document.querySelector('header');

function sidebar() {
    console.log(menuDisplay)
    if(menuDisplay.style.display === 'none'){
        menuDisplay.style.display = 'grid';
        headerSize.style.width = '10rem';
        headerSize.style.height = '100vh';
        headerSize.style.borderBottomRightRadius = '0px';
        headerSize.style.boxShadow = 'rgb(0 0 0 / 1) 1.95px 1.95px 2.6px';
        document.querySelector('body').style.backgroundColor = 'rgba(0, 0, 0, 0.4)';

    } else {
        menuDisplay.style.display = 'none';
        headerSize.style.width = '3rem';
        headerSize.style.height = '3rem';
        headerSize.style.borderBottomRightRadius = '15px';
        headerSize.style.boxShadow = 'rgb(0 0 0 / 51%) 1.95px 1.95px 2.6px';
        document.querySelector('body').style.backgroundColor = '';
    }
}

// Sidebar function end