import moment from "moment"




export const follow = async (req, res) => {
    const db = req.app.db
    const cuid = req.app.uid
    const uid = req.body.uid
    const hasFollowed = await db.collection("users").findOne({uid: cuid, "profile.following":{$elemMatch: {$in: [uid]}}})
    if(hasFollowed !== null){
        const task1 = db.collection("users").findOneAndUpdate({uid: cuid} ,{
            $pull: {
                "profile.following": uid
            }
        })
        const task2 = db.collection("users").findOneAndUpdate({uid: uid}, {
            $pull: {
                "profile.followers": cuid
            }
        })
        try{
            await Promise.all([task1, task2])
            res.end("success")
            return
        }catch{
            res.status(401).json({message: "error"})
        }
    }
    const task1 = db.collection("users").findOneAndUpdate({uid: cuid} ,{
        $push: {
            "profile.following": uid
        }
    })
    const task2 = db.collection("users").findOneAndUpdate({uid: uid}, {
        $push: {
            "profile.followers": cuid
        }
    })
    try{
        await Promise.all([task1, task2])
        res.end("success")
    }catch{
        res.status(401).json("error")
    }
}