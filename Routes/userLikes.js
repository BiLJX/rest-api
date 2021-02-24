import express from "express"
import admin from 'firebase-admin';

const router = express.Router();
const db = admin.database()




function getUserLikes(uid)
{
    let likes = []
    db.ref(`users/${uid}/private/feedback/liked`).on("value", snapshot=>{
        if(snapshot.val()){
            likes = Object.values(snapshot.val())
        }
    })
    return likes
}


router.get("/",(req, res)=>{
   const uid = req.query.uid
   res.send(getUserLikes(uid))
})

export {router}