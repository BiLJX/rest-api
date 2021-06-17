import moment from "moment";
import dayFunc from "../../Modules/dayFunc.js";


function makeid(length) {
    let result           = '';
    let characters       = 'AAAABBBBCCCCDDDDEEEEFFFFGGGGHHHHIIIIJJJJKKKKLLLLMMMMNNNNOOOOPPPPQQQQRRRRSSSSTTTTUUUUVVVVWWWWXXXXYYYYZZZZaaabbbcccdddeeefffggghhhiiijjjkkklllmmmnnnooopppqqqrrrssstttuuuvvvwwwxxxyyyzzz_____------11223344556677889900';
    let charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export const create = async (req, res) => {
    const db = req.app.db
    const uid = req.app.uid
    const data = req.body
    try{
        let hasId, pid;
        do{
            pid = makeid(11)
            hasId = await db.collection("playlist").findOne({pid: pid})
            console.log(pid)
        }while(pid == hasId?.sid)

        const schema = {
            pid: pid,
            uid: uid,
            info: {
                title: data.title,
                description: data.description,
                tracks_count: 0,
                tags: "",
                isPrivate: data.isPrivate
            },
            stats: {
                likes_count: 0,
                plays_count: 0,
                share_count: 0,
            },
            artwork: {
                imageURL: data.imageURL||""
            },            
            likedBy: [],
            created_at: {
                total_data: dayFunc(),
                formated_date: moment().format(),
                full_date: moment().format("MMM Do YY"),
            },
            tracks: []
        } 
        await db.collection("playlists").insertOne(schema)
        res.send({pid: pid})
    }catch(err){
        console.log(err)
        res.status(402).json({message: "something went wrong :("})
    }   
}

export const addSongs = async (req, res) => {
    const db = req.db;
    const tracks = req.body.tracks    
}
