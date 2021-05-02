export const getLiked = async (req, res) => {
    try{
        const db = req.app.db;
        const likedSongs = db.collection("users").find({uid: req.app.uid}).toArray()
        res.send(likedSongs)
    }catch{
        res.status(401).json({message: "error"})
    }
    
}