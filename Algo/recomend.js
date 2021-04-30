import {Similarity, Rank} from "./subAlgo/similarity.js"
import Sort from "../Modules/Sort.js"


class Recomend 
{
    constructor(uid, db) {
        this.uid = uid
        this.db = db
        this.recomendedTracks = []
    }

    //algorithm that returns the songs by user fav genre

    async getRecommendation()
    {
        this.recomendedTracks = []
        const db = this.db
        const [genres, selectedUser, user] = await Promise.all([ this.getUserGenre(), this.getOthersData(), this.getUserData() ])
        const sim = new Similarity(selectedUser, user, db)
        await sim.similiarityBygenre(genres)
        await sim.similiarityByLiked()
        const similar_users = sim.getSimilarUsers()
        const rank = new Rank(similar_users, db)
        const tracks = await rank.getTracks()
        return tracks
    }

    

    //gets what genre like the most
    async getUserGenre() {
        const db = this.db;
        const tracker = await db.collection("tracker").findOne({uid: this.uid});
        const genre = Object.keys(tracker.byLiked.genre);
        return genre;
    }

    async getUserData(){
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


    async getOthersData(){
        const db = this.db;
        const tracker = await db.collection("tracker").find({
            uid: {$ne: this.uid}
        }).toArray()
        const lentgth  = tracker.length;
        let i;
        for(i = 0; i<lentgth; i++){
            const likedTracks = await db.collection("liked").findOne({
                uid: tracker[i].uid, 
            })
            tracker[i].score = 0
            tracker[i].likedTracks = likedTracks.tracks
        }
        return tracker
    }



    sortByScore(data){
        for(let i = 0; i<data.length; i++){
            for(let j = i+1; j<data.length;j++){
                if(data[i].score<data[j].score){
                    let temp = data[i]
                    data[j] = data[i]
                    data[i] = data[j]
                }
            }
        }
        return data
    }


    sigmoid(x)
    {
        return 1/(1+Math.exp(-x))
    }
}



export default Recomend