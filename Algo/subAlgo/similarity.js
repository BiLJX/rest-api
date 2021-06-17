import {Rank} from "./Rank.js"

class Similarity
{
    constructor(selectedUsers, user, db){
        this.selectedUsers = selectedUsers
        this.user = user
        this.similarUsers = []
        this.db = db
    }

    similiarityBygenre()
    {
        const genres_array =  Object.keys(this.user.tracker.byLiked.genre) 
        
        const prom = new Promise((res, rej)=>{
            const others = this.selectedUsers
            const genres = genres_array
            const user = this.user
            for(let i = 0; i<others.length; i++){
                let sum = 0
                for(let j = 0; j<genres.length; j++){
                    const other_genre = others[i]?.tracker?.byLiked.genre[genres[j]];
                    const user_genre = user.tracker?.byLiked.genre[genres[j]];
                    if(other_genre){
                        //KNN
                        const squared = (other_genre-user_genre)*(other_genre-user_genre);
                        sum += squared;
                    }
                }
                others[i].score += sum>0?1/(1+Math.sqrt(sum)):0
            }
            this.selectedUsers = others
            res(others)
        })
        return prom
    }

    similiarityByLiked(){
        const prom = new Promise((res, rej)=>{
            const user = this.user
            let selectedUser;
            for(selectedUser of this.selectedUsers){
                
                if(!selectedUser.likedTracks) return
                console.log(selectedUser.likedTracks)
                const user_tracks = user.likedTracks
                const selectedUser_tracks = selectedUser.likedTracks
                let user_track, selectedUser_track
                for(user_track of user_tracks){
                    for(selectedUser_track of selectedUser_tracks){
                        if(user_track.sid === selectedUser_track.sid){
                            selectedUser.score += 1
                        }
                    }
                }
            }
            res("done")
        })
        return prom
    }

    getSimilarUsers(k){
        const similarUsers = this.selectedUsers
        return similarUsers
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