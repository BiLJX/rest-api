import express from "express";
import admin from 'firebase-admin';
import dayFunc from "../Modules/dayFunc.js"


const router = express.Router();
let database;
const dateObj = new Date();
const month = dateObj.getUTCMonth() + 1; //months from 1-12
const day = dateObj.getUTCDate();
const year = dateObj.getUTCFullYear();


function makeid(length) {
    let result           = '';
    let characters       = 'AAAABBBBCCCCDDDDEEEEFFFFGGGGHHHHIIIIJJJJKKKKLLLLMMMMNNNNOOOOPPPPQQQQRRRRSSSSTTTTUUUUVVVVWWWWXXXXYYYYZZZZaaabbbcccdddeeefffggghhhiiijjjkkklllmmmnnnooopppqqqrrrssstttuuuvvvwwwxxxyyyzzz__--1234567890';
    let charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}





async function upload_info(data)
{
    const db = database
    let song_id;
    let hasId;
    do{
        song_id = makeid(11)
        hasId = await db.collection("tracks").findOne({sid: song_id})
    }while(song_id !== hasId)
    
    const track_data = {
        "uid": data.userID,
        "sid": song_id,
        "info":{
            "songID": song_id,
            "userID": data.userID,
            "title": data.title,
            "artist": data.artist,
            "genre": data.genre,
            "tags": data.tags,
            "description": data.description,
        },
        "src":{
            "aduioURL": data.audioURL,
            "imageURL": data.imageURL,
        },
        "stats":{
            "views": 0,
            "likes": 0,
            "comment": 0,
            "shares": 0
        } ,
        "recomend":{
            "byGenre": 0,
            "similarity": 0,
            "mood": 0
        },
        "date":{
            "month": month,
            "day": day,
            "year": year,
            "totalDate": dayFunc(day, month, year)
        }
    }
    await db.collection("tracks").insertOne(track_data)
    return "success"
}



router.post("/", (req, res)=>{
    database = req.app.db
    const data = req.body
    data.userID = req.app.uid
    upload_info(data).then(()=> res.send({"upload_status": "ok"}))
})

export {router}

