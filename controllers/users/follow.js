import moment from "moment"




export const follow = async (req, res) => {
    const db = req.app.db
    const cuid = req.app.uid
    const uid = req.body.uid
    const hasFollowed = await db.collection("users").findOne({uid: cuid, "public.profile.following":{$elemMatch: {uid: uid}}})
    if(hasFollowed !== null){
        const task1 = db.collection("users").findOneAndUpdate({uid: cuid} ,{
            $pull: {
                "public.profile.following": {
                    uid: uid
                }
            }
        })
        const task2 = db.collection("users").findOneAndUpdate({uid: uid}, {
            $pull: {
                "public.profile.followers": {
                    uid: uid
                }
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
            "public.profile.following": {
                uid: uid,
                followedAt: {
                    format: moment().format(),
                    date: moment().format("MMM Do YY") 
                }
            }
        }
    })
    const task2 = db.collection("users").findOneAndUpdate({uid: uid}, {
        $push: {
            "public.profile.followers": {
                uid: uid,
                followerdAt: {
                    format: moment().format(),
                    date: moment().format("MMM Do YY") 
                }
            }
        }
    })
    try{
        await Promise.all([task1, task2])
        res.end("success")
    }catch{
        res.status(401).json("error")
    }
  
 
}