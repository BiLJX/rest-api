import  {getAll} from "./find.js"


async function putInfo(tracks = [], uid, db)
{
    for(let track of tracks){
        track.uploader = await getAll(track.info.userID, db)
        track.hasLiked = track?.likedBy?.find(x=>x.uid === uid)?.liked||false
    }
    return tracks
}

export {putInfo}