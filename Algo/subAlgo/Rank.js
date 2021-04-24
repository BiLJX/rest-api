import dayFunc from "../../Modules/dayFunc.js"

class Rank
{
    constructor(users, data)
    {
        this.data = data;
        this.users = users||[];
    }

    getRankedSongs()
    {
        const tracks = this.trendingScore(this.#getUserFavSongs())
        return this.#sortByScore(tracks)
    }

    trendingScore(tData){
        const date = dayFunc()
        for(let i = 0; i<tData.length; i++){
            const views1 = tData[i].stats.views;
            const totalDate1 = tData[i].date.totalDate;
            const diff1 = date - totalDate1;
            const rate1 = views1/diff1;
            tData[i].score += rate1/100
        }
        return tData
}

    #getUserFavSongs()
    {
        const userFavSongs = [];
        this.users.forEach(user => {
            Object.values(user.private.feedback.liked).forEach(data=>{
                const song = this.#getSongByid(data.id, data.song_id)
                song.score = user.score
                userFavSongs.push(song)
            })
        });
        return userFavSongs;
    }

    #getSongByid(uid, sid)
    {
        return this.data[uid].public.songs[sid]
    }
    #sortByScore(tracks)
    {
        for(let i = 0; i<tracks.length; i++){
            for(let j = i+1; j<tracks.length; j++){
                if(tracks[i].score<tracks[j].score){
                    const temp = tracks[i]
                    tracks[i]= tracks[j]
                    tracks[j] = temp
                }
            }
        }
        return tracks
    }
}

export {Rank}