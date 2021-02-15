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

function sendLike(liker_uid, u_uid, title, music, io)
{
    const check = likeCheck(liker_uid, u_uid, title)
    const genre = music.info.genre
    const counter = genreCounter(genre, liker_uid)
    const likeRef = db.ref("users/"+u_uid+"/public/"+"songs/"+title+"/stats")
    const db_ref = db.ref("users/"+u_uid+"/public/"+"songs/"+title+"/widgetInfo/likes/"+liker_uid)
    const fb_ref = db.ref("users/"+liker_uid+"/private/feedback/liked/"+u_uid+"/"+title)
    let counter2
    likeRef.on("value", snapshot=>{
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
            "title": title
        })
        likeRef.update({
            "likes": counter2+1
        })
        db.ref("users/"+liker_uid+"/private/feedback/byGenre").update({ 
            [genre]: counter+1
        })
        sendNotification(liker_uid, u_uid, title, io)
    }
  
}

//check if user has liked or not
function likeCheck(liker_uid, u_uid, title)
{
    let condition
    admin.database().ref("users/"+u_uid+"/public/"+"songs/"+title+"/widgetInfo/likes/"+liker_uid).on("child_added", (snapshot)=>{
        condition = snapshot.val().liked//stores the value in it
    })
    return condition
}

//how many likes does a song have
function sendNotification(liker_uid, u_uid, title, sio)
{
    db.ref("users/"+u_uid+"/private/new/notifications").push().set({
        likedBy: liker_uid,
        title: title,
        type: "like"
    })
    const io = sio
    console.log(liker_uid)
    io.to(u_uid).emit("notification", {
		"newNotification": true,
        "title": title,
        "uid":liker_uid
	})
}

router.post("/send", (req, res)=>
{
    const io = req.app.io
    const body = req.body
    const likedBy = body.likedBy
    const likedOf = body.likedOf
    const song_name = body.song_name
    const song = body.song
    sendLike(likedBy, likedOf, song_name, song, io)
})



export {router}