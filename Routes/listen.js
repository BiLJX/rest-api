import express from "express"
import admin from 'firebase-admin';

const router = express.Router();
const db = admin.database()

function getSongById(uid, sid)
{
    let track;
    db.ref("users/"+uid+"/public/songs/"+sid).on("value", snapshot=>{
        track = snapshot.val()
    })
    return track
}

router.get("/", (req, res)=>{
    const uid = req.query.uid
    const sid = req.query.song
    res.send(getSongById(uid, sid))
})

export {router} 