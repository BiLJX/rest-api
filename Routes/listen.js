import express from "express"
import admin from 'firebase-admin';

const router = express.Router();



router.get("/", async (req, res)=>{
    const db = req.app.db
    const uid = req.query.uid
    const sid = req.query.song
    const track = await db.collection("tracks").findOne({sid: sid})
    res.send(track)
})

export {router} 