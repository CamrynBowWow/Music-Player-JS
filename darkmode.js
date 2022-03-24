let darkMode = localStorage.getItem('darkMode'); 
const toggleMode = document.querySelector('.toggle-change')

toggleMode.addEventListener('click', toggleChange);

const enabledDarkMode = () => {
    document.body.classList.add('darkmode');
    
    toggleMode.querySelector('span.material-icons').innerText = 'brightness_7';
    toggleMode.querySelector('span.tooltip-text-sidebar').innerText = 'Enable Light Mode';

    localStorage.setItem('darkMode', 'enabled');
}

const disableDarkMode = () => {
    document.body.classList.remove('darkmode');

    toggleMode.querySelector('span.material-icons').innerText = 'nightlight';
    toggleMode.querySelector('span.tooltip-text-sidebar').innerText = 'Enable Dark Mode';

    localStorage.setItem('darkMode', 'disabled');
}

// Javascript way of checking for dark mode
const matched = window.matchMedia('(prefers-color-scheme: dark)').matches;

if(darkMode === 'enabled'){
    enabledDarkMode();
} else if(matched){
    enabledDarkMode();
} else {
    disableDarkMode();
}

function toggleChange(){
    
    darkMode = localStorage.getItem('darkMode'); 
    
    if (darkMode !== 'enabled') {
        enabledDarkMode();
    } else {
        disableDarkMode();
    }
}