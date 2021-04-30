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
        const genres = await this.#getUserGenre()
        const sim = new Similarity(selected_user, user)
        await sim.similiarityBygenre(genres)
        await sim.similiarityByLiked()
        return sim.getSimilarUsers()
    }
    async #getUserFollowing()
    {
        const db = this.db
        const user = await db.collection("users").findOne({uid: this.uid})
        return user.public.profile.following
    }

    async #getUserTracker()
    {
        const db = this.db;
        const user = await db.collection("tracker").findOne({uid: this.uid})
        const likedSongs = await db.collection("liked").findOne(
            {
                uid: this.uid,
            }
        )
        user.likedTracks = likedSongs.tracks
        user.score = 0
        return user
    }

    async #getUserGenre() {
        const db = this.db;
        const tracker = await db.collection("tracker").findOne({uid: this.uid});
        const genre = Object.keys(tracker.byLiked.genre);
        return genre;
    }          

    async #getUserFollowingData()
    {
        const data = []
        const userFollowing = await this.#getUserFollowing()
        let user;
        for(user of userFollowing){
            const userData = await this.#getFollowersData(user.uid)
            data.push(userData)
        }
        return data.flat()
    }

    async #getFollowersData(uid){
        const db = this.db;
        const user = await db.collection("users").findOne({uid: uid})
        const followers = user.public.profile.followers
        const followersData = []
        let follower;
        for(follower of followers){
            const follower_tracker = await this.#getUserTrackerByiD(follower.uid)
            followersData.push(follower_tracker)
        }
        return followersData
    }
    
    async #getUserTrackerByiD(uid)
    {
       const db = this.db;
       const user = await db.collection("tracker").findOne({uid: uid})
        const likedSongs = await db.collection("liked").findOne(
            {
                uid: this.uid,
            }
        )
        user.likedTracks = likedSongs.tracks
        user.score = 0
        return user
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