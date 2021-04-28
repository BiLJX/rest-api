export const plays = async (req, res)=>{
    const db = req.app.db
    const track = req.body.track;
    const info = req.body.info;
    const intialTime = info.initialTime;
    const finalTime = info.finalTime;
    if(finalTime - intialTime > 28){
        await db.collection("tracks").findOneAndUpdate({sid: track.info.songID}, {$inc:{"stats.views":1}})
        console.log("success")
        return "success"
    }
    res.end("success")
}