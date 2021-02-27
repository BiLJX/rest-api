import express from "express";
import admin from 'firebase-admin';
import dayFunc from "../Modules/dayFunc.js"


const router = express.Router();
const db = admin.database();
const dateObj = new Date();
const month = dateObj.getUTCMonth() + 1; //months from 1-12
const day = dateObj.getUTCDate();
const year = dateObj.getUTCFullYear();


function makeid(length) {
    let result           = '';
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}



async function upload_info(data)
{
    const song_id = makeid(11)
    console.log(data, song_id)
    db.ref("users/"+data.userID+"/public/songs/"+song_id).set({
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
            "likes": 0
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
    )
}



router.post("/", (req, res)=>{
    const data = req.body
    upload_info(data).then(()=> res.send({"upload_status": "ok"}))
   
})

export {router}

