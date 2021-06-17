import  {getAll} from "./find.js"


async function putInfo(tracks = [], uid, db)
{
    const uids = []
    for(let track of tracks){
        if(track){
            uids.push(track.uid)
        }
    }
    const users = await db.collection("users").find({uid:{$in: uids}}).toArray()
    const length = tracks.length
    let i;
    for(i = 0; i<length; i++){
        tracks[i].uploader = users.find(user=> user.uid === tracks[i].uid).profile
        tracks[i].hasLiked = tracks[i]?.likedBy?.find(x=>x.uid === uid)?.liked||false
    }
    return tracks
}

export {putInfo}