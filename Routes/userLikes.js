import express from "express"
import admin from 'firebase-admin';
import {putInfo} from "../Modules/putInfo.js"
const router = express.Router();
const db = admin.database()




function getUserLikes(uid)
{
    const likes = []
    db.ref(`users/${uid}/private/feedback/liked`).on("value", snapshot=>{
        if(snapshot.val()){
            const raw = Object.values(snapshot.val())
            raw.forEach(x=>{
                likes.push(getSongById(x.id, x["song_id"]))
            })
        }
    })
    return likes
}

function getSongById(uid, sid)
{
    let track;
    db.ref("users/"+uid+"/public/songs/"+sid).on("value", snapshot=>{
        track = snapshot.val()
    })
    return track
}


router.get("/",(req, res)=>{
   const uid = req.query.uid||req.app.uid
   const tracks = getUserLikes(uid)
   res.send(putInfo(tracks))
})

export {router}