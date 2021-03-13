import express from "express"
import admin from 'firebase-admin';

const router = express.Router();

const db = admin.database()

function update_views(track, info)
{
    const intialTime = info.initialTime;
    const finalTime = info.finalTime;
    if(finalTime - intialTime > 30){
        const current_views = track.stats.views;
        const updated_views = current_views+1;
        db.ref("users/"+track.info.userID+"/public/songs/"+track.info.songID+"/stats").update({
            views: updated_views
        })
    }
}   



router.post("/update", (req, res)=>{
    const track = req.body.track;
    const info = req.body.info;
    update_views(track, info)
    res.end("success")
})

export {router}