import {hideModal} from './playlistFunctions.js';

// Sidebar function

export const containerClassDiv = document.querySelector('.container-class');
const menuDisplay = document.querySelector('#menu-items');
const headerSize = document.querySelector('aside');
const sideBarA = document.querySelector('aside a');
const sidebarMenu = document.querySelector('aside a span');
const backgroundModal = document.querySelector('#background-modal');

document.addEventListener('click', function(event){
    let isClickedInside = headerSize.contains(event.target);
    menuBarSizeChange;
    if(!isClickedInside){
       hideSidebar();
    }
})

// Does check for change in size of the screen 
const windowMediaCheck = window.matchMedia("(max-width: 800px)");

let translateX = '';
let sideBarALeft = '';

function menuBarSizeChange(event){
    
    if(event.matches){
       
        sideBarALeft = "11rem";
        translateX = 'translateX(-11rem)';
        
    } else {
        sideBarALeft = "12rem";
        translateX = 'translateX(-12rem)';
    }

    if(menuDisplay.className === "hidden"){
        hideSidebar();
        
    } else {
        if(event.matches){
            sideBarA.style.left = "8rem";
        } else {
            sideBarA.style.left = "9rem";
        }
    }
    
}

menuBarSizeChange(windowMediaCheck);
windowMediaCheck.addListener(menuBarSizeChange);


// Closes the sidebar menu
export async function hideSidebar(){
    headerSize.style.transform = translateX;
    sideBarA.style.left = sideBarALeft;
    menuDisplay.classList.remove('show');
    menuDisplay.classList.add('hidden');
    sideBarA.style.width = "3.5rem";
    backgroundModal.style.display = "none";
    //containerClassDiv.style.filter = 'blur(0px)';
}

sidebarMenu.addEventListener('click', async () => {
   
    if(menuDisplay.className === 'hidden' ){
        headerSize.style.transform = 'translateX(0rem)';
        sideBarA.style.left =  windowMediaCheck.matches ? "8rem" : "9rem";
        sideBarA.style.width = "3rem";
        menuDisplay.classList.remove('hidden');
        menuDisplay.classList.add('show');
        backgroundModal.style.display = 'block';
        hideModal();
        //containerClassDiv.style.filter = 'blur(7px)';
    } else {
        hideSidebar();
        hideModal();     
    }
})

// Sidebar function end
