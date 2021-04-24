import {Rank} from "./Rank.js"

import admin from "firebase-admin"


const db = admin.database()
class Similarity
{
    constructor(user_data, others_data){
        this.user_data = user_data||[];
        this.others_data = others_data
        this.uid =user_data.private['login credentials'] .userId
    }
    similiarity()
    {
        const others = this.others_data.filter(x=>x.private['login credentials'].userId != this.uid)
        const genres = this.#getUserGenre()
        const user = this.user_data
        for(let i = 0; i<others.length; i++){
            let sum = 0
            for(let j = 0; j<genres.length; j++){
                const others_genre = others[i].private.feedback.byGenre[genres[j]];
                const user_genre = user.private.feedback.byGenre[genres[j]];
                if(others_genre){
                    //KNN
                    const squared = (others_genre-user_genre)*(others_genre-user_genre);
                    sum += squared;
                }
            }
            others[i].score = 1/(1+Math.sqrt(sum))
        }
        return this.#sort(others)
    }

    //converts to array                                                                                      
    #getUserGenre()
    {
        return Object.keys(this.user_data.private.feedback.byGenre)
    }

    #sort(data)
    {
        for(let i = 0; i<data.length; i++){
            for(let j = i+1; j<data.length; j++){
                if(data[i].score<data[j].score){
                    const temp = data[i]
                    data[i] = data[j]
                    data[j] = temp
                }
            }
        }
        return data
    }

    
}

export {Similarity}
export {Rank}

// db.ref("users/Kxi2dUmo97cyrOzQ3hgtXJv2bcJ2").once("value").then(data=>{
//     const sim = new Similarity(data)
//     sim.similiarity()
// })