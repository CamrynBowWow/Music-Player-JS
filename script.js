

// Dark Mode toggle
let darkMode = localStorage.getItem('darkmode'); 
const toggleMode = document.querySelector('.toggle-change')

toggleMode.addEventListener('click', toggleChange);

const enabledDarkMode = () => {
    document.body.classList.add('darkmode');

    localStorage.setItem('darkmode', 'enabled');
}

const disableDarkMode = () => {
    document.body.classList.remove('darkmode');

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



// Sidebar function end