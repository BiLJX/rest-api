import express from "express"
import firebase from "firebase"

const router = express.Router();
const db = firebase.database();

//adds or removes like
function genreCounter(genre, uid)
{
    let counter;
    firebase.database().ref("users/"+uid+"/private/feedback/byGenre").on("value", snapshot=>{
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

function sendLike(liker_uid, u_uid, title, music)
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
    }
}

//check if user has liked or not
function likeCheck(liker_uid, u_uid, title)
{
    let condition
    firebase.database().ref("users/"+u_uid+"/public/"+"songs/"+title+"/widgetInfo/likes/"+liker_uid).on("child_added", (snapshot)=>{
        condition = snapshot.val().liked//stores the value in it
    })
    return condition
}


//how many likes does a song have
function likeCounter(u_uid, title)
{
    let likeArr = []
    firebase.database().ref("users/"+u_uid+"/public/"+"songs/"+title+"/widgetInfo/likes/").on("value", (snapshot)=>{
        let likes = snapshot.val()
        console.log(likes)
        if(likes){
            Object.values(likes).forEach((value)=>{ 
                likeArr.push(likeArr)
            })
        }
    })
    return likeArr.length
}

router.post("/send", (req, res)=>
{
    const body = req.body
    const likedBy = body.likedBy
    const likedOf = body.likedOf
    const song_name = body.song_name
    const song = body.song
   
    sendLike(likedBy, likedOf, song_name, song)
})



export {router}