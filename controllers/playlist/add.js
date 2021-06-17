export const addSongs = async (req, res) => {
    const db = req.app.db
    const uid = req.app.uid
    const pid = req.query.pid
    const data = req.body
    const playlist = await db.collection("playlists").findOne({pid: pid})
    if(playlist.uid !== uid){
        res.send("uid not permitted")
        return
    }
    try{
        if(playlist.tracks.includes(data.track)){
             await db.collection("playlists").findOneAndUpdate({pid: pid}, {
                $pull: {
                    "tracks": data.track
                }
            })
            res.send("successfully revomed")
            return
        }
        await db.collection("playlists").findOneAndUpdate({pid: pid}, {
            $push: {
                "tracks": data.track
            }
        })
        res.send("successfully added")
    }catch(err){
        console.log(err)
        res.send(err)
    }
}