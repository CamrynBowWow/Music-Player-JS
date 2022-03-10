import { openDB } from './node_modules/idb/with-async-ittr.js';

let db;

// Creates the database and table for music 
export async function doDatabaseStuff() {
    db = await openDB('musicStorage', 3, {
        upgrade(db) {

            const musicDb = db.createObjectStore('musicList', {keyPath: "id", autoIncrement: true,});

            const musicIndex = musicDb.createIndex('music_name', 'name', {unique: true});
        }
    });
}


// Gets the music from the add filepath or add song to store in the table 'musicList'
export async function set(name, value, type){

    return (await db).put('musicList', {name: name, value: value, type: type});

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