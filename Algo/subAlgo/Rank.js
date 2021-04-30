import dayFunc from "../../Modules/dayFunc.js"

class Rank
{
    constructor(similar_users, db)
    {
        this.users = similar_users
        this.tracks = []
        this.db = db
        this.filter = null;
    }

    async getTracks(filter){
        this.filter = filter
        await this.start()
        return this.tracks
    }


    async start()
    {
        
        for(let user of this.users){
            await this.setTracks(user.uid)
        }
        return "done"
    }

    async setTracks(uid){
        const db = this.db
        const likedTracks = await db.collection("liked").findOne({uid: uid})
        for(let track of likedTracks.tracks){
            this.tracks.push(await this.findSongs(track.sid))
        }
    }

    async findSongs(sid){
        const db = this.db;
        const tracks = await db.collection("tracks").findOne({sid: sid})
        return tracks
    }


//     getRankedSongs()
//     {
//         const tracks = this.trendingScore(this.#getUserFavSongs())
//         return this.#sortByScore(tracks)
//     }

//     trendingScore(tData){
//         const date = dayFunc()
//         for(let i = 0; i<tData.length; i++){
//             const views1 = tData[i].stats.views;
//             const totalDate1 = tData[i].date.totalDate;
//             const diff1 = date - totalDate1;
//             const rate1 = views1/diff1;
//             tData[i].score += rate1/100
//         }
//         return tData
// }

//     #getUserFavSongs()
//     {
//         const userFavSongs = [];
//         this.users.forEach(user => {
//             Object.values(user.private.feedback.liked).forEach(data=>{
//                 const song = this.#getSongByid(data.id, data.song_id)
//                 song.score = user.score
//                 userFavSongs.push(song)
//             })
//         });
//         return userFavSongs;
//     }

//     #getSongByid(uid, sid)
//     {
//         return this.data[uid].public.songs[sid]
//     }
//     #sortByScore(tracks)
//     {
//         for(let i = 0; i<tracks.length; i++){
//             for(let j = i+1; j<tracks.length; j++){
//                 if(tracks[i].score<tracks[j].score){
//                     const temp = tracks[i]
//                     tracks[i]= tracks[j]
//                     tracks[j] = temp
//                 }
//             }
//         }
//         return tracks
//     }
}

export {Rank}