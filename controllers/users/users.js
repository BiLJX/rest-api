
import {putInfo} from "../../Modules/putInfo.js"
import {follow} from "./follow.js"
 import {uploadMusic} from "./uploadMusic.js"

export async function getUser(req, res){
    const {u} = req.params
	const db = req.app.db
    const query = {
		uid: u
	}
    try{
        const tracks = await db.collection("tracks").find(query).toArray()
        const user = await db.collection("users").findOne(query, {
            projection: {
                profile: 1,
                _id: 0
            }
        })
        user.tracks = await putInfo(tracks, req.app.uid, db)
        const hasFollowed = await db.collection("users").findOne({uid: req.app.uid, "profile.following":{$elemMatch: {$in: [u]}}})
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
    try{
        const db = req.app.db;
        const user = await db.collection("users").findOne({uid: req.query.uid||req.app.uid})
        const liked_datas = user.likedTracks
        const final = await db.collection("tracks").find({sid: {$in: liked_datas}}).toArray()
        res.send(await putInfo(final, req.app.uid, db))
    }catch(err){
        console.log(err)
        res.status(401).json({message: "error"})
    }

}

export {follow}
export {uploadMusic}
