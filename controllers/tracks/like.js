import moment from "moment"

export const like = async (req, res) => {
    const db= req.app.db;
    const likedBy_uid = req.app.uid;
    const song_id = req.body.songID||req.body.data.songID;
    const song =  db.collection("tracks");
    const liked = db.collection("users");
    const hasLiked = await liked.findOne({uid:likedBy_uid, likedTracks: {$elemMatch: {$in: [song_id]}}})
    const update_path = "tracker.byLiked.genre." + req.body?.song?.info?.genre.toLowerCase()||req.body.data.song.info.genre.toLowerCase()
    
    if(hasLiked !== null){
        console.log(likedBy_uid, song_id)
        const task1 = liked.findOneAndUpdate(
            {uid: likedBy_uid},
            {
                $pull: {likedTracks: song_id}
            }
        )
        const task2 = song.findOneAndUpdate(
            {sid: song_id},
            {
                $inc: {
                    "stats.likes": -1 
                },
                $pull: {likedBy: {uid: likedBy_uid}}
            }
        )
        const task3 =db.collection("users").findOneAndUpdate({uid: likedBy_uid}, {
            $inc: {
                [update_path]: -1
            }
        })
        await Promise.allSettled([task1, task2, task3])
        res.status(200).json({message: "success"})
        return
    }

    //in liked collection
    const task1 = liked.findOneAndUpdate({uid: likedBy_uid}, {
        $push: {
            likedTracks:song_id
        }
    })

//in track
    const task2 = song.findOneAndUpdate({sid: song_id}, {
        $inc: {
            "stats.likes": 1
        },
        $push: {
            "likedBy": {
                "uid": likedBy_uid,
                "liked": true,
                "likedAt": {
                    "fullData": moment().format("MMM Do YY"),
                    "formatted":   moment().format()
                }
            }
        } 
    }, {upsert: true});
    // in tracker
    const task3 = db.collection("users").findOneAndUpdate({uid: likedBy_uid}, {
        $inc: {
            [update_path]: 1
        }
    })
    await Promise.allSettled([task1, task2, task3])
    res.status(200).json({message: "success"})
}