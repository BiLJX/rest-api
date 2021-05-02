
import moment from "moment"
import dayFunc from "../../Modules/dayFunc.js";


let database;
const dateObj = new Date();
const month = dateObj.getUTCMonth() + 1; //months from 1-12
const day = dateObj.getUTCDate();
const year = dateObj.getUTCFullYear();


function makeid(length) {
    let result           = '';
    let characters       = 'AAAABBBBCCCCDDDDEEEEFFFFGGGGHHHHIIIIJJJJKKKKLLLLMMMMNNNNOOOOPPPPQQQQRRRRSSSSTTTTUUUUVVVVWWWWXXXXYYYYZZZZaaabbbcccdddeeefffggghhhiiijjjkkklllmmmnnnooopppqqqrrrssstttuuuvvvwwwxxxyyyzzz__--1234567890';
    let charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}





async function upload_info(data)
{
    console.log("second phase")
    const db = database
    let song_id;
    let hasId;
    do{
        song_id = makeid(11)
        hasId = await db.collection("tracks").findOne({sid: song_id})
        console.log(song_id)
    }while(song_id == hasId?.sid)
    
    const track_data = {
        "uid": data.userID,
        "sid": song_id,
        "info":{
            "songID": song_id,
            "userID": data.userID,
            "title": data.title,
            "artist": data.artist,
            "genre": data.genre.toLowerCase(),
            "tags": data.tags,
            "description": data.description,
        },
        "src":{
            "aduioURL": data.audioURL,
            "imageURL": data.imageURL,
        },
        "stats":{
            "views": 0,
            "likes": 0,
            "comment": 0,
            "shares": 0
        } ,
        "recomend":{
            "byGenre": 0,
            "similarity": 0,
            "mood": 0
        },
        "likedBy":[],
        "commentedBy": [],
        "date":{
            "fulldata": moment().format("MMM Do YY"),
            "totalDate": dayFunc(day, month, year)
        }
    }
    await db.collection("tracks").insertOne(track_data)
    return "success"
}



export const uploadMusic = async (req, res)=>{
    console.log("1st phase")
    database = req.app.db
    const data = req.body
    data.userID = req.app.uid
    await upload_info(data)
    res.send({"upload_status": "ok"})
}