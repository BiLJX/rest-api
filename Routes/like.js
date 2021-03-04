import express from "express"
import admin from 'firebase-admin';
import { createRequire } from "module";



const require = createRequire(import.meta.url);
const router = express.Router();
const db = admin.database();

//adds or removes like
function genreCounter(genre, uid)
{
    let counter;
    db.ref("users/"+uid+"/private/feedback/byGenre").on("value", snapshot=>{
        if(snapshot.val()){
            if(snapshot.val()[genre]){
                counter = snapshot.val()[genre]
            }else{
               counter = 0
            }
        }else{
            counter = 0
        }
    })
    return counter
}

function sendLike(liker_uid, u_uid, song_id, music, io)
{
    const check = likeCheck(liker_uid, u_uid, song_id)
    const genre = music.info.genre
    const counter = genreCounter(genre, liker_uid)
    const likeRef = db.ref("users/"+u_uid+"/public/"+"songs/"+song_id+"/stats")
    const db_ref = db.ref("users/"+u_uid+"/public/"+"songs/"+song_id+"/widgetInfo/likes/"+liker_uid)
    const fb_ref = db.ref("users/"+liker_uid+"/private/feedback/liked/"+song_id)
    let counter2
    likeRef.on("value", snapshot=>{
        console.log(song_id)
        counter2 = snapshot.val().likes
    })

    if(check)
    {
        db_ref.remove();
        fb_ref.remove()
        db.ref("users/"+liker_uid+"/private/feedback/byGenre").update({ 
            [genre]: counter-1
        })
        likeRef.update({
            "likes": counter2-1
        })
    }else{
        db_ref.push().set({
            "uid": liker_uid,
            "liked": true
        })
        fb_ref.set({
            "id": u_uid,
            "song_id": song_id
        })
        likeRef.update({
            "likes": counter2+1
        })
        db.ref("users/"+liker_uid+"/private/feedback/byGenre").update({ 
            [genre]: counter+1
        })
        sendNotification(liker_uid, u_uid, song_id, io)
    }
  
}

//check if user has liked or not
function likeCheck(liker_uid, u_uid, song_id)
{
    let condition
    admin.database().ref("users/"+u_uid+"/public/"+"songs/"+song_id+"/widgetInfo/likes/"+liker_uid).on("child_added", (snapshot)=>{
        condition = snapshot.val().liked//stores the value in it
    })
    return condition
}

//how many likes does a song have
function sendNotification(liker_uid, u_uid, song_id, sio)
{
    db.ref("users/"+u_uid+"/private/new/notifications").push().set({
        likedBy: liker_uid,
        song_id: song_id,
        type: "like"
    })
    const io = sio
    io.to(u_uid).emit("notification", {
		"newNotification": true,
        "song_id": song_id,
        "uid":liker_uid
	})
}

router.post("/send", (req, res)=>
{
    const io = req.app.io
    const body = req.body
    const likedBy = req.app.uid
    const likedOf = body.likedOf
    const songID = body.songID
    const song = body.song
    sendLike(likedBy, likedOf, songID, song, io)
})



export {router}