import {Similarity, Rank} from "./subAlgo/similarity.js"

class Interaction
{
    constructor(data, uid)
    {
        this.data = data
        this.uid = uid
    }

    main(){
        const user = this.#getUserData()
        if(user){
            const followers = this.#getFollowersData()
            return this.#similarity(user, followers) 
        }
        return []
    }
    #similarity(user_data, others_data)
    {
        const sim = new Similarity(user_data, others_data)
        const users =  sim.similiarity()
        const rank = new Rank(users, this.data)
        return rank.getRankedSongs()
    }
    #getUserFollowingData()
    {
        const data = this.data;
        if(data[this.uid].public?.following){
            return Object.values(data[this.uid].public.following) 
        }
        else return []
    }

    #getUserData()
    {
        const data = this.data;
        return data[this.uid]
    }

    #getFollowersData()
    {
        const userFollowing = this.#getUserFollowingData()
        return userFollowing.map(x=>this.#getUserByiD(x.uid))   
    }
    
    #getUserByiD(uid)
    {
        return this.data[uid]
    }
    #newSong(song){
        const user_data = this.#getUserData()
        const hasLiked = []
        Object.values(user_data.private.feedback.liked).forEach(value=>{
            hasLiked.push(value.song_id)
        })
        return song.filter(x => hasLiked.includes(x.info.songID));
    }
}

export {Interaction}