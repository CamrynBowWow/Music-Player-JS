import { openDB, deleteDB, wrap, unwrap } from 'https://cdn.jsdelivr.net/npm/idb@7/+esm';

let db;

// Creates the database and table for music 
export async function doDatabaseStuff() {
    db = await openDB('musicStorage', 3, {
        upgrade(db) {

            const musicDb = db.createObjectStore('musicList', {keyPath: "id", autoIncrement: true,});

        }
    });
}

// Gets the music from the add filepath or add song to store in the table 'musicList'
export async function set(name, value, type){

    return (await db).put('musicList', {name: name, value: value, type: type});

}

export async function retrieve(){

    const store = db.transaction('musicList').objectStore('musicList');
    const value = await store.get('id');

    console.log(value);

}