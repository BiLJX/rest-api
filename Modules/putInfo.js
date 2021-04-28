import  {getAll} from "./find.js"


function putInfo(tracks = [], uid, db)
{
    const final = tracks.map(value=>{
        value.uploader = getAll(value.info.userID, db)
        value.hasLiked = value?.likedBy?.find(x=>x.uid === uid)?.liked||false
        return value
    })
    return final
}

export {putInfo}