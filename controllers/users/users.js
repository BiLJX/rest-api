
import {putInfo} from "../../Modules/putInfo.js"
import {follow} from "./follow.js"
 

export async function getUser(req, res){
    const {u} = req.params
	const db = req.app.db
    const query = {
		uid: u
	}
    try{
        const tracks = await db.collection("tracks").find(query).toArray()
        const user = await db.collection("users").findOne(query)
        user.tracks = putInfo(tracks, req.app.uid)
        const hasFollowed = await db.collection("users").findOne({uid: req.app.uid, "public.profile.following":{$elemMatch: {uid: u}}})
        if(hasFollowed !== null){
            user.isFollowing = true
        }else{
            user.isFollowing = false
        }
        res.send(user)
    }catch(err){
        res.status(401).json({message: err})
    }
	
}

export const getLiked = async (req, res) => {
    const db = req.app.db;
    const likedSongs_uid = await db.collection("liked").findOne({uid: req.app.uid})
    const likedSongs = Promise.all(likedSongs_uid.tracks?.map(track=>{
        return db.collection("tracks").findOne({sid: track.sid})
     }))
    const final = await likedSongs 
    res.send(putInfo(final))
}

export {follow}

