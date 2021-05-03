export const plays = async (req, res)=>{
    const db = req.app.db
    const track = req.body.track;
    const info = req.body.info;
    const intialTime = info.initialTime;
    const finalTime = info.finalTime;
    try{
        if(finalTime - intialTime > 28){
            await db.collection("tracks").findOneAndUpdate({sid: track.info.songID}, {$inc:{"stats.views":1}})
            res.status(200).json({status: "success"})   
        }
        res.send("doesnt match requirements")
    }catch{
        res.end()
    }
   
}