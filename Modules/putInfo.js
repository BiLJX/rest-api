import  {getAll} from "./find.js"


function putInfo(tracks = [])
{
    const final = [];
    tracks.forEach(value=>{
        value.uploader = getAll(value.info.userID)
        final.push(value)
    })
    return final
}

export {putInfo}