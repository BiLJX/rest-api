import {Similarity, Rank} from "./subAlgo/similarity.js"

class Interaction
{
    constructor(uid, db)
    {
        this.db = db
        this.uid = uid
    }

    async getTracks(){
        const [ user, followers ] = await Promise.all([this.#getUserTracker(), this.#getUserFollowingData()])
        const similar_users = await this.#getSimilarUsers(followers, user) 
        const rank = new Rank(similar_users, this.db)
        const tracks = await rank.getTracks()
        return tracks
    }
    async #getSimilarUsers(selected_user, user)
    {
        const sim = new Similarity(selected_user, user)
        await sim.similiarityBygenre()
        await sim.similiarityByLiked()
        return sim.getSimilarUsers()
    }
    async #getUserFollowing()
    {
        const db = this.db
        const user = await db.collection("users").findOne({uid: this.uid})
        return user.profile.following
    }

    async #getUserTracker()
    {
        const db = this.db;
        const user = await db.collection("users").findOne({uid: this.uid})
        user.score = 0
        return user
    }


    async #getUserFollowingData()
    {
        const userFollowing = await this.#getUserFollowing()
        const data = await this.#getFollowersData(userFollowing)
        return data.flat()
    }

    async #getFollowersData(uids){
        const db = this.db;
        const users = await db.collection("users").find({uid: {$in: uids}}).toArray()
        const followersRaw = []
        for(let user of users){
            user.score = 0
            followersRaw.push(user.profile.followers)
        }
        const followers = followersRaw.flat()
        const followersData = await this.#getUserTrackerByiD(followers)
        return followersData
    }
    
    async #getUserTrackerByiD(uids)
    {
        const db = this.db;
        const users = await db.collection("users").find({uid: {$in: uids}}).toArray()
        return users
    }
    // #newSong(song){
    //     const user_data = this.#getUserData()
    //     const hasLiked = []
    //     Object.values(user_data.private.feedback.liked).forEach(value=>{
    //         hasLiked.push(value.song_id)
    //     })
    //     return song.filter(x => hasLiked.includes(x.info.songID));
    // }
}

export {Interaction}