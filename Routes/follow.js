import express from "express"
import admin from 'firebase-admin';

const router = express.Router();
const db = admin.database();

async function follow(c_uid, uid)
{
    
    const ref = db.ref("users/"+c_uid+"/public/followers/"+uid)
    const f_ref = db.ref("users/"+uid+"/public/following/"+c_uid)
    await ref.once("value").then(snapshot=>{
        const data = snapshot.val()
        if(data){
            f_ref.remove()
            ref.remove()
        }else{
            ref.set({
                uid: uid,
                following: true
            })
            f_ref.set({
                uid: c_uid,
                following: true
            })
        }
    })
}

router.post("/", async (req, res)=>{
    const uid = req.app.uid
    const c_uid = req.body.uid
    await follow(c_uid, uid)
    res.send({"status": "ok"})
})

export {router}