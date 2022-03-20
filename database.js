import { openDB } from './node_modules/idb/with-async-ittr.js';

let db;

// Creates the database and table for music 
export async function createDatabase() {
    db = await openDB('musicStorage', 3, {
        upgrade(db) {

            const musicDb = db.createObjectStore('musicList', {keyPath: "id", autoIncrement: true,});

            musicDb.createIndex('music_name', 'name', {unique: true});

            // const playlistTable = db.createObjectStore('playlists', {keyPath: "id", autoIncrement: true,});
            const playlistTable = db.createObjectStore('playlists', {autoIncrement: false,});         
        }
    });
}


// Gets the music from the add filepath or add song to store in the table 'musicList'
export async function set(name, byteLength, type){

    return (await db).put('musicList', {name: name, byteLength: byteLength, type: type});

}

// Gets the info from database but must open it first to use the features
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

    const musicInfo = await db.get('musicList', parseInt(value));

    return musicInfo;
}

// Puts music ID into playlists table musicInfo
export async function storeMusicIntoPlaylists(playlistName, valueId){

    const musicDatabase = await openDB('musicStorage', undefined, {});
   // console.log(valueId)

   let arrayValues = [];

   arrayValues = await getKeyName(playlistName);

   console.log(arrayValues)
    
    //const store = musicDatabase.transaction('playlists', 'readwrite').objectStore('playlists');

    //const index = store.index("music_id")
    //console.log(index)


    //const d = await db.get('playlists', parseInt(valueId));
    //console.log(d);

    //const v = await musicDatabase.add('playlists', {playlistName:playlistName, musicID:valueId})
    //console.log(v);

    //const v = await musicDatabase.getKeyFromIndex('playlists', 'musicId', valueId);

    //console.log(v);

   // const p = await musicDatabase.put('playlists', {playlistName:playlistName, musicId: valueId})

    //const d = await musicDatabase.add('playlists',valueId);
   // console.log(p);
}

async function getKeyName(keyName){

    const dbOpenCheck = await openDB('musicStorage', undefined, {});

    //const retrieveMusic = dbOpenCheck.transaction('playlists'); 

    //const arrayOfMusic = await retrieveMusic.get(keyName);
    const arrayOfMusic = await dbOpenCheck.get('playlists', keyName);
    console.log(arrayOfMusic);
    
    if(arrayOfMusic != undefined){

        arrayOfMusic.onerror = async function(e){
            console.log(arrayOfMusic)
            return arrayOfMusic;
        }
    
        arrayOfMusic.oncomplete = async function(e) {
            console.log(arrayOfMusic)
            return arrayOfMusic;
        }

    }

    return;
}