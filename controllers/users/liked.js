export const getLiked = async (req, res) => {
    try{
        console.log(req.app.uid)
        const db = req.app.db;
        const likedSongs = db.collection("users").find({uid: req.app.uid}).toArray()
        
        res.send(likedSongs)
    }catch(err){
        console.log(err)
        res.status(401).json({message: "error"})
    }
    
}