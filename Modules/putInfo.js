import  {getAll} from "./find.js"


function putInfo(tracks = [], uid)
{
    const final = [];
    tracks.forEach(value=>{
        value.uploader = getAll(value.info.userID)
        value.hasLiked = value.widgetInfo && value.widgetInfo.likes[uid] != undefined
        final.push(value)
    })
    return final
}

export {putInfo}