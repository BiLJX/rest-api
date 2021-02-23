import express from "express"
import admin from 'firebase-admin';

const router = express.Router();
const db = admin.database()




function getUserLikes(uid)
{
    let likes = []
    db.ref(`users/${uid}/private/feedback/liked`).on("value", snapshot=>{
        let temp;
        Object.values(snapshot.val()).forEach(value=>temp=value)
        likes = Object.values(temp)
    })
    return likes
}


router.get("/",(req, res)=>{
   const uid = req.query.uid
   res.send(getUserLikes(uid))
})

export {router}