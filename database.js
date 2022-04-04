import { openDB } from './node_modules/idb/with-async-ittr.js';

// Creates the database and table for music 
/**
 * TODO : Consider getting rid of this funciton altogether and creating
 * an upgrade function that you can call on every "openDB"
 * the upgrade function will not be executed unless a new version of the db
 * has been specified
 */

let db;

export async function createDatabase() {

    // TODO : Store the version number in a global constant
    db = await openDB('musicStorage', 3, {
        upgrade(db) {
            // TODO : Refer to comment above the createDatabase signature
            const musicDb = db.createObjectStore('musicList', {keyPath: "id", autoIncrement: true,});

            musicDb.createIndex('music_name', 'name', {unique: true});

            // const playlistTable = db.createObjectStore('playlists', {keyPath: "id", autoIncrement: true,});
            db.createObjectStore('playlists', {autoIncrement: false,});         
        }
    });
}


// Gets the music from the add filepath or add song to store in the table 'musicList'
export async function setMusicValue(name, byteLength, type){

    const transactionMusic = db.transaction('musicList', 'readwrite');

    try{

        await Promise.all([transactionMusic.store.put(
            {name: name, byteLength: byteLength, type: type}),
            transactionMusic.done,
        ]);

    } catch(error){
        return false;
    }
    
}

// Gets the info from database but must open it first to use the features
export async function retrieveAllMusicInfo(){

    const dbGet = await openDB('musicStorage', undefined, {});
    
    const fetchMusic = dbGet.transaction('musicList');

    let allMusic = [];

    for await (const cursor of fetchMusic.store){
        allMusic.push(cursor.value); 
    }

    return allMusic;

}

// Will get one song from the database using the ID of the song selected
export async function getMusicToPlay(value){

    let musicInfo = [];

    if(value.length != 0){
        if(value.length > 1){
            musicInfo = await db.getAll('musicList');
        } else {
            musicInfo = await db.get('musicList', parseInt(value[0]));
        }
    }

    return musicInfo;
}

// Puts music ID into playlists table musicInfo
export async function storeMusicIntoPlaylists(playlistName, valueId){

    const musicDatabase = await openDB('musicStorage', undefined, {});

    let arrayValues = [];

    let valueArray = await checksForPlaylist(playlistName); // checks to see if there is no playlist with specified name in the database
    
    let count = await musicDatabase.getAll('playlists', playlistName); 
    
    
    // If no name then push to array but if there is an array already will add to it
    if(valueArray != null){
        arrayValues.push(valueId);
        valueArray.map(value => {
            if(value != valueId){
                // Checks to see if value of Music ID is already in database and then won't add it again
                arrayValues.push(value);
    
            } else if(value === valueId && playlistName === "Favorites"){ // Removes musicID from favorite if already in the database
    
                const indexValue = arrayValues.indexOf(valueId);
                    
                arrayValues.splice(indexValue, 1);
                
            } else if(value === valueId) { // Gets all the must in the playlist to compare amount
                console.log(count[0].length.toString())
                
                return count[0].length.toString();
                
            }
        })
    }

    // TODO more simple #map
    // If no name then push to array but if there is an array already will add to it
    // if(valueArray != null){
    //     for(let i = 0; i < valueArray.length; i++){
    //         // Checks to see if value of Music ID is already in database and then won't add it again
    //         if(valueArray[i] != valueId){

    //             arrayValues.push(valueArray[i]);

    //         } else if(valueArray[i] === valueId){ // Removes musicID from favorite if already in the database

    //             const indexValue = arrayValues.indexOf(valueId);
                
    //             arrayValues.splice(indexValue, 1);
                
    //         }
    //     }   
    // } 

    await musicDatabase.put('playlists', arrayValues, playlistName);

    // This checks to see if music is being added Favorites playlist
    if(playlistName === "Favorites"){
        return getFavoritesIDs(valueId);
    }
}

// For storeMusicIntoPlaylists function
async function checksForPlaylist(keyName){

    const dbOpenCheck = await openDB('musicStorage', undefined, {});

    let arrayOfMusic = await dbOpenCheck.get('playlists', keyName);

    return arrayOfMusic; 
}

// Checks to see if music is in Favorite playlist 
export async function getFavoritesIDs(valueID){

    const dbOpen = await openDB('musicStorage', undefined, {});

    let arrayValueIDs = await dbOpen.get('playlists', 'Favorites');
    
    if(arrayValueIDs != null){
        if(arrayValueIDs != null && arrayValueIDs.includes(valueID.toString())){
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

// Retrieves playlists table Keys
export async function getPlaylistNames(){ 

    const dbOpen = await openDB('musicStorage', undefined, {});

    let array = await dbOpen.getAllKeys('playlists'); // Gets all the key names from the table
    
    const favIndex = array.indexOf('Favorites');
    array.splice(favIndex, 1); // Removes Favorites playlist from displaying
    
    let arrayReturn = Promise.all(array.map(async value =>  {
        
        let innerArray = [];
        innerArray.push(value);
        
        let count = await dbOpen.getAll('playlists', value);        
        innerArray.push(count[0].length);// The amount of songs in each playlist

        return innerArray;
    }))
    
    return await arrayReturn;
}

export async function retrieveMusicFromPlaylist(playlistName){

    const dbOpen = await openDB('musicStorage', undefined, {});

    let musicToDisplaySend = [];

    let playlistValues  = await dbOpen.get('playlists', playlistName);

    let allMusicFetched = await getMusicToPlay(playlistValues);

    if(allMusicFetched.id == playlistValues[0]){
        musicToDisplaySend.push(allMusicFetched)
    } else {
        for(let i = 0; i < playlistValues.length; i++) {
    
            for(let j = 0; j < allMusicFetched.length; j++){
                if(allMusicFetched[j].id == playlistValues[i]){
                    musicToDisplaySend.push(allMusicFetched[j])
                }
            }
        }
    }

    return musicToDisplaySend;
}