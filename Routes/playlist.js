import express from "express"
import admin from "firebase-admin"

const router = express.Router();
const db = admin.database()

const month = dateObj.getUTCMonth() + 1; //months from 1-12
const day = dateObj.getUTCDate();
const year = dateObj.getUTCFullYear();


function dayFunc() {
    const date = new Date();
    const month = date.getUTCMonth() + 1; //months from 1-12
    const day = date.getUTCDate();
    const year = date.getUTCFullYear();
    const month_day = month * 30.4
    const year1 = year * 365
    const total = day + month_day + year1
    return total
}

function makeid(length) {
    let result           = '';
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

async function create(data){
    const tracks = data.songs
    const playlist_id = makeid(11)
    try{
        await db.ref(`users/${data.uid}/public/playlists/${playlist_id}`).set({
            "info":{
                "playlistID": song_id,
                "userID": data.userID,
                "title": data.title,
                "artist": data.artist,
                "tags": data.tags,
                "description": data.description,
            },
            "songs":{
                
            },
            "stats":{
                "plays": 0,
                "likes": 0,
                "shares": 0
            },
            "date":{
                "month": month,
                "day": day,
                "year": year,
                "totalDate": dayFunc(day, month, year)
            }
        })
        await tracks.array.forEach(song => {
            db.ref(`users/${data.uid}/public/playlists/${playlist_id}/songs/${song.songID}`).set({
                "songID": song.songID,
                "userID": song.userID
            })
        });
    }
    finally{
        return {status: "completed"}
    }
    
}

function get(uid, playlist_id){

}

router.post("/create", (req, res)=>{
    
})

router.get("/get",  (req, res)=>{
    res.send(get(req.query.uid, req.query.pid))
})

