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
        const [selectedUser, user] = await Promise.all([this.getOthersData(), this.getUserData() ])
        const sim = new Similarity(selectedUser, user, db)
        await sim.similiarityBygenre()
        await sim.similiarityByLiked()
        const similar_users = sim.getSimilarUsers()
        const rank = new Rank(similar_users, db)
        const tracks = await rank.getTracks()
        return tracks
    }

    

    //gets what genre like the most

    async getUserData(){
        const db = this.db;
        const user = await db.collection("users").findOne({uid: this.uid})
        user.score = 0
        return user
    }


    async getOthersData(){
        const db = this.db;
        
        console.time("others")
        const users = await db.collection("users").find({
            uid: {$ne: this.uid}
        }).toArray()
        console.timeEnd("others")
        for(let user of users){
            user.score = 0
        }
        return users
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