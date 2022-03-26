import { openDB } from './node_modules/idb/with-async-ittr.js';

let db;

// Creates the database and table for music 
/**
 * TODO : Consider getting rid of this funciton altogether and creating
 * an upgrade function that you can call on every "openDB"
 * the upgrade function will not be executed unless a new version of the db
 * has been specified
 */
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

    return (await db).put('musicList', {name: name, byteLength: byteLength, type: type});

}

// Gets the info from database but must open it first to use the features
// What is this function retrieving?
export async function retrieve(){

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

    if(value.length > 1){
        musicInfo = await db.getAll('musicList');
    } else {
        musicInfo = await db.get('musicList', parseInt(value[0]));
    }


    return musicInfo;
}

// Puts music ID into playlists table musicInfo
export async function storeMusicIntoPlaylists(playlistName, valueId){

    const musicDatabase = await openDB('musicStorage', undefined, {});

    let arrayValues = [];

    let valueArray = await getKeyName(playlistName); // checks to see if there is no playlist with specified name in the database
   
    arrayValues.push(valueId);
    
    // TODO more simple #map
    // If no name then push to array but if there is an array already will add to it
    if(valueArray != null){
        for(let i = 0; i < valueArray.length; i++){
            // Checks to see if value of Music ID is already in database and then won't add it again
            if(valueArray[i] != valueId){

                arrayValues.push(valueArray[i]);

            } else if(valueArray[i] === valueId){ // Removes musicID from favorite if already in the database

                const indexValue = arrayValues.indexOf(valueId);
                
                arrayValues.splice(indexValue, 1);
                
            }
        }   
    } 

    await musicDatabase.put('playlists', arrayValues, playlistName)

}

// For storeMusicIntoPlaylists function
// TODO: What is this function doing? More descriptive
async function getKeyName(keyName){

    const dbOpenCheck = await openDB('musicStorage', undefined, {});

    let arrayOfMusic = await dbOpenCheck.get('playlists', keyName);

    return arrayOfMusic; 
}

// Checks to see if music is in Favorite playlist 
export async function getFavoritesIDs(valueID){

    const dbOpen = await openDB('musicStorage', undefined, {});

    let arrayValueIDs = await dbOpen.get('playlists', 'Favorites');

    if(arrayValueIDs != null && arrayValueIDs.includes(valueID.toString())){
        return true;
    } else {
        return false;
    }
    
}

export async function retrieveMusicFromPlaylist(playlistName){

    const dbOpen = await openDB('musicStorage', undefined, {});

    let musicToDisplaySend = [];

    let playlistValues  = await dbOpen.get('playlists', playlistName);

    // TODO : Looping through mulitple database calls is a no-no
    // espicially when using await. Consider changing the getMusicPlay function
    // to take an array of ids and return an array of objects fetch from the DB

    let allMusicFetched = await getMusicToPlay(playlistValues);
   
    for(let i = 0; i < playlistValues.length; i++){
        
        for(let j = 0; j < allMusicFetched.length; j++){
            if(allMusicFetched[j].id == playlistValues[i]){
                musicToDisplaySend.push(allMusicFetched[j])
            }
        }
    }
    
    return musicToDisplaySend;
}