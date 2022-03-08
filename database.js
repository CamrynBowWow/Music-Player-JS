import { openDB, deleteDB, wrap, unwrap } from 'https://cdn.jsdelivr.net/npm/idb@7/+esm';
      
export async function doDatabaseStuff() {
    const db = await openDB('musicStorage', 2, {
        upgrade(db) {
            const musicDb = db.createObjectStore('musicList', {keyPath: "id", autoIncrement: true,});

            musicDb.createIndex('name', 'name', {unique: true}) 
            musicDb.createIndex('size', 'size', {unique: false})
        }
    });
}

