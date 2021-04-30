import moment from "moment"

export const like = async (req, res) => {
    const db= req.app.db;
    const likedBy_uid = req.app.uid;
    const song_id = req.body.songID;
    const likedOf = req.body.likedOf
    const song =  db.collection("tracks");
    const liked = db.collection("liked");
    const hasLiked = await liked.findOne({uid:likedBy_uid, tracks: {$elemMatch: {sid: song_id}}})
    const update_path = "byLiked.genre." + req.body.song.info.genre.toLowerCase()
    if(hasLiked !== null){
        const task1 = liked.findOneAndUpdate(
            {uid: likedBy_uid},
            {$pull: {tracks: {sid: song_id}}}
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
        const task3 =db.collection("tracker").findOneAndUpdate({uid: likedBy_uid}, {
            $inc: {
                [update_path]: -1
            }
        })
        await Promise.allSettled([task1, task2, task3])
        res.end("success")
        return
    }

    //in liked collection
    const task1 = liked.findOneAndUpdate({uid: likedBy_uid}, {
        $set: {
            uid: likedBy_uid,
        },
        $push: {
            tracks: {
                sid: song_id,
                uid: likedOf,
                likedAt: moment().format(),
                likedOf: likedOf
            }
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
    const task3 = db.collection("tracker").findOneAndUpdate({uid: likedBy_uid}, {
        $inc: {
            [update_path]: 1
        }
    })
    await Promise.allSettled([task1, task2, task3])
    res.end("success")
}