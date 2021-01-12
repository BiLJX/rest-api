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
                            let check =this.newSong(songs[i])
                            if(!check){
                                songs[i].recomend.score = temp[genresName]
                                this.recomendData_byGenre.push(songs[i])
                            }
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
        Object.values(this.user_data.private.feedback.liked).forEach(value=>{
            temp = value
        })
        Object.values(temp).forEach(value=>{
            hasLiked.push(value)
        })
        for(let i = 0; i<hasLiked.length; i++){
            if(hasLiked[i].title == song.info.title){
                return true
            }
        }
    }

    


    recomendations(){
        const by_genre = this.byGenre()
        let total = by_genre
        for(let i = 0; i<total.length; i++){
            for(let j = i+1; j<total.length; j++){
                if(total[i].recomend.score<total[j].recomend.score){
                    let temp = total[i]
                    total[i] = total[j]
                    total[j] = temp
                }
            }
        }
        return total
    }
}



export default Recomend