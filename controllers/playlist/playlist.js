import { putInfo } from "../../Modules/putInfo.js"
import {create} from "./create.js"
import {addSongs} from "./add.js"

const getPlaylistData = async (req, res) =>{
    const db = req.app.db
    const uid = req.params.p
    const by = req.query.by
    console.log(uid)
    if(by === "uid"){
        const data = await db.collection("playlists").find({uid: uid}).toArray()
        res.send(data)
        return
    }
    const pid = req.params.p
    const data = await db.collection("playlists").findOne({pid: pid})
    res.send(data)
}

const getPlaylistTracks = async (req, res) => {
    const db = req.app.db
    const by = req.query.by
    const id = req.params.p
    if(by === "uid"){
        const data = await db.collection("playlists").findOne({uid: id})
        const tracks = await getTracks(data, db)
        res.send(await putInfo(tracks, req.app.uid, db))
        return
    }
    const data = await db.collection("playlists").findOne({pid: id})
    if(data){
        const tracks = await getTracks(data.tracks, db)
        res.send(await putInfo(tracks, req.app.uid, db))
    }
}

async function getTracks(tracks, db){
    if(tracks.length === 0){
        return []
    }
    const found_tracks = await db.collection("tracks").find({
        sid: { $in: tracks }
    }).toArray()
    return found_tracks
}

export {create, getPlaylistData, getPlaylistTracks, addSongs}