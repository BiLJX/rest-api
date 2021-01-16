import firebase from "firebase"
import Sort from "../Modules/Sort.js"
const sort = new Sort()
class Recomend {
    constructor(data, id) {
        this.id = id
        this.rawData = data
        this.user_data = data[this.id]
        this.data = Object.values(this.rawData)
    }

    //algorithm that returns the songs by user fav genre
    byGenre() {
        this.recomendData_byGenre = []//this storess all the songs by user fav genre
        let user_genres = this.getUserGenre() //stores user fav genres
        let songs = this.getSongs()//stores all the songs from database
        for (let i = 0; i < songs.length; i++) {
            for (let genre in user_genres) {    
                let temp = user_genres[genre]
                for (let genresName in temp) {
                    //if the songs genre from database matches with usef fav genre and if genre fav score is not equal to -
                    if (songs[i].info.genre.toLowerCase() == genresName) {
                        if (temp[genresName] != 0) {
                            songs[i].recomend.score = temp[genresName]
                            this.recomendData_byGenre.push(songs[i])
                        }
                    }
                }
            }
        }
        
        return this.recomendData_byGenre
    }

    //gets what genre like the most
    getUserGenre() {
        this.user_genre = []
        let obj = this.user_data.private
        Object.values(obj).forEach(value => {
            if (value.byGenre) {
                let temp = value.byGenre
                for (let data in temp) {
                    //L_data means lowered case data
                    let L_data = data.toLowerCase()
                    this.user_genre.push({
                        [ L_data ]: temp[data]
                    })
                }
            }
        })
        return this.user_genre
    }


    similiarity(){
        let songs = []
        let user = {

        }
        const other = this.getOthersGenre()
        const user_genre = this.getUserGenre()
        for(let j = 0; j<user_genre.length; j++){
            const user_genres =  user_genre[j]
               for(let userGenre in user_genres){
                   user[userGenre] = user_genres[userGenre]
                    //console.log(userGenre, user_genres[userGenre])
            }
        }
       for(let i = 0; i<other.length;i++){
           let sum = 0;
           let score = 0
           let other_genre = other[i].byGenre
           for(let genre in user){
               if(other_genre[genre]){
                   sum +=  (user[genre]-other_genre[genre])
                   score = 1/(1+sum )
               }
           }
           other[i].score = score
           let data;
           
           Object.values(other[i].liked).forEach(value=>{
               data = Object.values(value)
           })
           for(let i = 0; i<data.length; i++){
               songs.push(this.findSongs(data[i].title, data[i].id, score))
           }
       }
       return songs
    }


    //collects all the song from database
    getSongs() {
        let tempSongs;
        let songs = []
        Object.values(this.rawData).forEach(value => {
            if (value.public.songs) {
                tempSongs = value.public.songs
            }
        })
        Object.values(tempSongs).forEach(value => {
            songs.push(value)
        })
        return sort.popular(songs)
    }

    //checks if the user has previously liked or not
    newSong(song){
        let temp;
        let hasLiked = []
        let filtered = []
        Object.values(this.user_data.private.feedback.liked).forEach(value=>{
            temp = value
        })
        Object.values(temp).forEach(value=>{
            hasLiked.push(value.title)
        })
        let difference = song.filter(x => !hasLiked.includes(x.info.title));
        return difference
    }

    getOthersGenre(uid){
        let data = []
        Object.values(this.rawData).forEach(value=>{
            if(value.private['login credentials'].userId != this.id){
                data.push(value.private.feedback)
            }
        })
        return data
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

    findSongs(title, uid, score){
        this.rawData[uid].public.songs[title].recomend.score += score
        return this.rawData[uid].public.songs[title]
    }

    recomendations(){
        const by_genre = this.byGenre()
        const similiarity = this.similiarity()
        let total = by_genre.concat(similiarity)
        for(let i = 0; i<total.length; i++){
            for(let j = i+1; j<total.length; j++){
                if(total[i].recomend.score<total[j].recomend.score){
                    let temp = total[i]
                    total[i] = total[j]
                    total[j] = temp
                }
            }
        }
        return this.newSong(total) 
    }
}



export default Recomend