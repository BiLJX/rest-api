
import Sort from "../Modules/Sort.js"
const sort = new Sort()

class Recomend 
{
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
        this.getMySong()
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
        const data = []
        let user = {
        }
        const other = this.getOthersGenre()
        const user_genre = this.getUserGenre()
        //converts array to object
        for(let j = 0; j<user_genre.length; j++){
            const user_genres =  user_genre[j]
               for(let userGenre in user_genres){
                   user[userGenre] = user_genres[userGenre]
            }
        }
        //nearest neighbors
       for(let i = 0; i<other.length;i++){
           let sum = 0;
           let score = 0
           if(other[i]){
                let other_genre = other[i].byGenre
                //here the calculation starts
                for(let genre in user){
                    if(other_genre[genre]){
                        //manhattan distance formula
                        sum +=  (user[genre]-other_genre[genre])**2//(x2-x1) + (y2-y1) +......
                        score = 1/(10+Math.sqrt(sum))//to reverse the distance and convert to score
                    }
                }
                other[i].score = score //sets score in data for comparing later
                data.push(other[i])
                //converts object to array and stores in var(data)  
           }
           //finds and stores songs to [songs arr]
       }
       return data //finally returns song
    }

    similiarity2()
    {
        const other_song = this.getOthersGenre()
        const my_song = this.getMySong()
       const data = []
        for(let i = 0; i<other_song.length; i++){
            if(other_song[i]){
                const othersLikes =  Object.values(other_song[i].liked)
                for(let x of othersLikes){
                    for(let y of my_song){
                        if (y.song_id == x.song_id){
                            other_song[i].score += 1
                            data.push(other_song[i])
                        }
                    }
                }
            }
        }
        return data
    }
    getOthersSong(){
        let data = []
        Object.values(this.rawData).forEach(value=>{
            if(value.private['login credentials'].userId != this.id){
                data.push(value?.private?.feedback?.liked)
            }
        })
        return data
    }

    getMySong()
    {
        const data = this.user_data.private.feedback.liked
        return Object.values(data)
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
        let hasLiked = []
        let difference;
        if(this.user_data.private.feedback.liked){
            Object.values(this.user_data.private.feedback.liked).forEach(value=>{
               hasLiked.push(value.song_id)
            })
            difference = song.filter(x => !hasLiked.includes(x.info.songID));
        }
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

    findSongs(title, uid){
        return this.rawData[uid].public.songs[title]
    }

    sigmoid(x)
    {
        return 1/(1+Math.exp(-x))
    }

    recomendations(){
        const similiarity = this.similiarity()
        const similiarity2 = this.similiarity2()
        const tracks = []
        this.similiarity2()
        const total1 = similiarity2.concat(similiarity)
        const total = []

        for(let y of total1){
            y.score = this.sigmoid(y.score)
            total.push(y)
        }
        for(let i = 0; i<total.length; i++){
            for(let j = i+1; j<total.length; j++){
                if(total[i].score<total[j].score){
                    let temp = total[i]
                    total[i] = total[j]
                    total[j] = temp
                }
            }
        }
        for(let i = 0; i<total.length; i++){
            if(total[i].score >= 0.6){
                const temp = Object.values(total[i].liked)
                for(let x of temp){
                     tracks.push(this.findSongs(x.song_id, x.id))
                }
            }
        } 
        return this.newSong(tracks) 
    }
}



export default Recomend