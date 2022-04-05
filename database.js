import { openDB } from './node_modules/idb/with-async-ittr.js';

// Creates the database and table for music 
/**
 * TODO : Consider getting rid of this funciton altogether and creating
 * an upgrade function that you can call on every "openDB"
 * the upgrade function will not be executed unless a new version of the db
 * has been specified
 */

// let db;

// export async function createDatabase() {

//     // TODO : Store the version number in a global constant
//     db = await openDB('musicStorage', 3, {
//         upgrade(db) {
//             // TODO : Refer to comment above the createDatabase signature
//             const musicDb = db.createObjectStore('musicList', {keyPath: "id", autoIncrement: true,});

//             musicDb.createIndex('music_name', 'name', {unique: true});

//             // const playlistTable = db.createObjectStore('playlists', {keyPath: "id", autoIncrement: true,});
//             db.createObjectStore('playlists', {autoIncrement: false,});         
//         }
//     });
// }


const db = openDB('musicStorage', 3, {
    upgrade(db){
        // TODO : Refer to comment above the createDatabase signature
        const musicDb = db.createObjectStore('musicList', {keyPath: "id", autoIncrement: true,});

        musicDb.createIndex('music_name', 'name', {unique: true});

        // const playlistTable = db.createObjectStore('playlists', {keyPath: "id", autoIncrement: true,});
        db.createObjectStore('playlists', {autoIncrement: false,});              
    }
});


// Gets the music from the add filepath or add song to store in the table 'musicList'
export async function setMusicValue(name, byteLength, type){

    const transactionMusic = (await db).transaction('musicList', 'readwrite');

    try{

        await Promise.all([transactionMusic.store.put(
            {name: name, byteLength: byteLength, type: type}),
            transactionMusic.done,
        ]);

    } catch(error){
        return false;
    }
    return true;
}

// Gets the info from database but must open it first to use the features
export async function retrieveAllMusicInfo(){

    // const dbGet = await openDB('musicStorage', undefined, {});
    
    // const fetchMusic = dbGet.transaction('musicList');
    const fetchMusic = (await db).transaction('musicList');

    let allMusic = [];

    for await (const cursor of fetchMusic.store){
        allMusic.push(cursor.value); 
    }

    return allMusic;

}

// Will get one song from the database using the ID of the song selected
export async function getMusicToPlay(value){

    // let musicInfo = [];
    let valueID = await value;

    if(valueID.length != 0){
        if(valueID.length > 1){
            // musicInfo = (await db).getAll('musicList');
            return (await db).getAll('musicList');
        } else {
            // musicInfo = (await db).get('musicList', parseInt(valueID[0]));
            return (await db).get('musicList', parseInt(valueID[0]));
        }
    }

    // return musicInfo;
}

// Puts music ID into playlists table musicInfo
export async function storeMusicIntoPlaylists(playlistName, valueId){

    // const musicDatabase = await openDB('musicStorage', undefined, {});

    let arrayValues = [];

    let inPlaylistCount = false;

    let valueArray = await checksForPlaylist(playlistName); // checks to see if there is no playlist with specified name in the database
    
    // let count = await musicDatabase.getAll('playlists', playlistName); // Gets all the music in the playlist
    //let count = (await db).getAll('playlists', playlistName); // Gets all the music in the playlist
    
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
                
            } else if(value === valueId) { // If music already in playlist will send bool true back                  
                inPlaylistCount = true;                                 
            }
        })
    }

    (await db).put('playlists', arrayValues, playlistName);

    // This checks to see if music is being added Favorites playlist
    if(playlistName === "Favorites"){
        return getFavoritesIDs(valueId);
    }

    return inPlaylistCount;
}

// For storeMusicIntoPlaylists function
async function checksForPlaylist(keyName){

    // const dbOpenCheck = await openDB('musicStorage', undefined, {});

    // let arrayOfMusic = await dbOpenCheck.get('playlists', keyName);
    let arrayOfMusic = (await db).get('playlists', keyName);
    let musicArray = await arrayOfMusic;

    if(musicArray == null) {
        (await db).put('playlists', [], "Favorites");  
        return [];
    }
    return musicArray; 
}

// Checks to see if music is in Favorite playlist 
export async function getFavoritesIDs(valueID){

    // const dbOpen = await openDB('musicStorage', undefined, {});

    // let arrayValueIDs = await dbOpen.get('playlists', 'Favorites');
    let arrayValueIDs = (await db).get('playlists', 'Favorites');
    let array = await arrayValueIDs;// TODO: maybe a way to work around this to make it less code
    
    if(arrayValueIDs != null){
        if(arrayValueIDs != null && array?.includes(valueID.toString())){
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

    // const dbOpen = await openDB('musicStorage', undefined, {});

    // let array = await dbOpen.getAllKeys('playlists'); // Gets all the key names from the table
    let array = (await db).getAllKeys('playlists'); // Gets all the key names from the table
    let arrayIndex = await array; // TODO: work around this

    const favIndex = arrayIndex.indexOf('Favorites');
    arrayIndex.splice(favIndex, 1); // Removes Favorites playlist from displaying
    
    let arrayReturn = Promise.all(arrayIndex.map(async value =>  {
        
        let innerArray = [];
        innerArray.push(value);
        
        // let count = await dbOpen.getAll('playlists', value);        
        let count = (await db).getAll('playlists', value); 
        let numCount = await count;       
        innerArray.push(numCount[0].length);// The amount of songs in each playlist

        return innerArray;
    }))
    
    return await arrayReturn;
}

export async function retrieveMusicFromPlaylist(playlistName){

    // const dbOpen = await openDB('musicStorage', undefined, {});

    let musicToDisplaySend = [];

    // let playlistValues  = await dbOpen.get('playlists', playlistName);
    let playlistValues  = (await db).get('playlists', playlistName); // Fetches music from selected playlist
    let playValues = await playlistValues; // TODO: work around this

    let allMusicFetched = await getMusicToPlay(playValues);
    
    if(allMusicFetched == null){
        return musicToDisplaySend;
    } else if(allMusicFetched.id == playValues[0]){
        musicToDisplaySend.push(allMusicFetched)
    } else {
        for(let i = 0; i < playValues.length; i++) {
    
            for(let j = 0; j < allMusicFetched.length; j++){
                if(allMusicFetched[j].id == playValues[i]){
                    musicToDisplaySend.push(allMusicFetched[j])
                }
            }
        }
    }

    return musicToDisplaySend;
}